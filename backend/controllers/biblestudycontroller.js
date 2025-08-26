const BibleStudy = require('../models/biblestudymodel');
const BibleStudyMember = require("../models/BibleStudyMember");
const BibleStudyMemberAssigned = require("../models/BibleStudyMemberAssigned");

// Start Bible Study
const startBibleStudy = async (req, res) => {
  try {
    const { conductor, location } = req.body;

    if (!conductor || !location) {
      return res.status(400).json({ message: 'Conductor and location are required' });
    }

    const newStudy = new BibleStudy({
      conductor,
      location,
      startTime: new Date(),
      status: 'live',
    });

    const savedStudy = await newStudy.save();
    res.status(201).json({ id: savedStudy._id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to start Bible study', error });
  }
};

// End Bible Study
const endBibleStudy = async (req, res) => {
  try {
    const { id } = req.params;

    const study = await BibleStudy.findById(id);
    if (!study || study.status === 'ended') {
      return res.status(404).json({ message: 'Bible study not found or already ended' });
    }

    study.endTime = new Date();
    study.status = 'ended';
    await study.save();

    res.status(200).json({ message: 'Bible study ended successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to end Bible study', error });
  }
};


// Fetch ongoing Bible studies
const getOngoingBibleStudies = async (req, res) => {
    try {
        const ongoingStudies = await BibleStudy.find({ status: 'live' });
        res.status(200).json({ success: true, data: ongoingStudies });
    } catch (error) {
        console.error('Error fetching ongoing Bible studies:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch ongoing Bible studies.' });
    }
};


// Fetch unique conductor names
const getConductors = async (req, res) => {
  try {
    const conductors = await BibleStudy.distinct('conductor');
    console.log('Distinct Conductors:', conductors);  // Log the conductors
    res.status(200).json(conductors);
  } catch (error) {
    console.error('Error fetching conductors:', error);
    res.status(500).json({ message: 'Error fetching conductors', error });
  }
};


const getBibleStudies = async (req, res) => {
  try {
    const { conductor, startDate, endDate } = req.query;
    
    const filter = {};
    
    if (conductor && conductor !== 'all') {
      filter.conductor = conductor;
    }

    if (startDate && endDate) {
      filter.startTime = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const studies = await BibleStudy.find(filter);
    res.status(200).json(studies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Bible studies', error });
  }
};

const addMember = async (req, res) => {
  try {
    const { name, age, mobile } = req.body;
    const userId = req.user.id;  // from your auth middleware
    const username = req.user.name; // assuming token has "name"

    if (!name || !age || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 1. Create new bible study member
    const newMember = new BibleStudyMember({ name, age, mobile });
    await newMember.save();

    // 2. Check if user already has an assignment
    let assignment = await BibleStudyMemberAssigned.findOne({ userId });

    if (!assignment) {
      // Create new assignment document
      assignment = new BibleStudyMemberAssigned({
        userId,
        username,
        members: [newMember._id]
      });
    } else {
      // Add new member to existing list
      assignment.members.push(newMember._id);
    }

    await assignment.save();

    return res.status(201).json({
      message: "Member added and assigned successfully",
      member: newMember,
      assigned: assignment
    });
  } catch (err) {
    console.error("Error in addMember:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Fetch all members assigned to logged-in user
const getMyMembers = async (req, res) => {
  try {
    const userId = req.user.id;

    const assigned = await BibleStudyMemberAssigned.findOne({ userId }).populate("members");

    if (!assigned) {
      return res.status(404).json({ message: "No members assigned yet" });
    }

    res.json(assigned);
  } catch (err) {
    console.error("Error in getMyMembers:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
module.exports = {startBibleStudy,endBibleStudy,getOngoingBibleStudies,getConductors,getBibleStudies,addMember,getMyMembers};