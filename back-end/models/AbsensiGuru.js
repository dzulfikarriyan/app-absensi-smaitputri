const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AbsensiGuru = sequelize.define('AbsensiGuru', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  guru_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'guru',
      key: 'id'
    }
  },
  tanggal: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('hadir', 'sakit', 'izin', 'alpa', 'terlambat'),
    allowNull: false
  },
  keterangan: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'absensiguru',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['guru_id', 'tanggal']
    }
  ]
});

module.exports = AbsensiGuru; 