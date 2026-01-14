const mongoose = require('mongoose');
const Model = mongoose.model('Invoice');
const { calculate } = require('@/helpers');
const schema = require('./schemaValidate');

const update = async (req, res) => {
  let body = req.body;

  const { error, value } = schema.validate(body);
  if (error) {
    const { details } = error;
    return res.status(400).json({
      success: false,
      result: null,
      message: details[0]?.message,
    });
  }

  const previousInvoice = await Model.findOne({
    _id: req.params.id,
    removed: false,
  });

  if (!previousInvoice) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Invoice not found',
    });
  }

  const { items = [], discount = 0 } = value;

  if (items.length === 0) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Items cannot be empty',
    });
  }

  // Use the total from the validated body (as per schema)
  body.items = items;
  body.paymentStatus = calculate.sub(body.total, discount) === 0 ? 'paid' : 'unpaid';
  body.pdf = 'invoice-' + req.params.id + '.pdf';
  body.createdBy = previousInvoice.createdBy; // Preserve original createdBy
  if (body.hasOwnProperty('currency')) {
    delete body.currency; // Prevent currency updates
  }

  // Update the invoice document
  const result = await Model.findOneAndUpdate(
    { _id: req.params.id, removed: false },
    body,
    { new: true }
  ).exec();

  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Invoice not found',
    });
  }

  return res.status(200).json({
    success: true,
    result,
    message: 'Invoice updated successfully',
  });
};

module.exports = update;