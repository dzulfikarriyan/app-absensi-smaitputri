import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserGroupIcon, 
  ClipboardDocumentListIcon, 
  ChartBarIcon,
  PlusIcon 
} from '@heroicons/react/24/outline';
import { kelasAPI, siswaAPI, absensiAPI } from '../services/api';
import { getToday } from '../utils/dateUtils';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalKelas: 0,
    totalSiswa: 0,
    absensiHariIni: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch data secara parallel
      const [kelasRes, siswaRes] = await Promise.all([
        kelasAPI.getAll(),
        siswaAPI.getAll()
      ]);

      // Hitung absensi hari ini
      let absensiHariIni = 0;
      if (kelasRes.data.success && kelasRes.data.data.length > 0) {
        const kelasIds = kelasRes.data.data.map(k => k.id);
        for (const kelasId of kelasIds) {
          try {
            const absensiRes = await absensiAPI.getByTanggalKelas(getToday(), kelasId);
            if (absensiRes.data.success) {
              absensiHariIni += absensiRes.data.data.length;
            }
          } catch (error) {
            // Ignore error jika tidak ada absensi
          }
        }
      }

      setStats({
        totalKelas: kelasRes.data.success ? kelasRes.data.data.length : 0,
        totalSiswa: siswaRes.data.success ? siswaRes.data.data.length : 0,
        absensiHariIni
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Tambah Kelas',
      description: 'Buat kelas baru',
      icon: PlusIcon,
      path: '/kelas',
      color: 'bg-blue-500'
    },
    {
      title: 'Input Absensi',
      description: 'Catat kehadiran siswa',
      icon: ClipboardDocumentListIcon,
      path: '/absensi',
      color: 'bg-green-500'
    },
    {
      title: 'Lihat Rekap',
      description: 'Rekap absensi siswa',
      icon: ChartBarIcon,
      path: '/rekap',
      color: 'bg-purple-500'
    }
  ];

  if (loading) {
    return <LoadingSpinner size="lg" text="Memuat dashboard..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Selamat datang di sistem absensi siswa</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <UserGroupIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Kelas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalKelas}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <UserGroupIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Siswa</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSiswa}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <ClipboardDocumentListIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Absensi Hari Ini</p>
              <p className="text-2xl font-bold text-gray-900">{stats.absensiHariIni}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                to={action.path}
                className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${action.color} bg-opacity-10`}>
                    <Icon className={`h-8 w-8 ${action.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{action.title}</h3>
                    <p className="text-gray-600">{action.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h2>
        <div className="text-center py-8 text-gray-500">
          <p>Belum ada aktivitas terbaru</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 