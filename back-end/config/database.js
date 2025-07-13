require('dotenv').config();
const { Sequelize } = require('sequelize');

// Konfigurasi database dengan environment variables atau default
const sequelize = new Sequelize(
  process.env.DB_NAME || 'absensi_guru',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'Sukses!@#99', // Ganti dengan password MySQL Anda
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3307,
    dialect: 'mysql',
    logging: false, // Set false untuk production
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test koneksi
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Koneksi database berhasil.');
  } catch (error) {
    console.error('❌ Gagal koneksi ke database:', error.message);
    console.log('\n🔧 Solusi:');
    console.log('1. Pastikan MySQL server berjalan');
    console.log('2. Pastikan database "absensi_guru" sudah dibuat');
    console.log('3. Update password di config/database.js');
    console.log('4. Atau set environment variable DB_PASSWORD');
  }
};

testConnection();

module.exports = sequelize; 