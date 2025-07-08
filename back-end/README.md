# Backend API Absensi Siswa

Backend API untuk aplikasi absensi siswa menggunakan Node.js, Express.js, dan MySQL.

## 🚀 Instalasi

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Setup Database MySQL:**

   - Buat database dengan nama `absensi_siswa`
   - Update konfigurasi di `config/database.js` jika diperlukan

3. **Jalankan server:**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📋 Endpoints API

### Kelas

- `GET /api/kelas` - Get semua kelas
- `GET /api/kelas/:id` - Get kelas by ID
- `POST /api/kelas` - Create kelas baru
- `PUT /api/kelas/:id` - Update kelas
- `DELETE /api/kelas/:id` - Delete kelas

### Siswa

- `GET /api/siswa` - Get semua siswa
- `GET /api/siswa/kelas/:kelas_id` - Get siswa by kelas
- `GET /api/siswa/:id` - Get siswa by ID
- `POST /api/siswa` - Create siswa baru
- `PUT /api/siswa/:id` - Update siswa
- `DELETE /api/siswa/:id` - Delete siswa

### Absensi

- `POST /api/absensi` - Input absensi satu siswa
- `POST /api/absensi/batch` - Input absensi multiple siswa
- `GET /api/absensi/:tanggal/:kelas_id` - Get absensi by tanggal dan kelas
- `GET /api/absensi/rekap` - Get rekap absensi
- `GET /api/absensi/rekap/kelas` - Get rekap absensi per kelas

## 📝 Contoh Request

### Create Kelas

```json
POST /api/kelas
{
  "nama_kelas": "X-A"
}
```

### Create Siswa

```json
POST /api/siswa
{
  "nama": "John Doe",
  "kelas_id": 1
}
```

### Input Absensi

```json
POST /api/absensi
{
  "siswa_id": 1,
  "tanggal": "2024-01-15",
  "status": "hadir",
  "keterangan": "Sakit flu"
}
```

### Input Absensi Batch

```json
POST /api/absensi/batch
{
  "kelas_id": 1,
  "tanggal": "2024-01-15",
  "absensi_data": [
    {
      "siswa_id": 1,
      "status": "hadir",
      "keterangan": ""
    },
    {
      "siswa_id": 2,
      "status": "sakit",
      "keterangan": "Sakit flu"
    }
  ]
}
```

## 🗄️ Struktur Database

### Tabel Kelas

- `id` (INT, Primary Key, Auto Increment)
- `nama_kelas` (VARCHAR(100), Unique)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tabel Siswa

- `id` (INT, Primary Key, Auto Increment)
- `nama` (VARCHAR(100))
- `kelas_id` (INT, Foreign Key ke tabel Kelas)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tabel Absensi

- `id` (INT, Primary Key, Auto Increment)
- `siswa_id` (INT, Foreign Key ke tabel Siswa)
- `tanggal` (DATE)
- `status` (ENUM: 'sakit', 'izin', 'alpa', 'terlambat')
- `keterangan` (VARCHAR(255))
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## 🔧 Konfigurasi

Update file `config/database.js` sesuai dengan konfigurasi MySQL Anda:

```javascript
const sequelize = new Sequelize("absensi_siswa", "username", "password", {
  host: "localhost",
  dialect: "mysql",
});
```

## 📊 Status Response

Semua response menggunakan format:

```json
{
  "success": true/false,
  "message": "Pesan response",
  "data": {} // Data jika ada
}
```
