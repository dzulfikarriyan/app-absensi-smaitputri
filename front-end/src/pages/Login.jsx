import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import logo from '../img/logo-sma-putri.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Define user credentials and roles
    const users = {
      admin: {
        password: 'smaitputriabhurmtr',
        role: 'admin',
        name: 'Administrator'
      },
      walikelas: {
        password: 'smaitputri',
        role: 'walikelas',
        name: 'Wali Kelas'
      }
    };

    const user = users[username];
    
    if (user && user.password === password) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('username', username);
      setError('');
      
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/dashboard');
      } else if (user.role === 'walikelas') {
        navigate('/absensi-siswa');
      }
    } else {
      setError('Username atau password salah!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-soft w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src={logo} 
              alt="Logo SMA IT Putri" 
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Login Aplikasi Absensi</h1>
          <p className="text-gray-600"><strong>SMA IT Putri Abu Huraiah Mataram</strong></p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              className="input-field w-full" 
              placeholder="Masukkan username"
              required 
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="input-field w-full" 
              placeholder="Masukkan password"
              required 
            />
          </div>
          {error && (
            <div className="alert alert-error mb-4">
              {error}
            </div>
          )}
          <button type="submit" className="btn-primary w-full">
            Login
          </button>
        </form>

        {/* <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Akun Tersedia:</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <UserGroupIcon className="h-4 w-4 mr-2 text-primary-600" />
              <span><strong>Admin:</strong> admin / smaitputriabhurmtr</span>
            </div>
            <div className="flex items-center">
              <UserGroupIcon className="h-4 w-4 mr-2 text-success-600" />
              <span><strong>Wali Kelas:</strong> walikelas / smaitputri</span>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Login; 