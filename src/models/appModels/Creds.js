const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userFBRSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
  },
  sandbox_token: {
    type: String,
    trim: true,
    default: null,
  },
  production_token: {
    type: String,
    trim: true,
    default: null,
  },
  removed: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Creds', userFBRSchema);