const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: Date,
        default: Date.now, // Automatically set the current date
    },
});

module.exports = mongoose.model('Notice', NoticeSchema);
