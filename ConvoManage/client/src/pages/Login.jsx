import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      const { token, user } = res.data;
      user.token = token; //
      login(user);
      if (res.data.user.role === "speaker") {
        navigate("/speaker");
      } else if (res.data.user.role === "organizer") {
        navigate("/organizer");
      } else if (user.role === "attendee") {
        navigate("/attendee");
      } else if (user.role === "admin") {
        navigate("/admin");
      }
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={togglePassword}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        <button type="submit">Login</button>
        <p style={{ marginTop: "10px" }}>
          <a
            href="/forgot-password"
            style={{ color: "blue", textDecoration: "none" }}
          >
            Forgotten your password?
          </a>
        </p>
        <p>
          Don't have an account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
