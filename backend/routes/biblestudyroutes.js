const express = require('express');
const router = express.Router();
const { startBibleStudy, endBibleStudy,getOngoingBibleStudies,getConductors,getBibleStudies,addMember,getMyMembers } = require('../controllers/biblestudycontroller');
const authMiddleware = require("../middleware/authMiddleware");

router.post('/bible-study/start', startBibleStudy);
router.post('/bible-study/end/:id', endBibleStudy);

// Route to fetch ongoing Bible studies
router.get('/ongoing', getOngoingBibleStudies);


router.get('/fetch', getBibleStudies);
//router.get("/getbstudies", getBibleStudies);
router.get("/conductors", getConductors);

// Add and assign a bible study member
router.post("/add-member", authMiddleware, addMember);

// Get all members assigned to logged-in user
router.get("/my-members", authMiddleware, getMyMembers);
module.exports = router;
