const path = require('path');

// Add the current directory to the module path
process.chdir(path.join(__dirname, '..'));

// Load environment variables
require('dotenv').config();

console.log('🧪 Testing model imports...');

try {
  // Test individual model imports
  console.log('Testing User model...');
  const User = require('./models/User');
  console.log('✅ User model imported successfully');

  console.log('Testing Crop model...');
  const Crop = require('./models/Crop');
  console.log('✅ Crop model imported successfully');

  console.log('Testing Livestock model...');
  const Livestock = require('./models/Livestock');
  console.log('✅ Livestock model imported successfully');

  // Test models index
  console.log('Testing models index...');
  const models = require('./models');
  console.log('✅ Models index imported successfully');
  console.log('Available models:', Object.keys(models));

  // Test database config
  console.log('Testing database config...');
  const { sequelize } = require('./config/database');
  console.log('✅ Database config imported successfully');

  // Test utilities
  console.log('Testing logger...');
  const logger = require('./utils/logger');
  logger.info('Logger test message');
  console.log('✅ Logger imported successfully');

  console.log('\n🎉 All imports successful!');
  console.log('You can now run: npm run db:setup');

} catch (error) {
  console.error('❌ Import test failed:', error.message);
  console.error('Stack trace:', error.stack);
  console.error('\n🔧 Please check the file paths and dependencies.');
}

process.exit(0);