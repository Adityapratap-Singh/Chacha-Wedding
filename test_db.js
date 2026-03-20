const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });

const testDB = async () => {
  try {
    console.log('Connecting to:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    console.log('Trying to list databases...');
    const admin = new mongoose.mongo.Admin(mongoose.connection.db);
    const dbs = await admin.listDatabases();
    console.log('Databases:', dbs.databases.map(db => db.name));
    
    process.exit(0);
  } catch (err) {
    console.error('ERROR:', err);
    process.exit(1);
  }
};

testDB();
