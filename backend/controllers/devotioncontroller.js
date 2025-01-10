const Devotion = require('../models/devotionmodel');
const jwt = require('jsonwebtoken');
const User = require('../models/usermodel'); // Assuming User model is used for users


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


module.exports = { createDevotion, getDevotions,getUserProfile,checkDevotionByDate,getDevotionStats };
