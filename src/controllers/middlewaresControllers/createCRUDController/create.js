const mongoose = require('mongoose');

const create = async (Model, req, res) => {
  try {
    // Ensure req.userId is set by restrictToLoggedInUser middleware
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No user ID found. Please log in.',
      });
    }

    // Creating a new document in the collection
    const result = await new Model({
      ...req.body,
      removed: false,
      createdBy: req.userId, // Set createdBy to logged-in user's ID
      user_id: req.userId,   // Set user_id for consistency with invoiceSchema (optional)
    }).save();

    // Returning successful response
    return res.status(201).json({
      success: true,
      result,
      message: `Successfully created the document in ${Model.modelName}`,
    });
  } catch (error) {
    console.error(`Error creating document in ${Model.modelName}:`, error.message);
    return res.status(500).json({
      success: false,
      message: `Error creating document in ${Model.modelName}`,
      error: error.message,
    });
  }
};

module.exports = create;