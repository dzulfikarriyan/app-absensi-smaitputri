import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { 
  HomeIcon, 
  UserGroupIcon, 
  UserIcon,
  ClipboardDocumentListIcon, 
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import logo from '../img/logo-sma-putri.png';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Get user role from localStorage
  const userRole = localStorage.getItem('userRole');
  const userName = localStorage.getItem('userName');

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('username');
    window.location.href = '/login';
  };

  // Navigation items based on role and current section
  const getNavItems = () => {
    if (userRole === 'admin') {
      // Check which section admin is currently in
      const isInStudentSection = ['/absensi-siswa', '/rekap-siswa', '/kelas', '/siswa'].includes(location.pathname);
      const isInTeacherSection = ['/absensi-guru', '/rekap-guru', '/data-guru'].includes(location.pathname);
      
      if (isInStudentSection) {
        // Show only student-related menus
        return [
          { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
          { name: 'Kelas', path: '/kelas', icon: UserGroupIcon },
          { name: 'Siswa', path: '/siswa', icon: UserIcon },
          { name: 'Absensi Siswa', path: '/absensi-siswa', icon: ClipboardDocumentListIcon },
          { name: 'Rekap Siswa', path: '/rekap-siswa', icon: ChartBarIcon },
        ];
      } else if (isInTeacherSection) {
        // Show only teacher-related menus
        return [
          { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
          { name: 'Data Guru', path: '/data-guru', icon: UserIcon },
          { name: 'Absensi Guru', path: '/absensi-guru', icon: ClipboardDocumentListIcon },
          { name: 'Rekap Guru', path: '/rekap-guru', icon: ChartBarIcon },
        ];
      } else {
        // Default: show all menus (fallback)
        return [
          { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
          { name: 'Kelas', path: '/kelas', icon: UserGroupIcon },
          { name: 'Siswa', path: '/siswa', icon: UserIcon },
          { name: 'Absensi Siswa', path: '/absensi-siswa', icon: ClipboardDocumentListIcon },
          { name: 'Rekap Siswa', path: '/rekap-siswa', icon: ChartBarIcon },
          { name: 'Data Guru', path: '/data-guru', icon: UserIcon },
          { name: 'Absensi Guru', path: '/absensi-guru', icon: ClipboardDocumentListIcon },
          { name: 'Rekap Guru', path: '/rekap-guru', icon: ChartBarIcon },
        ];
      }
    } else if (userRole === 'walikelas') {
      // Wali kelas can only access student attendance
      return [
        { name: 'Dashboard', path: '/dashboard-walikelas', icon: HomeIcon },
        { name: 'Absensi Siswa', path: '/absensi-siswa', icon: ClipboardDocumentListIcon },
        { name: 'Rekap Siswa', path: '/rekap-siswa', icon: ChartBarIcon },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  // Get section title based on current location
  const getSectionTitle = () => {
    if (userRole === 'admin') {
      const isInStudentSection = ['/absensi-siswa', '/rekap-siswa', '/kelas', '/siswa'].includes(location.pathname);
      const isInTeacherSection = ['/absensi-guru', '/rekap-guru', '/data-guru'].includes(location.pathname);
      
      if (isInStudentSection) {
        return 'Absensi Siswa';
      } else if (isInTeacherSection) {
        return 'Absensi Guru';
      }
    }
    return userRole === 'admin' ? 'Absensi Siswa & Guru' : 'Absensi Siswa';
  };

  return (
    <nav className="bg-white shadow-soft border-b border-gray-100 sticky top-0 z-50">
      <div className="container-responsive">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <img 
                src={logo} 
                alt="Logo SMA IT Putri" 
                className="h-10 w-auto"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                {getSectionTitle()}
              </h1>
            </div>
          </div>
          
          {/* User Info */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{userName}</span>
              <span className="mx-2">•</span>
              <span className="capitalize">{userRole}</span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {item.name}
                </Link>
              );
            })}
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="nav-link text-danger-600 hover:text-danger-700"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            {/* Mobile Header with Logo */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <img 
                  src={logo} 
                  alt="Logo SMA IT Putri" 
                  className="h-8 w-auto"
                />
                <div className="text-sm text-gray-600">
                  <div className="font-medium">{userName}</div>
                  <div className="capitalize text-gray-500">{userRole}</div>
                </div>
              </div>
            </div>
            
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`nav-link w-full justify-start ${isActive ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
              
              {/* Logout Button Mobile */}
              <button
                onClick={handleLogout}
                className="nav-link w-full justify-start text-danger-600 hover:text-danger-700"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 