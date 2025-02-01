const mongoose = require('mongoose');

const WeeklyProgressSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  devotionDays: { type: Number, required: true },
  metDisciple: { type: String, enum: ['yes', 'no'], required: true },
  wentToChurch: { type: String, enum: ['yes', 'no'], required: true },
  attendedBibleStudies: { type: String, enum: ['yes', 'no'], required: true },
  marks: { type: Number, required: true },
  weekStart: { type: Date, required: true }, // Start of the previous week (Monday)
  weekEnd: { type: Date, required: true },   // End of the previous week (Sunday)
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WeeklyProgressU', WeeklyProgressSchema);
