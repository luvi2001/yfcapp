// routes/authRoutes.js
const express = require('express');
const { signUp, login, getAllUsers, verifyToken, logout } = require('../controllers/authcontroller');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes (no authentication required)
router.post('/signup', signUp);
router.post('/login', login);

// Protected routes (authentication required)
router.get('/verify', authMiddleware, verifyToken);  // NEW: Verify token
router.get('/users', getAllUsers);   // UPDATED: Now protected
router.post('/logout', authMiddleware, logout);      // NEW: Logout

module.exports = router;