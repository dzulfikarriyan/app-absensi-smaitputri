const express = require('express');
const router = express.Router();
const {
  getAllGuru,
  getGuruById,
  createGuru,
  updateGuru,
  deleteGuru,
  createGuruBatch
} = require('../controllers/guruController');

// GET /api/guru - Get semua guru
router.get('/', getAllGuru);

// POST /api/guru - Create guru baru
router.post('/', createGuru);

// POST /api/guru/batch - Create multiple guru
router.post('/batch', createGuruBatch);

// PUT /api/guru/:id - Update guru
router.put('/:id', updateGuru);

// DELETE /api/guru/:id - Delete guru
router.delete('/:id', deleteGuru);

// GET /api/guru/:id - Get guru by ID (harus di akhir)
router.get('/:id', getGuruById);

module.exports = router; 