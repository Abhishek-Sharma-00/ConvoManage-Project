import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { user } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  // const togglePassword = () => setShowPassword(!showPassword);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "http://localhost:5000/api/profile/change-password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="reset-field">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <button type="button" className="toggle-btn" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        <div className="reset-field">
        <input
          type={showNewPassword ? "text" : "password"}
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="button" className="toggle-btn" onClick={() => setShowNewPassword(!showNewPassword)}>
            {showNewPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
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
