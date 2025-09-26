const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Livestock = sequelize.define('Livestock', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tagNumber: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true
  },
  type: {
    type: DataTypes.ENUM('cattle', 'goat', 'sheep', 'pig', 'chicken', 'duck', 'other'),
    allowNull: false
  },
  breed: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('male', 'female'),
    allowNull: false
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  weight: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  healthStatus: {
    type: DataTypes.ENUM('healthy', 'sick', 'injured', 'pregnant', 'lactating', 'quarantine'),
    defaultValue: 'healthy',
    allowNull: false
  },
  lastVaccination: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  nextVaccination: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  acquisitionDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  acquisitionPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  currentValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
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
  tableName: 'livestock',
  timestamps: true
});

// Instance methods
Livestock.prototype.getAge = function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  const ageInMs = today - birthDate;
  const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));
  return {
    days: ageInDays,
    months: Math.floor(ageInDays / 30),
    years: Math.floor(ageInDays / 365)
  };
};

module.exports = Livestock;