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


// Delete Conference
exports.deleteConference = async (req, res) => {
  try {
    const { id } = req.params;

    const conf = await Conference.findById(id);
    if (!conf) return res.status(404).json({ message: "Conference not found" });

    // Only organizer who created it can delete
    if (conf.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this conference" });
    }

    await conf.deleteOne();
    res.json({ message: "Conference deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Conference
exports.updateConference = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date } = req.body;

    const conf = await Conference.findById(id);
    if (!conf) return res.status(404).json({ message: "Conference not found" });

    if (conf.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to edit this conference" });
    }

    conf.title = title || conf.title;
    conf.description = description || conf.description;
    conf.date = date || conf.date;

    await conf.save();
    res.json({ message: "Conference updated successfully", conference: conf });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
