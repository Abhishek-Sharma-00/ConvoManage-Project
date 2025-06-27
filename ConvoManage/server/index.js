const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

const scheduleReminders = require('./utils/reminderScheduler');


// Middleware
app.use(cors());
app.use(express.json());

// Auth Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Protected route
const protectedRoutes = require('./routes/protected');
app.use('/api', protectedRoutes);

//conference routes
const conferenceRoutes = require('./routes/conference');
app.use('/api/conferences', conferenceRoutes);

//session routes
const sessionRoutes = require('./routes/session');
app.use('/api/sessions', sessionRoutes);

// Admin routes
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);


// Basic route
app.get('/', (req, res) => {
  res.send('ConvoManage API is running');
});

// Admin Analytics
const analyticsRoutes = require('./routes/adminAnalytics');
app.use('/api/admin', analyticsRoutes);

// Test route for sending email
const testRoutes = require('./routes/test');
app.use('/api/test', testRoutes);


// Start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  // Start cron jobs
    scheduleReminders();
}).catch(err => console.error(err));
