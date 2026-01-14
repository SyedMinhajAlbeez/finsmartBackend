const mongoose = require('mongoose');
const Model = mongoose.model('Quote');
const { calculate } = require('@/helpers');
const { increaseBySettingKey } = require('@/middlewares/settings');
const Joi = require('joi');

const schema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        quantity: Joi.number().min(0).required(),
        price: Joi.number().min(0).required(),
        description: Joi.string().optional(),
      })
    )
    .min(1)
    .required(),
  taxRate: Joi.number().min(0).default(0),
  discount: Joi.number().min(0).default(0),
});

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

    // Validate request body
    const { error, value } = schema.validate(req.body);
    if (error) {
      const { details } = error;
      return res.status(400).json({
        success: false,
        result: null,
        message: details[0]?.message,
      });
    }

    const { items = [], taxRate = 0, discount = 0 } = value;

    // Calculate subTotal, taxTotal, and total
    let subTotal = 0;
    items.forEach((item) => {
      const total = calculate.multiply(item.quantity, item.price);
      item.total = total; // Add total to each item
      subTotal = calculate.add(subTotal, total);
    });
    const taxTotal = calculate.multiply(subTotal, taxRate / 100);
    const total = calculate.add(subTotal, taxTotal);

    // Prepare quote data
    const body = {
      ...value,
      items,
      subTotal,
      taxRate,
      taxTotal,
      total,
      discount,
      createdBy: req.userId, // Set createdBy to logged-in user's ID
      removed: false,
    };

    // Create new quote document
    const result = await new Model(body).save();

    // Update with PDF file ID
    const fileId = `quote-${result._id}.pdf`;
    const updateResult = await Model.findOneAndUpdate(
      { _id: result._id },
      { pdf: fileId },
      { new: true }
    ).exec();

    // Increment last quote number
    await increaseBySettingKey({ settingKey: 'last_quote_number' });

    return res.status(201).json({
      success: true,
      result: updateResult,
      message: 'Quote created successfully',
    });
  } catch (error) {
    console.error('Error creating quote:', error.message);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error creating quote',
      error: error.message,
    });
  }
};

module.exports = create;