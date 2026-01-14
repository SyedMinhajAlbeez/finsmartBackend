const mongoose = require('mongoose');
const TaxRule = require('../src/models/appModels/TaxRule'); 
const Scenario = require('../src/models/appModels/Scenario');


require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

async function createTaxRulesCollection() {

  try {
    await mongoose.connect(process.env.DATABASE);
    console.log('Connected to MongoDB');

     // Generate scenarioIds from SN001 to SN025
     const scenarioIds = Array.from({ length: 25 }, (_, i) => `SN${String(i + 1).padStart(3, '0')}`);

     // Find scenarios
     const scenarios = await Scenario.find({
       scenarioId: { $in: scenarioIds },
       removed: false,
     });
 
     if (scenarios.length === 0) {
       console.log('No scenarios found for SN001 to SN025');
       return;
     }
 
     // Map scenarioIds to their _id
     const scenarioMap = scenarios.reduce((map, scenario) => {
       map[scenario.scenarioId] = scenario._id;
       return map;
     }, {});
 
     // Static tax rule data
     const staticTaxRules = [
        { scenarioId: 'SN001', taxpercent: 18, additional_value: 0 }, // Standard rate, registered buyer, no further tax
        { scenarioId: 'SN002', taxpercent: 18, additional_value: 3 }, // Standard rate, unregistered, 3% further tax
        { scenarioId: 'SN003', taxpercent: 0, additional_value: 0 }, // Exempt goods, registered, no taxes
        { scenarioId: 'SN004', taxpercent: 0, additional_value: 0 }, // Exempt goods (e.g., steel scrap), unregistered, no taxes
        { scenarioId: 'SN005', taxpercent: 1, additional_value: 3 }, // Reduced rate (Eighth Schedule), unregistered, 3% further tax
        { scenarioId: 'SN006', taxpercent: 0, additional_value: 0 }, // Exempt goods, unregistered, no taxes
        { scenarioId: 'SN007', taxpercent: 18, additional_value: 0 }, // Fixed rate goods, registered, no further tax
        { scenarioId: 'SN008', taxpercent: 18, additional_value: 3 }, // Fixed rate goods, unregistered, 3% further tax
        { scenarioId: 'SN009', taxpercent: 18, additional_value: 0 }, // Retail price goods, registered, tax on MRP
        { scenarioId: 'SN010', taxpercent: 18, additional_value: 3 }, // Retail price goods, unregistered, 3% further tax
        { scenarioId: 'SN011', taxpercent: 18, additional_value: 5 }, // Extra tax goods, registered, 5% extra tax
        { scenarioId: 'SN012', taxpercent: 18, additional_value: 8 }, // Extra tax goods, unregistered, 5% extra + 3% further
        { scenarioId: 'SN013', taxpercent: 18, additional_value: 0 }, // Third Schedule goods, registered, tax on MRP
        { scenarioId: 'SN014', taxpercent: 18, additional_value: 3 }, // Third Schedule goods, unregistered, 3% further tax
        { scenarioId: 'SN015', taxpercent: 0, additional_value: 0 }, // Local zero-rated, registered, no taxes
        { scenarioId: 'SN016', taxpercent: 0, additional_value: 0 }, // Local zero-rated, unregistered, no taxes
        { scenarioId: 'SN017', taxpercent: 0, additional_value: 0 }, // Exempt export, registered, no taxes
        { scenarioId: 'SN018', taxpercent: 0, additional_value: 0 }, // Exempt export, unregistered, no taxes
        { scenarioId: 'SN019', taxpercent: 0, additional_value: 0 }, // Taxable export, registered, zero-rated
        { scenarioId: 'SN020', taxpercent: 0, additional_value: 0 }, // Taxable export, unregistered, zero-rated
        { scenarioId: 'SN021', taxpercent: 0, additional_value: 0 }, // Cement/concrete block, registered, fixed tax (not %)
        { scenarioId: 'SN022', taxpercent: 0, additional_value: 3 }, // Cement/concrete block, unregistered, fixed + 3% further
        { scenarioId: 'SN023', taxpercent: 0, additional_value: 0 }, // Reclaimed lead, registered, specific rate (often exempt)
        { scenarioId: 'SN024', taxpercent: 0, additional_value: 3 }, // Reclaimed lead, unregistered, specific + 3% further
        { scenarioId: 'SN025', taxpercent: 10, additional_value: 0 }, // Raw hides & skin, registered, 10% (SRO-specific)
        { scenarioId: 'SN026', taxpercent: 10, additional_value: 3 }, // Raw hides & skin, unregistered, 10% + 3% further
        { scenarioId: 'SN027', taxpercent: 10, additional_value: 0 }, // Ginned cotton, registered, 10% (SRO 1125)
        { scenarioId: 'SN028', taxpercent: 10, additional_value: 3 }  // Ginned cotton, unregistered, 10% + 3% further
      ];
 
     // Create tax rules with scenario _id
     const taxRules = staticTaxRules
       .map(rule => {
         const scenarioId = scenarioMap[rule.scenarioId];
         if (!scenarioId) {
           console.warn(`Scenario ${rule.scenarioId} not found, skipping tax rule creation`);
           return null;
         }
         return {
           taxpercent: rule.taxpercent,
           additional_value: rule.additional_value,
           scenarioId: scenarioId,
         };
       })
       .filter(rule => rule !== null);
 
     if (taxRules.length === 0) {
       console.log('No valid tax rules to insert');
       return;
     }
 
     const result = await TaxRule.insertMany(taxRules);
     console.log(`Inserted ${result.length} tax rules`);
     console.log('Inserted tax rules:', result.map(r => ({
       scenarioId: r.scenarioId,
       taxpercent: r.taxpercent,
       additional_value: r.additional_value,
     })));
   } catch (error) {
     console.error('Error creating tax rules:', error.message);
   } finally {
     await mongoose.disconnect();
     console.log('MongoDB connection closed');
   }
 }
 
 createTaxRulesCollection();