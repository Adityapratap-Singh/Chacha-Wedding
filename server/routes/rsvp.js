
const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');

// @route   POST api/rsvp/:guestId
// @desc    Update guest RSVP status
// @access  Public
router.post('/:guestId', guestController.rsvpGuest);

module.exports = router;
