const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
  },
  ntn: { type: String, required: true },
  address: { type: String, required: true },
  province: { type: String, required: true },
  name: { type: String, required: true },
  surname: { type: String },
  photo: {
    type: String,
    trim: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: 'owner',
    enum: ['owner'],
  },
  scenarioIds: { // Changed from scenarioId to scenarioIds (plural)
    type: [{ type: Schema.Types.ObjectId, ref: 'Scenario' }], // Array of ObjectIds
    default: [],
  },

  Creds: { // Changed from scenarioId to scenarioIds (plural)
    type: [{ type: Schema.Types.ObjectId, ref: 'Creds' }], // Array of ObjectIds
    default: [],
  },
  // Creds: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Creds',
  //   required: true,
  //   autopopulate: true,
  // },
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);