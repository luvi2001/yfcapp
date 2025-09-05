const express = require("express");
const {getReviewsByUserAndMonth,getUsersWithReviews } = require("../controllers/reviewController");

const router = express.Router();


// Get users who submitted reviews
router.get('/users',getUsersWithReviews);

// Get reviews by user and month
router.get('/by-month',getReviewsByUserAndMonth);
module.exports = router;
