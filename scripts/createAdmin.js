const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const Admin = require('../src/models/coreModels/Admin');

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Define the new Admin data
    const adminData = {
      email: 'admin@finsmart.com',
      // ntn: '4210195383221', 
       ntn: '420000000000', 

      address: 'Karachi,Pakistan', 
      province: 'Sindh',
      name: 'Super', 
      surname: 'Admin', 
      photo: '',
      role: 'owner', 
      removed: false, 
      enabled: true, // Set to true to enable the user
      scenarioIds: [], // Empty array as default
      Creds: [], // Empty array as default
    };

    // Create and save the new Admin document
    const newAdmin = new Admin(adminData);
    const savedAdmin = await newAdmin.save();

    console.log('Successfully created Admin:', savedAdmin);
  } catch (error) {
    console.error('Error creating Admin:', error.message);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
}

// Execute the function
createAdminUser()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });