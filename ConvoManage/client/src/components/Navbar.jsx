import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
// import { AiFillHome } from "react-icons/ai";
import {
  FaUserTie,
  FaUserGraduate,
  FaMicrophone,
  FaClipboardList,
  FaUserPlus,
  FaUserCircle,
  FaChartBar,
  FaSearch,
  // FaPlus,
  FaEdit,
  FaRedo,
} from "react-icons/fa";
import { FiLogOut, FiLogIn } from "react-icons/fi";
import { FaUserShield } from "react-icons/fa6"; // For Admin icon
import { useState, useContext, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
const logoUrl = "https://raw.githubusercontent.com/Abhishek-Sharma-00/ConvoManage-Project/refs/heads/main/ConvoManage/client/assets/Untitled_design__1_-removebg-preview.png";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  return (
    <nav className="navbar">
      <div className="navbar-left" onClick={() => navigate("/")}>
        <div className="logo-container">
      <img src={logoUrl} alt="ConvoManage Logo" className="logo"/>
        {/* <AiFillHome style={{ marginRight: "6px" }} /> */}
        </div>
        {/* <strong>ConvoManage</strong> */}
      </div>
      <div className="navbar-right">
        {user ? (
          <div className="profile-wrapper" ref={dropdownRef}>
            <button className="profile-button" onClick={toggleDropdown}>
              <FaUserCircle size={20} /> {user.name}
            </button>
            {showDropdown && (
              <div className="profile-dropdown">

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
                {user && (
                  <button onClick={() => navigate("/search-sessions")}>
                    <FaSearch/> Search Sessions
                  </button>
                )}
                {user && (
                  <button onClick={() => navigate("/profile")}>
                    <FaEdit/> Edit Profile
                  </button>
                )}
                {user && (
                  <button onClick={() => navigate("/change-password")}>
                    <FaRedo/> Change Password
                  </button>
                )}
                {/* {user && <Link to="/profile">Profile</Link>} */}

                

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
