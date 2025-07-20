import { Link } from 'react-router-dom';
import { 
  ClipboardDocumentListIcon, 
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const DashboardWaliKelas = () => {
  const userName = localStorage.getItem('userName');

  const quickActions = [
    {
      title: 'Input Absensi Siswa',
      description: 'Catat kehadiran siswa hari ini',
      icon: ClipboardDocumentListIcon,
      path: '/absensi-siswa',
      color: 'bg-success-500',
      bgColor: 'bg-success-50',
      textColor: 'text-success-600'
    },
    {
      title: 'Lihat Rekap Siswa',
      description: 'Rekap absensi siswa per periode',
      icon: ChartBarIcon,
      path: '/rekap-siswa',
      color: 'bg-warning-500',
      bgColor: 'bg-warning-50',
      textColor: 'text-warning-600'
    }
  ];

  return (
    <div className="container-responsive py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Wali Kelas</h1>
        <p className="text-gray-600">Selamat datang, {userName}! Kelola absensi siswa Anda.</p>
      </div>

      {/* Welcome Card */}
      <div className="card mb-8">
        <div className="card-body">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-primary-50">
              <UserGroupIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">Selamat Datang, {userName}!</h2>
              <p className="text-gray-600">Anda dapat mengelola absensi siswa di kelas Anda.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="card-header">
            <div className="flex items-center">
              <ClipboardDocumentListIcon className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Input Absensi</h3>
            </div>
          </div>
          <div className="card-body">
            <p className="text-gray-600 mb-4">
              Catat kehadiran siswa untuk hari ini. Anda dapat menandai status kehadiran seperti Hadir, Sakit, Izin, Alpa, atau Terlambat.
            </p>
            <Link to="/absensi-siswa" className="btn-primary">
              Mulai Input Absensi
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="flex items-center">
              <ChartBarIcon className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Rekap Absensi</h3>
            </div>
          </div>
          <div className="card-body">
            <p className="text-gray-600 mb-4">
              Lihat rekap absensi siswa per periode. Anda dapat melihat statistik kehadiran dan mengunduh laporan dalam format Excel.
            </p>
            <Link to="/rekap-siswa" className="btn-primary">
              Lihat Rekap
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">Aktivitas Terbaru</h2>
        </div>
        <div className="card-body">
          <div className="text-center py-8 text-gray-500">
            <ClockIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Belum ada aktivitas terbaru</p>
            <p className="text-sm mt-2">Mulai dengan input absensi siswa hari ini</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWaliKelas; 