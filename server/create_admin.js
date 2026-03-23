const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const User = require('./models/user');
const bcrypt = require('bcryptjs');

const admins = [
  { email: 'admin@pr-wedding.com', password: '12-05-2026' }, // Primary
  { email: 'pushpendra@pr-wedding.com', password: 'wedding-admin-1' },
  { email: 'renu@pr-wedding.com', password: 'wedding-admin-2' },
  { email: 'moderator1@pr-wedding.com', password: 'wedding-admin-3' },
  { email: 'moderator2@pr-wedding.com', password: 'wedding-admin-4' }
];

const createAdmins = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      console.log('Connecting to MongoDB...');
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected!');
    }

    const salt = await bcrypt.genSalt(10);

    for (const admin of admins) {
      let user = await User.findOne({ email: admin.email });
      if (!user) {
        const hashedPassword = await bcrypt.hash(admin.password, salt);
        user = new User({
          email: admin.email,
          password: hashedPassword,
        });
        await user.save();
        console.log(`SUCCESS: Admin created: ${admin.email} / ${admin.password}`);
      } else {
        console.log(`SKIP: Admin already exists: ${admin.email}`);
      }
    }
    
    console.log('\nAll admin accounts are ready.');
  } catch (err) {
    console.error('ERROR:', err.message);
    throw err;
  }
};

module.exports = createAdmins;

if (require.main === module) {
  createAdmins()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
