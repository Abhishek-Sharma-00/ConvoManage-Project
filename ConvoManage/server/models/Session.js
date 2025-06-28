const mongoose = require('mongoose');


const sessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  speaker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  conference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conference',
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  description: String,
  reminderMinutesBefore: {
    type: Number,
    default: 30, // default to 30 minutes if not specified
    enum: [15, 30, 60] // limit to common options
  },
  lastReminderSentAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
