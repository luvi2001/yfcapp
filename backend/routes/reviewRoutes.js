const express = require("express");
const { submitReview, getReviewsByUser} = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// submit review (available everyday for now)
router.post("/submit", authMiddleware, submitReview);

// get reviews of logged user
router.get("/:userName", authMiddleware, getReviewsByUser);

module.exports = router;
