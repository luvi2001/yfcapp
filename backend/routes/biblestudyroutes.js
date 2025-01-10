const express = require('express');
const router = express.Router();
const { startBibleStudy, endBibleStudy,getBibleStudyDetails,getOngoingBibleStudies,updateBibleStudyStatus } = require('../controllers/biblestudycontroller');

router.post('/bible-study/start', startBibleStudy);
router.post('/bible-study/end/:id', endBibleStudy);

// Route to fetch ongoing Bible studies
router.get('/ongoing', getOngoingBibleStudies);

// Route to fetch details of a specific Bible study
router.get('/:id', getBibleStudyDetails);

// Route to update the status of a Bible study
router.put('/:id/status', updateBibleStudyStatus);
module.exports = router;
