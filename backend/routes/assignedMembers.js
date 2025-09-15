const express = require("express");
const router = express.Router();
const {
  getAllAssignedMembers,
  deleteAssignedMember
} = require("../controllers/assignedMemberController");

const BibleStudyMemberAssigned = require("../models/BibleStudyMemberAssigned");


// Get all
router.get("/", getAllAssignedMembers);

// Delete by ID
router.delete("/:id", deleteAssignedMember);

// DELETE /api/assigned/:assignedId/member/:memberId
router.delete("/:assignedId/member/:memberId", async (req, res) => {
  try {
    const { assignedId, memberId } = req.params;

    const updatedAssigned = await BibleStudyMemberAssigned.findByIdAndUpdate(
      assignedId,
      { $pull: { members: memberId } }, // remove specific member
      { new: true }
    ).populate("userId").populate("members");

    if (!updatedAssigned) {
      return res.status(404).json({ message: "Assigned record not found" });
    }

    res.json(updatedAssigned);
  } catch (err) {
    console.error("Error deleting member:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
