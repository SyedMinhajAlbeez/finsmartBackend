const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const Setting = require('../src/models/coreModels/Setting'); // Adjust path as needed

// Provided settings data
const settingsData = [
  {
    "_id": "689382487da3270c1e79bc77",
    "removed": false,
    "enabled": true,
    "settingCategory": "money_format_settings",
    "settingKey": "zero_format",
    "settingValue": false,
    "valueType": "boolean",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc85",
    "removed": false,
    "enabled": true,
    "settingCategory": "company_settings",
    "settingKey": "company_logo",
    "settingValue": "public/uploads/setting/company-logo.png",
    "valueType": "image",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc88",
    "removed": false,
    "enabled": true,
    "settingCategory": "company_settings",
    "settingKey": "company_state",
    "settingValue": "Karachi",
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc89",
    "removed": false,
    "enabled": true,
    "settingCategory": "company_settings",
    "settingKey": "company_country",
    "settingValue": "Pakistan",
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc70",
    "removed": false,
    "enabled": true,
    "settingCategory": "money_format_settings",
    "settingKey": "default_currency_code",
    "settingValue": "PKR",
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc73",
    "removed": false,
    "enabled": true,
    "settingCategory": "money_format_settings",
    "settingKey": "currency_position",
    "settingValue": "before",
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc74",
    "removed": false,
    "enabled": true,
    "settingCategory": "money_format_settings",
    "settingKey": "decimal_sep",
    "settingValue": ".",
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc80",
    "removed": false,
    "enabled": true,
    "settingCategory": "finance_settings",
    "settingKey": "invoice_prefix",
    "settingValue": "inv-",
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc97",
    "removed": false,
    "enabled": true,
    "settingCategory": "client_settings",
    "settingKey": "pos_default_client_type",
    "settingValue": "people",
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc9b",
    "removed": false,
    "enabled": true,
    "settingCategory": "app_settings",
    "settingKey": "idurar_app_country",
    "settingValue": null,
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc9d",
    "removed": false,
    "enabled": true,
    "settingCategory": "app_settings",
    "settingKey": "idurar_app_email",
    "settingValue": null,
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc9f",
    "removed": false,
    "enabled": true,
    "settingCategory": "app_settings",
    "settingKey": "idurar_app_has_mutli_branch",
    "settingValue": false,
    "valueType": "boolean",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc6c",
    "removed": false,
    "enabled": true,
    "settingCategory": "quote_settings",
    "settingKey": "quote_show_product_tax",
    "settingValue": false,
    "valueType": "boolean",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc6f",
    "removed": false,
    "enabled": true,
    "settingCategory": "quote_settings",
    "settingKey": "quote_pdf_footer",
    "settingValue": "Quote was created on a computer and is valid without the signature and seal",
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc78",
    "removed": false,
    "enabled": true,
    "settingCategory": "invoice_settings",
    "settingKey": "invoice_show_product_tax",
    "settingValue": false,
    "valueType": "boolean",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc7a",
    "removed": false,
    "enabled": true,
    "settingCategory": "invoice_settings",
    "settingKey": "invoice_pdf_footer",
    "settingValue": "Invoice was created on a computer and is valid without the signature and seal",
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc81",
    "removed": false,
    "enabled": true,
    "settingCategory": "finance_settings",
    "settingKey": "quote_prefix",
    "settingValue": "qot-",
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc83",
    "removed": false,
    "enabled": true,
    "settingCategory": "finance_settings",
    "settingKey": "payment_prefix",
    "settingValue": "pym-",
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc8d",
    "removed": false,
    "enabled": true,
    "settingCategory": "company_settings",
    "settingKey": "company_tax_number",
    "settingValue": "234",
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc8e",
    "removed": false,
    "enabled": true,
    "settingCategory": "company_settings",
    "settingKey": "company_vat_number",
    "settingValue": "2123",
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc92",
    "removed": false,
    "enabled": true,
    "settingCategory": "client_settings",
    "settingKey": "client_status",
    "settingValue": ["active", "new", "premium", "unactive"],
    "valueType": "array",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc94",
    "removed": false,
    "enabled": true,
    "settingCategory": "client_settings",
    "settingKey": "client_category",
    "settingValue": ["Corporate", "startup", "small company", "services business", "retails", "cafe & restaurant"],
    "valueType": "array",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc95",
    "removed": false,
    "enabled": true,
    "settingCategory": "client_settings",
    "settingKey": "invoice_default_client_type",
    "settingValue": "company",
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc96",
    "removed": false,
    "enabled": true,
    "settingCategory": "client_settings",
    "settingKey": "quote_default_client_type",
    "settingValue": "company",
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc84",
    "removed": false,
    "enabled": true,
    "settingCategory": "company_settings",
    "settingKey": "company_name",
    "settingValue": "finsmart",
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc86",
    "removed": false,
    "enabled": true,
    "settingCategory": "company_settings",
    "settingKey": "company_icon",
    "settingValue": "public/uploads/setting/company-logo.png",
    "valueType": "image",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc8f",
    "removed": false,
    "enabled": true,
    "settingCategory": "company_settings",
    "settingKey": "company_reg_number",
    "settingValue": "00001231421",
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc7b",
    "removed": false,
    "enabled": true,
    "settingCategory": "invoice_settings",
    "settingKey": "invoice_status",
    "settingValue": ["draft", "pending", "sent", "received", "refund", "cancelled", "on hold"],
    "valueType": "array",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc7d",
    "removed": false,
    "enabled": true,
    "settingCategory": "finance_settings",
    "settingKey": "last_quote_number",
    "settingValue": 0,
    "valueType": "number",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc7e",
    "removed": false,
    "enabled": true,
    "settingCategory": "finance_settings",
    "settingKey": "last_offer_number",
    "settingValue": 0,
    "valueType": "number",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc82",
    "removed": false,
    "enabled": true,
    "settingCategory": "finance_settings",
    "settingKey": "offer_prefix",
    "settingValue": "ofr-",
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc87",
    "removed": false,
    "enabled": true,
    "settingCategory": "company_settings",
    "settingKey": "company_address",
    "settingValue": "Block E, Gulshan e Iqbal",
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc8c",
    "removed": false,
    "enabled": true,
    "settingCategory": "company_settings",
    "settingKey": "company_website",
    "settingValue": "www.finsmart.aualinks.com",
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc90",
    "removed": false,
    "enabled": true,
    "settingCategory": "company_settings",
    "settingKey": "company_bank_account",
    "settingValue": "iban : 00001231421",
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc99",
    "removed": false,
    "enabled": true,
    "settingCategory": "app_settings",
    "settingKey": "idurar_app_date_format",
    "settingValue": "DD/MM/YYYY",
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc9e",
    "removed": false,
    "enabled": true,
    "settingCategory": "app_settings",
    "settingKey": "idurar_app_company_email",
    "settingValue": null,
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc75",
    "removed": false,
    "enabled": true,
    "settingCategory": "money_format_settings",
    "settingKey": "thousand_sep",
    "settingValue": ",",
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc8a",
    "removed": false,
    "enabled": true,
    "settingCategory": "company_settings",
    "settingKey": "company_email",
    "settingValue": "contact@aualinks.com",
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc9c",
    "removed": false,
    "enabled": true,
    "settingCategory": "app_settings",
    "settingKey": "idurar_app_timezone",
    "settingValue": null,
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bca1",
    "removed": false,
    "enabled": true,
    "settingCategory": "app_settings",
    "settingKey": "idurar_app_early_access",
    "settingValue": "default",
    "valueType": "boolean",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc79",
    "removed": false,
    "enabled": true,
    "settingCategory": "invoice_settings",
    "settingKey": "invoice_load_default_client",
    "settingValue": false,
    "valueType": "boolean",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc71",
    "removed": false,
    "enabled": true,
    "settingCategory": "money_format_settings",
    "settingKey": "currency_name",
    "settingValue": "Pakistani Rupees",
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc7c",
    "removed": false,
    "enabled": true,
    "settingCategory": "finance_settings",
    "settingKey": "last_invoice_number",
    "settingValue": 49,
    "valueType": "number",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc7f",
    "removed": false,
    "enabled": true,
    "settingCategory": "finance_settings",
    "settingKey": "last_payment_number",
    "settingValue": 0,
    "valueType": "number",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc8b",
    "removed": false,
    "enabled": true,
    "settingCategory": "company_settings",
    "settingKey": "company_phone",
    "settingValue": "+92 3313134845",
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc91",
    "removed": false,
    "enabled": true,
    "settingCategory": "client_settings",
    "settingKey": "client_type",
    "settingValue": ["people", "company"],
    "valueType": "array",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc93",
    "removed": false,
    "enabled": true,
    "settingCategory": "client_settings",
    "settingKey": "client_source",
    "settingValue": ["self checking", "sales lead", "recomendation", "facebook", "instagram", "tiktok", "youtube", "blog", "linkedin", "newsletter", "website", "twitter"],
    "valueType": "array",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc98",
    "removed": false,
    "enabled": true,
    "settingCategory": "client_settings",
    "settingKey": "pos_default_client",
    "settingValue": "609e0057246f2359b0c4c31f",
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc9a",
    "removed": false,
    "enabled": true,
    "settingCategory": "app_settings",
    "settingKey": "idurar_app_language",
    "settingValue": "en_us",
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bca0",
    "removed": false,
    "enabled": true,
    "settingCategory": "app_settings",
    "settingKey": "idurar_app_industry",
    "settingValue": "default",
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc6d",
    "removed": false,
    "enabled": true,
    "settingCategory": "quote_settings",
    "settingKey": "quote_load_default_client",
    "settingValue": false,
    "valueType": "boolean",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc6e",
    "removed": false,
    "enabled": true,
    "settingCategory": "quote_settings",
    "settingKey": "quote_status",
    "settingValue": ["draft", "pending", "sent", "negotiation", "accepted", "declined", "cancelled"],
    "valueType": "array",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc72",
    "removed": false,
    "enabled": true,
    "settingCategory": "money_format_settings",
    "settingKey": "currency_symbol",
    "settingValue": "Rs .",
    "valueType": "string",
    "isPrivate": false,
    "isCoreSetting": false
  },
  {
    "_id": "689382487da3270c1e79bc76",
    "removed": false,
    "enabled": true,
    "settingCategory": "money_format_settings",
    "settingKey": "cent_precision",
    "settingValue": 2,
    "valueType": "number",
    "isPrivate": false,
    "isCoreSetting": false
  }
];

async function populateSettings() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Counter for inserted and skipped settings
    let insertedCount = 0;
    let skippedCount = 0;

    // Iterate through settings data
    for (const setting of settingsData) {
      // Check if setting already exists by settingCategory and settingKey
      const existingSetting = await Setting.findOne({
        settingCategory: setting.settingCategory,
        settingKey: setting.settingKey,
      });

      if (existingSetting) {
        console.log(`Setting already exists: ${setting.settingCategory} - ${setting.settingKey}`);
        skippedCount++;
        continue;
      }

      // Prepare setting document
      const settingDoc = {
        _id: setting._id, // Use provided _id
        removed: setting.removed,
        enabled: setting.enabled,
        settingCategory: setting.settingCategory,
        settingKey: setting.settingKey,
        settingValue: setting.settingValue,
        valueType: setting.valueType,
        isPrivate: setting.isPrivate,
        isCoreSetting: setting.isCoreSetting,
      };

      // Create and save the new setting
      const newSetting = new Setting(settingDoc);
      await newSetting.save();
      console.log(`Inserted setting: ${setting.settingCategory} - ${setting.settingKey}`);
      insertedCount++;
    }

    console.log(`Population complete. Inserted: ${insertedCount}, Skipped: ${skippedCount}`);
  } catch (error) {
    console.error('Error populating settings:', error.message);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
}

// Execute the function
populateSettings()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });