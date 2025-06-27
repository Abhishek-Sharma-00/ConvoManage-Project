const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const allowRoles = require("../middlewares/roleMiddleware");
const User = require("../models/User");
const logActivity = require("../utils/logActivity");

router.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: "Access granted to protected route",
    user: req.user,
  });
});

router.delete(
  "/users/:id",
  verifyToken,
  allowRoles("admin"),
  async (req, res) => {
    // console.log("Admin trying to delete user ID:", req.params.id);
    // console.log("Admin user ID:", req.user.id, "Role:", req.user.role);
    try {
      if (req.user.id === req.params.id) {
        return res
          .status(400)
          .json({ message: "You can't delete your own account." });
      }

      const deleted = await User.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "User not found" });
      }
      await logActivity(req.user, `Deleted user: ${deleted.name} (${deleted.email})`);
      res.json({ message: "User deleted successfully" });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
