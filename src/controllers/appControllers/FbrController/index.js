const mongoose = require('mongoose');
const Model = mongoose.model('Creds');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Creds');
const axios = require('axios');
delete methods['delete'];
require('dotenv').config({ path: '.env' });

methods.create = async (req, res) => {
  const { isDefault } = req.body;

  if (isDefault) {
    await Model.updateMany({}, { isDefault: false });
  }

  const countDefault = await Model.countDocuments({
    isDefault: true,
  });

  const result = await new Model({
    ...req.body,

    isDefault: countDefault < 1 ? true : false,
  }).save();

  return res.status(200).json({
    success: true,
    result: result,
    message: 'Creds created successfully',
  });
};

methods.delete = async (req, res) => {
  return res.status(403).json({
    success: false,
    result: null,
    message: "you can't delete tax after it has been created",
  });
};

methods.update = async (req, res) => {
  const { id } = req.params;
  const tax = await Model.findOne({
    _id: req.params.id,
    removed: false,
  }).exec();
  const { isDefault = tax.isDefault, enabled = tax.enabled } = req.body;

  // if isDefault:false , we update first - isDefault:true
  // if enabled:false and isDefault:true , we update first - isDefault:true
  if (!isDefault || (!enabled && isDefault)) {
    await Model.findOneAndUpdate({ _id: { $ne: id }, enabled: true }, { isDefault: true });
  }

  // if isDefault:true and enabled:true, we update other taxes and make is isDefault:false
  if (isDefault && enabled) {
    await Model.updateMany({ _id: { $ne: id } }, { isDefault: false });
  }

  const taxesCount = await Model.countDocuments({});

  // if enabled:false and it's only one exist, we can't disable
  if ((!enabled || !isDefault) && taxesCount <= 1) {
    return res.status(422).json({
      success: false,
      result: null,
      message: 'You cannot disable the tax because it is the only existing one',
    });
  }

  const result = await Model.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  return res.status(200).json({
    success: true,
    message: 'Tax updated successfully',
    result,
  });
};


methods.fetchItemDescCode = async (req, res) => {
  try {
    const user_id = req.user?._id;
    const { env = 'sandbox' } = req.query;

    if (!user_id) {
      return res.status(401).json({
        success: false,
        result: null,
        message: 'Authentication required: No user_id found in token',
      });
    }

    const userFBR = await UserFBR.findOne({ user_id, removed: false });
    if (!userFBR) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No FBR tokens found for the user',
      });
    }

    let token, baseURL;
    if (env === 'production' && userFBR.production_token) {
      token = userFBR.production_token;
      baseURL = process.env.FBR_BASEURL_PRODUCTION || 'https://gw.fbr.gov.pk/pdi/v1/';
    } else {
      token = userFBR.sandbox_token;
      baseURL = process.env.FBR_BASEURL_SANDBOX || 'https://gw.fbr.gov.pk/pdi/v1/';
      if (!token) {
        return res.status(401).json({
          success: false,
          result: null,
          message: 'Sandbox token not found for the user',
        });
      }
    }

    const endpoint = 'itemdesccode';
    const url = `${baseURL}${endpoint}`;

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return res.status(200).json({
      success: true,
      result: response.data,
      message: 'FBR Item Description Code fetched successfully',
      env: env,
    });
  } catch (error) {
    console.error('FBR API Error:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      success: false,
      result: null,
      message: 'Failed to fetch from FBR API',
      error: error.response?.data || error.message,
    });
  }
};





module.exports = methods;
