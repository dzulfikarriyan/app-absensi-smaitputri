# Fitur Download Excel Rekap Absensi Guru

## Deskripsi

Fitur ini memungkinkan pengguna untuk mengunduh laporan rekap absensi guru dalam format Excel (.xlsx) dengan data yang sudah difilter sesuai kriteria yang dipilih.

## Cara Penggunaan

### 1. Di Frontend (RekapGuru.jsx)

1. Buka halaman "Rekap Absensi Guru"
2. Pilih filter yang diinginkan:
   - **Guru**: Pilih guru tertentu atau "Semua Guru"
   - **Tanggal Mulai**: Pilih tanggal awal periode
   - **Tanggal Akhir**: Pilih tanggal akhir periode
3. Klik tombol "Tampilkan" untuk melihat data
4. Klik tombol "Download Excel" untuk mengunduh file

### 2. Validasi

- Tanggal mulai dan tanggal akhir harus diisi
- Tombol download akan disabled jika filter tidak lengkap
- Loading state akan ditampilkan saat proses download

## Format File Excel

### Struktur Data

File Excel yang diunduh akan berisi:

| Kolom      | Deskripsi                                          |
| ---------- | -------------------------------------------------- |
| No         | Nomor urut                                         |
| Tanggal    | Tanggal absensi                                    |
| Nama Guru  | Nama guru                                          |
| Status     | Status kehadiran (Hadir/Sakit/Izin/Alpa/Terlambat) |
| Keterangan | Keterangan tambahan                                |

### Ringkasan Statistik

Di bagian bawah file akan ditampilkan:

- Total Hari
- Total Hadir
- Total Sakit
- Total Izin
- Total Alpa
- Total Terlambat

## API Endpoint

### Backend Route

```
GET /api/absensi-guru/download-excel
```

### Parameter Query

- `guru_id` (optional): ID guru tertentu
- `start_date` (required): Tanggal mulai (format: YYYY-MM-DD)
- `end_date` (required): Tanggal akhir (format: YYYY-MM-DD)

### Response

- **Content-Type**: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- **Content-Disposition**: `attachment; filename="rekap_absensi_guru_TIMESTAMP.xlsx"`
- **Body**: File Excel binary data

## Contoh Penggunaan

### Frontend API Call

```javascript
const params = {
  guru_id: "1", // optional
  start_date: "2024-01-01",
  end_date: "2024-12-31",
};

const response = await absensiGuruAPI.downloadExcel(params);
```

### Backend Controller

```javascript
const downloadRekapExcel = async (req, res) => {
  // Generate Excel file using ExcelJS
  // Set proper headers for file download
  // Return file as response
};
```

## Dependencies

### Backend

- `exceljs`: Untuk generate file Excel
- `sequelize`: Untuk query database
- `express`: Untuk routing

### Frontend

- `axios`: Untuk HTTP requests dengan `responseType: 'blob'`

## Error Handling

### Frontend

- Validasi input sebelum request
- Loading state management
- Error alert jika download gagal
- File download menggunakan Blob dan URL.createObjectURL

### Backend

- Validasi parameter query
- Try-catch untuk error handling
- Proper HTTP status codes
- Error response dengan pesan yang informatif

## File Naming

File Excel akan diberi nama dengan format:

```
rekap_absensi_guru_YYYY-MM-DDTHH-MM-SS.xlsx
```

Contoh: `rekap_absensi_guru_2024-01-15T14-30-25.xlsx`
