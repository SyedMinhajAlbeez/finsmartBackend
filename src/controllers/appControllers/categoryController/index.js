const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const summary = require('./summary');

function modelController() {
  const Model = mongoose.model('Category');
  const methods = createCRUDController('Category');

  methods.summary = (req, res) => summary(Model, req, res);
  return methods;
}

module.exports = modelController();