const mongoose = require('mongoose');

const devotionSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        date: {
            type: String,
            required: true,
           // Make sure only one devotion is allowed per day
        },
        passage: {
            type: String,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('DevotionUp', devotionSchema);
