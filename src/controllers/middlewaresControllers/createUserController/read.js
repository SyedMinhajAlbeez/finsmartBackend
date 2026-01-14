const mongoose = require('mongoose');

const read = async (userModel, req, res) => {
  const User = mongoose.model(userModel);

  // Build query
  let query = User.findOne({
    _id: req.params.id,
    removed: false,
  });

  // Add population for Admin model
  if (userModel === 'Admin') {
    query = query
      .populate('scenarioIds', 'name description enabled')
      .populate('Creds', 'sandbox_token production_token');
  }

  // Find document by id
  const tmpResult = await query.exec();

  // If no results found, return document not found
  if (!tmpResult) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found',
    });
  } else {
    // Format response based on user model
    let result;
    if (userModel === 'Admin') {
      result = {
        _id: tmpResult._id,
        enabled: tmpResult.enabled,
        email: tmpResult.email,
        name: tmpResult.name,
        surname: tmpResult.surname,
        photo: tmpResult.photo,
        role: tmpResult.role,
        ntn: tmpResult.ntn,
        address: tmpResult.address,
        province: tmpResult.province,
        scenarioIds: tmpResult.scenarioIds,
        Creds: tmpResult.Creds,
        created: tmpResult.created,
        updatedAt: tmpResult.updatedAt,
      };
    } else {
      result = {
        _id: tmpResult._id,
        enabled: tmpResult.enabled,
        email: tmpResult.email,
        name: tmpResult.name,
        surname: tmpResult.surname,
        photo: tmpResult.photo,
        role: tmpResult.role,
        created: tmpResult.created,
        updatedAt: tmpResult.updatedAt,
      };
    }

    return res.status(200).json({
      success: true,
      result,
      message: 'We found this document',
    });
  }
};

module.exports = read;