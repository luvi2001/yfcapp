const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); 
const { createDevotion, getDevotions,getUserProfile,checkDevotionByDate,getDevotionStats} = require('../controllers/devotioncontroller');

// Create a new devotion
router.post('/add',authMiddleware, createDevotion);

// Get all devotions
router.get('/', getDevotions);
router.get('/stats', getDevotionStats);
router.get('/profile', authMiddleware, getUserProfile);
router.get('/check', authMiddleware, checkDevotionByDate);

module.exports = router;
