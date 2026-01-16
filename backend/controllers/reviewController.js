const ReviewForm = require("../models/ReviewForm");
const mongoose = require('mongoose');

exports.submitReview = async (req, res) => {
  try {
    // Adjust timezone
    let weekStart = new Date(req.body.weekStart);
    let weekEnd = new Date(req.body.weekEnd);
    const tzOffset = new Date().getTimezoneOffset() * 60000;
    weekStart = new Date(weekStart.getTime() - tzOffset);
    weekEnd = new Date(weekEnd.getTime() - tzOffset);

    // ✅ Check if user already submitted in this week
    const existing = await ReviewForm.findOne({
      userName: req.body.userName,
      weekStart: { $eq: weekStart },
      weekEnd: { $eq: weekEnd },
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "⚠️ You have already submitted a review for this week." });
    }

    // Points calculation
    let points = 0;
    let maxPoints = 0;

    // 1. Daily Devotion (max 7)
    const devotionDays = Number(req.body.devotionDays) || 0;
    points += Math.min(devotionDays, 7);
    maxPoints += 7;

    // 2. Planning Meeting
    if (req.body.planningMeeting === "yes") points += 1;
    maxPoints += 1;

    // 3. Bible Study
    if (req.body.bibleStudy === "yes") {
      points += 2;
      maxPoints += 2;
    } else if (req.body.bibleStudy === "someoneelse" && req.body.studyPeople?.length) {
      points += req.body.studyPeople.length; // 1 point per person
      maxPoints += req.body.studyPeople.length;
    } else {
      maxPoints += 2;
    }

    // 4. Members' activities (NEW LOGIC)
    // If any activity is yes, give 2 points per member. Otherwise 0 points.
    if (Array.isArray(req.body.members)) {
      req.body.members.forEach((m) => {
        if (m.activities) {
          // Check if at least one activity is true
          const hasAnyActivity =
            m.activities.biblestudy ||
            m.activities.discipleship ||
            m.activities.visiting;

          if (hasAnyActivity) {
            points += 2;
          }
        }
        maxPoints += 2; // each member max 2 points
      });
    }

    // 5. Discipler Meeting
    if (req.body.disciplerMeeting === "yes") points += 2;
    maxPoints += 2;

    // 6. Contribution (NEW LOGIC)
    // Check if contribution is paid for this month
    const reviewMonth = weekStart.getMonth() + 1; // 1-12
    const reviewYear = weekStart.getFullYear();

    // Check if user has already made a contribution this month
    const existingContribution = await ReviewForm.findOne({
      userName: req.body.userName,
      $expr: {
        $and: [
          { $eq: [{ $month: "$weekStart" }, reviewMonth] },
          { $eq: [{ $year: "$weekStart" }, reviewYear] }
        ]
      },
      contributionPaid: "Yes"
    });

    // Give 2 points if contributing now OR already contributed this month
    if (req.body.contributionPaid === "Yes" || existingContribution) {
      points += 2;
    }
    maxPoints += 2;

    // Save to DB
    const payload = {
      ...req.body,
      weekStart,
      weekEnd,
      points,
      maxPoints,
    };

    const review = new ReviewForm(payload);
    await review.save();

    res.json({ message: "✅ Review submitted successfully", review });
  } catch (err) {
    console.error("❌ Error in submitReview:", err);
    res.status(500).json({ message: "Error submitting review" });
  }
};

exports.getReviewsByUser = async (req, res) => {
  try {
    const { userName } = req.params;
    const reviews = await ReviewForm.find({ userName }).populate(
      "members.memberId"
    );
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
};


exports.getUsersWithReviews = async (req, res) => {
  try {
    // Get distinct userIds and populate their names
    const users = await ReviewForm.aggregate([
      {
        $group: {
          _id: '$userId',
          userName: { $first: '$userName' },
        },
      },
      {
        $project: {
          _id: 1,
          name: '$userName',
        },
      },
    ]);

    console.log(users);
    res.json(users); // [{ _id, name }]
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// Get reviews for a user filtered by month
exports.getReviewsByUserAndMonth = async (req, res) => {
  try {
    let { userName, month, year } = req.query;

    if (!userName || !month || !year) {
      return res.status(400).json({ message: 'Missing userName, month or year' });
    }

    // Convert month and year to numbers
    month = parseInt(month, 10);
    year = parseInt(year, 10);

    if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
      return res.status(400).json({ message: 'Invalid month or year' });
    }

    // Start and end of month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    // Fetch reviews and populate member names
    const reviews = await ReviewForm.find({
      userName: userName,
      weekStart: { $gte: startDate, $lte: endDate },
    })
      .sort({ weekStart: 1 })
      .populate({
        path: 'members.memberId',
        select: 'name', // Only return the name field
      });

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
};


