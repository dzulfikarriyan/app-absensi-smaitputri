const { Guru } = require('../models');

// Get semua guru
const getAllGuru = async (req, res) => {
  try {
    const guru = await Guru.findAll({ order: [['nama', 'ASC']] });
    res.json({ success: true, data: guru });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data guru', error: error.message });
  }
};

// Get guru by ID
const getGuruById = async (req, res) => {
  try {
    const { id } = req.params;
    const guru = await Guru.findByPk(id);
    if (!guru) {
      return res.status(404).json({ success: false, message: 'Guru tidak ditemukan' });
    }
    res.json({ success: true, data: guru });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data guru', error: error.message });
  }
};

// Create guru baru
const createGuru = async (req, res) => {
  try {
    const { nama } = req.body;
    if (!nama) {
      return res.status(400).json({ success: false, message: 'Nama harus diisi' });
    }
    const guru = await Guru.create({ nama });
    res.status(201).json({ success: true, message: 'Guru berhasil ditambahkan', data: guru });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menambahkan guru', error: error.message });
  }
};

// Update guru
const updateGuru = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama } = req.body;
    const guru = await Guru.findByPk(id);
    if (!guru) {
      return res.status(404).json({ success: false, message: 'Guru tidak ditemukan' });
    }
    await guru.update({ nama });
    res.json({ success: true, message: 'Guru berhasil diupdate', data: guru });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengupdate guru', error: error.message });
  }
};

// Delete guru
const deleteGuru = async (req, res) => {
  try {
    const { id } = req.params;
    const guru = await Guru.findByPk(id);
    if (!guru) {
      return res.status(404).json({ success: false, message: 'Guru tidak ditemukan' });
    }
    await guru.destroy();
    res.json({ success: true, message: 'Guru berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus guru', error: error.message });
  }
};

// Create multiple guru (batch)
const createGuruBatch = async (req, res) => {
  try {
    const { guru_list } = req.body;
    
    if (!guru_list || !Array.isArray(guru_list) || guru_list.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Data guru harus berupa array dan tidak boleh kosong' 
      });
    }

    const results = [];
    const createdGurus = [];

    for (const guruData of guru_list) {
      const { nama } = guruData;
      
      if (!nama || nama.trim() === '') {
        results.push({ 
          nama: nama || 'N/A', 
          success: false, 
          message: 'Nama guru harus diisi' 
        });
        continue;
      }

      try {
        // Cek apakah guru sudah ada
        const existingGuru = await Guru.findOne({ 
          where: { nama: nama.trim() } 
        });

        if (existingGuru) {
          results.push({ 
            nama, 
            success: false, 
            message: 'Guru dengan nama ini sudah ada' 
          });
          continue;
        }

        // Buat guru baru
        const newGuru = await Guru.create({ nama: nama.trim() });
        createdGurus.push(newGuru);
        
        results.push({ 
          nama, 
          success: true, 
          message: 'Guru berhasil ditambahkan',
          data: newGuru
        });

      } catch (error) {
        results.push({ 
          nama, 
          success: false, 
          message: error.message 
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    res.status(201).json({
      success: true,
      message: `Berhasil menambahkan ${successCount} guru, ${failCount} gagal`,
      data: {
        results,
        summary: {
          total: guru_list.length,
          success: successCount,
          failed: failCount
        }
      }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Gagal memproses data guru', 
      error: error.message 
    });
  }
};

module.exports = {
  getAllGuru,
  getGuruById,
  createGuru,
  updateGuru,
  deleteGuru,
  createGuruBatch
}; 