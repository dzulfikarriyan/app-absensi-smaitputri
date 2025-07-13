const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Guru = sequelize.define('Guru', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nama: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'guru',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Guru; 