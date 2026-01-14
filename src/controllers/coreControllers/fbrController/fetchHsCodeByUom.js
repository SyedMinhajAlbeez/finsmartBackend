const axios = require('axios');
const mongoose = require('mongoose');
const Creds = mongoose.model('Creds');

const fetchHsCodeByUom = async (req, res) => {
  try {
    // Get authenticated user ID from req.admin
    const userId = req.admin?._id;
    console.log('Authenticated user ID:', userId);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No user authenticated',
      });
    }

    // Fetch sandbox_token for the authenticated user
    const creds = await Creds.findOne({ user_id: userId, removed: false });
    if (!creds || !creds.sandbox_token) {
      return res.status(400).json({
        success: false,
        message: 'No valid sandbox token found for this user',
      });
    }

    // Get hs_code and annexure_id from query parameters
    const { hs_code, annexure_id = '3' } = req.query;
    if (!hs_code) {
      return res.status(400).json({
        success: false,
        message: 'hs_code query parameter is required',
      });
    }

    // Construct FBR API URL with query parameters
    const fbrUrl = new URL('https://gw.fbr.gov.pk/pdi/v2/HS_UOM');
    fbrUrl.searchParams.append('hs_code', hs_code);
    fbrUrl.searchParams.append('annexure_id', 3);

    // Fetch data from FBR HS_UOM API
    const response = await axios.get(fbrUrl.toString(), {
      timeout: 20000,
      headers: {
        'Authorization': `Bearer ${creds.sandbox_token}`,
        'User-Agent': 'Mozilla/5.0 (compatible; FBR-API-Client/1.0)',
        'Accept': 'application/json',
      },
    });

    return res.status(200).json({
      success: true,
      result: response.data,
      message: 'FBR HS_UOM API fetched successfully',
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
        message: 'FBR API request failed: No response received',
      });
    } else if (error.name === 'MongoError') {
      return res.status(500).json({
        success: false,
        message: `Database error: ${error.message}`,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: `Error in fetchHsCodeByUom: ${error.message}`,
      });
    }
  }
};

module.exports = fetchHsCodeByUom;