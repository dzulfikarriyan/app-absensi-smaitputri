const Kelas = require('./Kelas');
const Siswa = require('./Siswa');
const Absensi = require('./Absensi');
const Guru = require('./Guru');
const AbsensiGuru = require('./AbsensiGuru');

// Relasi Kelas -> Siswa (One to Many)
Kelas.hasMany(Siswa, {
  foreignKey: 'kelas_id',
  as: 'siswa'
});

Siswa.belongsTo(Kelas, {
  foreignKey: 'kelas_id',
  as: 'kelas'
});

// Relasi Siswa -> Absensi (One to Many)
Siswa.hasMany(Absensi, {
  foreignKey: 'siswa_id',
  as: 'absensi'
});

Absensi.belongsTo(Siswa, {
  foreignKey: 'siswa_id',
  as: 'siswa'
});

// Relasi Guru -> AbsensiGuru (One to Many)
Guru.hasMany(AbsensiGuru, {
  foreignKey: 'guru_id',
  as: 'absensi_guru'
});

AbsensiGuru.belongsTo(Guru, {
  foreignKey: 'guru_id',
  as: 'guru'
});

module.exports = {
  Kelas,
  Siswa,
  Absensi,
  Guru,
  AbsensiGuru
}; 