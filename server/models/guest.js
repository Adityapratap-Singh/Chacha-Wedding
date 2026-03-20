
const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  family: {
    type: String,
    required: true,
  },
  honorific: {
    type: String,
    enum: ['Mr', 'Mrs', 'None'],
    default: 'None',
  },
  guestId: {
    type: String,
    required: true,
    unique: true,
  },
  specialMessage: {
    type: String,
  },
  location: {
    type: String,
    default: '',
  },
  rsvpStatus: {
    type: String,
    enum: ['Pending', 'Attending', 'Not Attending'],
    default: 'Pending',
  },
  rsvpDate: {
    type: Date,
  },
  guestCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Guest', guestSchema);
