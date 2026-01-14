const mongoose = require('mongoose');

const list = async (userModel, req, res) => {
  const User = mongoose.model(userModel);
  
  const page = req.query.page || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = (page - 1) * limit;

  try {
    // Build query for non-removed users
    let query = { removed: false };

    // Add search functionality if search parameter is provided
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { name: searchRegex },
        { surname: searchRegex },
        { email: searchRegex },
        { role: searchRegex },
        { address: searchRegex },
        { province: searchRegex }
      ];
    }

    // Add filter by enabled status if provided
    if (req.query.enabled !== undefined) {
      query.enabled = req.query.enabled === 'true';
    }

    // Add filter by role if provided
    if (req.query.role) {
      query.role = req.query.role;
    }

    // Count total documents that match the query
    const countPromise = User.countDocuments(query);

    // Build the query for items
    let itemsQuery = User.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ created: -1 });

    // Populate related fields if they exist in the schema
    const userSchema = User.schema;
    
    if (userSchema.path('scenarioIds')) {
      itemsQuery = itemsQuery.populate('scenarioIds', 'name scenarioId saleType description enabled');
    }
    
    if (userSchema.path('Creds')) {
      itemsQuery = itemsQuery.populate('Creds', 'sandbox_token production_token');
    }

    // Execute the query
    const itemsPromise = itemsQuery.exec();

    // Wait for both promises to resolve
    const [count, items] = await Promise.all([countPromise, itemsPromise]);

    // Calculate total pages
    const pages = Math.ceil(count / limit);

    // Format the results
    const result =  items.map(item => {
        const baseResult = {
          _id: item._id,
          enabled: item.enabled,
          email: item.email,
          name: item.name,
          surname: item.surname,
          photo: item.photo,
          role: item.role,
          created: item.created,
          updatedAt: item.updatedAt
        };

        // Add additional fields for Admin model
        if (userModel === 'Admin') {
          baseResult.ntn = item.ntn;
          baseResult.address = item.address;
          baseResult.province = item.province;
          baseResult.scenarioIds = item.scenarioIds || [];
          baseResult.Creds = item.Creds || [];
        }

        return baseResult;
      });

     const pagination = {

        total: count,
        limit: limit,
        page: page,
      pages: pages,
      hasNextPage: page < pages,
      hasPrevPage: page > 1,
    }
    
      
    return res.status(200).json({
      success: true,
      result,
      pagination,
      message: 'Successfully retrieved all Admin Users',
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
    });
  }
};

module.exports = list;