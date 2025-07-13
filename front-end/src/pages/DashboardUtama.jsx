import { useNavigate } from 'react-router-dom';

const DashboardUtama = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Dashboard Admin
        </h1>
        <p className="text-lg text-gray-600 max-w-md">
          Pilih bagian yang ingin Anda kelola
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
        {/* Absensi Siswa Card */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Absensi Siswa</h3>
            <p className="text-gray-600 mb-6">
              Kelola data kelas, siswa, dan absensi siswa
            </p>
            <button 
              onClick={() => navigate('/absensi-siswa')} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Masuk ke Absensi Siswa
            </button>
          </div>
        </div>

        {/* Absensi Guru Card */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Absensi Guru</h3>
            <p className="text-gray-600 mb-6">
              Kelola data guru dan absensi guru
            </p>
            <button 
              onClick={() => navigate('/absensi-guru')} 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Masuk ke Absensi Guru
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          Setelah memilih bagian, Anda akan diarahkan ke menu yang sesuai
        </p>
      </div>
    </div>
  );
};

export default DashboardUtama; 