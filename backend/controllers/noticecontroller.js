const Notice = require('../models/noticemodal');

// @desc Add a new notice
// @route POST /api/notices
// @access Public
const addNotice = async (req, res) => {
    try {
        const { heading, description } = req.body;

        if (!heading || !description) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const newNotice = new Notice({
            heading,
            description,
        });

        await newNotice.save();
        res.status(201).json({ message: 'Notice added successfully.', notice: newNotice });
    } catch (error) {
        console.error('Error adding notice:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// @desc Get all notices
// @route GET /api/notices
// @access Public
const getNotices = async (req, res) => {
    try {
        const notices = await Notice.find().sort({ date: -1 }); // Latest notices first
        res.status(200).json(notices);
    } catch (error) {
        console.error('Error fetching notices:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};


module.exports = { addNotice,getNotices };
