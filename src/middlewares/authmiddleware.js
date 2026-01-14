const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const restrictToLoggedInUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    console.log(token);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please log in.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please log in again.',
      });
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error('Error in auth middleware:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Invalid or expired token.',
    });
  }
};

module.exports = { restrictToLoggedInUser };