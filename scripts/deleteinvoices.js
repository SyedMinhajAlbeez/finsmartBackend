const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const Admin = require('../src/models/coreModels/Admin');
const FBRUser = require('../src/models/appModels/Creds');


const Invoice = require('../src/models/appModels/Invoice'); // Adjust the path to your Invoice model

async function deleteAllInvoices() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Delete all documents in the Invoice collection
    const result = await Invoice.deleteMany({});

    console.log(`Successfully deleted ${result.deletedCount} invoices`);

  } catch (error) {
    console.error('Error deleting invoices:', error.message);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
}

// Execute the function
deleteAllInvoices()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });