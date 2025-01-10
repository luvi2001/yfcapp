// controllers/uploadController.js
const Media = require('../models/mediamodel');  // Assuming the Media model is in the 'models' folder

// Controller to handle media upload
const uploadMedia = async (req, res) => {
  const { title,photo, videoLink } = req.body;
  console.log(photo);
  console.log(videoLink);

  // Check if both photo and videoLink are provided
  if (!photo || !videoLink) {
    return res.status(400).json({ message: 'Photo and video link are required.' });
  }

  try {
    // Create a new media entry
    const media = new Media({
      title,
      photo,       // Store Base64 image string
      videoLink,   // Store video link
    });

    // Save the media in the database
    await media.save();

    // Return success response
    res.status(200).json({ message: 'Media uploaded successfully!', media });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: 'Error uploading media.', error: error.message });
  }
};


const getMedia = async (req, res) => {
    try {
      const mediaList = await Media.find();
      res.json(mediaList);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve media' });
    }
  };


module.exports = { uploadMedia,getMedia };
