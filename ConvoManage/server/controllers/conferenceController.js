const Conference = require('../models/Conference');
const logActivity = require("../utils/logActivity");


// Create a new conference
exports.createConference = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    const conference = new Conference({
      title,
      description,
      date,
      organizer: req.user.id,
    });

    await conference.save();
    await logActivity(req.user, `Created conference: ${title}`);
    res.status(201).json(conference);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all conferences
exports.getAllConferences = async (req, res) => {
  try {
    const conferences = await Conference.find().populate('organizer', 'name email');
    res.json(conferences);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get one conference
exports.getConferenceById = async (req, res) => {
  try {
    const conf = await Conference.findById(req.params.id).populate('organizer', 'name email');
    if (!conf) return res.status(404).json({ message: 'Conference not found' });
    res.json(conf);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
exports.updateConference = async (req, res) => {
  try {
    const updated = await Conference.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Conference not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete
exports.deleteConference = async (req, res) => {
  try {
    const deleted = await Conference.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Conference not found' });
    res.json({ message: 'Conference deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
