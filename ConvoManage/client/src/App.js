import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import SpeakerDashboard from "./pages/SpeakerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import AttendeeDashboard from "./pages/AttendeeDashboard";
import MySessions from "./pages/MySessions";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminLogs from "./pages/AdminLogs";
import SearchSessions from "./pages/SearchSessions";
import ProfilePage from "./pages/ProfilePage";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/speaker"
            element={
              <ProtectedRoute allowedRoles={["speaker"]}>
                <SpeakerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer"
            element={
              <ProtectedRoute allowedRoles={["organizer"]}>
                <OrganizerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendee"
            element={
              <ProtectedRoute allowedRoles={["attendee"]}>
                <AttendeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-sessions"
            element={
              <ProtectedRoute allowedRoles={["attendee"]}>
                <MySessions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-analytics"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminAnalytics />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/logs" element={<AdminLogs />} />
          <Route path="/search-sessions" element={<SearchSessions />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* Add the Forgot Password route */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Reset Password route */}
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;
