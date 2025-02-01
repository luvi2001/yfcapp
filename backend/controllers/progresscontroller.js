const WeeklyProgress = require('../models/weeklyprogresssmodel');

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
    console.log(start);
    console.log(end);
    const reports = await WeeklyProgress.find({
      weekStart: { $gte: start },
      weekEnd: { $lte: end }
    }).limit(15);

    const requiredReports = 15;
    const maxDevotionMarks = requiredReports * 7;
    const maxTotalMarks = requiredReports * 10; // Total max marks for the team

    let totalDevotionMarks = 0;
    let totalMarksGained = 0;
    let metDiscipleCount = 0;
    let wentToChurchCount = 0;
    let attendedBibleStudiesCount = 0;

    reports.forEach(report => {
      totalDevotionMarks += report.devotionDays;
      totalMarksGained += report.marks;
      if (report.metDisciple === 'yes') metDiscipleCount++;
      if (report.wentToChurch === 'yes') wentToChurchCount++;
      if (report.attendedBibleStudies === 'yes') attendedBibleStudiesCount++;
    });

    const devotionPercentage = ((totalDevotionMarks / maxDevotionMarks) * 100).toFixed(2);
    const metDisciplePercentage = ((metDiscipleCount / requiredReports) * 100).toFixed(2);
    const wentToChurchPercentage = ((wentToChurchCount / requiredReports) * 100).toFixed(2);
    const attendedBibleStudiesPercentage = ((attendedBibleStudiesCount / requiredReports) * 100).toFixed(2);
    const teamTotalPercentage = ((totalMarksGained / maxTotalMarks) * 100).toFixed(2);
    console.log(teamTotalPercentage);
    res.status(200).json({
      totalReports: reports.length,
      maxDevotionMarks,
      totalDevotionMarks,
      devotionPercentage,
      metDisciplePercentage,
      wentToChurchPercentage,
      attendedBibleStudiesPercentage,
      teamTotalPercentage,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { getWeeklyStats };