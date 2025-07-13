import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/Login';
import DashboardUtama from './pages/DashboardUtama';
import Absensi from './pages/Absensi';
import AbsensiGuru from './pages/absensi-guru/AbsensiGuru';
import DataGuru from './pages/absensi-guru/DataGuru';
import Navbar from './components/Navbar';
import Kelas from './pages/Kelas';
import Siswa from './pages/Siswa';
import Rekap from './pages/Rekap';
import RekapGuru from './pages/absensi-guru/RekapGuru';

// Simple test component
const TestPage = () => (
  <div style={{ 
    padding: '20px', 
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
    minHeight: '100vh'
  }}>
    <h1 style={{ color: '#333', fontSize: '2rem', marginBottom: '1rem' }}>
      🎉 Aplikasi Absensi Siswa
    </h1>
    <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '2rem' }}>
      Selamat datang di sistem absensi siswa SMA IT Putri
    </p>
    <div style={{ 
      backgroundColor: 'white', 
      padding: '2rem', 
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h2 style={{ color: '#2563eb', marginBottom: '1rem' }}>Status Sistem</h2>
      <div style={{ textAlign: 'left' }}>
        <p>✅ React berjalan dengan baik</p>
        <p>✅ Routing berfungsi</p>
        <p>✅ CSS ter-load</p>
        <p>🔄 Menghubungkan ke backend...</p>
      </div>
    </div>
  </div>
);

function RequireAuth({ children }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = '/login';
    }
  }, [isLoggedIn]);
  return isLoggedIn ? children : null;
}

function App() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const location = useLocation();
  const showNavbar = isLoggedIn && location.pathname !== '/login';
  return (
    <div className="min-h-screen bg-gray-50">
      {showNavbar && <Navbar />}
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<RequireAuth><DashboardUtama /></RequireAuth>} />
          <Route path="/absensi-siswa" element={<RequireAuth><Absensi /></RequireAuth>} />
          <Route path="/absensi-guru" element={<RequireAuth><AbsensiGuru /></RequireAuth>} />
          <Route path="/data-guru" element={<RequireAuth><DataGuru /></RequireAuth>} />
          <Route path="/kelas" element={<RequireAuth><Kelas /></RequireAuth>} />
          <Route path="/siswa" element={<RequireAuth><Siswa /></RequireAuth>} />
          <Route path="/rekap" element={<RequireAuth><Rekap /></RequireAuth>} />
          <Route path="/rekap-guru" element={<RequireAuth><RekapGuru /></RequireAuth>} />
          <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App; 