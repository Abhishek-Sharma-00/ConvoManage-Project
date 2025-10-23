const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const User = require("../models/User");
const logActivity = require("../utils/logActivity");
const {
  changePassword,
  resetPassword,
  getUserByResetToken,
  forgotPassword,
} = require("../controllers/passwordController");


router.post("/register", register);
router.post("/login", login);
router.post("/change-password", changePassword);
router.post("/forgot-password", forgotPassword);
router.get("/reset-password/:token", getUserByResetToken);
router.post("/reset-password/:token", resetPassword);

router.get("/speakers", async (req, res) => {
  try {
    const speakers = await User.find({ role: "speaker" }).select("-password");
    await logActivity(speakers._id, "User logged in");
    res.json(speakers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Middleware to validate registration and login requests
router.post("/register", (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  register(req, res, next);
});

router.post("/login", (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  login(req, res, next);
});

module.exports = router;
