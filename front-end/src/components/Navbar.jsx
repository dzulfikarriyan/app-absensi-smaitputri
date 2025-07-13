import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UserGroupIcon, 
  UserIcon,
  ClipboardDocumentListIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const location = useLocation();

  // Deteksi jika di halaman guru
  const isGuru = location.pathname.includes('guru');

  const navItems = isGuru
    ? [
        { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
        { name: 'Guru', path: '/data-guru', icon: UserIcon },
        { name: 'Absensi', path: '/absensi-guru', icon: ClipboardDocumentListIcon },
        { name: 'Rekap', path: '/rekap-guru', icon: ChartBarIcon },
      ]
    : [
        { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Kelas', path: '/kelas', icon: UserGroupIcon },
    { name: 'Siswa', path: '/siswa', icon: UserIcon },
        { name: 'Absensi', path: '/absensi-siswa', icon: ClipboardDocumentListIcon },
    { name: 'Rekap', path: '/rekap', icon: ChartBarIcon },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-primary-600">
                Absensi Siswa
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 