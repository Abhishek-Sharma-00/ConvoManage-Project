const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verifyToken = require('../middlewares/authMiddleware');
const bcrypt = require("bcryptjs");
// Get current user profile
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user profile
router.put('/', verifyToken, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset user password
// const bcrypt = require("bcryptjs");

router.put('/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);
    user.password = hashed;

    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Delete user account

module.exports = router;
