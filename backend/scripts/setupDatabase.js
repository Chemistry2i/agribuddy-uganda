const { sequelize, User, Crop, Livestock } = require('../models');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

const setupDatabase = async () => {
  let setupError = null;
  try {
    console.log('📄 Setting up AgriBuddy Uganda database...');
    
    // Load environment variables
    require('dotenv').config();
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Sync all models (create tables)
    await sequelize.sync({ force: true }); // WARNING: This drops existing tables
    console.log('✅ Database tables created');
    
    // Create default admin user
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@agribuddy.com',
      password: 'admin123456', // Will be hashed automatically
      role: 'admin',
      location: 'Kampala, Uganda',
      emailVerified: true
    });
    
    console.log('✅ Admin user created');
    
    // Create sample farmer user
    const farmerUser = await User.create({
      name: 'John Farmer',
      email: 'farmer@example.com',
      password: 'farmer123456',
      phone: '+256700123456',
      location: 'Mukono, Uganda',
      farmSize: 5.5,
      role: 'farmer',
      emailVerified: true
    });
    
    console.log('✅ Sample farmer user created');
    
    // Create sample crops
    await Crop.bulkCreate([
      {
        name: 'Maize',
        variety: 'Hybrid 614',
        plantingDate: '2024-03-15',
        expectedHarvest: '2024-07-15',
        area: 2.5,
        status: 'growing',
        expectedYield: 2500,
        yieldUnit: 'kg',
        userId: farmerUser.id
      },
      {
        name: 'Coffee',
        variety: 'Arabica',
        plantingDate: '2023-01-10',
        expectedHarvest: '2024-12-01',
        area: 1.8,
        status: 'mature',
        expectedYield: 1800,
        yieldUnit: 'kg',
        userId: farmerUser.id
      },
      {
        name: 'Beans',
        variety: 'Common Bean',
        plantingDate: '2024-05-01',
        expectedHarvest: '2024-08-01',
        area: 1.0,
        status: 'flowering',
        expectedYield: 800,
        yieldUnit: 'kg',
        userId: farmerUser.id
      }
    ]);
    
    console.log('✅ Sample crops created');
    
    // Create sample livestock
    await Livestock.bulkCreate([
      {
        tagNumber: 'COW-001',
        type: 'cattle',
        breed: 'Ankole',
        gender: 'female',
        dateOfBirth: '2021-03-15',
        weight: 450.5,
        healthStatus: 'healthy',
        lastVaccination: '2024-01-15',
        nextVaccination: '2025-01-15',
        acquisitionDate: '2021-04-01',
        acquisitionPrice: 800000,
        currentValue: 1200000,
        userId: farmerUser.id
      },
      {
        tagNumber: 'GOAT-001',
        type: 'goat',
        breed: 'Boer',
        gender: 'male',
        dateOfBirth: '2023-06-10',
        weight: 45.2,
        healthStatus: 'healthy',
        lastVaccination: '2024-06-10',
        nextVaccination: '2025-06-10',
        acquisitionDate: '2023-07-01',
        acquisitionPrice: 150000,
        currentValue: 200000,
        userId: farmerUser.id
      }
    ]);
    
    console.log('✅ Sample livestock created');
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n🔑 Default users created:');
    console.log('Admin: admin@agribuddy.com / admin123456');
    console.log('Farmer: farmer@example.com / farmer123456');
    console.log('\n⚠️  Please change these passwords in production!');
    
  } catch (error) {
    setupError = error;
    console.error('❌ Database setup failed:', error.message);
    console.error('Full error:', error);
    
    // Try to log the error, but don't fail if logger is not available
    try {
      logger.error('Database setup failed:', error);
    } catch (logError) {
      console.error('Logger error:', logError.message);
    }
  } finally {
    try {
      await sequelize.close();
    } catch (closeError) {
      console.error('Error closing database connection:', closeError.message);
    }
    process.exit(setupError ? 1 : 0);
  }
};

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;