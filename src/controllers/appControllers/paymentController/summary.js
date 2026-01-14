const mongoose = require('mongoose');
const moment = require('moment');
const Model = mongoose.model('Payment');
const { loadSettings } = require('@/middlewares/settings');

const summary = async (req, res) => {
  try {
    // Ensure req.userId is set by restrictToLoggedInUser middleware
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        result: null,
        message: 'Unauthorized: No user ID found. Please log in.',
      });
    }

    let defaultType = 'month';
    const { type } = req.query;

    // Validate type query parameter
    if (type && !['week', 'month', 'year'].includes(type)) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Invalid type. Must be week, month, or year.',
      });
    }
    if (type) {
      defaultType = type;
    }

    // Set date range
    const currentDate = moment();
    const startDate = currentDate.clone().startOf(defaultType);
    const endDate = currentDate.clone().endOf(defaultType);

    // Aggregate payment data for the logged-in user
    const result = await Model.aggregate([
      {
        $match: {
          removed: false,
          createdBy: new mongoose.Types.ObjectId(req.userId), // Filter by user ID
          date: {
            $gte: startDate.toDate(),
            $lte: endDate.toDate(),
          },
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          total: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          count: 1,
          total: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      result: result.length > 0 ? result[0] : { count: 0, total: 0 },
      message: `Successfully fetched payment summary for the last ${defaultType}`,
    });
  } catch (error) {
    console.error('Error generating payment summary:', error.message);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error generating payment summary',
      error: error.message,
    });
  }
};

module.exports = summary;