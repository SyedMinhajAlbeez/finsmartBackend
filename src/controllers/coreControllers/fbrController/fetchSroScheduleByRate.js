const axios = require('axios');
const mongoose = require('mongoose');
const Creds = mongoose.model('Creds');

const fetchSroScheduleByRate = async (req, res) => {
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

    // Get hs_code and annexure_id from query parameters
    const {rate_id } = req.query;
    const date = new Date();
    
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const currentDate = `${day}-${month}${year}`;


    if (!rate_id) {
      return res.status(400).json({
        success: false,
        message: 'rate_id query parameter is required',
      });
    }
    console.log(rate_id);
    console.log(currentDate);
    
    // Construct FBR API URL with query parameters
    const fbrUrl = new URL('https://gw.fbr.gov.pk/pdi/v1/SroSchedule');
    fbrUrl.searchParams.append('rate_id', rate_id);
    fbrUrl.searchParams.append('date', currentDate);
    fbrUrl.searchParams.append('origination_supplier_csv', 1);
    console.log(fbrUrl.toString());
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
      message: 'FBR SroSchedule API fetched successfully',
    });
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status || 500).json({
        success: false,
        message: `FBR API error: ${error.response.status} - ${error.message}`,
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
        message: `Error in SroSchedule: ${error.message}`,
      });
    }
  }
};

module.exports = fetchSroScheduleByRate;