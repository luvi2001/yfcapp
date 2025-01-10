// routes/authRoutes.js
const express = require('express');
const { signUp, login } = require('../controllers/authcontroller');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Route to handle user sign-up
router.post('/signup', signUp);
router.post('/login',login)

module.exports = router;
