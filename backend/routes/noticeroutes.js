const express = require('express');
const router = express.Router();
const { addNotice, getNotices } = require('../controllers/noticecontroller');

// Add a new notice
router.post('/add', addNotice);

// Get all notices
router.get('/get', getNotices);

module.exports = router;
