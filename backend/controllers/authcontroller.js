// controllers/authController.js
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

        const token = jwt.sign({ userId: user._id,name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            token,
            user: {
                name: user.name,
                email: user.email,
                // Add other user details if needed
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
module.exports = { signUp,login };
