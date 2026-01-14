const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authUser = async (req, res, { user, databasePassword, password, UserPasswordModel }) => {
  try {
    // Debug: Log the user object
    console.log('authUser user:', {
      _id: user._id,
      modelName: user.constructor.modelName,
      ntn: user.ntn,
      address: user.address,
      province: user.province,
      email: user.email,
      availableFields: Object.keys(user._doc || user),
    });

    // Debug: Log databasePassword
    console.log('DatabasePassword:', {
      userId: databasePassword?.user,
      salt: databasePassword?.salt,
      password: databasePassword?.password ? '[REDACTED]' : 'undefined',
    });

    // Verify password data
    if (!databasePassword || !databasePassword.salt || !databasePassword.password) {
      console.error('Invalid databasePassword object');
      return res.status(500).json({
        success: false,
        result: null,
        message: 'Password data not found.',
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(databasePassword.salt + password, databasePassword.password);
    // const isMatch = await bcrypt.compare(password, databasePassword.password);

    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(403).json({
        success: false,
        result: null,
        message: 'Invalid credentials.',
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: req.body.remember ? '365d' : '24h' }
    );

    // Update logged sessions
    const sessionUpdate = await UserPasswordModel.findOneAndUpdate(
      { user: user._id },
      { $push: { loggedSessions: token } },
      { new: true }
    ).exec();

    if (!sessionUpdate) {
      console.error('Failed to update loggedSessions');
      return res.status(500).json({
        success: false,
        result: null,
        message: 'Failed to update session data.',
      });
    }

    // Return response
    res.status(200).json({
      success: true,
      result: {
        _id: user._id,
        name: user.name,
        surname: user.surname,
        role: user.role,
        email: user.email,
        ntn: user.ntn || 'not set',
        address: user.address || 'not set',
        province: user.province || 'not set',
        photo: user.photo,
        scenarioIds: user.scenarioIds,
        Creds: user.Creds,
        token: token,
        maxAge: req.body.remember ? 365 : null,
      },
      message: 'Successfully logged in user',
    });
  } catch (error) {
    console.error('Error in authUser:', error.message);
    res.status(500).json({
      success: false,
      result: null,
      message: 'Server error during authentication.',
    });
  }
};

module.exports = authUser;
