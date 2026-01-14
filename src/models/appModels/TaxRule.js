const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taxRuleSchema = new Schema({
  taxpercent: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  additional_value: {
    type: Number,
    default: 0,
  },
  scenarioId: {
    type: Schema.Types.ObjectId,
    ref: 'Scenario',
    required: true,
  },
  removed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('TaxRule', taxRuleSchema);