const express = require('express');
const router = express.Router();
const {
  getAllSiswa,
  getSiswaByKelas,
  getSiswaById,
  createSiswa,
  updateSiswa,
  deleteSiswa,
  createManySiswa
} = require('../controllers/siswaController');

// GET /api/siswa - Get semua siswa
router.get('/', getAllSiswa);

// GET /api/siswa/kelas/:kelas_id - Get siswa by kelas
router.get('/kelas/:kelas_id', getSiswaByKelas);

// POST /api/siswa/batch - Tambah banyak siswa sekaligus
router.post('/batch', createManySiswa);

// POST /api/siswa - Create siswa baru
router.post('/', createSiswa);

// PUT /api/siswa/:id - Update siswa
router.put('/:id', updateSiswa);

// DELETE /api/siswa/:id - Delete siswa
router.delete('/:id', deleteSiswa);

// GET /api/siswa/:id - Get siswa by ID (harus di akhir)
router.get('/:id', getSiswaById);

module.exports = router; 