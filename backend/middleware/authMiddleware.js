const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');

const authMiddleware = async (req, res, next) => {
    let token;

    // Check if the Authorization header is present and starts with "Bearer"
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extract token from header
            token = req.headers.authorization.split(' ')[1];
            console.log('Token received:', token); // Log token to check

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded token:', decoded); // Log decoded token to check

            // Attach user information to the request object
            req.user = await User.findById(decoded.userId).select('-password');
            console.log('User from token:', req.user); // Log user data retrieved from DB

            next();
        } catch (error) {
            console.error('Not authorized, token failed');
            console.error('Error details:', error.message); // Log error details for debugging
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        console.log('No token in request'); // Log when no token is found
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = authMiddleware;
