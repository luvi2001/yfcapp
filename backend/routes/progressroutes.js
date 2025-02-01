const express = require('express');
const router = express.Router();
const { getWeeklyStats } = require('../controllers/progresscontroller');

router.post('/stats', getWeeklyStats);

module.exports = router;
