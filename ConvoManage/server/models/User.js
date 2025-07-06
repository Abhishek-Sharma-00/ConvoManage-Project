const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['organizer', 'speaker', 'attendee', 'admin'],
    default: 'attendee',
  },
  password: {
    type: String,
    required: true,
  },
  resetPasswordToken: {
    type: String,
    // default: null,
  },
  resetPasswordExpires: {
    type: Date,
    // default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
