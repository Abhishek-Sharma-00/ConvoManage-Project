import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const AttendeeDashboard = () => {
  const [data, setData] = useState([]); // [{ conf, sessions: [] }]
  const [registered, setRegistered] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchAll = async () => {
    try {
      // 1) fetch all conferences
      const { data: confs } = await axios.get(
        "http://localhost:5000/api/conferences"
      );
      // 2) for each, fetch its sessions
      const fullData = await Promise.all(
        confs.map(async (conf) => {
          const { data: sessions } = await axios.get(
            `http://localhost:5000/api/sessions/${conf._id}`
          );
          return { conf, sessions };
        })
      );
      setData(fullData);
    } catch (err) {
      console.error("Failed to load conferences/sessions", err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleRegister = async (sessionId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/sessions/${sessionId}/register`,
        {},
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("user")).token
            }`,
          },
        }
      );
      alert(res.data.message);
      setRegistered((prev) => [...prev, sessionId]);
    } catch (err) {
      alert(err?.response?.data?.message || "Registration failed");
    }
  };

  const handleJoinSession = async (sessionId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/sessions/${sessionId}/register`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      alert("Joined session successfully");
      setRegistered((prev) => [...prev, sessionId]);
      // fetchSessions(); // re-fetch sessions if needed
    } catch (err) {
      alert("Already joined or failed to join");
      console.error(err);
    }
  };

  return (
    <div className="attendee-container">
      <h2>Welcome, Attendee!</h2>
      <h3>Upcoming Conferences & Sessions</h3>

      {data.map(({ conf, sessions }) => (
        <div key={conf._id} className="conference-card">
          <h4>{conf.title}</h4>
          <p>
            <em>{new Date(conf.date).toLocaleDateString()}</em>
          </p>
          {conf.description && <p>{conf.description}</p>}

          {sessions.length > 0 ? (
            <>
              <h5>Sessions:</h5>
              <ul>
                {sessions.map((s) => (
                  <li key={s._id} className="session-item">
                    <strong>{s.title}</strong> by {s.speaker?.name || "Unknown"}
                    <br />
                    {new Date(s.startTime).toLocaleTimeString()} –{" "}
                    {new Date(s.endTime).toLocaleTimeString()}
                    <br />
                    {registered.includes(s._id) ? (
                      <span className="session-registered">✅ Registered</span>
                    ) : (
                      <button onClick={() => handleRegister(s._id)}>
                        Register
                      </button>
                    )}
                    <button onClick={() => handleJoinSession(s._id)}>
                      Join
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>
              <em>No sessions scheduled yet.</em>
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default AttendeeDashboard;
