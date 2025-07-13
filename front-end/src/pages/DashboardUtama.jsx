import { useNavigate } from 'react-router-dom';

const DashboardUtama = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">Dashboard Utama</h1>
      <div className="flex flex-col gap-6 w-full max-w-xs">
        <button onClick={() => navigate('/absensi-siswa')} className="btn-primary py-4 text-lg">Absensi Siswa</button>
        <button onClick={() => navigate('/absensi-guru')} className="btn-secondary py-4 text-lg">Absensi Guru</button>
      </div>
    </div>
  );
};

export default DashboardUtama; 