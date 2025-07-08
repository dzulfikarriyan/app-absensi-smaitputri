const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Absensi = sequelize.define('Absensi', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  siswa_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'siswa',
      key: 'id'
    }
  },
  tanggal: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('sakit', 'izin', 'alpa', 'terlambat'),
    allowNull: false
  },
  keterangan: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'absensi',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['siswa_id', 'tanggal']
    }
  ]
});

module.exports = Absensi; 