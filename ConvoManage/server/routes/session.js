const Session = require('../models/Session');
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const allowRoles = require('../middlewares/roleMiddleware');
const {
  registerForSession,
  createSession,
  getSessionsByConference,
  updateSession,
  deleteSession,
  getSessionsBySpeaker
} = require('../controllers/sessionController');
const { getMySessions } = require('../controllers/sessionController');
const { getTopSpeakers } = require("../controllers/sessionController");
const logActivity = require("../utils/logActivity");
const { searchSessions } = require('../controllers/sessionController');

router.get("/top-speakers", verifyToken, allowRoles("admin"), getTopSpeakers);

// Route for attendee's registered sessions
router.get('/my-registrations', verifyToken, allowRoles('attendee'), getMySessions);


// Only organizers can manage sessions
router.post('/', verifyToken, allowRoles('organizer'), createSession);
router.put('/:id', verifyToken, allowRoles('organizer'), updateSession);
router.delete('/:id', verifyToken, allowRoles('organizer'), deleteSession);

// Anyone can view sessions of a conference
router.get('/:conferenceId', getSessionsByConference);
router.get('/speaker/:speakerId', verifyToken, allowRoles('speaker'), getSessionsBySpeaker);

router.get('/search', searchSessions); // e.g. /api/sessions/search?title=node&speaker=ram

// Register for a session
router.post('/:id/register', verifyToken, allowRoles('attendee'), registerForSession);

router.post('/:id/register', verifyToken, allowRoles('attendee'), async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // prevent duplicate
    if (session.attendees.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already registered' });
    }

    session.attendees.push(req.user.id);
    await session.save();
    await logActivity(req.user.id, `Registered for session: ${session.title}`);

    res.status(200).json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;




