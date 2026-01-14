const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const AdminPassword = require('../src/models/coreModels/AdminPassword');

async function setAdminPassword() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Define the Admin user ID and password details
    const adminId = '69673cc51d6b711b6afd13ba';
    const plainPassword = 'admin@786';

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(salt + plainPassword);

    // Define the AdminPassword data
    const adminPasswordData = {
      user: adminId,
      password: hashedPassword,
      salt: salt,
      emailVerified: false, // Default as per schema
      authType: 'email', // Default as per schema
      loggedSessions: [], // Default as per schema
      removed: false, // Default as per schema
    };

    // Check if AdminPassword already exists for this user
    const existingAdminPassword = await AdminPassword.findOne({ user: adminId });
    if (existingAdminPassword) {
      console.log(`AdminPassword already exists for Admin with _id: ${adminId}`);
      return;
    }

    // Create and save the new AdminPassword document
    const newAdminPassword = new AdminPassword(adminPasswordData);
    const savedAdminPassword = await newAdminPassword.save();

    console.log('Successfully set Admin password:', savedAdminPassword);
  } catch (error) {
    console.error('Error setting Admin password:', error.message);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
}

// Execute the function
setAdminPassword()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });