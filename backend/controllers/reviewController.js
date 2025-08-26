const ReviewForm = require("../models/ReviewForm");

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

    // 4. Members’ activities
    if (Array.isArray(req.body.members)) {
      req.body.members.forEach((m) => {
        if (m.activities) {
          if (m.activities.biblestudy) points += 2;
          if (m.activities.discipleship) points += 2;
          if (m.activities.visiting) points += 2;
        }
        maxPoints += 6; // each member max 6
      });
    }

    // 5. Discipler Meeting
    if (req.body.disciplerMeeting === "yes") points += 2;
    maxPoints += 2;

    // 6. Giving Contributions
    if (req.body.contributionPaid === "yes") points += 2;
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
