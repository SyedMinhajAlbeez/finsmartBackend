const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const Admin = require('../src/models/coreModels/Admin');
const FBRUser = require('../src/models/appModels/Creds');

async function createFBRUserCollection() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Define the Admin _id to update
    const adminId = '689382467da3270c1e79bc66';

    // Define the update data for ntn, address, and province
    const updateData = {
      ntn: '4230108488825', // Replace with the desired NTN value
      address: '123 New Street, Karachi', // Replace with the desired address
      province: 'Sindh', // Replace with the desired province
      updatedAt: new Date(), // Update the timestamp
    };

    // Update the Admin document
    const admin = await Admin.findByIdAndUpdate(
      adminId,
      { $set: updateData },
      { new: true, runValidators: true } // Return the updated document and validate
    );

    if (!admin) {
      console.log(`No admin found with _id: ${adminId}`);
      return;
    }

    console.log('Successfully updated Admin:', admin);

  
  } catch (error) {
    console.error('Error processing script:', error.message);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
}

// Execute the function
createFBRUserCollection()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });