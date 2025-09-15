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
const progressRoutes = require('./routes/progressroutes'); // Ensure this is the correct path
const reviewRoutes = require("./routes/reviewRoutes");
const areviewRoutes = require("./routes/adminreviewRoutes");
const topicRoutes=require('./routes/topicroutes');
const assignedRoutes=require('./routes/assignedMembers')

// Middleware
app.use(express.json({ limit: '100mb' })); 
app.use(express.urlencoded({ limit: '100mb', extended: true }));

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
app.use('/api/progress', progressRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/areview", areviewRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/assigned", assignedRoutes);


// Server listener
const PORT = process.env.PORT || 5000; // Port fallback for flexibility
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

