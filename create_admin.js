
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });
const User = require('./server/models/user');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
  try {
    console.log('Connecting to:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@pr-wedding.com';

    let user = await User.findOne({ email: adminEmail });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('12-05-2026', salt);
      user = new User({
        email: adminEmail,
        password: hashedPassword,
      });
      await user.save();
      console.log('SUCCESS: Default admin created!');
      console.log('Email:', adminEmail);
      console.log('Password: 12-05-2026');
    } else {
      console.log('Admin user already exists.');
      console.log('Email:', adminEmail);
    }
    process.exit(0);
  } catch (err) {
    console.error('ERROR:', err.message);
    process.exit(1);
  }
};

createAdmin();
