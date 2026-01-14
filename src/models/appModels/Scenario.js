const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scenarioSchema = new Schema({
  id: {
    type: String,
    trim: true,
  },
  scenarioId: {
    type: String,
    required: true,
    trim: true,
    unique: true, // Ensure scenarioId is unique (e.g., SN001)
  },
  description: {
    type: String,
    required: true,
    trim: true, // Maps to table's description field
  },
  hscode_id: {
    type: String,
    trim: true,
  },
  uom_id: {
    type: String,
    trim: true,
  },
  sroScheduleNo: {
    type: String,
    trim: true,
  },
  sroItemSerialNo: {
    type: String,
    trim: true,
  },
  saleType: {
    type: String,
    trim: true,
  },
  rate: {
    type: String,
    trim: true,
  },
  removed: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Scenario', scenarioSchema);