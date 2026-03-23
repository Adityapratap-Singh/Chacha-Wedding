const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: {
    type: String, // email or 'Guest' or 'System'
    default: 'System',
  },
  action: {
    type: String, // 'ADD_GUEST', 'DELETE_GUEST', 'UPDATE_SETTING', 'RSVP_SUBMIT', 'LOGIN'
    required: true,
  },
  target: {
    type: String, // 'Guest: Pushpendra', 'Setting: coupleNames'
    required: true,
  },
  details: {
    type: mongoose.Schema.Types.Mixed, // Stores old/new values or other relevant data
  },
  ip: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
