import Topic from "../models/Topic.js";

// Add new topic
export const addTopic = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const existing = await Topic.findOne({ title });
    if (existing) return res.status(400).json({ message: "Topic already exists" });

    const newTopic = new Topic({ title, description });
    await newTopic.save();

    res.status(201).json({ message: "Topic added successfully", topic: newTopic });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all topics
export const getTopics = async (req, res) => {
  try {
    const topics = await Topic.find().sort({ createdAt: -1 });
    res.json({ topics });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
