const mongoose = require('mongoose');

const Admin = require('../src/models/coreModels/Admin');
const FBRUser = require('../src/models/appModels/Creds');

require('dotenv').config({ path: '.env' });

require('dotenv').config({ path: '.env.local' });

async function createFBRUserCollection() {
 
    try {
        await mongoose.connect(process.env.DATABASE);
        console.log('Connected to MongoDB');
    
    console.log('Connected to MongoDB');

    // Find an admin
    const admin = await Admin.findOne({ email: 'alisons@finsmart.com', removed: false });
    if (!admin) {
      console.log('No admin found with email: alisons@finsmart.com');
      return;
    }

    // Seed FBRUser records
    const FBRUserData = [
      {
        user_id: admin._id,
        sandbox_token: 'a477412c-5585-3af8-8f82-ace172dc407b',
        production_token: '',
      },
    ];

    const result = await FBRUser.insertMany(FBRUserData);
    console.log(`Inserted ${result.length} FBRUser records`);
    console.log('Inserted records:', result);
  } catch (error) {
    console.error('Error creating FBRUser records:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
}

createFBRUserCollection();