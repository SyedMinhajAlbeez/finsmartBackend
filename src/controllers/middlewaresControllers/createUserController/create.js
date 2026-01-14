const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { generate: uniqueId } = require('shortid');

const create = async (userModel, req, res) => {
  const User = mongoose.model(userModel);
  const UserPassword = mongoose.model(userModel + 'Password');

  try {
    const {
      email,
      ntn,
      address,
      province,
      name,
      surname,
      photo,
      role,
      enabled,
      scenarioIds,
      Creds,
      password
    } = req.body;

    // Validate required fields
    if (!email || !ntn || !address || !province || !name) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Required fields: email, ntn, address, province, name',
      });
    }

    // Check if user already exists with this email
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
      removed: false,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'User with this email already exists',
      });
    }

    // Validate password
    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Password is required and must be at least 8 characters long',
      });
    }

    // Create Creds documents if provided (for Admin model)
    let credsIds = [];
    if (userModel === 'Admin' && Creds && Array.isArray(Creds)) {
      const CredsModel = mongoose.model('Creds');
      
      for (const credData of Creds) {
        const newCred = new CredsModel({
          sandbox_token: credData.sandbox_token || '',
          production_token: credData.production_token || '',
        });
        const savedCred = await newCred.save();
        credsIds.push(savedCred._id);
      }
    }

    // Create the main User document
    const userData = {
      email: email.toLowerCase(),
      name,
      surname: surname || '',
      photo: photo || '',
      role: role || 'staff',
      enabled: enabled !== undefined ? enabled : true,
    };

    // Add Admin-specific fields
    if (userModel === 'Admin') {
      userData.ntn = ntn;
      userData.address = address;
      userData.province = province;
      userData.scenarioIds = scenarioIds || [];
      userData.Creds = credsIds;
    }

    const newUser = new User(userData);
    const savedUser = await newUser.save();

    // Create password entry
    const salt = uniqueId();
    const passwordHash = bcrypt.hashSync(salt + password);

    const userPasswordData = {
      user: savedUser._id,
      password: passwordHash,
      salt: salt,
      emailVerified: false,
      authType: 'email',
      loggedSessions: [],
      removed: false,
    };

    const newUserPassword = new UserPassword(userPasswordData);
    await newUserPassword.save();

    // Populate the result based on user model
    let populatedUser;
    if (userModel === 'Admin') {
      populatedUser = await User.findById(savedUser._id)
        .populate('scenarioIds', 'name description enabled')
        .populate('Creds', 'sandbox_token production_token')
        .exec();
    } else {
      populatedUser = await User.findById(savedUser._id).exec();
    }

    // Format response based on user model
    let result;
    if (userModel === 'Admin') {
      result = {
        _id: populatedUser._id,
        enabled: populatedUser.enabled,
        email: populatedUser.email,
        name: populatedUser.name,
        surname: populatedUser.surname,
        photo: populatedUser.photo,
        role: populatedUser.role,
        ntn: populatedUser.ntn,
        address: populatedUser.address,
        province: populatedUser.province,
        scenarioIds: populatedUser.scenarioIds,
        Creds: populatedUser.Creds,
        created: populatedUser.created,
      };
    } else {
      result = {
        _id: populatedUser._id,
        enabled: populatedUser.enabled,
        email: populatedUser.email,
        name: populatedUser.name,
        surname: populatedUser.surname,
        photo: populatedUser.photo,
        role: populatedUser.role,
        created: populatedUser.created,
      };
    }

    return res.status(200).json({
      success: true,
      result: result,
      message: `${userModel} created successfully`,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
    });
  }
};

module.exports = create;