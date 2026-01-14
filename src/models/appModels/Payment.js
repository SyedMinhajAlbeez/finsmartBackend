const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },

  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin', autopopulate: true, required: true },
  number: {
    type: Number,
    required: true,
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    autopopulate: true,
    required: true,
  },
  invoice: {
    type: mongoose.Schema.ObjectId,
    ref: 'Invoice',
    required: true,
    autopopulate: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  cheque_date: {
    type: Date,
    required: true,
  },
  deposit_date: {
    type: Date,
    required: true,
  },
  cheque_no: {
    type: String,
    required: true,
  },
  bank_code: {
    type: String,
    required: true,
  },

  deposit_bank: {
    type: String,
    required: true,
  },
  
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'NA',
    uppercase: true,
    required: true,
  },
  // paymentMode: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'PaymentMode',
  //   autopopulate: true,
  // },
  ref: {
    type: String,
  },
  remarks: {
    type: String,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});
paymentSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Payment', paymentSchema);
