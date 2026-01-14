require('module-alias/register');
const mongoose = require('mongoose');
const { globSync } = require('glob');
const path = require('path');

// -------------------- NODE VERSION CHECK --------------------
const [major] = process.versions.node.split('.').map(parseFloat);
if (major < 20) {
  console.log('Please upgrade your node.js version at least 20 or greater. 👌');
  process.exit();
}

// -------------------- ENV VARIABLES --------------------
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

// -------------------- MONGODB CONNECTION --------------------
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('error', (error) => {
  console.log(`🔥 Common Error → Check your .env file and add your MongoDB URL`);
  console.error(`🚫 Error → ${error.message}`);
});

mongoose.connection.once('open', () => {
  console.log('✅ MongoDB connected successfully!');
});

// -------------------- LOAD MODELS --------------------
const modelsFiles = globSync('./src/models/**/*.js');
for (const filePath of modelsFiles) {
  require(path.resolve(filePath));
}

// -------------------- START EXPRESS APP --------------------
const app = require('./app');
const PORT = process.env.PORT || 8888;

const server = app.listen(PORT, () => {
  console.log(`🚀 Express running → On PORT : ${server.address().port}`);
});
