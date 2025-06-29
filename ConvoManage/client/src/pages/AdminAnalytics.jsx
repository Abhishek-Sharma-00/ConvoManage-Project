import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AdminAnalytics = () => {
  const { user } = useContext(AuthContext);
  const [roleData, setRoleData] = useState([]);
  const [sessionData, setSessionData] = useState([]);
  const [userRoleData, setUserRoleData] = useState([]);
  const [topSpeakers, setTopSpeakers] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [rolesRes, sessionsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/analytics/user-roles", {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          axios.get(
            "http://localhost:5000/api/admin/analytics/sessions-per-conference",
            {
              headers: { Authorization: `Bearer ${user.token}` },
            }
          ),
        ]);

        // Format Pie Data
        setRoleData(
          rolesRes.data.map((item) => ({
            name: item._id,
            value: item.count,
          }))
        );

        // Format Bar Data
        setSessionData(
          sessionsRes.data.map((item) => ({
            name: item.name,
            sessions: item.count,
          }))
        );
      } catch (err) {
        alert("Failed to load analytics");
        console.error(err);
      }
    };

    fetchAnalytics();
  }, [user.token]);

  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin/analytics/users",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setUserRoleData(res.data);
      } catch (err) {
        console.error("Failed to fetch user role analytics", err);
      }
    };

    fetchUserCounts();
  }, [user.token]);

  useEffect(() => {
    const fetchTopSpeakers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/sessions/top-speakers",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setTopSpeakers(res.data);
      } catch (err) {
        console.error("Error fetching top speakers", err);
      }
    };

    fetchTopSpeakers();
  }, [user.token]);

  return (
    <div className="container">
      <h2>Admin Analytics</h2>

      <h3>User Roles</h3>
      <PieChart width={400} height={300}>
        <Pie
          data={roleData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {roleData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>

      <h3>Sessions per Conference</h3>
      <BarChart width={500} height={300} data={sessionData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="sessions" fill="#82ca9d" />
      </BarChart>

      <h3>Total Users by Role</h3>
      <ul>
        {userRoleData.map((item) => (
          <li key={item._id}>
            <strong>{item._id}</strong>: {item.count}
          </li>
        ))}
      </ul>
      
        <h3>Most Active Speakers</h3>
        <ul>
          {topSpeakers.map((speaker, i) => (
            <li key={i}>
              {speaker.name} ({speaker.email}) – {speaker.sessionCount} sessions
            </li>
          ))}
        </ul>
    </div>
  );
};

export default AdminAnalytics;
