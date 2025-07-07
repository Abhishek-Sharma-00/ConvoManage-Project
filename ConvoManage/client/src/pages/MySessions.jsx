import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";

const MySessions = () => {
  const { user } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMySessions = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/sessions/my-registrations", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setSessions(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMySessions();
  }, [user.token]);

  if (loading) return <Loader />;

  return (
    <div className="container">
      <h2>My Registered Sessions</h2>
      {sessions.length === 0 ? (
        <p>No sessions yet.</p>
      ) : (
        <ul>
          {sessions.map((s) => (
            <li key={s._id}>
              <strong>{s.title}</strong> ({new Date(s.startTime).toLocaleString()} – {new Date(s.endTime).toLocaleTimeString()}) <br />
              Speaker: {s.speaker?.name} | Conference: {s.conference?.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MySessions;
