# Role-Based Access Control - Aplikasi Absensi

## 🎯 Sistem Akses Berbasis Role

Aplikasi absensi sekarang mendukung sistem akses berbasis role dengan dua jenis pengguna:

### 👨‍💼 **Admin (Administrator)**

- **Username**: `admin`
- **Password**: `smaitputriabhurmtr`
- **Akses**: Semua fitur aplikasi

### 👩‍🏫 **Wali Kelas**

- **Username**: `walikelas`
- **Password**: `smaitputri`
- **Akses**: Hanya fitur absensi siswa

---

## 📋 Perbandingan Akses

| Fitur         | Admin | Wali Kelas            |
| ------------- | ----- | --------------------- |
| Dashboard     | ✅    | ✅ (Dashboard khusus) |
| Kelas         | ✅    | ❌                    |
| Siswa         | ✅    | ❌                    |
| Absensi Siswa | ✅    | ✅                    |
| Rekap Siswa   | ✅    | ✅                    |
| Data Guru     | ✅    | ❌                    |
| Absensi Guru  | ✅    | ❌                    |
| Rekap Guru    | ✅    | ❌                    |

---

## 🚀 Cara Kerja Sistem

### 1. **Login & Autentikasi**

- User memasukkan username dan password
- Sistem memverifikasi kredensial
- Role user disimpan di localStorage
- Redirect ke halaman yang sesuai dengan role

### 2. **Navigation Menu**

- Menu navigasi menyesuaikan dengan role user
- Admin: Semua menu tersedia
- Wali Kelas: Hanya menu absensi siswa

### 3. **Route Protection**

- Setiap route dilindungi berdasarkan role
- Akses ditolak jika user tidak memiliki permission
- Redirect otomatis ke halaman yang sesuai

---

## 🎨 Interface Berbeda

### **Admin Dashboard**

- Akses penuh ke semua fitur
- Statistik lengkap (siswa, guru, absensi)
- Menu navigasi lengkap

### **Wali Kelas Dashboard**

- Fokus pada absensi siswa
- Interface yang lebih sederhana
- Menu terbatas sesuai kebutuhan

---

## 🔧 Implementasi Teknis

### **File yang Diupdate:**

1. **`Login.jsx`**

   - Support multiple user credentials
   - Role-based redirect
   - Enhanced UI dengan informasi akun

2. **`Navbar.jsx`**

   - Dynamic navigation berdasarkan role
   - User info display
   - Logout functionality

3. **`App.jsx`**

   - Route protection dengan role checking
   - Separate routes untuk admin dan wali kelas
   - Default routing berdasarkan role

4. **`DashboardWaliKelas.jsx`** (Baru)
   - Dashboard khusus wali kelas
   - Focus pada absensi siswa
   - Simplified interface

### **Komponen Protection:**

```jsx
// Admin-only routes
<RequireAdmin><Component /></RequireAdmin>

// Wali Kelas-only routes
<RequireWaliKelas><Component /></RequireWaliKelas>

// Shared routes (both roles)
<RequireAuth><Component /></RequireAuth>
```

---

## 🔐 Keamanan

### **Client-Side Protection:**

- Role checking di setiap route
- Menu filtering berdasarkan role
- Redirect otomatis jika akses ditolak

### **Data Storage:**

- User info disimpan di localStorage
- Role dan username tersimpan
- Logout menghapus semua data

### **Session Management:**

- Login status tersimpan
- Auto-redirect jika belum login
- Logout membersihkan session

---

## 📱 Responsive Design

### **Desktop:**

- Full navigation menu
- User info di navbar
- Side-by-side layout

### **Mobile:**

- Hamburger menu
- User info di mobile menu
- Touch-friendly interface

---

## 🎯 User Experience

### **Admin:**

- Akses penuh ke semua fitur
- Dashboard dengan statistik lengkap
- Kemampuan mengelola data guru dan siswa

### **Wali Kelas:**

- Interface yang fokus dan sederhana
- Akses cepat ke absensi siswa
- Dashboard yang relevan dengan tugas

---

## 🔄 Workflow

### **Login Flow:**

1. User membuka aplikasi
2. Masuk ke halaman login
3. Input username dan password
4. Sistem verifikasi kredensial
5. Redirect ke dashboard sesuai role

### **Navigation Flow:**

1. User melihat menu sesuai role
2. Klik menu yang diinginkan
3. Sistem cek permission
4. Akses diberikan atau ditolak

### **Logout Flow:**

1. User klik tombol logout
2. Session dibersihkan
3. Redirect ke halaman login

---

## 🛠️ Maintenance

### **Menambah User Baru:**

1. Update object `users` di `Login.jsx`
2. Tambah role baru jika diperlukan
3. Update navigation logic di `Navbar.jsx`
4. Tambah route protection di `App.jsx`

### **Mengubah Permission:**

1. Update `allowedRoles` di route protection
2. Update navigation items di `Navbar.jsx`
3. Test akses untuk setiap role

---

## 📞 Support

Untuk pertanyaan atau masalah terkait sistem role-based access, silakan hubungi tim development.

---

**🎉 Sistem role-based access control telah berhasil diimplementasikan!**
