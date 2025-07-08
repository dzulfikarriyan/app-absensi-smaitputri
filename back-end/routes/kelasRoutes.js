const express = require('express');
const router = express.Router();
const {
  getAllKelas,
  getKelasById,
  createKelas,
  updateKelas,
  deleteKelas
} = require('../controllers/kelasController');

// GET /api/kelas - Get semua kelas
router.get('/', getAllKelas);

// GET /api/kelas/:id - Get kelas by ID
router.get('/:id', getKelasById);

// POST /api/kelas - Create kelas baru
router.post('/', createKelas);

// PUT /api/kelas/:id - Update kelas
router.put('/:id', updateKelas);

// DELETE /api/kelas/:id - Delete kelas
router.delete('/:id', deleteKelas);

module.exports = router; 