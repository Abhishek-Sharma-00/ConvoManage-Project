const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const allowRoles = require('../middlewares/roleMiddleware');
const User = require('../models/User');
const Conference = require('../models/Conference');
const Session = require('../models/Session');

router.get('/stats', verifyToken, allowRoles('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const roles = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);
    const totalConferences = await Conference.countDocuments();
    const totalSessions = await Session.countDocuments();

    const speakerActivity = await Session.aggregate([
      { $group: { _id: "$speaker", sessionCount: { $sum: 1 } } },
      { $sort: { sessionCount: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      totalUsers,
      roles,
      totalConferences,
      totalSessions,
      topSpeakers: speakerActivity,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
