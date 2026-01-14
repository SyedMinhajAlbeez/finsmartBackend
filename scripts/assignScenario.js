const mongoose = require('mongoose');
const Admin = require('../src/models/coreModels/Admin');
const Scenario = require('../src/models/appModels/Scenario');

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local'});

async function assignScenarioIdsToAdmin() {
  try {
    await mongoose.connect(process.env.DATABASE);

    console.log('Connected to MongoDB');

    // Find a scenario to assign (e.g., by scenarioId)
    const scenarioIdsToAssign = ['SN006', 'SN005','SN001','SN002','SN007', 'SN008', 'SN016', 'SN017','SN024','SN018','SN019','SN026','SN027','SN028'];
    const scenarios = await Scenario.find({ scenarioId: { $in: scenarioIdsToAssign } });
    
    if (scenarios.length === 0) {
      console.log('No scenarios found with provided scenarioIds:', scenarioIdsToAssign);
      return;
    }

    const scenarioObjectIds = scenarios.map(scenario => scenario._id);

    // Update an admin with the array of scenario _ids
    const result = await Admin.updateOne(
      { email: 'alisons@finsmart.com', removed: false },
      { $set: { scenarioIds: scenarioObjectIds } } // Replace scenarioIds array
    );

    console.log(`Updated ${result.modifiedCount} admin document(s) with scenarioIds:`, scenarioObjectIds);
  } catch (error) {
    console.error('Error assigning scenarioIds:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
}

assignScenarioIdsToAdmin();