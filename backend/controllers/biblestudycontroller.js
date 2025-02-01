const BibleStudy = require('../models/biblestudymodel');

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


module.exports = {startBibleStudy,endBibleStudy,getOngoingBibleStudies,getConductors,getBibleStudies};