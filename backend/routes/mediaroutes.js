// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const { uploadMedia,getMedia,updateMedia,deleteMedia } = require('../controllers/librarycontroller');  // Import the controller

// Middleware to parse JSON and handle large Base64 strings (up to 50mb)
const bodyParser = require('body-parser');
router.use(bodyParser.json({ limit: '1000mb' }));  // For handling base64 images
router.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

// Route to handle media upload
router.post('/upload', uploadMedia);
router.get('/getmedia', getMedia);
router.put('/update/:id', updateMedia); // New update route
router.delete('/delete/:id', deleteMedia);

module.exports = router;
