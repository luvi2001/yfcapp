require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const authRoutes = require('./routes/authroutes');
const devotionRoutes = require('./routes/devotionroutes');
const biblestudyRoutes = require('./routes/biblestudyroutes');
const noticeRoutes = require('./routes/noticeroutes');
const mediaRoutes = require('./routes/mediaroutes'); // Ensure this is the correct path

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from the uploads directory

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB Connected'))
  .catch((err) => console.error('Error connecting to database:', err));

// Route handlers
app.use('/api/auth', authRoutes);
app.use('/api/devotion', devotionRoutes);
app.use('/api/bstudy', biblestudyRoutes);
app.use('/api/notice', noticeRoutes);
app.use('/api/media', mediaRoutes); // Ensure media routes are correctly referenced

// Server listener
const PORT = process.env.PORT || 5000; // Port fallback for flexibility
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

