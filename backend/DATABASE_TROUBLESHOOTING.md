# Database Setup Troubleshooting Guide

## Issues Fixed in setupDatabase.js

### 1. Syntax Errors Fixed ✅
- **Problem**: Unterminated string literals in console.log statements with multi-line strings
- **Solution**: Changed from:
  ```javascript
  console.log('
  🎉 Database setup completed successfully!');
  ```
  To:
  ```javascript
  console.log('\n🎉 Database setup completed successfully!');
  ```

### 2. Circular Dependency Issues Fixed ✅
- **Problem**: Models were importing each other causing circular dependencies
- **Solution**: 
  - Moved all model associations to `models/index.js`
  - Updated imports to use the centralized models file
  - Removed direct associations from individual model files

### 3. Error Handling Improved ✅
- **Problem**: Poor error handling and logging
- **Solution**: 
  - Added proper error scoping
  - Improved error messages
  - Added graceful database connection closing
  - Added environment variable loading

## How to Test and Debug

### Step 1: Test Imports
```bash
npm run test:imports
```
This will verify all models and dependencies can be imported correctly.

### Step 2: Check Database Connection
Make sure your `.env` file has correct database settings:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=agribuddy_uganda
DB_USER=your_db_user
DB_PASSWORD=your_db_password
```

### Step 3: Run Database Setup
```bash
npm run db:setup
```

### Step 4: If Setup Fails, Check These Common Issues:

#### MySQL Connection Issues:
- ✅ MySQL server is running
- ✅ Database exists (`agribuddy_uganda`)
- ✅ User has proper privileges
- ✅ Correct host, port, username, password

#### Permission Issues:
```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS agribuddy_uganda;

-- Create user and grant privileges
CREATE USER IF NOT EXISTS 'agribuddy_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON agribuddy_uganda.* TO 'agribuddy_user'@'localhost';
FLUSH PRIVILEGES;
```

#### Environment Variables:
Make sure you have a `.env` file in the backend directory:
```bash
cp .env.example .env
# Edit .env with your actual values
```

## Debugging Commands

### Test Database Connection:
```bash
mysql -h localhost -u agribuddy_user -p agribuddy_uganda
```

### Check Server Logs:
```bash
npm run dev
# Look for connection messages and errors
```

### Manual Model Testing:
```bash
node -e "
require('dotenv').config();
const { sequelize } = require('./config/database');
sequelize.authenticate()
  .then(() => console.log('✅ Connection successful'))
  .catch(err => console.error('❌ Connection failed:', err));
"
```

## Files Modified:
- ✅ `scripts/setupDatabase.js` - Fixed syntax errors and improved error handling
- ✅ `scripts/resetDatabase.js` - Updated imports
- ✅ `models/index.js` - Centralized model associations
- ✅ `models/Crop.js` - Removed circular dependencies
- ✅ `models/Livestock.js` - Removed circular dependencies
- ✅ `scripts/testImports.js` - New file for testing imports
- ✅ `package.json` - Added test:imports script

## If You Still Have Issues:

1. **Run the import test first**: `npm run test:imports`
2. **Check the exact error message** in the console
3. **Verify your MySQL server is running and accessible**
4. **Make sure your `.env` file has the correct database credentials**
5. **Try connecting to MySQL manually** to verify credentials

The setup should now work correctly! 🎉