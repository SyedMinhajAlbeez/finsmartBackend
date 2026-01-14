const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const Admin = require('../src/models/coreModels/Admin');

async function deleteAdminById() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Delete the Admin document with the specified _id
    const adminId = '68ff1818fac3287a1dae9763';
    const result = await Admin.deleteOne({ _id: adminId });

    if (result.deletedCount === 1) {
      console.log(`Successfully deleted Admin with _id: ${adminId}`);
    } else {
      console.log(`No Admin found with _id: ${adminId}`);
    }

  } catch (error) {
    console.error('Error deleting Admin:', error.message);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
}

// Execute the function
deleteAdminById()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });