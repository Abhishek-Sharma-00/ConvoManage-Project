import { useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email,
      });
      toast.success("Password reset link sent to your email.");
    } catch (err) {
      toast.error("Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container">
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
    </div>
  );
};

export default ForgotPassword;
