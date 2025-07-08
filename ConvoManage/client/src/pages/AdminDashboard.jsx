import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useCallback } from "react";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await 
      axios.patch(
        `http://localhost:5000/api/admin/users/${id}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      if (res.status === 200) {
      toast.success("Role updated");
      } else {
        toast.error("Failed to update role");
      }
      // Refresh the user list after role change
      fetchUsers();
    } catch (err) {
      console.error("Updated role error:", err);
      toast.error("Failed to update role");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = user.token; // Get the token from the user context
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("User deleted successfully");

      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user", err);
      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Message:", err.response.data);
      }
      toast.error("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) return <Loader />;

  return (
    <div className="container-two">
      <h2>Admin Panel</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Current Role</th>
            <th>Update Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u._id, e.target.value)}
                >
                  <option value="admin">Admin</option>
                  <option value="organizer">Organizer</option>
                  <option value="speaker">Speaker</option>
                  <option value="attendee">Attendee</option>
                </select>
              </td>
              <td>
                {user.id !== u._id && (
                  <button onClick={() => handleDelete(u._id)}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;

