const Review = require("../models/ReviewForm"); // Adjust path as needed

const getWeeklyStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start date and end date are required." });
    }

    const start = new Date(startDate);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);

    const reports = await Review.find({
      weekStart: { $gte: start },
      weekEnd: { $lte: end }
    }).limit(50);

    const requiredReports = 23; // configurable
    const maxDevotionMarks = requiredReports * 7; // max devotion per person (7 days)

    let totalDevotionMarks = 0;
    let totalPoints = 0;
    let maxPoints = 0;
    let planningMeetingCount = 0;
    let bibleStudyCount = 0;
    let disciplerMeetingCount = 0;

    const userNames = [];

    reports.forEach(report => {
      totalDevotionMarks += report.devotionDays || 0;
      totalPoints += report.points || 0;
      maxPoints += report.maxPoints || 0;
      if (report.planningMeeting === "yes") planningMeetingCount++;
      if (report.bibleStudy === "yes") bibleStudyCount++;
      if (report.disciplerMeeting === "yes") disciplerMeetingCount++;
      if (report.userName) userNames.push(report.userName);
    });

    const devotionPercentage = ((totalDevotionMarks / maxDevotionMarks) * 100).toFixed(2);
    const planningMeetingPercentage = ((planningMeetingCount / requiredReports) * 100).toFixed(2);
    const bibleStudyPercentage = ((bibleStudyCount / requiredReports) * 100).toFixed(2);
    const disciplerMeetingPercentage = ((disciplerMeetingCount / requiredReports) * 100).toFixed(2);
    const teamTotalPercentage = ((totalPoints / (maxPoints || 1)) * 100).toFixed(2);

    res.status(200).json({
      totalReports: reports.length,
      maxDevotionMarks,
      totalDevotionMarks,
      devotionPercentage,
      planningMeetingPercentage,
      bibleStudyPercentage,
      disciplerMeetingPercentage,
      teamTotalPercentage,
      submittedBy: userNames,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { getWeeklyStats };
