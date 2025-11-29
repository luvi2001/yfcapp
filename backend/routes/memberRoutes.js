const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

// Get all members
router.get('/all', memberController.getAllMembers);

// Get member details by month
router.get('/details-by-month', memberController.getMemberDetailsByMonth);

// Get member overall statistics (optional)
router.get('/stats/:memberId', memberController.getMemberStats);

// Delete a member
router.delete('/delete/:memberId', memberController.deleteMember);

module.exports = router;