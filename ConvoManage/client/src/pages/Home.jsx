import React from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";
import { FaChalkboardTeacher, FaUsers, FaCalendarAlt, FaUserPlus } from "react-icons/fa";
import {FiLogIn } from "react-icons/fi";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <h1>
          Welcome to <span className="brand">ConvoManage</span>
        </h1>
        <p>Your all-in-one solution for managing online conferences</p>
        <div className="cta-buttons">
          <button onClick={() => navigate("/login")}><FiLogIn /> Login</button>
          <button onClick={() => navigate("/register")}><FaUserPlus /> Register</button>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <h2>What is ConvoManage?</h2>
        <p>
          ConvoManage helps organizers, speakers, and attendees easily manage
          and participate in online conferences. From scheduling sessions to
          real-time analytics – all in one place.
        </p>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Key Features</h2>
        <div className="feature-grid">
          <div className="feature-item">
            <FaUsers size={32} />
            <h3>Role-based Dashboards</h3>
            <p>
              Custom interfaces for Admins, Organizers, Speakers, and Attendees.
            </p>
          </div>
          <div className="feature-item">
            <FaChalkboardTeacher size={32} />
            <h3>Session Management</h3>
            <p>Manage speaker schedules, registrations, and topics easily.</p>
          </div>
          <div className="feature-item">
            <FaCalendarAlt size={32} />
            <h3>Conference Analytics</h3>
            <p>View stats, monitor activity, and gain insights.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-final">
        <h2>Get Started Today</h2>
        <div className="cta-content">
          <p>Join ConvoManage and streamline your conference experience!</p>
          <button onClick={() => navigate("/register")}>Create Account</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>
          &copy; {new Date().getFullYear()} ConvoManage. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
