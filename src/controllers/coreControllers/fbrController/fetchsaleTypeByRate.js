const axios = require('axios');
const mongoose = require('mongoose');
const axiosRetry = require('axios-retry').default;
const Creds = mongoose.model('Creds');

// Validate axios and Creds
if (!axios || typeof axios.get !== 'function') {
  console.error('Axios is not properly initialized');
  throw new Error('Axios is not properly initialized');
}
if (!Creds || typeof Creds.findOne !== 'function') {
  console.error('Creds model is not properly defined');
  throw new Error('Creds model is not properly defined');
}

// Configure axios-retry
axiosRetry(axios, {
  retries: 3,
  retryDelay: retryCount => retryCount * 1000,
  retryCondition: error => error.code === 'ECONNABORTED' || (error.response && error.response.status >= 500),
  shouldResetTimeout: true,
});

const fetchsaleTypeByRate = async (req, res) => {
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

    console.log('MongoDB connection state:', mongoose.connection.readyState); // Debug MongoDB
    const creds = await Creds.findOne({ user_id: userId, removed: false });
    if (!creds || !creds.sandbox_token) {
      return res.status(400).json({
        success: false,
        message: 'No valid sandbox token found for this user',
      });
    }
    console.log('Creds document:', JSON.stringify(creds, null, 2)); // Debug Creds
    console.log('Using sandbox token:', creds.sandbox_token); // Debug (remove in production)

    // Get saletype from query parameters
    const { saletype } = req.query;
    const date = new Date(); // October 2, 2025, 5:23 PM PKT
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const currentDate = `${day}-${month}${year}`; // 02-Oct2025
    // const currentDate = `${year}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${day}`; // Alternative: 2025-10-02

    if (!saletype) {
      return res.status(400).json({
        success: false,
        message: 'saletype query parameter is required', // Fixed typo: hs_code -> saletype
      });
    }

    const fbrUrl = new URL('https://gw.fbr.gov.pk/pdi/v2/SaleTypeToRate');
    fbrUrl.searchParams.append('date', currentDate);
    fbrUrl.searchParams.append('transTypeId', saletype);
    fbrUrl.searchParams.append('originationSupplier', 1);
    console.log('FBR API URL:', fbrUrl.toString());

    const start = Date.now(); // Log request time
    const response = await axios.get(fbrUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${creds.sandbox_token}`,
        'Accept': 'application/json',
      },
      timeout: 30000, // 30 seconds timeout
    });

    console.log(`Request took ${Date.now() - start}ms`);
    return res.status(200).json({
      success: true,
      result: response.data,
      message: 'FBR SaleTypeToRate API fetched successfully',
    });
  } catch (error) {
    console.error('Error in fetchsaleTypeByRate:', error.message, error.stack);
    console.log(`Request failed after ${Date.now() - start || 0}ms`);
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        success: false,
        message: 'FBR API request timed out. Please try again later.',
      });
    } else if (error.response) {
      return res.status(error.response.status || 500).json({
        success: false,
        message: `FBR API error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`,
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
        message: `Error in fetchsaleTypeByRate: ${error.message}`,
      });
    }
  }
};

module.exports = fetchsaleTypeByRate;