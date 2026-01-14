const axios = require('axios');
const mongoose = require('mongoose');
const Creds = mongoose.model('Creds');

const postdigitalinvoice = async (req, res) => {
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

    // Extract payload fields from req.body
    const {
      invoiceType,
      invoiceDate,
      sellerBusinessName,
      sellerProvince,
      sellerNTNCNIC,
      sellerAddress,
      buyerNTNCNIC,
      buyerBusinessName,
      buyerProvince,
      buyerAddress,
      invoiceRefNo,
      buyerRegistrationType,
      scenarioId,
      items
    } = req.body;

    // Validate required fields
    const requiredFields = [
      'invoiceType',
      'invoiceDate',
      'sellerBusinessName',
      'sellerProvince',
      'sellerNTNCNIC',
      'sellerAddress',
      'buyerNTNCNIC',
      'buyerBusinessName',
      'buyerProvince',
      'buyerAddress',
      'buyerRegistrationType',
      'scenarioId',
      'items'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Items must be a non-empty array'
      });
    }

    // Validate each item in the items array
    const requiredItemFields = [
      'hsCode',
      'productDescription',
      'rate',
      'uoM',
      'quantity',
      'unitPrice',
      'salesTax',
      'valueSalesExcludingST',
      'fixedNotifiedValueOrRetailPrice',
      'salesTaxApplicable',
      'salesTaxWithheldAtSource',
      'extraTax',
      'furtherTax',
      'sroScheduleNo',
      'fedPayable',
      'discount',
      'totalValues',
      'saleType',
      'sroItemSerialNo'
    ];

    for (const item of items) {
      const missingItemFields = requiredItemFields.filter(field => item[field] === undefined || item[field] === null);
      if (missingItemFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required item fields: ${missingItemFields.join(', ')}`
        });
      }
    }

    const payload = {
      invoiceType,
      invoiceDate,
      sellerBusinessName,
      sellerProvince,
      sellerNTNCNIC,
      sellerAddress,
      buyerNTNCNIC,
      buyerBusinessName,
      buyerProvince,
      buyerAddress,
      invoiceRefNo: invoiceRefNo || '',
      buyerRegistrationType,
      scenarioId,
      items
    };

    console.log(payload);
    // Construct FBR API URL for POST request
    const fbrUrl = 'https://gw.fbr.gov.pk/di_data/v1/di/validateinvoicedata_sb';

    // Make POST request to FBR API
    const response = await axios.post(fbrUrl, payload, {
      headers: {
        'Authorization': `Bearer ${creds.sandbox_token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });


    return res.status(200).json({
      success: true,
      result: response.data,
      message: 'FBR postinvoicedata_sb API called successfully',
    });
  } catch (error) {
    if (error.response) {
      console.log(error.response);
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
        message: `Error in postinvoicedata_sb: ${error.message}`,
      });
    }
  }
};

module.exports = postdigitalinvoice;