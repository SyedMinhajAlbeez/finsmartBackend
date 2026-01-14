const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const Admin = require('../src/models/coreModels/Admin');

async function fetchAdminByEmail() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Fetch the Admin document with the specified email
    const email = 'admin@finsmart.com';
    const admin = await Admin.findOne({ email });

    if (admin) {
      console.log('Admin found:');
      console.log({
        _id: admin._id,
        email: admin.email,
        name: admin.name,
        // Add other fields you want to log
      });
      console.log('Full document:', admin.toObject());
    } else {
      console.log(`No Admin found with email: ${email}`);
    }

  } catch (error) {
    console.error('Error fetching Admin:', error.message);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
}

// Execute the function
fetchAdminByEmail()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });