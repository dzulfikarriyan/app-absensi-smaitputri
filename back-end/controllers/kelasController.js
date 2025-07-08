const { Kelas, Siswa } = require('../models');

// Get semua kelas
const getAllKelas = async (req, res) => {
  try {
    const kelas = await Kelas.findAll({
      include: [{ model: Siswa, as: 'siswa', attributes: [] }],
      attributes: {
        include: [
          [require('sequelize').fn('COUNT', require('sequelize').col('siswa.id')), 'jumlah_siswa']
        ]
      },
      group: ['Kelas.id'],
      order: [['nama_kelas', 'ASC']]
    });
    res.json({
      success: true,
      data: kelas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data kelas',
      error: error.message
    });
  }
};

// Get kelas by ID
const getKelasById = async (req, res) => {
  try {
    const { id } = req.params;
    const kelas = await Kelas.findByPk(id);
    
    if (!kelas) {
      return res.status(404).json({
        success: false,
        message: 'Kelas tidak ditemukan'
      });
    }
    
    res.json({
      success: true,
      data: kelas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data kelas',
      error: error.message
    });
  }
};

// Create kelas baru
const createKelas = async (req, res) => {
  try {
    const { nama_kelas } = req.body;
    
    if (!nama_kelas) {
      return res.status(400).json({
        success: false,
        message: 'Nama kelas harus diisi'
      });
    }
    
    const kelas = await Kelas.create({ nama_kelas });
    
    res.status(201).json({
      success: true,
      message: 'Kelas berhasil dibuat',
      data: kelas
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Nama kelas sudah ada'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Gagal membuat kelas',
      error: error.message
    });
  }
};

// Update kelas
const updateKelas = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_kelas } = req.body;
    
    const kelas = await Kelas.findByPk(id);
    
    if (!kelas) {
      return res.status(404).json({
        success: false,
        message: 'Kelas tidak ditemukan'
      });
    }
    
    await kelas.update({ nama_kelas });
    
    res.json({
      success: true,
      message: 'Kelas berhasil diupdate',
      data: kelas
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Nama kelas sudah ada'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate kelas',
      error: error.message
    });
  }
};

// Delete kelas
const deleteKelas = async (req, res) => {
  try {
    const { id } = req.params;
    
    const kelas = await Kelas.findByPk(id);
    
    if (!kelas) {
      return res.status(404).json({
        success: false,
        message: 'Kelas tidak ditemukan'
      });
    }
    
    await kelas.destroy();
    
    res.json({
      success: true,
      message: 'Kelas berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus kelas',
      error: error.message
    });
  }
};

module.exports = {
  getAllKelas,
  getKelasById,
  createKelas,
  updateKelas,
  deleteKelas
}; 