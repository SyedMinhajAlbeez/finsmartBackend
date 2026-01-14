const pug = require('pug');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const puppeteer = require('puppeteer');
const QRCode = require('qrcode'); // Add QR code library
const { loadSettings } = require('@/middlewares/settings');
const useLanguage = require('@/locale/useLanguage');
const { useMoney, useDate } = require('@/settings');

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const pugFiles = ['invoice', 'offer', 'quote', 'payment'];

// QR Code generation function
const generateQRCodeBase64 = async (text) => {
  try {
    if (!text) return null;
    
    const qrCodeBase64 = await QRCode.toDataURL(text, {
      width: 120,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });
    
    console.log('✅ QR Code generated successfully');
    return qrCodeBase64;
  } catch (error) {
    console.error('❌ QR Code generation failed:', error);
    return null;
  }
};

exports.generatePdf = async (
  modelName,
  info = { filename: 'pdf_file', format: 'A5', targetLocation: '' },
  result,
  callback
) => {
  try {
    const { targetLocation } = info;
    console.log(JSON.stringify(result.items, null, 2));

    // 1️⃣ Delete existing file if it exists
    if (fs.existsSync(targetLocation)) fs.unlinkSync(targetLocation);

    // 2️⃣ Check if pug template exists
    if (!pugFiles.includes(modelName.toLowerCase())) {
      throw new Error(`No Pug template found for model: ${modelName}`);
    }

    // 3️⃣ Load system settings
    const settings = await loadSettings();
    const selectedLang = settings['idurar_app_language'] || 'en';
    const translate = useLanguage({ selectedLang });

    const {
      currency_symbol,
      currency_position,
      decimal_sep,
      thousand_sep,
      cent_precision,
      zero_format,
    } = settings;

    const { moneyFormatter } = useMoney({
      settings: {
        currency_symbol,
        currency_position,
        decimal_sep,
        thousand_sep,
        cent_precision,
        zero_format,
      },
    });

    const { dateFormat } = useDate({ settings });

    settings.public_server_file = process.env.PUBLIC_SERVER_FILE;

    // 4️⃣ Generate QR Code from FbrInvoiceNo
    let qrCodeBase64 = null;
    if (result.FbrInvoiceNo) {
      console.log('🔄 Generating QR Code for:', result.FbrInvoiceNo);
      qrCodeBase64 = await generateQRCodeBase64(result.FbrInvoiceNo);
    } else {
      console.log('⚠️ No FbrInvoiceNo found for QR code generation');
    }

    // 5️⃣ Debug - check model data structure
    console.log('🧾 MODEL DATA PASSED TO PUG:', JSON.stringify(result, null, 2));

    // 6️⃣ Resolve pug template path correctly
    const templatePath = path.resolve('src/pdf', `${modelName}.pug`);

    // 7️⃣ Render HTML with data (including QR code)
    const htmlContent = pug.renderFile(templatePath, {
      model: result,
      settings,
      translate,
      dateFormat,
      moneyFormatter,
      moment,
      qrCodeBase64 // Pass QR code to template
    });

    // 8️⃣ Save HTML preview for debugging (optional but helpful)
    const htmlPreviewPath = targetLocation.replace(/\.pdf$/, '.html');
    fs.writeFileSync(htmlPreviewPath, htmlContent);
    console.log('🧩 HTML view saved at:', htmlPreviewPath);

    // 9️⃣ Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);

    // 🔟 Block slow external requests (except data URLs for QR code)
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const type = req.resourceType();
      // Allow data URLs (for QR code) and block other slow resources
      if (req.url().startsWith('data:')) {
        req.continue();
      } else if (['image', 'stylesheet', 'font'].includes(type)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    // 11️⃣ Load HTML into page
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
    await page.emulateMediaType('screen');

    // 12️⃣ Generate PDF
    await page.pdf({
      path: targetLocation,
      format: info.format || 'A4',
      printBackground: true,
      margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
    });

    await browser.close();
    console.log('✅ PDF generated successfully:', targetLocation);

    if (callback) callback();
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    throw error;
  }
};