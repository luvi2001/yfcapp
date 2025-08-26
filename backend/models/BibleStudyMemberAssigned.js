const mongoose = require("mongoose");

const BibleStudyMemberAssignedSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "BibleStudyMember" }]
}, { timestamps: true });

module.exports = mongoose.model("BibleStudyMemberAssigned", BibleStudyMemberAssignedSchema);
