const { sequelize } = require('../config/database');
const User = require('./User');
const Crop = require('./Crop');
const Livestock = require('./Livestock');

// Define all associations here to avoid circular dependencies

// User -> Crop relationship
User.hasMany(Crop, { foreignKey: 'userId', as: 'crops' });
Crop.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

// User -> Livestock relationship
User.hasMany(Livestock, { foreignKey: 'userId', as: 'livestock' });
Livestock.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

const models = {
  User,
  Crop,
  Livestock,
  sequelize
};

// Sync all models
const syncDatabase = async (options = {}) => {
  try {
    await sequelize.sync(options);
    console.log('✅ All models synchronized successfully');
  } catch (error) {
    console.error('❌ Error synchronizing models:', error);
    throw error;
  }
};

models.syncDatabase = syncDatabase;

module.exports = models;