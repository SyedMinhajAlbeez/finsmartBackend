const Joi = require('joi');

const schema = Joi.object({
  invoiceType: Joi.string().valid('Sale Invoice', 'Debit Note').required(),
  invoiceDate: Joi.date().required(),
  invoiceRefNo: Joi.string().allow('').optional(),
  scenarioId: Joi.string().allow('').optional(),
  saleType: Joi.number().allow('').optional(),
  FbrInvoiceNo: Joi.string().allow('').optional(),
  fbrsubmit: Joi.bool().optional(),
  sellerBusinessName: Joi.string().required(),
  sellerProvince: Joi.string().required(),
  sellerNTNCNIC: Joi.string().required(),
  sellerAddress: Joi.string().required(),
  buyerBusinessName: Joi.string().required(),
  buyerProvince: Joi.string().required(),
  total: Joi.number().required(),
  buyerNTNCNIC: Joi.string().allow('').optional(),
  buyerAddress: Joi.string().required(),
  buyerRegistrationType: Joi.string()
    .valid('Registered', 'Unregistered', 'Unregistered Distirbutor', 'Retail Consumer')
    .required(),
  items: Joi.array()
    .items(
      Joi.object({
        hsCode: Joi.string().required(),
        item: Joi.string().required(),
        saleType: Joi.string().required(),
        rate: Joi.string().required(),
        uoM: Joi.string().required(),
        quantity: Joi.number().min(0).required(),
        unitPrice: Joi.number().min(0).required(),
        salesTax: Joi.number().min(0).required(),
        valueSalesExcludingST: Joi.number().min(0).required(),
        valueSalesIncludingST: Joi.number().min(0).required(),
        fixedNotifiedValueOrRetailPrice: Joi.number().min(0).allow(0).optional(),
        salesTaxApplicable: Joi.number().min(0).required(),
        salesTaxWithheldAtSource: Joi.number().min(0).allow(0).optional(),
        extraTax: Joi.number().min(0).allow(0).optional(),
        furtherTax: Joi.number().min(0).allow(0).optional(),
        sroScheduleNo: Joi.string().allow('').optional(),
        sroItemSerialNo: Joi.string().allow('').optional(),
        fedPayable: Joi.number().min(0).allow(0).optional(),
        discount: Joi.number().min(0).allow(0).optional(),
        totalValues: Joi.number().min(0).allow(0).optional(),
      }).required()
    )
    .min(1)
    .required(),
  notes: Joi.string().allow('').optional(),

});

module.exports = schema;