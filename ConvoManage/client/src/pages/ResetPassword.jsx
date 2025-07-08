import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./ResetPassword.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Fetch user info using token
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/auth/reset-password/${token}`
        );
        setUserInfo(res.data);
      } catch (err) {
        toast.error("Link expired or invalid");
        navigate("/login");
      } finally { 
        setLoading(false);
      }
    };
    fetchUser();
  }, [token, navigate]);

  // 2. Handle reset
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          password: newPassword,
        }
      );

      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Reset failed. Please try again.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="reset-container">
      <h2 className="reset-title">Reset Password</h2>

      {userInfo && (
        <div className="reset-user-info">
          <p>
            <strong>Name:</strong> {userInfo.name}
          </p>
          <p>
            <strong>Role:</strong> {userInfo.role}
          </p>
          <p>
            <strong>Email:</strong> {userInfo.email}
          </p>
          
        </div>
      )}

      <form onSubmit={handleSubmit} className="reset-form">
        <div className="reset-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="button" className="toggle-btn" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        <div className="reset-field">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="button" className="toggle-btn" onClick={() => setShowConfirm(!showConfirm)}>
            {showConfirm ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        <button className="submit-btn" type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
