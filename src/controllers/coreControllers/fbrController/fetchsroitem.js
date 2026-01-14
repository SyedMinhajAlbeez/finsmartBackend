const axios = require('axios');
const mongoose = require('mongoose');
const Creds = mongoose.model('Creds');

const fetchsroitem = async (req, res) => {
  try {
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

    const { sro_id } = req.query;
    const date = new Date();

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add 1 because getMonth() is 0-based
    const day = date.getDate().toString().padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;
   console.log(currentDate);
    if (!sro_id) {
      return res.status(400).json({
        success: false,
        message: 'sro_id query parameter is required',
      });
    }

    const fbrUrl = new URL('https://gw.fbr.gov.pk/pdi/v2/SROItem');
    fbrUrl.searchParams.append('date', currentDate);
    fbrUrl.searchParams.append('sro_id', sro_id);
   

    // Fetch data from FBR HS_UOM API
    const response = await axios.get(fbrUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${creds.sandbox_token}`,
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

module.exports = fetchsroitem;