const Session = require("../models/Session");
const logActivity = require("../utils/logActivity");

// Create session
const createSession = async (req, res) => {
  try {
    const { title, speaker, conference, startTime, endTime, description } =
      req.body;

    const session = new Session({
      title,
      speaker,
      conference,
      startTime,
      endTime,
      description,
    });

    await session.save();
    await logActivity(req.user, `Created session: ${title}`);
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all sessions for a conference
const getSessionsByConference = async (req, res) => {
  try {
    const sessions = await Session.find({ conference: req.params.conferenceId })
      .populate("speaker", "name email")
      .populate("conference", "title");
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update session
const updateSession = async (req, res) => {
  try {
    const updated = await Session.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Session not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete session
const deleteSession = async (req, res) => {
  try {
    const deleted = await Session.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Session not found" });
    res.json({ message: "Session deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get sessions by speaker
const getSessionsBySpeaker = async (req, res) => {
  try {
    if (req.user.id !== req.params.speakerId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const sessions = await Session.find({ speaker: req.params.speakerId })
      .populate("conference", "title date")
      .sort({ startTime: 1 });

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get sessions registered by the logged-in attendee
const getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({ attendees: req.user.id })
      .populate("conference")
      .populate("speaker", "name email");
    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get most active speakers
const getTopSpeakers = async (req, res) => {
  try {
    const topSpeakers = await Session.aggregate([
      {
        $group: {
          _id: "$speaker",
          sessionCount: { $sum: 1 },
        },
      },
      { $sort: { sessionCount: -1 } },
      { $limit: 5 }, // Top 5 speakers
      {
        $lookup: {
          from: "users", // must match your User model's MongoDB collection name
          localField: "_id",
          foreignField: "_id",
          as: "speakerDetails",
        },
      },
      { $unwind: "$speakerDetails" },
      {
        $project: {
          _id: 0,
          name: "$speakerDetails.name",
          email: "$speakerDetails.email",
          sessionCount: 1,
        },
      },
    ]);

    res.json(topSpeakers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Filter & Search Sessions
const searchSessions = async (req, res) => {
  const { title, speaker, dateFrom, dateTo, conferenceId } = req.query;

  const query = {};

  if (title) {
    query.title = { $regex: title, $options: "i" }; // case-insensitive
  }

  if (speaker) {
    query.speakerName = { $regex: speaker, $options: "i" };
  }

  if (conferenceId) {
    query.conference = conferenceId;
  }

  if (dateFrom || dateTo) {
    query.startTime = {};
    if (dateFrom) query.startTime.$gte = new Date(dateFrom);
    if (dateTo) query.startTime.$lte = new Date(dateTo);
  }

  try {
    const results = await Session.find(query)
      .populate("conference", "title")
      .populate("speaker", "name email");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Register for a session
const registerForSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Prevent duplicate registration
    if (session.attendees.includes(req.user.id)) {
      return res.status(400).json({ message: "Already registered" });
    }

    session.attendees.push(req.user.id);
    await session.save();

    res.status(200).json({ message: "Successfully joined session" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createSession,
  getSessionsByConference,
  updateSession,
  deleteSession,
  getSessionsBySpeaker,
  getMySessions,
  getTopSpeakers,
  searchSessions,
  registerForSession,
};
