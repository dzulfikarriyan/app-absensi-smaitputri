const { Siswa, Kelas } = require('../models');

// Get semua siswa
const getAllSiswa = async (req, res) => {
  try {
    const siswa = await Siswa.findAll({
      include: [{
        model: Kelas,
        as: 'kelas',
        attributes: ['id', 'nama_kelas']
      }],
      order: [['nama', 'ASC']]
    });
    
    res.json({
      success: true,
      data: siswa
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data siswa',
      error: error.message
    });
  }
};

// Get siswa by kelas ID
const getSiswaByKelas = async (req, res) => {
  try {
    const { kelas_id } = req.params;
    
    const siswa = await Siswa.findAll({
      where: { kelas_id },
      include: [{
        model: Kelas,
        as: 'kelas',
        attributes: ['id', 'nama_kelas']
      }],
      order: [['nama', 'ASC']]
    });
    
    res.json({
      success: true,
      data: siswa
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data siswa',
      error: error.message
    });
  }
};

// Get siswa by ID
const getSiswaById = async (req, res) => {
  try {
    const { id } = req.params;
    const siswa = await Siswa.findByPk(id, {
      include: [{
        model: Kelas,
        as: 'kelas',
        attributes: ['id', 'nama_kelas']
      }]
    });
    
    if (!siswa) {
      return res.status(404).json({
        success: false,
        message: 'Siswa tidak ditemukan'
      });
    }
    
    res.json({
      success: true,
      data: siswa
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data siswa',
      error: error.message
    });
  }
};

// Create siswa baru
const createSiswa = async (req, res) => {
  try {
    const { nama, kelas_id } = req.body;
    
    if (!nama || !kelas_id) {
      return res.status(400).json({
        success: false,
        message: 'Nama dan kelas harus diisi'
      });
    }
    
    // Cek apakah kelas ada
    const kelas = await Kelas.findByPk(kelas_id);
    if (!kelas) {
      return res.status(400).json({
        success: false,
        message: 'Kelas tidak ditemukan'
      });
    }
    
    const siswa = await Siswa.create({ nama, kelas_id });
    
    res.status(201).json({
      success: true,
      message: 'Siswa berhasil ditambahkan',
      data: siswa
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan siswa',
      error: error.message
    });
  }
};

// Update siswa
const updateSiswa = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, kelas_id } = req.body;
    
    const siswa = await Siswa.findByPk(id);
    
    if (!siswa) {
      return res.status(404).json({
        success: false,
        message: 'Siswa tidak ditemukan'
      });
    }
    
    // Cek apakah kelas ada jika kelas_id diubah
    if (kelas_id) {
      const kelas = await Kelas.findByPk(kelas_id);
      if (!kelas) {
        return res.status(400).json({
          success: false,
          message: 'Kelas tidak ditemukan'
        });
      }
    }
    
    await siswa.update({ nama, kelas_id });
    
    res.json({
      success: true,
      message: 'Siswa berhasil diupdate',
      data: siswa
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate siswa',
      error: error.message
    });
  }
};

// Delete siswa
const deleteSiswa = async (req, res) => {
  try {
    const { id } = req.params;
    
    const siswa = await Siswa.findByPk(id);
    
    if (!siswa) {
      return res.status(404).json({
        success: false,
        message: 'Siswa tidak ditemukan'
      });
    }
    
    await siswa.destroy();
    
    res.json({
      success: true,
      message: 'Siswa berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus siswa',
      error: error.message
    });
  }
};

// Batch create siswa
const createManySiswa = async (req, res) => {
  try {
    const siswaList = req.body.siswa;
    if (!Array.isArray(siswaList) || siswaList.length === 0) {
      return res.status(400).json({ success: false, message: 'Data siswa kosong!' });
    }
    // Validasi kelas_id untuk semua siswa
    const kelasIds = [...new Set(siswaList.map(s => s.kelas_id))];
    const { Kelas } = require('../models');
    const kelasCount = await Kelas.count({ where: { id: kelasIds } });
    if (kelasCount !== kelasIds.length) {
      return res.status(400).json({ success: false, message: 'Ada kelas_id yang tidak valid!' });
    }
    const created = await Siswa.bulkCreate(siswaList);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllSiswa,
  getSiswaByKelas,
  getSiswaById,
  createSiswa,
  updateSiswa,
  deleteSiswa,
  createManySiswa
}; 