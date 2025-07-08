const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Siswa = sequelize.define('Siswa', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nama: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  kelas_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'kelas',
      key: 'id'
    }
  }
}, {
  tableName: 'siswa',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Siswa; 