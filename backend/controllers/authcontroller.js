// controllers/authcontroller.js
const bcrypt = require('bcrypt');
const User = require('../models/usermodel');
const jwt = require('jsonwebtoken');

// Controller function to handle user sign-up
const signUp = async (req, res) => {
    const { name, email, phone, division, username, password } = req.body;

    // Validate if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists.' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Create a new user
        const newUser = new User({
            name,
            email,
            phone,
            division,
            username,
            password: hashedPassword,
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'Account created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // ✅ UPDATED: Token now expires in 30 days instead of 1 hour
        const token = jwt.sign(
            { 
                userId: user._id,
                name: user.name,
                email: user.email 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '30d' } // Changed from '1h' to '30d'
        );

        // ✅ UPDATED: Return more user details
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                division: user.division,
                username: user.username
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'name'); // Fetch only user names
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ NEW FUNCTION: Verify token
const verifyToken = async (req, res) => {
    try {
        // req.user is already populated by authMiddleware
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        res.json({
            valid: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                phone: req.user.phone,
                division: req.user.division,
                username: req.user.username
            }
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// ✅ NEW FUNCTION: Logout
const logout = async (req, res) => {
    try {
        // In a stateless JWT system, logout is handled client-side
        // You can implement token blacklisting here if needed in the future
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ UPDATED: Export new functions
module.exports = { 
    signUp, 
    login, 
    getAllUsers,
    verifyToken,  // NEW
    logout        // NEW
};