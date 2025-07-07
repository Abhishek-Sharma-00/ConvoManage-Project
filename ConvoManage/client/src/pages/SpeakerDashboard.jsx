import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";

const SpeakerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/sessions/speaker/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setSessions(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [user]);

  if (loading) return <Loader />;

  return (
    <div>
      <h2>Welcome, {user.name}</h2>
      <h3>Your Sessions</h3>
      <ul>
        {sessions.map((session) => (
          <li key={session._id}>
            <strong>{session.title}</strong> @ {session.conference?.title}
            <br />
            {new Date(session.startTime).toLocaleString()} -{" "}
            {new Date(session.endTime).toLocaleString()}
            <p>
              <strong>Reminder:</strong> {session.reminderMinutesBefore || 30}{" "}
              minutes before start
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpeakerDashboard;
