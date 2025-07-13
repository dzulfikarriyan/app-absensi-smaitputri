import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/Login';
import DashboardUtama from './pages/DashboardUtama';
import DashboardWaliKelas from './pages/DashboardWaliKelas';
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

// Role-based route protection
function RequireAuth({ children, allowedRoles = ['admin', 'walikelas'] }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');
  
  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = '/login';
    }
  }, [isLoggedIn]);
  
  if (!isLoggedIn) {
    return null;
  }
  
  // Check if user has required role
  if (!allowedRoles.includes(userRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Akses Ditolak</h1>
          <p className="text-gray-600 mb-4">Anda tidak memiliki akses ke halaman ini.</p>
          <button 
            onClick={() => window.history.back()} 
            className="btn-primary"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }
  
  return children;
}

// Admin-only route protection
function RequireAdmin({ children }) {
  return <RequireAuth allowedRoles={['admin']}>{children}</RequireAuth>;
}

// Wali Kelas-only route protection
function RequireWaliKelas({ children }) {
  return <RequireAuth allowedRoles={['walikelas']}>{children}</RequireAuth>;
}

function App() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');
  const location = useLocation();
  
  // Don't show navbar on login page or admin dashboard
  const showNavbar = isLoggedIn && 
    location.pathname !== '/login' && 
    !(userRole === 'admin' && location.pathname === '/dashboard');
  
  // Determine default route based on role
  const getDefaultRoute = () => {
    if (!isLoggedIn) return '/login';
    if (userRole === 'admin') return '/dashboard';
    if (userRole === 'walikelas') return '/dashboard-walikelas';
    return '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavbar && <Navbar />}
      <main className={showNavbar ? "container-responsive py-8" : ""}>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route path="/dashboard" element={<RequireAdmin><DashboardUtama /></RequireAdmin>} />
          <Route path="/kelas" element={<RequireAdmin><Kelas /></RequireAdmin>} />
          <Route path="/siswa" element={<RequireAdmin><Siswa /></RequireAdmin>} />
          <Route path="/data-guru" element={<RequireAdmin><DataGuru /></RequireAdmin>} />
          <Route path="/absensi-guru" element={<RequireAdmin><AbsensiGuru /></RequireAdmin>} />
          <Route path="/rekap-guru" element={<RequireAdmin><RekapGuru /></RequireAdmin>} />
          
          {/* Wali Kelas Routes */}
          <Route path="/dashboard-walikelas" element={<RequireWaliKelas><DashboardWaliKelas /></RequireWaliKelas>} />
          
          {/* Shared Routes (Admin & Wali Kelas) */}
          <Route path="/absensi-siswa" element={<RequireAuth><Absensi /></RequireAuth>} />
          <Route path="/rekap" element={<RequireAuth><Rekap /></RequireAuth>} />
          
          {/* Default Routes */}
          <Route path="/" element={<Navigate to={getDefaultRoute()} />} />
          <Route path="*" element={<Navigate to={getDefaultRoute()} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App; 