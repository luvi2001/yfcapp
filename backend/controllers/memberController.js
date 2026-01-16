// controllers/memberController.js
const ReviewForm = require("../models/ReviewForm");
const BibleStudyMemberAssigned = require("../models/BibleStudyMemberAssigned");
const mongoose = require('mongoose');

// Get all members
exports.getAllMembers = async (req, res) => {
  try {
    const members = await BibleStudyMemberAssigned.find().sort({ name: 1 });
    console.log('Found members:', members.length);
    res.json(members);
  } catch (err) {
    console.error('Error fetching members:', err);
    res.status(500).json({ message: 'Error fetching members', error: err.message });
  }
};

// Get member details by month
exports.getMemberDetailsByMonth = async (req, res) => {
  try {
    let { memberId, month, year } = req.query;

    console.log('Request params:', { memberId, month, year });

    if (!memberId || !month || !year) {
      return res.status(400).json({ message: 'Missing memberId, month or year' });
    }

    // Convert to proper types
    month = parseInt(month, 10);
    year = parseInt(year, 10);

    if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
      return res.status(400).json({ message: 'Invalid month or year' });
    }

    // Validate memberId
    if (!mongoose.Types.ObjectId.isValid(memberId)) {
      return res.status(400).json({ message: 'Invalid member ID' });
    }

    // Start and end of month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    console.log('Date range:', { startDate, endDate });

    // Fetch reviews where this member is included
    const reviews = await ReviewForm.find({
      'members.memberId': memberId,
      weekStart: { $gte: startDate, $lte: endDate },
    })
      .sort({ weekStart: 1 })
      .populate('members.memberId', 'name mobile age');

    console.log('Found reviews:', reviews.length);

    // Transform data to show member-specific activities
    const memberReviews = reviews.map(review => {
      const memberData = review.members.find(
        m => m.memberId && m.memberId._id.toString() === memberId
      );

      return {
        _id: review._id,
        userName: review.userName,
        weekStart: review.weekStart,
        weekEnd: review.weekEnd,
        commonLesson: review.commonLesson,
        memberActivities: memberData ? memberData.activities : {
          biblestudy: false,
          discipleship: false,
          visiting: false,
        },
      };
    });

    // Calculate summary statistics
    const totalWeeks = memberReviews.length;
    const bibleStudyCount = memberReviews.filter(r => r.memberActivities.biblestudy).length;
    const discipleshipCount = memberReviews.filter(r => r.memberActivities.discipleship).length;
    const visitingCount = memberReviews.filter(r => r.memberActivities.visiting).length;
    
    const totalActivities = bibleStudyCount + discipleshipCount + visitingCount;
    const maxActivities = totalWeeks * 3; // 3 activities per week
    const attendanceRate = maxActivities > 0 
      ? Math.round((totalActivities / maxActivities) * 100) 
      : 0;

    const summary = {
      totalWeeks,
      bibleStudyCount,
      discipleshipCount,
      visitingCount,
      attendanceRate,
    };

    res.json({
      reviews: memberReviews,
      summary,
    });
  } catch (err) {
    console.error('Error fetching member details:', err);
    res.status(500).json({ message: 'Server error fetching member details', error: err.message });
  }
};

// Get member's overall statistics
exports.getMemberStats = async (req, res) => {
  try {
    const { memberId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(memberId)) {
      return res.status(400).json({ message: 'Invalid member ID' });
    }

    // Get all reviews for this member
    const reviews = await ReviewForm.find({
      'members.memberId': memberId,
    });

    let totalBibleStudy = 0;
    let totalDiscipleship = 0;
    let totalVisiting = 0;

    reviews.forEach(review => {
      const memberData = review.members.find(
        m => m.memberId && m.memberId.toString() === memberId
      );
      
      if (memberData) {
        if (memberData.activities.biblestudy) totalBibleStudy++;
        if (memberData.activities.discipleship) totalDiscipleship++;
        if (memberData.activities.visiting) totalVisiting++;
      }
    });

    res.json({
      totalWeeks: reviews.length,
      activities: {
        bibleStudy: totalBibleStudy,
        discipleship: totalDiscipleship,
        visiting: totalVisiting,
      },
      overallAttendance: reviews.length > 0 
        ? Math.round(((totalBibleStudy + totalDiscipleship + totalVisiting) / (reviews.length * 3)) * 100)
        : 0,
    });
  } catch (err) {
    console.error('Error fetching member stats:', err);
    res.status(500).json({ message: 'Server error fetching member stats', error: err.message });
  }
};

// Delete a member and their activity records
exports.deleteMember = async (req, res) => {
  try {
    const { memberId } = req.params;

    console.log('Attempting to delete member:', memberId);

    if (!mongoose.Types.ObjectId.isValid(memberId)) {
      return res.status(400).json({ message: 'Invalid member ID' });
    }

    // Check if member exists
    const member = await BibleStudyMember.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Remove member from all reviews
    await ReviewForm.updateMany(
      { 'members.memberId': memberId },
      { $pull: { members: { memberId: memberId } } }
    );

    // Delete the member
    await BibleStudyMember.findByIdAndDelete(memberId);

    console.log('Member deleted successfully:', member.name);

    res.json({ 
      message: 'Member and their activity records deleted successfully',
      deletedMember: {
        id: member._id,
        name: member.name
      }
    });
  } catch (err) {
    console.error('Error deleting member:', err);
    res.status(500).json({ message: 'Server error deleting member', error: err.message });
  }
};