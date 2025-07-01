const ActivityLog = require("../models/ActivityLog");

const logActivity = async (user, action) => {
  try {
    await ActivityLog.create({
      user: user._id,
      role: user.role,
      action,
    });
  } catch (err) {
    console.error("Failed to log activity:", err.message);
  }
};

module.exports = logActivity;
