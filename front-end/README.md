# Frontend Aplikasi Absensi SMA IT Putri

## 📋 Overview

Frontend aplikasi absensi yang dibangun dengan **React 18**, **Vite**, dan **Tailwind CSS**. Aplikasi ini mendukung sistem role-based access control dengan dua role utama: **Admin** dan **Wali Kelas**, dengan navigasi yang dinamis dan responsif.

---

## 🏗️ Arsitektur & Teknologi

### **Tech Stack**

- **React 18** - UI Framework
- **Vite** - Build tool & development server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Icon library
- **Axios** - HTTP client untuk API calls

### **Struktur Folder**

```
front-end/
├── public/                    # Static assets
├── src/
│   ├── components/            # Reusable components
│   │   ├── Navbar.jsx         # Navigation component
│   │   └── LoadingSpinner.jsx # Loading indicator
│   ├── pages/                 # Page components
│   │   ├── Login.jsx          # Login page
│   │   ├── DashboardUtama.jsx # Admin dashboard
│   │   ├── DashboardWaliKelas.jsx # Wali kelas dashboard
│   │   ├── Kelas.jsx          # Class management
│   │   ├── Siswa.jsx          # Student management
│   │   ├── Absensi.jsx        # Student attendance
│   │   ├── Rekap.jsx          # Student attendance report
│   │   └── absensi-guru/      # Teacher features
│   │       ├── DataGuru.jsx   # Teacher data management
│   │       ├── AbsensiGuru.jsx # Teacher attendance
│   │       └── RekapGuru.jsx  # Teacher attendance report
│   ├── services/              # API services
│   │   └── api.js             # Axios configuration & API calls
│   ├── utils/                 # Utility functions
│   │   └── dateUtils.js       # Date formatting utilities
│   ├── App.jsx                # Main app component & routing
│   ├── main.jsx               # App entry point
│   └── style.css              # Global styles & Tailwind imports
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
├── vite.config.js             # Vite configuration
├── package.json               # Dependencies & scripts
└── README.md                  # This file
```

---

## 🔐 Sistem Role-Based Access Control

### **Role Types**

1. **Admin** - Akses penuh ke semua fitur
2. **Wali Kelas** - Akses terbatas hanya untuk absensi siswa

### **Login Credentials**

```javascript
// Admin
username: "admin";
password: "admin123";

// Wali Kelas
username: "walikelas";
password: "walikelas123";
```

### **Access Matrix**

| Fitur         | Admin | Wali Kelas |
| ------------- | ----- | ---------- |
| Dashboard     | ✅    | ✅         |
| Kelas         | ✅    | ❌         |
| Siswa         | ✅    | ❌         |
| Absensi Siswa | ✅    | ✅         |
| Rekap Siswa   | ✅    | ✅         |
| Data Guru     | ✅    | ❌         |
| Absensi Guru  | ✅    | ❌         |
| Rekap Guru    | ✅    | ❌         |

---

## 🧭 Sistem Navigasi

### **Admin Navigation Flow**

#### **1. Dashboard Utama (No Navbar)**

- Tampilan clean dengan dua card utama
- **Absensi Siswa Card** (Blue theme)
- **Absensi Guru Card** (Green theme)
- Tidak ada navbar untuk fokus pada pilihan

#### **2. Student Section Navigation**

Ketika admin klik "Absensi Siswa", navbar menampilkan:

- Dashboard
- Kelas
- Siswa
- Absensi Siswa
- Rekap Siswa

#### **3. Teacher Section Navigation**

Ketika admin klik "Absensi Guru", navbar menampilkan:

- Dashboard
- Data Guru
- Absensi Guru
- Rekap Guru

### **Wali Kelas Navigation**

- Dashboard Wali Kelas
- Absensi Siswa
- Rekap Siswa

---

## 🎨 Design System

### **Color Palette**

```javascript
// Primary Colors
primary: {
  50: '#eff6ff',
  500: '#3b82f6',
  600: '#2563eb',
  700: '#1d4ed8',
  800: '#1e40af'
}

// Status Colors
success: { 500: '#22c55e', 600: '#16a34a' }
danger: { 500: '#ef4444', 600: '#dc2626' }
warning: { 500: '#f59e0b', 600: '#d97706' }
```

### **Component Classes**

```css
/* Buttons */
.btn-primary    /* Blue primary button */
/* Blue primary button */
.btn-secondary  /* Gray secondary button */
.btn-success    /* Green success button */
.btn-danger     /* Red danger button */

/* Cards */
.card           /* Main container */
.card-header    /* Card title section */
.card-body      /* Card content section */

/* Forms */
.input-field    /* Text input styling */
.form-group     /* Form field container */

/* Tables */
.table          /* Main table styling */
.table-container /* Responsive table wrapper */

/* Status Badges */
.status-badge   /* Base status styling */
.status-hadir   /* Present status */
.status-sakit   /* Sick status */
.status-izin    /* Permission status */
.status-alpha; /* Absent status */
```

---

## 📱 Responsive Design

### **Breakpoints**

- **Mobile**: `< 768px`
- **Tablet**: `768px - 1024px`
- **Desktop**: `> 1024px`

### **Responsive Utilities**

```jsx
// Grid responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// Text responsive
<h1 className="text-2xl md:text-3xl lg:text-4xl">

// Spacing responsive
<div className="p-4 md:p-6 lg:p-8">
```

---

## 🔧 Setup & Installation

### **Prerequisites**

- Node.js (v16 or higher)
- npm or yarn

### **Installation Steps**

```bash
# Navigate to frontend directory
cd front-end

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### **Environment Configuration**

Create `.env` file in `front-end/` directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## 🚀 Fitur Utama

### **1. Authentication & Authorization**

- Login dengan username/password
- Role-based access control
- Session management dengan localStorage
- Automatic redirect berdasarkan role

### **2. Student Management**

- **Kelas**: CRUD operasi untuk data kelas
- **Siswa**: CRUD operasi untuk data siswa
- **Absensi**: Input absensi siswa per kelas
- **Rekap**: Laporan absensi dengan filter dan export

### **3. Teacher Management**

- **Data Guru**: CRUD operasi untuk data guru
- **Absensi Guru**: Input absensi guru dengan batch input
- **Rekap Guru**: Laporan absensi guru dengan Excel export

### **4. Advanced Features**

- **Excel Export**: Download laporan dalam format Excel
- **Batch Input**: Input multiple absensi sekaligus
- **Search & Filter**: Pencarian dan filter data
- **Responsive Tables**: Tabel yang adaptif di semua device

---

## 📊 State Management

### **Local Storage**

```javascript
// User session data
localStorage.setItem("isLoggedIn", "true");
localStorage.setItem("userRole", "admin");
localStorage.setItem("userName", "Admin Name");
localStorage.setItem("username", "admin");
```

### **Component State**

- Menggunakan React hooks (`useState`, `useEffect`)
- Form state management
- Loading states
- Error handling

---

## 🔌 API Integration

### **API Service Structure**

```javascript
// services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use((config) => {
  // Add auth headers if needed
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    return Promise.reject(error);
  }
);
```

### **API Endpoints**

```javascript
// Student endpoints
GET    /kelas              // Get all classes
POST   /kelas              // Create class
PUT    /kelas/:id          // Update class
DELETE /kelas/:id          // Delete class

GET    /siswa              // Get all students
POST   /siswa              // Create student
PUT    /siswa/:id          // Update student
DELETE /siswa/:id          // Delete student

GET    /absensi            // Get attendance data
POST   /absensi            // Create attendance
GET    /rekap              // Get attendance report

// Teacher endpoints
GET    /guru               // Get all teachers
POST   /guru               // Create teacher
PUT    /guru/:id           // Update teacher
DELETE /guru/:id           // Delete teacher

GET    /absensi-guru       // Get teacher attendance
POST   /absensi-guru       // Create teacher attendance
GET    /rekap-guru         // Get teacher report
GET    /rekap-guru/excel   // Download Excel report
```

---

## 🎯 Customization Guide

### **Adding New Pages**

1. Create new component in `src/pages/`
2. Add route in `App.jsx`
3. Update navigation in `Navbar.jsx` if needed
4. Add role-based protection

### **Modifying Styles**

1. **Global styles**: Edit `src/style.css`
2. **Component styles**: Use Tailwind classes directly
3. **Theme colors**: Modify `tailwind.config.js`

### **Adding New Features**

1. Create component in appropriate folder
2. Add API service if needed
3. Update routing and navigation
4. Test with different roles

---

## 🐛 Troubleshooting

### **Common Issues**

#### **1. Styling Not Applied**

```bash
# Check Tailwind installation
npm install -D tailwindcss postcss autoprefixer

# Verify config files exist
tailwind.config.js
postcss.config.js
```

#### **2. API Connection Issues**

- Check backend server is running
- Verify `VITE_API_BASE_URL` in `.env`
- Check CORS configuration in backend

#### **3. Navigation Issues**

- Clear localStorage: `localStorage.clear()`
- Check role permissions in `App.jsx`
- Verify route protection logic

#### **4. Build Issues**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Development Guidelines

### **Code Style**

- Use functional components with hooks
- Follow React best practices
- Use meaningful component and variable names
- Add comments for complex logic

### **Performance**

- Use React.memo for expensive components
- Implement proper loading states
- Optimize re-renders with useCallback/useMemo
- Lazy load components when possible

### **Security**

- Validate user input
- Sanitize data before rendering
- Implement proper error boundaries
- Use HTTPS in production

---

## 🚀 Deployment

### **Build for Production**

```bash
npm run build
```

### **Deploy Options**

- **Vercel**: Connect GitHub repository
- **Netlify**: Drag and drop `dist/` folder
- **Static Hosting**: Upload `dist/` contents

### **Environment Variables**

Set production environment variables:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

---

## 📞 Support & Maintenance

### **Logging**

- Use browser console for debugging
- Implement error tracking (Sentry, LogRocket)
- Monitor API response times

### **Updates**

- Keep dependencies updated
- Test thoroughly after updates
- Maintain backward compatibility

---

## 📄 License

This project is part of the SMA IT Putri Attendance System.

---

**Happy Coding! 🎉**
