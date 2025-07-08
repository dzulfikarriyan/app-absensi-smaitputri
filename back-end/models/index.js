const Kelas = require('./Kelas');
const Siswa = require('./Siswa');
const Absensi = require('./Absensi');

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

module.exports = {
  Kelas,
  Siswa,
  Absensi
}; 