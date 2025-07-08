const express = require('express');
const router = express.Router();
const {
  inputAbsensi,
  inputAbsensiBatch,
  getAbsensiByTanggalKelas,
  getRekapAbsensi,
  getRekapAbsensiKelas,
  downloadRekapExcel,
  downloadRekapExcelAll
} = require('../controllers/absensiController');

// POST /api/absensi - Input absensi satu siswa
router.post('/', inputAbsensi);

// POST /api/absensi/batch - Input absensi multiple siswa
router.post('/batch', inputAbsensiBatch);

// GET /api/absensi/rekap/excel - Download rekap sesuai filter
router.get('/rekap/excel', downloadRekapExcel);

// GET /api/absensi/rekap/excel-all - Download semua rekap
router.get('/rekap/excel-all', downloadRekapExcelAll);

// GET /api/absensi/rekap - Get rekap absensi
router.get('/rekap', getRekapAbsensi);

// GET /api/absensi/rekap/kelas - Get rekap absensi per kelas
router.get('/rekap/kelas', getRekapAbsensiKelas);

// GET /api/absensi/:tanggal/:kelas_id - Get absensi by tanggal dan kelas
router.get('/:tanggal/:kelas_id', getAbsensiByTanggalKelas);

module.exports = router; 