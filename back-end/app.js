const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');

// Import routes
const kelasRoutes = require('./routes/kelasRoutes');
const siswaRoutes = require('./routes/siswaRoutes');
const absensiRoutes = require('./routes/absensiRoutes');
const guruRoutes = require('./routes/guruRoutes');
const absensiGuruRoutes = require('./routes/absensiGuruRoutes');

// Import models untuk sync database
const { Kelas, Siswa, Absensi } = require('./models');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/kelas', kelasRoutes);
app.use('/api/siswa', siswaRoutes);
app.use('/api/absensi', absensiRoutes);
app.use('/api/guru', guruRoutes);
app.use('/api/absensi-guru', absensiGuruRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'API Absensi Siswa berjalan dengan baik!',
    endpoints: {
      kelas: '/api/kelas',
      siswa: '/api/siswa',
      absensi: '/api/absensi'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan pada server',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan'
  });
});

// Sync database dan jalankan server
const startServer = async () => {
  try {
    // Sync database (force: false untuk production)
    await sequelize.sync({ force: false });
    console.log('✅ Database berhasil disinkronkan');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di port ${PORT}`);
      console.log(`📱 API tersedia di http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Gagal menjalankan server:', error);
  }
};

startServer(); 