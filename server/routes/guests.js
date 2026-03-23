
const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');
const auth = require('../middleware/auth');

router.post('/', auth, guestController.addGuest);
router.get('/', auth, guestController.getGuests);
router.get('/locations', auth, guestController.getLocations);
router.put('/:id', auth, guestController.editGuest);
router.delete('/:id', auth, guestController.deleteGuest);
router.post('/notify-open', guestController.notifyOpen);
router.get('/:guestId', guestController.getGuest);
router.post('/rsvp/:guestId', guestController.rsvpGuest);

module.exports = router;
