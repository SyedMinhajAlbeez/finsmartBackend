const userFBR = require('./user_FBR');
const fetchapis = require('./fetchhscode');
const fetchHsCodeByUom = require('./fetchHsCodeByUom');
const fetchsaletype = require('./fetchsaletype');
const fetchsaleTypeByRate = require('./fetchsaleTypeByRate');
const fetchSroScheduleByRate = require('./fetchSroScheduleByRate');
const fetchsroitem = require('./fetchsroitem');
const fetchprovinces = require('./fetchprovinces');
const fetchregtype = require('./fetchregtype');
const postdigitalinvoice = require('./postdigitalinvoice');
const lastinvoice = require('./lastinvoice');
const validatefbrdata = require('./validatefbrdata');

const fbrMethods = {
  read: userFBR.read,
  update: userFBR.update,
  fetchapis,
  fetchHsCodeByUom,
  fetchsaletype,
  fetchsaleTypeByRate,
  fetchSroScheduleByRate,
  fetchsroitem,
  fetchprovinces,
  fetchregtype,
  postdigitalinvoice,
  lastinvoice,
  validatefbrdata
};

module.exports = fbrMethods;