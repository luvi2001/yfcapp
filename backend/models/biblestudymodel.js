const mongoose = require('mongoose');

const BibleStudySchema = new mongoose.Schema({
  conductor: { type: String, required: true },
  location: { type: String, required: true },
  startTime: { type: Date },
  endTime: { type: Date },
  status: { type: String, enum: ['live', 'ended'], default: 'live' },
});

module.exports = mongoose.model('BibleStudy', BibleStudySchema);
