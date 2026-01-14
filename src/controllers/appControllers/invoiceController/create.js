const mongoose = require('mongoose');
const Model = mongoose.model('Invoice');
const { calculate } = require('@/helpers');
const { increaseBySettingKey } = require('@/middlewares/settings');
const schema = require('./schemaValidate');

const create = async (req, res) => {
  try {
    // Ensure req.userId is set by restrictToLoggedInUser middleware
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        result: null,
        message: 'Unauthorized: No user ID found. Please log in.',
      });
    }

    let body = req.body;

    // Validate request body
    const { error, value } = schema.validate(body);
    if (error) {
      const { details } = error;
      return res.status(400).json({
        success: false,
        result: null,
        message: details[0]?.message,
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

    // Calculate total from items
    const total = calculate.totalItems(items); // Assumes items: [{ price, quantity, ... }]
    if (!total || total < 0) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Invalid total calculated from items',
      });
    }

    // Prepare invoice data
    body = {
      ...value,
      items,
      total,
      discount,
      paymentStatus: calculate.sub(total, discount) === 0 ? 'paid' : 'unpaid',
      createdBy: req.userId, // Set createdBy to logged-in user's ID
      removed: false,
    };

    // Create new invoice document
    const result = await new Model(body).save();

    // Update with PDF file ID
    const fileId = `invoice-${result._id}.pdf`;
    const updateResult = await Model.findOneAndUpdate(
      { _id: result._id },
      { pdf: fileId },
      { new: true }
    ).exec();

    // Increment last invoice number
    await increaseBySettingKey({ settingKey: 'last_invoice_number' });

    return res.status(201).json({
      success: true,
      result: updateResult,
      message: 'Invoice created successfully',
    });
  } catch (error) {
    console.error('Error creating invoice:', error.message);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error creating invoice',
      error: error.message,
    });
  }
};

module.exports = create;