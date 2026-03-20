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

    console.log('Searching for admin user...');
    let user = await User.findOne({ username: 'admin' }).maxTimeMS(5000);
    if (!user) {
      console.log('Admin user not found. Creating one...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      user = new User({
        username: 'admin',
        password: hashedPassword,
      });
      await user.save();
      console.log('SUCCESS: Default admin created!');
      console.log('Username: admin');
      console.log('Password: admin123');
    } else {
      console.log('Admin user already exists.');
      console.log('Username: admin');
    }
    process.exit(0);
  } catch (err) {
    console.error('ERROR:', err);
    process.exit(1);
  }
};

createAdmin();
