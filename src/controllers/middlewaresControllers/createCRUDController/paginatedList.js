const mongoose = require('mongoose');

const paginatedList = async (Model, req, res) => {
  try {
    // Ensure req.userId is set by restrictToLoggedInUser middleware
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No user ID found. Please log in.',
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.items) || 10;
    const skip = page * limit - limit;

    const { sortBy = 'enabled', sortValue = -1, filter, equal, q } = req.query;

    const fieldsArray = req.query.fields ? req.query.fields.split(',') : [];

    // Build query fields for search
    let fields = fieldsArray.length === 0 ? {} : { $or: [] };
    for (const field of fieldsArray) {
      fields.$or.push({ [field]: { $regex: new RegExp(q, 'i') } });
    }
console.log(req.originalUrl.includes("scenario"));

    // Query the database for documents created by the logged-in user
   const query = {
  removed: false,
  ...(req.originalUrl.includes("scenario") ? {} : { createdBy: req.userId }), // Add 'createdBy' if the URL doesn't contain 'scenario'
  ...(filter && equal ? { [filter]: equal } : {}),
  ...fields,
};


   const resultsQuery = Model.find(query)
  .skip(skip)
  .limit(limit)
  .sort({ [sortBy]: sortValue });

// Conditionally populate 'createdBy' if the URL contains "scenario"
if (!req.originalUrl.includes("scenario")) {
  resultsQuery.populate('createdBy');
}

// Execute the query
const resultsPromise = resultsQuery.exec();

    // Count total documents
    const countPromise = Model.countDocuments(query);

    // Resolve both promises
    const [result, count] = await Promise.all([resultsPromise, countPromise]);

    // Calculate total pages
    const pages = Math.ceil(count / limit);

    // Build pagination object
    const pagination = { page, pages, count };

    return res.status(200).json({
      success: true,
      result,
      pagination,
      message: count > 0 ? 'Successfully found all documents' : 'No documents found for this user',
    });
  } catch (error) {
    console.error(`Error listing documents in ${Model.modelName}:`, error.message);
    return res.status(500).json({
      success: false,
      message: `Error listing documents in ${Model.modelName}`,
      error: error.message,
    });
  }
};

module.exports = paginatedList;