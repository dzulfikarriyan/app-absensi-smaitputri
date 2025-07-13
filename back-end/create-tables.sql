-- Script untuk membuat tabel guru dan absensi_guru
-- Jalankan script ini di MySQL untuk membuat tabel yang diperlukan

USE absensi_siswa;

-- Buat tabel guru jika belum ada
CREATE TABLE IF NOT EXISTS guru (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Buat tabel absensi_guru jika belum ada
CREATE TABLE IF NOT EXISTS absensi_guru (
  id INT AUTO_INCREMENT PRIMARY KEY,
  guru_id INT NOT NULL,
  tanggal DATE NOT NULL,
  status ENUM('hadir', 'sakit', 'izin', 'alpa', 'terlambat') NOT NULL,
  keterangan VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (guru_id) REFERENCES guru(id) ON DELETE CASCADE,
  UNIQUE KEY unique_guru_tanggal (guru_id, tanggal)
);

-- Masukkan data guru contoh
INSERT IGNORE INTO guru (nama) VALUES 
('Ahmad Supriadi'),
('Siti Nurhaliza'),
('Budi Santoso'),
('Dewi Sartika'),
('Rudi Hermawan');

-- Masukkan data absensi guru contoh untuk hari ini
INSERT IGNORE INTO absensi_guru (guru_id, tanggal, status, keterangan) 
SELECT 
  g.id, 
  CURDATE(), 
  'hadir', 
  'Hadir tepat waktu'
FROM guru g
WHERE NOT EXISTS (
  SELECT 1 FROM absensi_guru ag 
  WHERE ag.guru_id = g.id AND ag.tanggal = CURDATE()
);

-- Tampilkan hasil
SELECT 'Tabel guru:' as info;
SELECT * FROM guru;

SELECT 'Tabel absensi_guru:' as info;
SELECT 
  ag.id,
  g.nama as nama_guru,
  ag.tanggal,
  ag.status,
  ag.keterangan
FROM absensi_guru ag
JOIN guru g ON ag.guru_id = g.id
ORDER BY ag.tanggal DESC, g.nama; 