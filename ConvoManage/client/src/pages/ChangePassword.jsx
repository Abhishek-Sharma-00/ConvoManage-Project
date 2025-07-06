import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { FiEye, FiEyeOff } from "react-icons/fi";

const ResetPassword = () => {
  const { user } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "http://localhost:5000/api/profile/change-password",
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      alert("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <div className="container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          type="button"
          className="toggle-password"
          onClick={togglePassword}
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
        <p style={{ marginTop: "10px" }}>
          <a
            href="/forgot-password"
            style={{ color: "blue", textDecoration: "none" }}
          >
            Forgotten your password?
          </a>
        </p>
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
