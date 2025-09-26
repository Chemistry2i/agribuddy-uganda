const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Crop = sequelize.define('Crop', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  variety: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  plantingDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  expectedHarvest: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  actualHarvest: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  area: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.01
    }
  },
  status: {
    type: DataTypes.ENUM('planted', 'growing', 'flowering', 'mature', 'harvested', 'failed'),
    defaultValue: 'planted',
    allowNull: false
  },
  expectedYield: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  actualYield: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  yieldUnit: {
    type: DataTypes.STRING(20),
    defaultValue: 'kg',
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  tableName: 'crops',
  timestamps: true
});

module.exports = Crop;