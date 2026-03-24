
const Guest = require('../models/guest');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const { logAction } = require('../utils/logger');
const { sendTelegramMessage } = require('../utils/telegram');

const emitGuestsUpdate = (req) => {
  const io = req.app.get('io');
  if (io) io.emit('guests:updated');
};

exports.addGuest = async (req, res) => {
  const { name, family, honorific, specialMessage, location, forceCreate } = req.body;

  try {
    if (!forceCreate && name) {
      const escaped = String(name).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const existing = await Guest.findOne({
        name: { $regex: new RegExp(`^${escaped}$`, 'i') }
      });
      if (existing) {
        return res.status(409).json({
          duplicate: true,
          existing: {
            _id: existing._id,
            name: existing.name,
            family: existing.family,
            honorific: existing.honorific,
            location: existing.location,
          }
        });
      }
    }

    const guestId = uuidv4();
    const newGuest = new Guest({
      name: name?.trim() || name,
      family,
      honorific,
      guestId,
      specialMessage,
      location: location || '',
    });

    const guest = await newGuest.save();
    
    // Log the change
    await logAction(
      req.user ? req.user.email : 'System',
      'ADD_GUEST',
      `Guest: ${guest.name}`,
      'GUESTS',
      null,
      guest.toObject(),
      { guestId: guest.guestId, family: guest.family },
      req.ip
    );

    emitGuestsUpdate(req);
    res.json(guest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.notifyOpen = async (req, res) => {
  const { guestId } = req.body;
  try {
    const guest = await Guest.findOne({ guestId });
    if (!guest) return res.status(404).json({ msg: 'Guest not found' });

    // Extract IP from request headers (behind proxies) or remoteAddress
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
    
    // Geolocation from IP (using ip-api.com - free for non-commercial)
    let ipLoc = {};
    try {
      if (ip && ip !== '::1' && ip !== '127.0.0.1') {
        const locRes = await axios.get(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,zip,lat,lon,isp`);
        if (locRes.data && locRes.data.status === 'success') {
          ipLoc = locRes.data;
        }
      }
    } catch (e) {
      console.error('IP Geo Error:', e.message);
    }

    // Build Telegram Message
    let message = `✨ <b>Invitation Opened!</b> ✨\n\n`;
    message += `👤 <b>Guest:</b> ${guest.name}\n`;
    message += `📍 <b>Database Location:</b> ${guest.location || 'Unknown'}\n`;
    message += `🌐 <b>IP Address:</b> ${ip}\n`;

    if (ipLoc.status === 'success') {
      message += `🏙 <b>Detected Location:</b> ${ipLoc.city}, ${ipLoc.regionName}, ${ipLoc.country} (${ipLoc.zip})\n`;
      message += `📶 <b>ISP:</b> ${ipLoc.isp}\n`;
      message += `🗺 <a href="https://www.google.com/maps?q=${ipLoc.lat},${ipLoc.lon}">View Approximate Location</a>\n`;
    } else {
      message += `🗺 <i>Exact location unavailable (Direct tracking used)</i>\n`;
    }

    await sendTelegramMessage(message);

    res.json({ msg: 'Notification sent' });
  } catch (err) {
    console.error('Notification Controller Error:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.rsvpGuest = async (req, res) => {
  const { rsvpStatus, guestCount } = req.body;
  try {
    let guest = await Guest.findOne({ guestId: req.params.guestId });
    if (!guest) {
      return res.status(404).json({ msg: 'Guest not found' });
    }

    const before = guest.toObject();

    guest.rsvpStatus = rsvpStatus;
    guest.guestCount = guestCount || 0;
    guest.rsvpDate = Date.now();

    await guest.save();

    // Log the RSVP
    await logAction(
      'Guest',
      'RSVP_SUBMIT',
      `Guest: ${guest.name}`,
      'RSVP',
      before,
      guest.toObject(),
      { status: rsvpStatus, count: guestCount },
      req.ip
    );

    emitGuestsUpdate(req);
    res.json(guest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getGuests = async (req, res) => {
  try {
    const guests = await Guest.find().sort({ createdAt: -1 });
    res.json(guests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getLocations = async (req, res) => {
  try {
    const locations = await Guest.distinct('location');
    const filtered = locations.filter(Boolean).sort();
    res.json(filtered);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.editGuest = async (req, res) => {
  const { name, family, honorific, specialMessage, location } = req.body;
  try {
    let guest = await Guest.findById(req.params.id);
    if (!guest) {
      return res.status(404).json({ msg: 'Guest not found' });
    }

    const before = guest.toObject();

    const update = { name, family, honorific, specialMessage };
    if (location !== undefined) update.location = location;

    guest = await Guest.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true }
    );

    // Log the edit
    await logAction(
      req.user ? req.user.email : 'System',
      'EDIT_GUEST',
      `Guest: ${guest.name}`,
      'GUESTS',
      before,
      guest.toObject(),
      { update },
      req.ip
    );

    emitGuestsUpdate(req);
    res.json(guest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteGuest = async (req, res) => {
  try {
    let guest = await Guest.findById(req.params.id);
    if (!guest) {
      return res.status(404).json({ msg: 'Guest not found' });
    }

    await Guest.findByIdAndDelete(req.params.id);

    // Log the deletion
    await logAction(
      req.user ? req.user.email : 'System',
      'DELETE_GUEST',
      `Guest: ${guest.name}`,
      'GUESTS',
      guest.toObject(),
      null,
      { guestId: guest.guestId },
      req.ip
    );

    emitGuestsUpdate(req);
    res.json({ msg: 'Guest removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getGuest = async (req, res) => {
  try {
    const guest = await Guest.findOne({ guestId: req.params.guestId });
    if (!guest) {
      return res.status(404).json({ msg: 'Guest not found' });
    }
    res.json(guest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
