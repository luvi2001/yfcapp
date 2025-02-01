const multer = require('multer');
const path = require('path');

// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Ensure 'uploads' folder exists
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}${ext}`);  // Use a timestamp-based unique filename
  }
});

// Set file size limit and file type validation
// In upload.js (adjust the configuration)
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 },  // Adjust file size limit if needed
    fileFilter: function (req, file, cb) {
      const filetypes = /jpeg|jpg|png/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);
      if (extname && mimetype) {
        cb(null, true);  // Accept the file
      } else {
        cb(new Error('Only JPEG, JPG, and PNG files are allowed'));  // Reject invalid files
      }
    }
  }).single('image');  // Ensures the field name for the image is 'image'
  
  module.exports = upload;
  


