# MySQL Database Setup Guide for AgriBuddy Uganda

This guide will help you set up MySQL database for the AgriBuddy Uganda backend using Sequelize ORM.

## Prerequisites

- Node.js (v16 or higher)
- MySQL Server (v8.0 or higher)
- MySQL client or MySQL Workbench

## Database Configuration

### 1. Install MySQL Server

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

**macOS (using Homebrew):**
```bash
brew install mysql
brew services start mysql
```

**Windows:**
Download and install MySQL from the official website.

### 2. Create Database

Connect to MySQL and create the database:

```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE agribuddy_uganda CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create database user (recommended)
CREATE USER 'agribuddy_user'@'localhost' IDENTIFIED BY 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON agribuddy_uganda.* TO 'agribuddy_user'@'localhost';
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

### 3. Environment Configuration

Update your `.env` file with MySQL database settings:

```env
# Database Configuration (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=agribuddy_uganda
DB_USER=agribuddy_user
DB_PASSWORD=your_secure_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Other configurations...
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

## Database Models

The system includes the following Sequelize models:

### User Model (`models/User.js`)
- **Fields**: id, name, email, password, phone, location, farmSize, role, isActive, emailVerified
- **Relationships**: Has many Crops and Livestock
- **Features**: Password hashing, email validation, role-based access

### Crop Model (`models/Crop.js`)
- **Fields**: id, name, variety, plantingDate, expectedHarvest, area, status, yield data
- **Relationships**: Belongs to User
- **Features**: Crop lifecycle tracking, yield analytics

### Livestock Model (`models/Livestock.js`)
- **Fields**: id, tagNumber, type, breed, gender, weight, healthStatus, vaccination dates
- **Relationships**: Belongs to User
- **Features**: Health tracking, vaccination management

## Database Setup Commands

### 1. First Time Setup
```bash
# Install dependencies
npm install

# Set up database tables and sample data
npm run db:setup
```

### 2. Reset Database (Development)
```bash
# WARNING: This will delete all data
npm run db:reset
```

### 3. Manual Setup
```bash
# Run the setup script directly
node scripts/setupDatabase.js
```

## Sample Data

The setup script creates:

### Default Users
- **Admin**: `admin@agribuddy.com` / `admin123456`
- **Farmer**: `farmer@example.com` / `farmer123456`

### Sample Crops
- Maize (Hybrid 614) - Growing stage
- Coffee (Arabica) - Mature stage
- Beans (Common Bean) - Flowering stage

### Sample Livestock
- Cattle (Ankole breed) - Healthy
- Goat (Boer breed) - Healthy

## Database Operations

### Starting the Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

### Connection Testing
The server will automatically:
1. Test database connection on startup
2. Sync models in development mode
3. Log connection status

### Manual Database Operations

**Connect to database:**
```javascript
const { sequelize } = require('./config/database');
await sequelize.authenticate();
```

**Create tables:**
```javascript
await sequelize.sync({ force: true }); // Drops existing tables
await sequelize.sync({ alter: true });  // Alters existing tables
await sequelize.sync();                 // Creates only new tables
```

## API Endpoints with MySQL

### Authentication
- `POST /api/auth/register` - Creates user in MySQL
- `POST /api/auth/login` - Validates against MySQL
- `POST /api/auth/forgot-password` - Uses password reset tokens

### Data Management
- `GET /api/crops` - Fetches user's crops from MySQL
- `POST /api/crops` - Creates crop records in MySQL
- `GET /api/livestock` - Fetches livestock from MySQL

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  location VARCHAR(255),
  farm_size DECIMAL(10,2),
  role ENUM('farmer', 'extension_officer', 'admin') DEFAULT 'farmer',
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Crops Table
```sql
CREATE TABLE crops (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  variety VARCHAR(100),
  planting_date DATE NOT NULL,
  expected_harvest DATE,
  area DECIMAL(10,2) NOT NULL,
  status ENUM('planted', 'growing', 'flowering', 'mature', 'harvested', 'failed') DEFAULT 'planted',
  expected_yield DECIMAL(10,2),
  actual_yield DECIMAL(10,2),
  yield_unit VARCHAR(20) DEFAULT 'kg',
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Livestock Table
```sql
CREATE TABLE livestock (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tag_number VARCHAR(50) UNIQUE,
  type ENUM('cattle', 'goat', 'sheep', 'pig', 'chicken', 'duck', 'other') NOT NULL,
  breed VARCHAR(100),
  gender ENUM('male', 'female') NOT NULL,
  date_of_birth DATE,
  weight DECIMAL(8,2),
  health_status ENUM('healthy', 'sick', 'injured', 'pregnant', 'lactating', 'quarantine') DEFAULT 'healthy',
  last_vaccination DATE,
  next_vaccination DATE,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Troubleshooting

### Common Issues

1. **Connection Error**: `ECONNREFUSED`
   - Ensure MySQL server is running
   - Check host, port, username, and password
   - Verify firewall settings

2. **Authentication Error**: `ER_ACCESS_DENIED_ERROR`
   - Check username and password
   - Verify user has proper privileges
   - Try connecting with MySQL client first

3. **Database Not Found**: `ER_BAD_DB_ERROR`
   - Create the database manually
   - Check database name in .env file

4. **Table Doesn't Exist**: `ER_NO_SUCH_TABLE`
   - Run `npm run db:setup` to create tables
   - Check model synchronization

### Debugging

Enable SQL logging in development:
```javascript
// In config/database.js
logging: process.env.NODE_ENV === 'development' ? console.log : false
```

Check database connection:
```bash
# Test MySQL connection
mysql -h localhost -u agribuddy_user -p agribuddy_uganda

# Show tables
SHOW TABLES;

# Describe table structure
DESCRIBE users;
```

## Production Considerations

### Security
- Use strong passwords
- Enable SSL/TLS connections
- Limit database user privileges
- Regular security updates

### Performance
- Add proper indexes on frequently queried fields
- Use connection pooling
- Monitor query performance
- Regular database maintenance

### Backup
```bash
# Create backup
mysqldump -u agribuddy_user -p agribuddy_uganda > backup.sql

# Restore backup
mysql -u agribuddy_user -p agribuddy_uganda < backup.sql
```

### Monitoring
- Enable slow query log
- Monitor connection counts
- Set up alerts for errors
- Regular performance audits

## Migration Strategy

If migrating from MongoDB:
1. Export data from MongoDB
2. Transform data format
3. Import into MySQL using Sequelize
4. Update application code
5. Test thoroughly

## Support

For issues:
1. Check server logs
2. Verify database connection
3. Test with sample data
4. Review Sequelize documentation
5. Contact development team

---

## Quick Start Checklist

- [ ] Install MySQL server
- [ ] Create database and user
- [ ] Configure `.env` file
- [ ] Install dependencies: `npm install`
- [ ] Set up database: `npm run db:setup`
- [ ] Start server: `npm run dev`
- [ ] Test API endpoints
- [ ] Login with sample users

Your MySQL database is now ready! 🎉