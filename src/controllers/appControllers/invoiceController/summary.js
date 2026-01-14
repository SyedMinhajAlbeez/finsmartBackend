const mongoose = require('mongoose');
const moment = require('moment');
const Model = mongoose.model('Invoice');
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

    const statuses = ['draft', 'pending', 'overdue', 'paid', 'unpaid', 'partially'];

    // Aggregate invoice data for the logged-in user
    const response = await Model.aggregate([
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
        $facet: {
          totalInvoice: [
            {
              $group: {
                _id: null,
                total: { $sum: '$total' },
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                total: '$total',
                count: '$count',
              },
            },
          ],
          statusCounts: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                status: '$_id',
                count: '$count',
              },
            },
          ],
          paymentStatusCounts: [
            {
              $group: {
                _id: '$paymentStatus',
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                status: '$_id',
                count: '$count',
              },
            },
          ],
          overdueCounts: [
            {
              $match: {
                expiredDate: { $lt: new Date() },
              },
            },
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                status: '$_id',
                count: '$count',
              },
            },
          ],
        },
      },
    ]);

    // Initialize result arrays
    const totalInvoices = response[0].totalInvoice[0] || { total: 0, count: 0 };
    const statusResult = response[0].statusCounts || [];
    const paymentStatusResult = response[0].paymentStatusCounts || [];
    const overdueResult = response[0].overdueCounts || [];

    // Calculate percentages safely
    const statusResultMap = statusResult.map((item) => ({
      ...item,
      percentage: totalInvoices.count > 0 ? Math.round((item.count / totalInvoices.count) * 100) : 0,
    }));

    const paymentStatusResultMap = paymentStatusResult.map((item) => ({
      ...item,
      percentage: totalInvoices.count > 0 ? Math.round((item.count / totalInvoices.count) * 100) : 0,
    }));

    const overdueResultMap = overdueResult.map((item) => ({
      ...item,
      status: 'overdue',
      percentage: totalInvoices.count > 0 ? Math.round((item.count / totalInvoices.count) * 100) : 0,
    }));

    // Combine results for all statuses
    const result = statuses.map((status) => {
      const found = [...paymentStatusResultMap, ...statusResultMap, ...overdueResultMap].find(
        (item) => item.status === status
      ) || { status, count: 0, percentage: 0 };
      return found;
    });

    // Aggregate unpaid amounts for the logged-in user
    const unpaid = await Model.aggregate([
      {
        $match: {
          removed: false,
          createdBy: new mongoose.Types.ObjectId(req.userId), // Filter by user ID
          date: {
            $gte: startDate.toDate(),
            $lte: endDate.toDate(),
          },
          paymentStatus: { $in: ['unpaid', 'partially'] },
        },
      },
      {
        $group: {
          _id: null,
          total_amount: {
            $sum: { $subtract: ['$total', '$credit'] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          total_amount: '$total_amount',
        },
      },
    ]);

    const finalResult = {
      total: totalInvoices.total,
      total_undue: unpaid.length > 0 ? unpaid[0].total_amount : 0,
      type: defaultType,
      performance: result,
    };

    return res.status(200).json({
      success: true,
      result: finalResult,
      message: `Successfully found invoice summary for the last ${defaultType}`,
    });
  } catch (error) {
    console.error('Error generating invoice summary:', error.message);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error generating invoice summary',
      error: error.message,
    });
  }
};

module.exports = summary;