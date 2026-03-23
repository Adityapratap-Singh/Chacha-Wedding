
const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const auth = require('../middleware/auth');

// @route   GET api/content
// @desc    Get all wedding content and settings
// @access  Public
router.get('/', settingController.getSettings);

// @route   POST api/content
// @desc    Update wedding content and settings
// @access  Private
router.post('/', auth, settingController.updateSettings);

module.exports = router;
