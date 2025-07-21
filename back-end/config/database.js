require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Base configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3307,
    dialect: 'mysql',
    logging: false, // Set false for production
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
};

// Add SSL configuration for production/Aiven if DB_SSL is true
if (process.env.DB_SSL === 'true') {
  // Path untuk sertifikat di Render adalah /etc/secrets/ca.pem
  // Path lokal untuk development adalah di dalam folder config
  const renderCaPath = '/etc/secrets/ca.pem';
  const localCaPath = path.join(__dirname, 'ca.pem');

  let caCertPath;

  if (fs.existsSync(renderCaPath)) {
    caCertPath = renderCaPath;
    console.log('🔍 Ditemukan sertifikat SSL di path Render.');
  } else if (fs.existsSync(localCaPath)) {
    caCertPath = localCaPath;
    console.log('🔍 Ditemukan sertifikat SSL di path lokal.');
  }

  if (caCertPath) {
    dbConfig.dialectOptions = {
      ssl: {
        rejectUnauthorized: true, // Ensures the server certificate is verified
        ca: fs.readFileSync(caCertPath).toString(),
      }
    };
    console.log(`✅ Menggunakan koneksi SSL ke database dari ${caCertPath}.`);
  } else {
    // This will stop the application if the certificate is missing in production
    console.error('❌ KRITIS: Variabel DB_SSL=true tapi file sertifikat "ca.pem" tidak ditemukan.');
    process.exit(1);
  }
}

// Konfigurasi database dengan environment variables atau default
const sequelize = new Sequelize(
  process.env.DB_NAME || 'absensi_siswa', // Mengganti default ke absensi_siswa
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'Sukses!@#99', // Ganti dengan password MySQL Anda
  dbConfig
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