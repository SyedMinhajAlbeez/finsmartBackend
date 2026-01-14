const axios = require('axios');
const mongoose = require('mongoose');
const Creds = mongoose.model('Creds');

const fetchhscode = async (req, res) => {
  try {
    const userId = req.admin._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No user authenticated',
      });
    }
    // const allCreds = await Creds.find({ removed: false }).lean(); // Use lean() for performance

    const creds = await Creds.findOne({ user_id: userId, removed: false });
    console.log(creds);
    if (!creds || !creds.sandbox_token) {
      return res.status(400).json({
        success: false,
        message: 'No valid production token found for this user',
      });
    }

    const response = await axios.get('https://gw.fbr.gov.pk/pdi/v1/itemdesccode', {

      headers: {
        'Authorization': `Bearer ${creds.sandbox_token}`,
        'Accept': 'application/json',
      },
    });

    return res.status(200).json({
      success: true,
      result: response.data, 
      message: 'FBR API fetched successfully',
    });
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status || 500).json({
        success: false,
        message: `FBR API error: ${error.response.status} - ${error.response.statusText}`,
      });
    } else if (error.request) {
      return res.status(504).json({
        success: false,
        message:`FBR API request failed: No response received ${error.message}`,
      });
    } else if (error.name === 'MongoError') {
      return res.status(500).json({
        success: false,
        message: `Database error: ${error.message}`,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: `Error in fetchapis: ${error.message}`,
      });
    }
  }
};



module.exports = fetchhscode;