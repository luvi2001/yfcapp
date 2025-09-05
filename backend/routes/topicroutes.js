const express = require("express");
const { addTopic,getTopics } = require("../controllers/topicController.js");


const router = express.Router();

// Add a new topic (admin only)
router.post("/",addTopic);

// Get all topics
router.get("/",  getTopics);

module.exports = router;
