const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const helmet = require("helmet");
// const mongoSanitize = require("express-mongo-sanitize");
// const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

const app = express();
const scheduleReminders = require("./utils/reminderScheduler");

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(helmet()); // Security middleware to set various HTTP headers
// app.use(
//   mongoSanitize({
//     replaceWith: "_",
//     onSanitize: ({ req, key }) => {
//       console.warn(`Sanitized: ${key}`);
//       console.log("Sanitized request query:", req.query);
//     },
//   })
// );
// app.use(xss()); // Middleware to sanitize user input to prevent XSS attacks

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
});
app.use(limiter); // Apply rate limiting to all requests

// Auth Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Protected route
const protectedRoutes = require("./routes/protected");
app.use("/api", protectedRoutes);

//conference routes
const conferenceRoutes = require("./routes/conference");
app.use("/api/conferences", conferenceRoutes);

//session routes
const sessionRoutes = require("./routes/session");
app.use("/api/sessions", sessionRoutes);

// Admin routes
const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("ConvoManage API is running");
});

// Admin Analytics
const analyticsRoutes = require("./routes/adminAnalytics");
app.use("/api/admin", analyticsRoutes);

// Test route for sending email
const testRoutes = require("./routes/test");
app.use("/api/test", testRoutes);

// Profile routes
const profileRoutes = require("./routes/profile");
app.use("/api/profile", profileRoutes);

// Start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    // Start cron jobs
    scheduleReminders();
  })
  .catch((err) => console.error(err));
