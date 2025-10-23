const ActivityLog = require("../models/ActivityLog");

const logActivity = async (user, action) => {
  try {
    const userId = user?._id || user?.id || user;

    if (!userId) {
      console.warn("Skipping logActivity: Missing user ID");
      return;
    }

    await ActivityLog.create({
      user: userId,
      action,
    });
  } catch (err) {
    console.error("Failed to log activity:", err.message);
  }
};

module.exports = logActivity;

// const ActivityLog = require("../models/ActivityLog");

// const logActivity = async (user, action) => {
//   try {
//     await ActivityLog.create({
//       user: user._id,
//       role: user.role,
//       action,
//     });
//   } catch (err) {
//     console.error("Failed to log activity:", err.message);
//   }
// };

// module.exports = logActivity;
