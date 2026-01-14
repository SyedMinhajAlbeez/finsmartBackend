const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },

  'Product Name': {
    type: String,
    required: true,
    trim: true,
  },
  descriptions: {
    type: String,
    trim: true,
  },
  'uom': {
    type: String,
  },

  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    autopopulate: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
    default: null,
  },
  assigned: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
    default: null,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true }); 

productSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Product', productSchema);