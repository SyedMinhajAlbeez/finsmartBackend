const mongoose = require('mongoose');
const Invoice = mongoose.model('Invoice');

const lastinvoice = async (req, res) => {
  try {
    // Check user authentication
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No user ID found. Please log in.',
      });
    }

    // Count invoices created by the logged-in user
    const invoiceCount = await Invoice.countDocuments({ createdBy: req.userId });

    // Generate next invoice number (count + 1)
    const nextNumber = (invoiceCount + 1).toString().padStart(5, '0');

    return res.status(200).json({
      success: true,
      nextInvoiceNumber: nextNumber,
    });
  } catch (error) {
    console.error('Error fetching last invoice number:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while getting invoice number.',
      error: error.message,
    });
  }
};

module.exports = { lastinvoice };
