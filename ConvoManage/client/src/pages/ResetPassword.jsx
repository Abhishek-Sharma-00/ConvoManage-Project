import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // 1. Fetch user info using token
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/auth/reset-password/${token}`
        );
        setUserInfo(res.data);
      } catch (err) {
        alert("Link expired or invalid");
        navigate("/login");
      }
    };
    fetchUser();
  }, [token, navigate]);

  // 2. Handle reset
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          password: newPassword,
        }
      );

      alert("Password reset successfully!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Reset failed. Please try again.");
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>

      {userInfo && (
        <div className="user-details">
          <p>
            <strong>Name:</strong> {userInfo.name}
          </p>
          <p>
            <strong>Email:</strong> {userInfo.email}
          </p>
          <p>
            <strong>Role:</strong> {userInfo.role}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="button" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? "Hide" : "Show"}
        </button>

        <input
          type={showConfirm ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
          {showConfirm ? "Hide" : "Show"}
        </button>

        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;

