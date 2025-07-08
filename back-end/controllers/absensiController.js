const { Absensi, Siswa, Kelas } = require('../models');
const { Op } = require('sequelize');
const ExcelJS = require('exceljs');

// Input absensi untuk satu siswa
const inputAbsensi = async (req, res) => {
  try {
    const { siswa_id, tanggal, status, keterangan } = req.body;
    
    if (!siswa_id || !tanggal || !status) {
      return res.status(400).json({
        success: false,
        message: 'Siswa, tanggal, dan status harus diisi'
      });
    }
    
    // Cek apakah siswa ada
    const siswa = await Siswa.findByPk(siswa_id);
    if (!siswa) {
      return res.status(400).json({
        success: false,
        message: 'Siswa tidak ditemukan'
      });
    }
    
    // Cek apakah sudah ada absensi untuk siswa dan tanggal tersebut
    const existingAbsensi = await Absensi.findOne({
      where: { siswa_id, tanggal }
    });
    
    if (existingAbsensi) {
      // Update absensi yang sudah ada
      await existingAbsensi.update({ status, keterangan });
      
      return res.json({
        success: true,
        message: 'Absensi berhasil diupdate',
        data: existingAbsensi
      });
    }
    
    // Buat absensi baru
    const absensi = await Absensi.create({
      siswa_id,
      tanggal,
      status,
      keterangan
    });
    
    res.status(201).json({
      success: true,
      message: 'Absensi berhasil disimpan',
      data: absensi
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menyimpan absensi',
      error: error.message
    });
  }
};

// Input absensi untuk multiple siswa (batch)
const inputAbsensiBatch = async (req, res) => {
  try {
    const { kelas_id, tanggal, absensi_data } = req.body;
    
    if (!kelas_id || !tanggal || !absensi_data || !Array.isArray(absensi_data)) {
      return res.status(400).json({
        success: false,
        message: 'Kelas, tanggal, dan data absensi harus diisi'
      });
    }
    
    const results = [];
    
    for (const item of absensi_data) {
      const { siswa_id, status, keterangan } = item;
      
      if (!siswa_id || !status) {
        results.push({
          siswa_id,
          success: false,
          message: 'Siswa ID dan status harus diisi'
        });
        continue;
      }
      
      try {
        // Cek apakah sudah ada absensi
        const existingAbsensi = await Absensi.findOne({
          where: { siswa_id, tanggal }
        });
        
        if (existingAbsensi) {
          await existingAbsensi.update({ status, keterangan });
          results.push({
            siswa_id,
            success: true,
            message: 'Absensi diupdate',
            data: existingAbsensi
          });
        } else {
          const absensi = await Absensi.create({
            siswa_id,
            tanggal,
            status,
            keterangan
          });
          results.push({
            siswa_id,
            success: true,
            message: 'Absensi disimpan',
            data: absensi
          });
        }
      } catch (error) {
        results.push({
          siswa_id,
          success: false,
          message: error.message
        });
      }
    }
    
    res.json({
      success: true,
      message: 'Proses input absensi selesai',
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal memproses absensi',
      error: error.message
    });
  }
};

// Get absensi by tanggal dan kelas
const getAbsensiByTanggalKelas = async (req, res) => {
  try {
    const { tanggal, kelas_id } = req.params;
    
    const absensi = await Absensi.findAll({
      include: [{
        model: Siswa,
        as: 'siswa',
        where: { kelas_id },
        include: [{
          model: Kelas,
          as: 'kelas',
          attributes: ['id', 'nama_kelas']
        }]
      }],
      where: { tanggal },
      order: [['siswa', 'nama', 'ASC']]
    });
    
    res.json({
      success: true,
      data: absensi
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data absensi',
      error: error.message
    });
  }
};

// Get rekap absensi siswa
const getRekapAbsensi = async (req, res) => {
  try {
    const { siswa_id, start_date, end_date } = req.query;
    
    let whereClause = {};
    
    if (siswa_id) {
      whereClause.siswa_id = siswa_id;
    }
    
    if (start_date && end_date) {
      whereClause.tanggal = {
        [Op.between]: [start_date, end_date]
      };
    }
    
    const absensi = await Absensi.findAll({
      where: whereClause,
      include: [{
        model: Siswa,
        as: 'siswa',
        include: [{
          model: Kelas,
          as: 'kelas',
          attributes: ['id', 'nama_kelas']
        }]
      }],
      order: [['tanggal', 'DESC']]
    });
    
    // Hitung rekap
    const rekap = {};
    const siswaMap = new Map();
    
    absensi.forEach(item => {
      const siswaId = item.siswa_id;
      const status = item.status;
      
      if (!rekap[siswaId]) {
        rekap[siswaId] = {
          siswa: item.siswa,
          total: 0,
          sakit: 0,
          izin: 0,
          alpa: 0,
          terlambat: 0,
          detail: []
        };
      }
      
      rekap[siswaId].total++;
      rekap[siswaId][status]++;
      rekap[siswaId].detail.push({
        tanggal: item.tanggal,
        status: item.status,
        keterangan: item.keterangan
      });
    });
    
    res.json({
      success: true,
      data: Object.values(rekap)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil rekap absensi',
      error: error.message
    });
  }
};

// Get rekap absensi per kelas
const getRekapAbsensiKelas = async (req, res) => {
  try {
    const { kelas_id, start_date, end_date } = req.query;
    
    if (!kelas_id) {
      return res.status(400).json({
        success: false,
        message: 'ID kelas harus diisi'
      });
    }
    
    let whereClause = {};
    
    if (start_date && end_date) {
      whereClause.tanggal = {
        [Op.between]: [start_date, end_date]
      };
    }
    
    const absensi = await Absensi.findAll({
      where: whereClause,
      include: [{
        model: Siswa,
        as: 'siswa',
        where: { kelas_id },
        include: [{
          model: Kelas,
          as: 'kelas',
          attributes: ['id', 'nama_kelas']
        }]
      }],
      order: [['tanggal', 'DESC']]
    });
    
    // Hitung rekap per siswa
    const rekap = {};
    
    absensi.forEach(item => {
      const siswaId = item.siswa_id;
      const status = item.status;
      
      if (!rekap[siswaId]) {
        rekap[siswaId] = {
          siswa: item.siswa,
          total: 0,
          sakit: 0,
          izin: 0,
          alpa: 0,
          terlambat: 0,
          detail: []
        };
      }
      
      rekap[siswaId].total++;
      rekap[siswaId][status]++;
      rekap[siswaId].detail.push({
        tanggal: item.tanggal,
        status: item.status,
        keterangan: item.keterangan
      });
    });
    
    res.json({
      success: true,
      data: Object.values(rekap)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil rekap absensi kelas',
      error: error.message
    });
  }
};

function formatTanggalIndo(dateStr) {
  if (!dateStr) return '';
  const bulan = [
    '', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const [year, month, day] = dateStr.split('-');
  return `${parseInt(day)} ${bulan[parseInt(month)]} ${year}`;
}

// Download rekap absensi sesuai filter
const downloadRekapExcel = async (req, res) => {
  try {
    const { kelas_id, start_date, end_date, tanggal } = req.query;
    console.log('Download rekap Excel params:', req.query);
    if (!kelas_id || !start_date || !end_date) {
      return res.status(400).json({ success: false, message: 'kelas_id, start_date, dan end_date wajib diisi!' });
    }
    let whereClause = {};
    whereClause['tanggal'] = { [Op.between]: [start_date, end_date] };
    const absensi = await Absensi.findAll({
      where: whereClause,
      include: [{
        model: Siswa,
        as: 'siswa',
        where: { kelas_id },
        include: [{ model: Kelas, as: 'kelas', attributes: ['nama_kelas'] }]
      }],
      order: [['tanggal', 'ASC'], ['siswa', 'nama', 'ASC']]
    });
    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet('Rekap Absensi');
    ws.addRow(['No', 'Tanggal', 'Kelas', 'Nama', 'Status']);
    if (absensi.length > 0) {
      absensi.forEach((a, i) => {
        ws.addRow([
          i + 1,
          formatTanggalIndo(a.tanggal),
          a.siswa?.kelas?.nama_kelas || '',
          a.siswa?.nama || '',
          a.status
        ]);
      });
    }
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=rekap-absensi.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error download rekap Excel:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Download semua rekap absensi
const downloadRekapExcelAll = async (req, res) => {
  try {
    const absensi = await Absensi.findAll({
      include: [{
        model: Siswa,
        as: 'siswa',
        include: [{ model: Kelas, as: 'kelas', attributes: ['nama_kelas'] }]
      }],
      order: [['tanggal', 'ASC'], ['siswa', 'nama', 'ASC']]
    });
    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet('Rekap Absensi');
    ws.addRow(['No', 'Tanggal', 'Kelas', 'Nama', 'Status']);
    if (absensi.length > 0) {
      absensi.forEach((a, i) => {
        ws.addRow([
          i + 1,
          formatTanggalIndo(a.tanggal),
          a.siswa?.kelas?.nama_kelas || '',
          a.siswa?.nama || '',
          a.status
        ]);
      });
    }
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=rekap-absensi-semua.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  inputAbsensi,
  inputAbsensiBatch,
  getAbsensiByTanggalKelas,
  getRekapAbsensi,
  getRekapAbsensiKelas,
  downloadRekapExcel,
  downloadRekapExcelAll
}; 