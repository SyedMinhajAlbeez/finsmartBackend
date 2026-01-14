const mongoose = require('mongoose');
const Model = mongoose.model('Quote');

const paginatedList = async (req, res) => {
  try {
    // Ensure req.userId is set by restrictToLoggedInUser middleware
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No user ID found. Please log in.',
      });
    }

    // Parse and validate query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.items) || 10;
    const skip = (page - 1) * limit;

    // Validate page and limit
    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: 'Page and limit must be positive integers',
      });
    }

    // Sanitize sort parameters
    const sortBy = req.query.sortBy || 'created'; // Default to created
    const sortValue = parseInt(req.query.sortValue) === 1 ? 1 : -1;
    const allowedSortFields = ['created', 'updated', 'subTotal', 'taxTotal', 'total', 'discount'];
    if (!allowedSortFields.includes(sortBy)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sort field',
      });
    }

    // Sanitize filter and equal parameters
    const filter = req.query.filter || null;
    const equal = req.query.equal || null;

    // Construct fields for search
    const fieldsArray = req.query.fields ? req.query.fields.split(',') : [];
    const searchQuery = req.query.q ? new RegExp(req.query.q, 'i') : null;

    let fields = {};
    if (searchQuery && fieldsArray.length > 0) {
      fields.$or = fieldsArray.map((field) => ({ [field]: searchQuery }));
    }

    // Build the query
    const query = {
      removed: false,
      createdBy: req.userId, // Filter by logged-in user's ID
    };
    if (filter && equal) {
      query[filter] = equal;
    }
    if (fields.$or) {
      Object.assign(query, fields);
    }

    // Execute queries
    const resultsPromise = Model.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortValue })
      .populate('createdBy', 'name email') // Include email for user details
      .exec();

    const countPromise = Model.countDocuments(query);

    // Resolve promises
    const [result, count] = await Promise.all([resultsPromise, countPromise]);

    // Calculate pagination
    const pages = Math.ceil(count / limit);
    const pagination = { page, pages, count };

    // Respond based on results
    return res.status(200).json({
      success: true,
      result: result || [],
      pagination,
      message: count > 0 ? 'Successfully found all documents' : 'No documents found for this user',
    });
  } catch (error) {
    console.error('Error listing quotes:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error listing quotes',
      error: error.message,
    });
  }
};

module.exports = paginatedList;