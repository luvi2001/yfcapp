const BibleStudyMemberAssigned = require("../models/BibleStudyMemberAssigned");

exports.getAllAssignedMembers = async (req, res) => {
  try {
    const assigned = await BibleStudyMemberAssigned.find()
      .populate("userId", "name email") // populate user details
      .populate("members", "name age gender"); // populate BibleStudyMember details

    res.json(assigned);
  } catch (err) {
    console.error("Error fetching assigned members:", err);
    res.status(500).json({ message: "Server error fetching assigned members" });
  }
};

exports.deleteAssignedMember = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await BibleStudyMemberAssigned.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Assigned member record not found" });
    }

    res.json({ message: "Assigned member deleted successfully", deleted });
  } catch (err) {
    console.error("Error deleting assigned member:", err);
    res.status(500).json({ message: "Server error deleting assigned member" });
  }
};
