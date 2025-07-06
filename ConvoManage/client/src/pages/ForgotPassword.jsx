import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email,
      });
      alert("Password reset link sent to your email.");
    } catch (err) {
      alert("Failed to send reset link.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Forgot Password</h2>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="Email"
        required
      />
      <button type="submit">Send Reset Link</button>
    </form>
  );
};

export default ForgotPassword;
