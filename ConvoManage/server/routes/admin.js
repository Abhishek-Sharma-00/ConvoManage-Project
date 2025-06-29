const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const allowRoles = require("../middlewares/roleMiddleware");
const User = require("../models/User");
const Conference = require("../models/Conference");
const Session = require("../models/Session");
const logActivity = require("../utils/logActivity");
const ActivityLog = require("../models/ActivityLog");

// 🔐 Only admins can access these routes
router.use(verifyToken, allowRoles("admin"));

// GET all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH: Update a user's role
router.patch("/users/:id/role", async (req, res) => {
  const { role } = req.body;
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "User not found" });
    await logActivity(
      req.user,
      `Changed role of user ${updated.name} to ${role}`
    );
    res.json({ message: "Role updated", user: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin stats endpoint
router.get("/stats", verifyToken, allowRoles("admin"), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalConferences = await Conference.countDocuments();
    const totalSessions = await Session.countDocuments();

    res.json({ totalUsers, totalConferences, totalSessions });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

// Route for user role counts
router.get(
  "/analytics/user-roles",
  verifyToken,
  allowRoles("admin"),
  async (req, res) => {
    try {
      const User = require("../models/User");
      const data = await User.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } },
      ]);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Route for Sessions per Conference
router.get(
  "/analytics/sessions-per-conference",
  verifyToken,
  allowRoles("admin"),
  async (req, res) => {
    try {
      const Session = require("../models/Session");
      const data = await Session.aggregate([
        {
          $group: {
            _id: "$conference",
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "conferences",
            localField: "_id",
            foreignField: "_id",
            as: "conferenceInfo",
          },
        },
        {
          $unwind: "$conferenceInfo",
        },
        {
          $project: {
            name: "$conferenceInfo.title",
            count: 1,
          },
        },
      ]);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET total user counts by role
router.get(
  "/analytics/users",
  verifyToken,
  allowRoles("admin"),
  async (req, res) => {
    try {
      const result = await User.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } },
      ]);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET activity logs
router.get("/logs", verifyToken, allowRoles("admin"), async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .sort({ timestamp: -1 })
      .populate("user", "name email");
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
