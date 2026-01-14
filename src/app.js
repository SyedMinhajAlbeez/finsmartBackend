const express = require('express');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const coreAuthRouter = require('./routes/coreRoutes/coreAuth');
const coreApiRouter = require('./routes/coreRoutes/coreApi');
const erpApiRouter = require('./routes/appRoutes/appApi');
const coreDownloadRouter = require('./routes/coreRoutes/coreDownloadRouter');
const corePublicRouter = require('./routes/coreRoutes/corePublicRouter');
const adminAuth = require('./controllers/coreControllers/adminAuth');

const errorHandlers = require('./handlers/errorHandlers');
const fileUpload = require('express-fileupload');

const app = express();

// -------------------- MIDDLEWARE --------------------
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
// app.use(fileUpload()); // optional, enable if needed

// -------------------- DEFAULT ROOT --------------------
app.get('/backends/api', (req, res) => {
  res.json({ success: true, message: 'API is live!' });
});

// -------------------- API ROUTES --------------------
app.use('/backends/api', coreAuthRouter); // public auth routes
app.use('/backends/api', adminAuth.isValidAuthToken, coreApiRouter); // protected core API routes
app.use('/backends/api', adminAuth.isValidAuthToken, erpApiRouter); // protected ERP routes

app.use('/download', coreDownloadRouter); // download routes
app.use('/public', corePublicRouter); // public routes

// -------------------- ERROR HANDLING --------------------
// 404 handler
app.use(errorHandlers.notFound);

// Production error handler
app.use(errorHandlers.productionErrors);

// -------------------- EXPORT --------------------
module.exports = app;
