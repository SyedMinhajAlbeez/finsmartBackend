const mongoose = require('mongoose');

const updateProfile = async (userModel, req, res) => {
  const User = mongoose.model(userModel);

  const reqUserName = userModel.toLowerCase();
  const userProfile = req[reqUserName];

  if (userProfile.email === 'admin@admin.com') {
    return res.status(403).json({
      success: false,
      result: null,
      message: "you couldn't update demo informations",
    });
  }

  // Handle Creds updates if provided (for Admin model)
  let credsUpdates = [];
  if (userModel === 'Admin' && req.body.Creds && Array.isArray(req.body.Creds)) {
    const CredsModel = mongoose.model('Creds');
    
    for (const credData of req.body.Creds) {
      if (credData._id) {
        // Update existing Creds
        await CredsModel.findOneAndUpdate(
          { _id: credData._id, user_id: userProfile._id },
          {
            $set: {
              sandbox_token: credData.sandbox_token,
              production_token: credData.production_token,
            }
          }
        );
        credsUpdates.push(credData._id);
      } else {
        // Create new Creds
        const newCred = new CredsModel({
          user_id: userProfile._id,
          sandbox_token: credData.sandbox_token || '',
          production_token: credData.production_token || '',
        });
        const savedCred = await newCred.save();
        credsUpdates.push(savedCred._id);
      }
    }
  }

  // Build updates object
  let updates = {
    email: req.body.email,
    name: req.body.name,
    surname: req.body.surname,
  };

  // Add photo if provided
  if (req.body.photo) {
    updates.photo = req.body.photo;
  }

  // Add Admin-specific fields
  if (userModel === 'Admin') {
    updates.ntn = req.body.ntn;
    updates.province = req.body.province;
    updates.address = req.body.address;
    
    // Add scenarioIds if provided
    if (req.body.scenarioIds) {
      updates.scenarioIds = req.body.scenarioIds;
    }
    
    // Add Creds if updates were made
    if (credsUpdates.length > 0) {
      updates.Creds = credsUpdates;
    }
  }

  // Find document by id and updates with the required fields
  let query = User.findOneAndUpdate(
    { _id: userProfile._id, removed: false },
    { $set: updates },
    {
      new: true, // return the new result instead of the old one
    }
  );

  // Add population for Admin model
  if (userModel === 'Admin') {
    query = query
      .populate('scenarioIds', 'name scenarioId saleType description enabled')
      .populate('Creds', 'sandbox_token production_token');
  }

  const result = await query.exec();

  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No profile found by this id: ' + userProfile._id,
    });
  }

  // Format response based on user model
  let responseResult;
  if (userModel === 'Admin') {
    responseResult = {
      _id: result._id,
      enabled: result.enabled,
      email: result.email,
      name: result.name,
      surname: result.surname,
      photo: result.photo,
      role: result.role,
      ntn: result.ntn,
      province: result.province,
      address: result.address,
      scenarioIds: result.scenarioIds,
      Creds: result.Creds,
    };
  } else {
    responseResult = {
      _id: result._id,
      enabled: result.enabled,
      email: result.email,
      name: result.name,
      surname: result.surname,
      photo: result.photo,
      role: result.role,
    };
  }

  return res.status(200).json({
    success: true,
    result: responseResult,
    message: 'we update this profile by this id: ' + userProfile._id,
  });
};

module.exports = updateProfile;