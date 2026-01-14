const mongoose = require('mongoose');

const listAll = async (Model, req, res) => {
  try {
    // Ensure req.userId is set by restrictToLoggedInUser middleware
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No user ID found. Please log in.',
      });
    }

    const sort = req.query.sort || 'desc';
    const enabled = req.query.enabled || undefined;

    // Query the database for documents created by the logged-in user
    const query = {
      removed: false,
      createdBy: req.userId, // Filter by logged-in user's ID
    };

    if (enabled !== undefined) {
      query.enabled = enabled === 'true'; // Convert string to boolean
    }
  
    console.log(query);
    const result = await Model.find(query)
      .sort({ created: sort })
      .populate('createdBy') // Populate createdBy for user details
      .exec();

    return res.status(200).json({
      success: true,
      result,
      message: result.length > 0 ? 'Successfully found all documents' : 'No documents found for this user',
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

module.exports = listAll;