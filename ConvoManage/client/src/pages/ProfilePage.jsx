import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setForm({ name: res.data.name, email: res.data.email });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user.token]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("http://localhost:5000/api/profile", form, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const updatedUser = { ...user, name: res.data.user.name };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Profile updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container">
      <h2>My Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default ProfilePage;
