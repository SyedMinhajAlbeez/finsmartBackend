const read = require('./read');
const updateProfile = require('./updateProfile');
const list = require('./list');
const create = require('./create');
const updatePassword = require('./updatePassword');
const updateProfilePassword = require('./updateProfilePassword');

const createUserController = (userModel) => {
  let userController = {};
  userController.create = (req, res) => create(userModel, req, res);
  userController.updateProfile = (req, res) => updateProfile(userModel, req, res);
  userController.updatePassword = (req, res) => updatePassword(userModel, req, res);
  userController.updateProfilePassword = (req, res) => updateProfilePassword(userModel, req, res);

  userController.read = (req, res) => read(userModel, req, res);
  userController.list = (req, res) => list(userModel, req, res); // Add this line

  return userController;
};

module.exports = createUserController;
