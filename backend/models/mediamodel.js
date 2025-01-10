const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  photo: {
    type: String,
    required: true,  // Base64-encoded string or URL of the image
  },
  videoLink: {
    type: String,
    required: true,  // URL link to the video
    validate: {
      validator: function (v) {
        return /^(https?:\/\/)?([\w\d-]+\.)+[\w-]{2,4}(\/[^\s]*)?$/.test(v);
      },
      message: 'Invalid video link format.',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,  // Automatically sets the timestamp when created
  },
});

const Media = mongoose.model('LMediass', mediaSchema);

module.exports = Media;
