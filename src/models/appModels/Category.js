const { taxes } = require('@/locale/translation/en_us');
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },

  'HS Code': {
    type: String,
    required: true,
  },
  'Name': {
    type: String,
    required: true,
  },
  'Description': {
    type: String,
  },
  tax: {
    type: Number,
    required: true,
  },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  assigned: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Category', schema);
