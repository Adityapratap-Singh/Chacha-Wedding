
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const User = require('./models/user');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      console.log('Connecting to:', process.env.MONGODB_URI);
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB');
    }

    // Default admin email
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
  } catch (err) {
    console.error('ERROR:', err.message);
    throw err;
  }
};

module.exports = createAdmin;

// Allow running directly: `node create_admin.js`
if (require.main === module) {
  createAdmin()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
