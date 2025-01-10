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

// Get details of a specific Bible study by ID
const getBibleStudyDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const bibleStudy = await BibleStudy.findById(id);
        if (!bibleStudy) {
            return res.status(404).json({ success: false, message: 'Bible study not found.' });
        }
        res.status(200).json({ success: true, data: bibleStudy });
    } catch (error) {
        console.error('Error fetching Bible study details:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Bible study details.' });
    }
};

// Update the status of a Bible study
const updateBibleStudyStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const updatedBibleStudy = await BibleStudy.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedBibleStudy) {
            return res.status(404).json({ success: false, message: 'Bible study not found.' });
        }

        res.status(200).json({ success: true, data: updatedBibleStudy });
    } catch (error) {
        console.error('Error updating Bible study status:', error);
        res.status(500).json({ success: false, message: 'Failed to update Bible study status.' });
    }
};
module.exports = {startBibleStudy,endBibleStudy,updateBibleStudyStatus,getBibleStudyDetails,getOngoingBibleStudies};