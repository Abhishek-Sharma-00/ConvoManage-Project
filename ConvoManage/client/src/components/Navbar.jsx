import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import {
  FaUserTie,
  FaUserGraduate,
  FaMicrophone,
  FaClipboardList,
  FaUserPlus,
  FaUserCircle,
  FaChartBar,
  FaSearch,
} from "react-icons/fa";
import { FiLogOut, FiLogIn } from "react-icons/fi";
import { FaUserShield } from "react-icons/fa6"; // For Admin icon
import { useState, useContext } from "react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left" onClick={() => navigate("/")}>
        <AiFillHome style={{ marginRight: "6px" }} />
        <strong>ConvoManage</strong>
      </div>
      <div className="navbar-right">
        {user ? (
          <div className="profile-wrapper">
            <button className="profile-button" onClick={toggleDropdown}>
              <FaUserCircle size={20} /> {user.name}
            </button>
            {showDropdown && (
              <div className="profile-dropdown">
                <div className="profile-info">
                  <strong>{user.name}</strong>
                  <small>Role: {user.role}</small>
                </div>
                <hr />

                {user.role === "organizer" && (
                  <button onClick={() => navigate("/organizer")}>
                    <FaUserTie /> Organizer
                  </button>
                )}
                {user.role === "speaker" && (
                  <button onClick={() => navigate("/speaker")}>
                    <FaMicrophone /> Speaker
                  </button>
                )}
                {user.role === "attendee" && (
                  <>
                    <button onClick={() => navigate("/attendee")}>
                      <FaUserGraduate /> Attendee
                    </button>
                    <button onClick={() => navigate("/my-sessions")}>
                      <FaClipboardList /> My Sessions
                    </button>
                  </>
                )}
                {user.role === "admin" && (
                  <button onClick={() => navigate("/admin")}>
                    <FaUserShield /> Admin
                  </button>
                )}
                {user.role === "admin" && (
                  <button onClick={() => navigate("/admin-analytics")}>
                    <FaChartBar /> Analytics
                  </button>
                )}
                {user.role === "admin" && (
                  <button onClick={() => navigate("/admin/logs")}>
                    <FaClipboardList /> Activity Logs
                  </button>
                )}
                {user.role === "admin" && (
                  <button onClick={() => navigate("/search-sessions")}>
                    <FaSearch/> Search Sessions
                  </button>
                )}
                

                <hr />
                <button onClick={handleLogout}>
                  <FiLogOut /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button onClick={() => navigate("/login")}>
              <FiLogIn /> Login
            </button>
            <button onClick={() => navigate("/register")}>
              <FaUserPlus /> Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
