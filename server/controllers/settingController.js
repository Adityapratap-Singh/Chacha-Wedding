
const Setting = require('../models/setting');
const { logAction } = require('../utils/logger');

const emitSettingsUpdate = (req) => {
  const io = req.app.get('io');
  if (io) io.emit('settings:updated');
};

exports.getSettings = async (req, res) => {
  try {
    const settings = await Setting.find();
    // Convert to a simple key-value object
    const config = {};
    settings.forEach(s => {
      config[s.key] = s.value;
    });
    res.json(config);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateSettings = async (req, res) => {
  const { settings } = req.body; // Expecting an object of key-value pairs

  try {
    // Get current settings before update for logging
    const keys = Object.keys(settings);
    const oldSettingsDocs = await Setting.find({ key: { $in: keys } });
    const oldSettings = {};
    oldSettingsDocs.forEach(s => {
      oldSettings[s.key] = s.value;
    });

    const promises = Object.entries(settings).map(([key, value]) => {
      return Setting.findOneAndUpdate(
        { key },
        { value },
        { upsert: true, new: true }
      );
    });

    await Promise.all(promises);
    
    // Log the change with before and after states
    await logAction(
      req.user ? req.user.email : 'System',
      'UPDATE_SETTING',
      `Updated ${keys.length} setting(s)`,
      'SETTINGS',
      oldSettings,
      settings,
      { affectedKeys: keys },
      req.ip
    );

    emitSettingsUpdate(req);
    res.json({ msg: 'Settings updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
