const Devotion = require('../models/devotionmodel');
const jwt = require('jsonwebtoken');
const User = require('../models/usermodel'); // Assuming User model is used for users
const moment = require('moment');
const WeeklyProgress = require('../models/weeklyprogresssmodel');

const getWeeklyProgress = async (req, res) => {
    try {
        const { userName } = req.params;

        if (!userName) {
            return res.status(400).json({ error: 'Username is required' });
        }

        const lastWeekStart = moment().subtract(1, 'weeks').startOf('isoWeek').toDate(); // Ensure proper Date format
        const lastWeekEnd = moment().subtract(1, 'weeks').endOf('isoWeek').toDate();

        console.log(`Fetching progress for user: ${userName}`);
        console.log(`Week Start: ${lastWeekStart}, Week End: ${lastWeekEnd}`);

        const progress = await WeeklyProgress.findOne({
            userName,
            weekStart: { $gte: lastWeekStart },
            weekEnd: { $lte: lastWeekEnd },
        });

        console.log('Progress found:', progress);

        if (!progress) {
            return res.status(200).json({ available: false, message: 'No submission for last week' });
        }

        res.status(200).json({ available: true, progress });

    } catch (error) {
        console.error('Error fetching weekly progress:', error);
        res.status(500).json({ error: 'Server error' });
    }
};



// Submit Weekly Progress (Only allowed on Mondays for the previous week)
const submitProgress = async (req, res) => {
  try {
    const { userName, devotionDays, metDisciple, wentToChurch, attendedBibleStudies } = req.body;

    // Ensure submission is only allowed on Mondays
    const today = moment().utc().day();
    if (today !== 1) { // 1 = Monday
      return res.status(400).json({ message: 'Weekly progress can only be submitted on Mondays.' });
    }

    // Calculate the start (Monday) and end (Sunday) of the previous week
    const weekStart = moment().utc().subtract(1, 'week').startOf('isoWeek').toDate();
    const weekEnd = moment().utc().subtract(1, 'week').endOf('isoWeek').toDate();

    const marks = Number(devotionDays) + (metDisciple === 'yes' ? 1 : 0) + (wentToChurch === 'yes' ? 1 : 0) + (attendedBibleStudies === 'yes' ? 1 : 0);

    const progress = new WeeklyProgress({
      userName,
      devotionDays,
      metDisciple,
      wentToChurch,
      attendedBibleStudies,
      marks,
      weekStart,
      weekEnd
    });

    await progress.save();
    res.status(201).json({ message: 'Weekly progress submitted successfully', progress });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};



const getUserDevotions = async (req, res) => {
    try {
        const { name, startDate, endDate } = req.query;

        if (!name || !startDate || !endDate) {
            return res.status(400).json({ message: 'Name, startDate, and endDate are required' });
        }

        const start = moment(startDate).startOf('day').toDate();
        const end = moment(endDate).endOf('day').toDate();
        const weekStart = moment().startOf('isoWeek').toDate();
        const weekEnd = moment().endOf('isoWeek').toDate();

        // Fetch devotions within the selected period
        const devotions = await Devotion.find({
            name: { $regex: new RegExp(name, 'i') }, // Case-insensitive search
            date: { $gte: startDate, $lte: endDate }
        });

        // Fetch devotions for the current week
        const weeklyDevotions = await Devotion.find({
            name: { $regex: new RegExp(name, 'i') },
            date: { $gte: moment(weekStart).format('YYYY-MM-DD'), $lte: moment(weekEnd).format('YYYY-MM-DD') }
        });

        // Calculate devotion count and total hours
        const devotionCount = devotions.length;
        const totalHours = devotions.reduce((sum, d) => sum + d.duration, 0);
        const weeklyCount = weeklyDevotions.length;
        const weeklyHours = weeklyDevotions.reduce((sum, d) => sum + d.duration, 0);

        res.json({
            name,
            devotionCount,
            totalHours,
            weeklyCount,
            weeklyHours,
            devotions
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

getDevotionStats = async (req, res) => {
    try {
        // Get total number of users
        const totalUsers = await User.countDocuments();

        // Get the current date in YYYY-MM-DD format
        const currentDate = new Date().toISOString().split('T')[0];

        // Get the number of users who submitted devotion for today
        const submittedToday = await Devotion.countDocuments({ date: currentDate });

        res.status(200).json({ totalUsers, submittedToday });
    } catch (error) {
        console.error('Error fetching devotion stats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Fetch user profile
const getUserProfile = async (req, res) => {
    try {
        // Extract the token from the Authorization header
        const token = req.headers.authorization.split(' ')[1];

        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by the ID stored in the token
        const user = await User.findById(decoded.userId).select('-password'); // Exclude the password field

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with user details
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(401).json({ message: 'Not authorized or invalid token' });
    }
};


// Create a new devotion
const createDevotion = async (req, res) => {
    try {
        const { name, date, passage, duration } = req.body;
        const userId = req.user._id; // Assuming user ID is passed in the auth token

        // Check if the user has already submitted devotion for the day
        const existingDevotion = await Devotion.findOne({ userId, date });
        if (existingDevotion) {
            return res.status(400).json({ message: 'You have already submitted your devotion for today.' });
        }

        // Create a new devotion record
        const newDevotion = new Devotion({
            userId,
            name,
            date,
            passage,
            duration,
        });

        await newDevotion.save();

        res.status(201).json({ message: 'Devotion submitted successfully!' });
    } catch (error) {
        console.error('Error submitting devotion:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all devotions
const getDevotions = async (req, res) => {
    try {
        const devotions = await Devotion.find().sort({ date: -1 });
        res.status(200).json(devotions);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const checkDevotionByDate = async (req, res) => {
    try {
        const { userId, date } = req.query;
        
        // Find if there's a devotion record for this user and date
        const devotion = await Devotion.findOne({ userId, date });
        
        if (devotion) {
            return res.json({ isSubmitted: true });
        } else {
            return res.json({ isSubmitted: false });
        }
    } catch (error) {
        console.error('Error checking devotion submission:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = { createDevotion, getDevotions,getUserProfile,checkDevotionByDate,getWeeklyProgress,getUserDevotions,submitProgress };
