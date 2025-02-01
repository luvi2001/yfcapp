const express = require('express');
const router = express.Router();
const { startBibleStudy, endBibleStudy,getOngoingBibleStudies,getConductors,getBibleStudies } = require('../controllers/biblestudycontroller');

router.post('/bible-study/start', startBibleStudy);
router.post('/bible-study/end/:id', endBibleStudy);

// Route to fetch ongoing Bible studies
router.get('/ongoing', getOngoingBibleStudies);


router.get('/fetch', getBibleStudies);
//router.get("/getbstudies", getBibleStudies);
router.get("/conductors", getConductors);
module.exports = router;
