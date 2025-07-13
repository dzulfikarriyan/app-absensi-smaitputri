import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserGroupIcon, 
  ClipboardDocumentListIcon, 
  ChartBarIcon,
  PlusIcon,
  AcademicCapIcon,
  ClockIcon
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
      description: 'Buat kelas baru untuk siswa',
      icon: PlusIcon,
      path: '/kelas',
      color: 'bg-primary-500',
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-600'
    },
    {
      title: 'Input Absensi',
      description: 'Catat kehadiran siswa hari ini',
      icon: ClipboardDocumentListIcon,
      path: '/absensi',
      color: 'bg-success-500',
      bgColor: 'bg-success-50',
      textColor: 'text-success-600'
    },
    {
      title: 'Lihat Rekap',
      description: 'Rekap absensi siswa per periode',
      icon: ChartBarIcon,
      path: '/rekap',
      color: 'bg-warning-500',
      bgColor: 'bg-warning-50',
      textColor: 'text-warning-600'
    }
  ];

  if (loading) {
    return (
      <div className="container-responsive py-8">
        <LoadingSpinner size="lg" text="Memuat dashboard..." />
      </div>
    );
  }

  return (
    <div className="container-responsive py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Selamat datang di sistem absensi siswa</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-primary-50">
                <AcademicCapIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Kelas</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalKelas}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-success-50">
                <UserGroupIcon className="h-8 w-8 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Siswa</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalSiswa}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-warning-50">
                <ClockIcon className="h-8 w-8 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Absensi Hari Ini</p>
                <p className="text-3xl font-bold text-gray-900">{stats.absensiHariIni}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                to={action.path}
                className="card hover:shadow-medium transition-all duration-200 cursor-pointer group"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-xl ${action.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className={`h-8 w-8 ${action.textColor}`} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                        {action.title}
                      </h3>
                      <p className="text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">Aktivitas Terbaru</h2>
        </div>
        <div className="card-body">
          <div className="text-center py-8 text-gray-500">
            <ClipboardDocumentListIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Belum ada aktivitas terbaru</p>
            <p className="text-sm mt-2">Mulai dengan menambahkan kelas atau input absensi</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 