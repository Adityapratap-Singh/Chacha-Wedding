
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const guestController = require('../controllers/guestController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

router.post(
  '/',
  auth,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('family').optional().trim(),
    body('honorific').optional().trim(),
    body('location').optional().trim(),
  ],
  validate,
  guestController.addGuest
);
router.get('/', auth, guestController.getGuests);
router.get('/locations', auth, guestController.getLocations);
router.put('/:id', auth, guestController.editGuest);
router.delete('/:id', auth, guestController.deleteGuest);
router.post(
  '/notify-open',
  [body('guestId').notEmpty().withMessage('Guest ID is required')],
  validate,
  guestController.notifyOpen
);
router.get('/:guestId', guestController.getGuest);
router.post('/rsvp/:guestId', guestController.rsvpGuest);

module.exports = router;
