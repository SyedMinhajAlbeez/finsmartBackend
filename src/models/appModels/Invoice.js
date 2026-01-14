const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin', required: true },

  FbrInvoiceNo: {
    type: String,
    required: false,
  },
  
  // number: {
  //   type: Number,
  //   required: true,
  // },
  // year: {
  //   type: Number,
  //   required: true,
  // },
  content: String,
  recurring: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'annually', 'quarter'],
  },
  invoiceDate: {
    type: Date,
    required: true,
  },
  // expiredDate: {
  //   type: Date,
  //   required: true,
  // },
  buyerBusinessName: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    required: true,
    autopopulate: true,
  },
  converted: {
    from: {
      type: String,
      enum: ['quote', 'offer'],
    },
    offer: {
      type: mongoose.Schema.ObjectId,
      ref: 'Offer',
    },
    quote: {
      type: mongoose.Schema.ObjectId,
      ref: 'Quote',
    },
  },
  items: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        autopopulate: true,
      },

      
      uoM: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
        required: true,
      },
      unitPrice: {
        type: Number,
        required: true,
      },
      salesTax: {
        type: Number,
        required: true,
      },
      
      tax: {
        type: Number,
        default: 0,
        required: true,
      },
      hsCode: {
        type: String,
      },
      rate: {
        type: String,
      },
      valueSalesExcludingST: {
        type: Number,
      },
      valueSalesIncludingST: {
        type: Number,
      },
      fixedNotifiedValueOrRetailPrice: {
        type: Number,
      },
      salesTaxApplicable: {
        type: Number,
        default: 0,
      },
      salesTaxWithheldAtSource: {
        type: Number,
        default: 0,
      },
      extraTax: {
        type: Number,
        default: 0,
      },
      furtherTax: {
        type: Number,
        default: 0,
      },
      sroScheduleNo: {
        type: String,
      },
      fedPayable: {
        type: Number,
        default: 0,
      },
      discount: {
        type: Number,
        default: 0,
      },
      totalValues: {
        type: Number,
      },
      saleType: {
        type: String,
      },
      sroItemSerialNo: {
        type: String,
      },
    },
  ],
  taxRate: {
    type: Number,
    default: 0,
  },
  fbrsubmit: {
    type: Boolean,
    default: false,
  },
  subTotal: {
    type: Number,
    default: 0,
  },
  taxTotal: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: 'NA',
    uppercase: true,
    required: true,
  },
  credit: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  payment: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Payment',
    },
  ],
  paymentStatus: {
    type: String,
    default: 'unpaid',
    enum: ['unpaid', 'paid', 'partially'],
  },
  isOverdue: {
    type: Boolean,
    default: false,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'sent', 'refunded', 'cancelled', 'on hold'],
    default: 'draft',
  },
  pdf: {
    type: String,
  },

  invoiceType: {
    type: String,
  },
  sellerBusinessName: {
    type: String,
  },

  sellerProvince: {
    type: String,
  },
  sellerNTNCNIC: {
    type: String,
  },
  sellerAddress: {
    type: String,
  },
  buyerNTNCNIC: {
    type: String,
  },
  buyerProvince: {
    type: String,
  },
  buyerAddress: {
    type: String,
  },
  invoiceRefNo: {
    type: String,
  },
  buyerRegistrationType: {
    type: String,
  },
  scenarioId: {
    type: String,
  },

  updated: {
    type: Date,
    default: Date.now,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

invoiceSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Invoice', invoiceSchema);