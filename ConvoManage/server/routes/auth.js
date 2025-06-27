const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const User = require('../models/User');
const logActivity = require("../utils/logActivity");

router.post('/register', register);
router.post('/login', login);
router.get('/speakers', async (req, res) => {
  try {
    const speakers = await User.find({ role: 'speaker' }).select('-password');
    await logActivity(speakers._id, "User logged in");
    res.json(speakers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
