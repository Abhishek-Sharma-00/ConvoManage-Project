import { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const OrganizerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [conferences, setConferences] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
  });
  const [speakers, setSpeakers] = useState([]);
  const [sessionForm, setSessionForm] = useState({});
  const [conferenceSessions, setConferenceSessions] = useState({});
  const [reminderUpdates, setReminderUpdates] = useState({});
  const [loading, setLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedConferenceId, setSelectedConferenceId] = useState(null);
  const [editConference, setEditConference] = useState({
    _id: "",
    title: "",
    description: "",
    date: "",
  });

  // Fetch all conferences
  const fetchConferences = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/conferences");
      const myConfs = res.data.filter((conf) => {
        const organizerId =
          typeof conf.organizer === "string"
            ? conf.organizer
            : conf.organizer?._id || conf.organizer?.id;

        return organizerId === user.id;
      });

      setConferences(myConfs);
    } catch (err) {
      console.error(err);
    }
  }, [user.id]);

  // Fetch sessions for a specific conference
  const fetchSessionsForConference = async (confId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/sessions/${confId}`
      );
      setConferenceSessions((prev) => ({
        ...prev,
        [confId]: res.data,
      }));
    } catch (err) {
      console.error("Failed to fetch sessions for", confId, err);
    }
  };

  // Handle new conference input
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Create new conference
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/conferences", form, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setForm({ title: "", description: "", date: "" });
      fetchConferences(); // Refresh list
    } catch (err) {
      toast.error("Failed to create conference");
    }
  };

  // Handle session creation
  const handleSessionChange = (confId, e) => {
    setSessionForm((prev) => ({
      ...prev,
      [confId]: {
        ...prev[confId],
        [e.target.name]: e.target.value,
      },
    }));
  };

  const handleSessionSubmit = async (confId, e) => {
    e.preventDefault();
    const sessionData = {
      ...sessionForm[confId],
      conference: confId,
    };

    try {
      await axios.post("http://localhost:5000/api/sessions", sessionData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      toast.success("Session created!");
      await fetchSessionsForConference(confId);
      fetchConferences(); // refresh sessions under conferences
    } catch (err) {
      toast.error("Failed to create session");
      console.error(err);
    }
  };

  //Edit Conference
  const handleEditConference = async (conf) => {
    setEditConference({
      _id: conf._id,
      title: conf.title,
      description: conf.description,
      date: conf.date?.slice(0, 10),
    });
    setShowEditModal(true);
  };

  const saveEditedConference = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/conferences/${editConference._id}`,
        {
          title: editConference.title,
          description: editConference.description,
          date: editConference.date,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      toast.success("Conference updated successfully");
      setShowEditModal(false);
      fetchConferences(); // Refresh list
    } catch (err) {
      toast.error("Failed to update conference");
      console.error(err);
    }
  };

  // Delete Conference
  const handleDeleteConference = (confId) => {
    setSelectedConferenceId(confId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/conferences/${selectedConferenceId}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      toast.success("Conference deleted");
      setShowDeleteModal(false);
      fetchConferences();
    } catch (err) {
      toast.error("Failed to delete conference");
    }
  };

  // Reminder function
  const handleReminderChange = (sessionId, value) => {
    setReminderUpdates((prev) => ({ ...prev, [sessionId]: Number(value) }));
  };

  const saveReminderTime = async (sessionId) => {
    const minutes = reminderUpdates[sessionId];
    try {
      await axios.put(
        `http://localhost:5000/api/sessions/${sessionId}`,
        { reminderMinutesBefore: minutes },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success("Reminder time updated");
      fetchConferences(); // refresh session list
    } catch (err) {
      toast.error("Failed to update reminder time");
    }
  };

  // Fetch all data on mount
  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/speakers"); // You'll create this route
        setSpeakers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchConferences();
    fetchSpeakers();
    setLoading(false);
  }, [fetchConferences]);

  if (loading) return <Loader />;

  return (
    <div className="container-two">
      <h2>Welcome Organizer, {user.name}</h2>
      <h3>Create New Conference</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <button type="submit">Create</button>
      </form>

      <h3>Your Conferences</h3>
      <ul>
        {conferences.map((conf) => (
          <li key={conf._id} style={{ marginBottom: "30px" }}>
            <strong>{conf.title}</strong> —{" "}
            {new Date(conf.date).toLocaleDateString()}
            <p>{conf.description}</p>
            {/* Edit/Delete Buttons */}
            <div style={{ marginBottom: "10px" }}>
              <button
                onClick={() => handleEditConference(conf)}
                style={{ marginRight: "10px" }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteConference(conf._id)}
                style={{ backgroundColor: "red", color: "white" }}
              >
                Delete
              </button>
            </div>
            {/* Add Session Form */}
            <form onSubmit={(e) => handleSessionSubmit(conf._id, e)}>
              <h4>Add Session</h4>
              <input
                type="text"
                name="title"
                placeholder="Session Title"
                onChange={(e) => handleSessionChange(conf._id, e)}
                required
              />
              <p>From</p>
              <input
                type="datetime-local"
                name="startTime"
                onChange={(e) => handleSessionChange(conf._id, e)}
                required
              />
              <p>To</p>
              <input
                type="datetime-local"
                name="endTime"
                onChange={(e) => handleSessionChange(conf._id, e)}
                required
              />
              <select
                name="speaker"
                onChange={(e) => handleSessionChange(conf._id, e)}
                required
              >
                <option value="">Select Speaker</option>
                {speakers.map((speaker) => (
                  <option key={speaker._id} value={speaker._id}>
                    {speaker.name} ({speaker.email})
                  </option>
                ))}
              </select>
              <select
                name="reminderMinutesBefore"
                onChange={(e) => handleSessionChange(conf._id, e)}
                required
              >
                <option value="">Reminder before...</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">60 minutes</option>
              </select>

              <button type="submit">Add Session</button>
            </form>
            <h4>Sessions:</h4>
            <ul>
              {(conferenceSessions[conf._id] || []).map((session) => (
                <li key={session._id}>
                  <strong>{session.title}</strong> by{" "}
                  {session.speaker?.name || "Unknown"}
                  <br />
                  {new Date(session.startTime).toLocaleTimeString()} -{" "}
                  {new Date(session.endTime).toLocaleTimeString()}
                  <br />
                  Reminder:{" "}
                  <select
                    value={
                      reminderUpdates[session._id] ??
                      session.reminderMinutesBefore ??
                      30
                    }
                    onChange={(e) =>
                      handleReminderChange(session._id, e.target.value)
                    }
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>60 minutes</option>
                  </select>
                  <button onClick={() => saveReminderTime(session._id)}>
                    Save
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {/* === Edit Modal === */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Conference</h3>
            <label>Title</label>
            <input
              type="text"
              value={editConference.title}
              onChange={(e) =>
                setEditConference({ ...editConference, title: e.target.value })
              }
            />
            <label>Description</label>
            <textarea
              value={editConference.description}
              onChange={(e) =>
                setEditConference({
                  ...editConference,
                  description: e.target.value,
                })
              }
            ></textarea>
            <label>Date</label>
            <input
              type="date"
              value={editConference.date}
              onChange={(e) =>
                setEditConference({ ...editConference, date: e.target.value })
              }
            />
            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button className="save-btn" onClick={saveEditedConference}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === Delete Confirmation Modal === */}
      {showDeleteModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowDeleteModal(false)}
        >
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Conference</h3>
            <p>Are you sure you want to delete this conference?</p>
            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button className="save-btn" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
