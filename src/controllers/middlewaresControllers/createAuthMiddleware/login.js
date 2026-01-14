const Joi = require('joi');
const mongoose = require('mongoose');
const authUser = require('./authUser');

const login = async (req, res, { userModel }) => {
  const UserPasswordModel = mongoose.model(userModel + 'Password');
  const UserModel = mongoose.model(userModel);
  const { email, password, remember } = req.body;

  // Validate input
  const objectSchema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: true } })
      .required(),
    password: Joi.string().required(),
    remember: Joi.boolean().optional(),
  });

  const { error, value } = objectSchema.validate({ email, password, remember });
  if (error) {
    return res.status(400).json({
      success: false,
      result: null,
      error: error,
      message: 'Invalid/Missing credentials.',
      errorMessage: error.message,
    });
  }

  // Find the Admin by email
  const user = await UserModel.findOne({ email: email, removed: false })
    .select('name surname role email photo enabled scenarioIds ntn address province Creds') // Include ntn, address, province
    .populate('scenarioIds Creds'); // Populate array of scenarios
  if (!user) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No account with this email has been registered.',
    });
  }

  // Debug: Log the user object
  console.log('Login route user:', {
    _id: user._id,
    email: user.email,
    ntn: user.ntn,
    address: user.address,
    province: user.province,
    enabled: user.enabled,
    availableFields: Object.keys(user._doc || user),
  });

  // Check if account is enabled
  if (!user.enabled) {
    return res.status(409).json({
      success: false,
      result: null,
      message: 'Your account is disabled, contact your account administrator',
    });
  }

  // Find the password record
  const databasePassword = await UserPasswordModel.findOne({ user: user._id, removed: false });
  if (!databasePassword) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Password record not found for this user.',
    });
  }

  // Debug: Log databasePassword
  console.log('DatabasePassword:', {
    userId: databasePassword.user,
    salt: databasePassword.salt,
    password: databasePassword.password ? '[REDACTED]' : 'undefined',
  });

  // Call authUser
  await authUser(req, res, {
    user,
    databasePassword,
    password,
    UserPasswordModel,
  });
};

module.exports = login;