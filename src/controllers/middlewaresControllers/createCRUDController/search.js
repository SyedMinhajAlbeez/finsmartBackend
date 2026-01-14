const mongoose = require('mongoose');

const search = async (Model, req, res) => {
  try {
    // Ensure req.userId is set by restrictToLoggedInUser middleware
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        result: null,
        message: 'Unauthorized: No user ID found. Please log in.',
      });
    }

    // Validate query parameter
    if (!req.query.q || req.query.q.trim() === '') {
      return res.status(200).json({
        success: false,
        result: [],
        message: 'No document found: Search query is empty',
      });
    }

    // Parse and validate fields
    const fieldsArray = req.query.fields ? req.query.fields.split(',') : ['name'];
    const validFields = Object.keys(Model.schema.paths).filter(
      (field) => !['_id', '__v', 'createdBy', 'removed', 'created', 'updated'].includes(field)
    );
    const validNestedFields = ['createdBy.name', 'createdBy.email'];
    const invalidFields = fieldsArray.filter(
      (field) => !validFields.includes(field) && !validNestedFields.includes(field)
    );
    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        result: null,
        message: `Invalid search fields: ${invalidFields.join(', ')}`,
      });
    }

    // Construct search query
    const fields = {
      $or: fieldsArray.map((field) => {
        if (field.startsWith('createdBy.')) {
          return { [field]: { $regex: new RegExp(req.query.q, 'i') } };
        }
        return { [field]: { $regex: new RegExp(req.query.q, 'i') } };
      }),
    };

    // Parse limit
    const limit = parseInt(req.query.limit) || 20;
    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Limit must be between 1 and 100',
      });
    }

    // Execute query
    const results = await Model.find({
      removed: false,
      $or: [
        { createdBy: new mongoose.Types.ObjectId(req.userId) }, // Unpopulated createdBy
        { 'createdBy._id': new mongoose.Types.ObjectId(req.userId) }, // Populated createdBy
      ],
      ...fields,
    })
      .populate('createdBy', 'name email') // Populate for consistent output
      .limit(limit)
      .exec();

    return res.status(200).json({
      success: results.length > 0,
      result: results,
      message: results.length > 0 ? 'Successfully found documents' : 'No documents found for this search',
    });
  } catch (error) {
    console.error('Error searching documents:', error.message);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error searching documents',
      error: error.message,
    });
  }
};

module.exports = search;