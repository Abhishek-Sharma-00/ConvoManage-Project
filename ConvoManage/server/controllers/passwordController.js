const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcryptjs");

exports.changePassword = async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = newPassword;
   
    if (confirmPassword !== newPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const resetLink = `http://localhost:3000/reset-password/${token}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2 style="color: #2e6c80;">ConvoManage - Password Reset</h2>
        <p>Hello <strong>${user.name}</strong>,</p>
        <p>We received a request to reset your password.</p>
        <p>Click the button below to reset it. This link will expire in 15 minutes.</p>
        <a href="${resetLink}" style="display:inline-block; padding:10px 15px; background:#2e6c80; color:#fff; text-decoration:none; border-radius:5px;">Reset Password</a>
        <p>If you did not request this, you can safely ignore this email.</p>
        <br/>
        <p style="font-size: 0.9em; color: #666;">- ConvoManage Team</p>
      </div>
    `;

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    await sendEmail(
      user.email,
      "Reset Your Password - ConvoManage",
      `Reset your password: ${resetLink}`,
      htmlContent
    );
    res.json({ message: "Password reset email sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserByResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("name email role");

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    if (!password) return res.status(400).json({ message: "Password is required" });

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


