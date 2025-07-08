import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Kelas from './pages/Kelas';
import Siswa from './pages/Siswa';
import Absensi from './pages/Absensi';
import Rekap from './pages/Rekap';

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

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/kelas" element={<Kelas />} />
          <Route path="/siswa" element={<Siswa />} />
          <Route path="/absensi" element={<Absensi />} />
          <Route path="/rekap" element={<Rekap />} />
        </Routes>
      </main>
    </div>
  );
}

export default App; 