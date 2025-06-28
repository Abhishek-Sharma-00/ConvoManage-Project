const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const {
  createConference,
  getAllConferences,
  getConferenceById,
  updateConference,
  deleteConference
} = require('../controllers/conferenceController');

// Protected Routes
router.post('/', verifyToken, createConference);
router.get('/', getAllConferences);
router.get('/:id', getConferenceById);
router.put('/:id', verifyToken, updateConference);
router.delete('/:id', verifyToken, deleteConference);

module.exports = router;
