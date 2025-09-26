const { sequelize, User, Crop, Livestock } = require('../models');
const logger = require('../utils/logger');

const resetDatabase = async () => {
  let resetError = null;
  
  try {
    // Load environment variables
    require('dotenv').config();
    
    console.log('⚠️  Resetting AgriBuddy Uganda database...');
    console.log('⚠️  This will DELETE ALL DATA!');
    
    // Wait for user confirmation in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('⏸️  Press Ctrl+C to cancel or wait 5 seconds to continue...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Drop and recreate all tables
    await sequelize.sync({ force: true });
    console.log('✅ Database tables reset');
    
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
      }
    ]);
    
    console.log('✅ Sample livestock created');
    
    console.log('\n🎉 Database reset completed successfully!');
    console.log('\n🔑 Default users created:');
    console.log('Admin: admin@agribuddy.com / admin123456');
    console.log('Farmer: farmer@example.com / farmer123456');
    console.log('\n⚠️  Please change these passwords in production!');
    
  } catch (error) {
    resetError = error;
    console.error('❌ Database reset failed:', error.message);
    console.error('Full error:', error);
    
    // Try to log the error, but don't fail if logger is not available
    try {
      logger.error('Database reset failed:', error);
    } catch (logError) {
      console.error('Logger error:', logError.message);
    }
  } finally {
    try {
      // Ensure database connection is closed
      await sequelize.close();
    } catch (closeError) {
      console.error('Error closing database connection:', closeError.message);
    }
    
    process.exit(resetError ? 1 : 0);
  }
};

// Run reset if called directly
if (require.main === module) {
  resetDatabase();
}

module.exports = resetDatabase;