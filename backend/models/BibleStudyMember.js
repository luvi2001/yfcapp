const mongoose = require("mongoose");

const BibleStudyMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  mobile: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("BibleStudyMember", BibleStudyMemberSchema);
