import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setForm({ name: res.data.name, email: res.data.email });
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

      alert("Profile updated!");
    } catch (err){
      console.error(err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="container">
      <h2>My Profile</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default ProfilePage;
