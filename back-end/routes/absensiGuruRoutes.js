const express = require('express');
const router = express.Router();
const {
  inputAbsensiGuru,
  inputAbsensiGuruBatch,
  getAbsensiGuruByTanggal,
  getRekapAbsensiGuru,
  downloadRekapExcel
} = require('../controllers/absensiGuruController');

// POST /api/absensi-guru - Input absensi satu guru
router.post('/', inputAbsensiGuru);

// POST /api/absensi-guru/batch - Input absensi multiple guru
router.post('/batch', inputAbsensiGuruBatch);

// GET /api/absensi-guru/rekap - Get rekap absensi guru
router.get('/rekap', getRekapAbsensiGuru);

// GET /api/absensi-guru/download-excel - Download rekap absensi guru as Excel
router.get('/download-excel', downloadRekapExcel);

// GET /api/absensi-guru/:tanggal - Get absensi guru by tanggal
router.get('/:tanggal', getAbsensiGuruByTanggal);

module.exports = router; 