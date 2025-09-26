const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');
const path = require('path');

// Database configuration - use SQLite for development, MySQL for production
const sequelize = process.env.NODE_ENV === 'production' 
  ? new Sequelize({
      database: process.env.DB_NAME || 'agribuddy_uganda',
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false,
      
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },

      define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true
      },

      dialectOptions: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
      }
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: path.join(__dirname, '..', 'database', 'agribuddy_development.sqlite'),
      logging: process.env.NODE_ENV === 'development' ? (msg) => logger.info(msg) : false,
      
      define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true
      }
    });

// Test database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ MySQL database connection established successfully');
    
    // Sync database in development mode
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('✅ Database synchronized successfully');
    }
    
    return true;
  } catch (error) {
    logger.error('❌ Unable to connect to MySQL database:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  connectDB
};