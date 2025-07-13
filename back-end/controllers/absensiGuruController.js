const { AbsensiGuru, Guru } = require('../models');
const { Op } = require('sequelize');
const ExcelJS = require('exceljs');

// Input absensi satu guru
const inputAbsensiGuru = async (req, res) => {
  try {
    const { guru_id, tanggal, status, keterangan } = req.body;
    if (!guru_id || !tanggal || !status) {
      return res.status(400).json({ success: false, message: 'Guru, tanggal, dan status harus diisi' });
    }
    const guru = await Guru.findByPk(guru_id);
    if (!guru) {
      return res.status(400).json({ success: false, message: 'Guru tidak ditemukan' });
    }
    const existing = await AbsensiGuru.findOne({ where: { guru_id, tanggal } });
    if (existing) {
      await existing.update({ status, keterangan });
      return res.json({ success: true, message: 'Absensi guru berhasil diupdate', data: existing });
    }
    const absensi = await AbsensiGuru.create({ guru_id, tanggal, status, keterangan });
    res.status(201).json({ success: true, message: 'Absensi guru berhasil disimpan', data: absensi });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menyimpan absensi guru', error: error.message });
  }
};

// Input absensi batch guru
const inputAbsensiGuruBatch = async (req, res) => {
  try {
    const { tanggal, absensi_data } = req.body;
    if (!tanggal || !absensi_data || !Array.isArray(absensi_data)) {
      return res.status(400).json({ success: false, message: 'Tanggal dan data absensi harus diisi' });
    }
    const results = [];
    for (const item of absensi_data) {
      const { guru_id, status, keterangan } = item;
      if (!guru_id || !status) {
        results.push({ guru_id, success: false, message: 'Guru ID dan status harus diisi' });
        continue;
      }
      try {
        const existing = await AbsensiGuru.findOne({ where: { guru_id, tanggal } });
        if (existing) {
          await existing.update({ status, keterangan });
          results.push({ guru_id, success: true, message: 'Absensi diupdate', data: existing });
        } else {
          const absensi = await AbsensiGuru.create({ guru_id, tanggal, status, keterangan });
          results.push({ guru_id, success: true, message: 'Absensi disimpan', data: absensi });
        }
      } catch (error) {
        results.push({ guru_id, success: false, message: error.message });
      }
    }
    res.json({ success: true, message: 'Proses input absensi guru selesai', data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memproses absensi guru', error: error.message });
  }
};

// Get absensi guru by tanggal
const getAbsensiGuruByTanggal = async (req, res) => {
  try {
    const { tanggal } = req.params;
    const absensi = await AbsensiGuru.findAll({
      include: [{ model: Guru, as: 'guru', attributes: ['id', 'nama'] }],
      where: { tanggal },
      order: [[{ model: Guru, as: 'guru' }, 'nama', 'ASC']]
    });
    res.json({ success: true, data: absensi });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data absensi guru', error: error.message });
  }
};

// Get rekap absensi guru
const getRekapAbsensiGuru = async (req, res) => {
  try {
    const { guru_id, start_date, end_date } = req.query;
    console.log('DEBUG absensi-guru/rekap:', { guru_id, start_date, end_date });
    let whereClause = {};
    if (guru_id) whereClause.guru_id = guru_id;
    // Validasi tanggal
    const isValidDate = (d) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d);
    if (isValidDate(start_date) && isValidDate(end_date)) {
      whereClause.tanggal = { [Op.between]: [start_date, end_date] };
    }
    const absensi = await AbsensiGuru.findAll({
      where: whereClause,
      include: [{ model: Guru, as: 'guru', attributes: ['id', 'nama'] }],
      order: [['tanggal', 'DESC']]
    });
    res.json({ success: true, data: absensi });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil rekap absensi guru', error: error.message });
  }
};

// Download rekap absensi guru as Excel
const downloadRekapExcel = async (req, res) => {
  try {
    const { guru_id, start_date, end_date } = req.query;
    console.log('DEBUG download-excel:', { guru_id, start_date, end_date });
    
    let whereClause = {};
    if (guru_id) whereClause.guru_id = guru_id;
    
    // Validasi tanggal
    const isValidDate = (d) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d);
    if (isValidDate(start_date) && isValidDate(end_date)) {
      whereClause.tanggal = { [Op.between]: [start_date, end_date] };
    }
    
    const absensi = await AbsensiGuru.findAll({
      where: whereClause,
      include: [{ model: Guru, as: 'guru', attributes: ['id', 'nama'] }],
      order: [['tanggal', 'DESC']]
    });

    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Rekap Absensi Guru');

    // Set up headers
    worksheet.columns = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'Tanggal', key: 'tanggal', width: 15 },
      { header: 'Nama Guru', key: 'nama_guru', width: 30 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Keterangan', key: 'keterangan', width: 30 }
    ];

    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Add data rows
    absensi.forEach((item, index) => {
      worksheet.addRow({
        no: index + 1,
        tanggal: item.tanggal,
        nama_guru: item.guru?.nama || '-',
        status: getStatusLabel(item.status),
        keterangan: item.keterangan || '-'
      });
    });

    // Add summary statistics
    const totalHari = (() => {
      if (!start_date || !end_date) return 0;
      const start = new Date(start_date);
      const end = new Date(end_date);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays + 1;
    })();

    const totalHadir = absensi.filter(r => r.status === 'hadir').length;
    const totalSakit = absensi.filter(r => r.status === 'sakit').length;
    const totalIzin = absensi.filter(r => r.status === 'izin').length;
    const totalAlpa = absensi.filter(r => r.status === 'alpa').length;
    const totalTerlambat = absensi.filter(r => r.status === 'terlambat').length;

    // Add empty row
    worksheet.addRow({});

    // Add summary section
    worksheet.addRow({ no: '', tanggal: 'RINGKASAN:', nama_guru: '', status: '', keterangan: '' });
    worksheet.addRow({ no: '', tanggal: 'Total Hari:', nama_guru: totalHari, status: '', keterangan: '' });
    worksheet.addRow({ no: '', tanggal: 'Total Hadir:', nama_guru: totalHadir, status: '', keterangan: '' });
    worksheet.addRow({ no: '', tanggal: 'Total Sakit:', nama_guru: totalSakit, status: '', keterangan: '' });
    worksheet.addRow({ no: '', tanggal: 'Total Izin:', nama_guru: totalIzin, status: '', keterangan: '' });
    worksheet.addRow({ no: '', tanggal: 'Total Alpa:', nama_guru: totalAlpa, status: '', keterangan: '' });
    worksheet.addRow({ no: '', tanggal: 'Total Terlambat:', nama_guru: totalTerlambat, status: '', keterangan: '' });

    // Style summary rows
    const summaryStartRow = absensi.length + 3;
    for (let i = summaryStartRow; i <= summaryStartRow + 6; i++) {
      const row = worksheet.getRow(i);
      row.font = { bold: true };
    }

    // Generate filename
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `rekap_absensi_guru_${timestamp}.xlsx`;

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Write to response
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Error generating Excel:', error);
    res.status(500).json({ success: false, message: 'Gagal mengunduh file Excel', error: error.message });
  }
};

// Helper function for status labels
const getStatusLabel = (status) => {
  switch (status) {
    case 'hadir':
      return 'Hadir';
    case 'sakit':
      return 'Sakit';
    case 'izin':
      return 'Izin';
    case 'alpa':
      return 'Alpa';
    case 'terlambat':
      return 'Terlambat';
    default:
      return status;
  }
};

module.exports = {
  inputAbsensiGuru,
  inputAbsensiGuruBatch,
  getAbsensiGuruByTanggal,
  getRekapAbsensiGuru,
  downloadRekapExcel
}; 