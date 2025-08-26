const mongoose = require("mongoose");

const memberProgressSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: "BibleStudyMember" },
  activities: {
    biblestudy: { type: Boolean, default: false },
    discipleship: { type: Boolean, default: false },
    visiting: { type: Boolean, default: false },
  },
});

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userName: { type: String, required: true },

  // Frontend supplies these
  weekStart: { type: Date, required: true },
  weekEnd: { type: Date, required: true },

  devotionDays: { type: Number, default: 0 },
  planningMeeting: { type: String, enum: ["yes", "no"], required: true },
  bibleStudy: { type: String, enum: ["yes", "no", "someoneelse"], required: true },
  reason: { type: String },
  otherReasonText: { type: String },
  otherCompletedName: { type: String },
  disciplerMeeting: { type: String, enum: ["yes", "no"], required: true },
  contributionPaid: { type: String, enum: ["Yes", "No"], required: true },
  contributionAmount: {
    type: Number,
    required: function () {
      return this.contributionPaid === "Yes";
    },
  },

  commonLesson: { type: String },

  members: [memberProgressSchema],
  contributionPaid: String,
  points: { type: Number, default: 0 },   // earned points
  maxPoints: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

module.exports = Review;
