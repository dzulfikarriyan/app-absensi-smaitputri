import { useState, useEffect } from 'react';
import { 
  CalendarIcon,
  UserGroupIcon,
  ChartBarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { kelasAPI, absensiAPI } from '../services/api';
import { getToday, formatDate } from '../utils/dateUtils';
import LoadingSpinner from '../components/LoadingSpinner';

const Rekap = () => {
  const [kelas, setKelas] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(getToday());
  const [rekapData, setRekapData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchKelas();
  }, []);

  useEffect(() => {
    if (selectedKelas && startDate && endDate) {
      fetchRekap();
    }
  }, [selectedKelas, startDate, endDate]);

  const fetchKelas = async () => {
    try {
      const response = await kelasAPI.getAll();
      if (response.data.success) {
        setKelas(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching kelas:', error);
      alert('Gagal mengambil data kelas');
    }
  };

  const fetchRekap = async () => {
    try {
      setLoading(true);
      const response = await absensiAPI.getRekapKelas({
        kelas_id: selectedKelas,
        start_date: startDate,
        end_date: endDate
      });
      
      if (response.data.success) {
        setRekapData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching rekap:', error);
      alert('Gagal mengambil data rekap');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'hadir':
        return 'bg-green-100 text-green-800';
      case 'sakit':
        return 'bg-yellow-100 text-yellow-800';
      case 'izin':
        return 'bg-blue-100 text-blue-800';
      case 'alpa':
        return 'bg-red-100 text-red-800';
      case 'terlambat':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'hadir':
        return 'Hadir';
      case 'sakit':
        return 'Sakit';
      case 'izin':
        return 'Izin';
      case 'alpa':
        return 'Alpa';
      case 'terlambat':
        return 'Terlambat';
      default:
        return status;
    }
  };

  const calculateTotalDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  const calculateAttendancePercentage = (hadir, total) => {
    if (total === 0) return 0;
    return Math.round((hadir / total) * 100);
  };

  const handleDownloadExcel = async () => {
    try {
      if (!selectedKelas || !startDate || !endDate) {
        alert('Pilih kelas dan tanggal terlebih dahulu!');
        return;
      }
      const params = new URLSearchParams();
      if (selectedKelas) params.append('kelas_id', selectedKelas);
      if (startDate && startDate !== 'Invalid date') params.append('start_date', startDate);
      if (endDate && endDate !== 'Invalid date') params.append('end_date', endDate);
      const url = `/api/absensi/rekap/excel?${params.toString()}`;
      console.log('Download Excel URL:', url);
      const res = await fetch(url);
      if (res.headers.get('content-type')?.includes('application/json')) {
        const err = await res.json();
        alert(err.message || 'Gagal download rekap Excel');
        return;
      }
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'rekap-absensi.xlsx';
      link.click();
    } catch (e) {
      alert('Gagal download rekap Excel');
    }
  };

  const handleDownloadExcelAll = async () => {
    try {
      const url = `/api/absensi/rekap/excel-all`;
      const res = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'rekap-absensi-semua.xlsx';
      link.click();
    } catch (e) {
      alert('Gagal download semua rekap Excel');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-2 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Rekap Absensi</h1>
        <p className="text-gray-500 mt-1 text-base">Lihat rekap kehadiran siswa per periode</p>
      </div>

      {/* Filter */}
      <div className="card mb-4 p-4 shadow-sm border border-gray-100 bg-white rounded-lg">
        <div className="flex items-center mb-3">
          <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Filter Data</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Pilih Kelas
            </label>
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="input-field py-2 px-3 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-200 w-full"
            >
              <option value="">Pilih Kelas</option>
              {kelas.map(k => (
                <option key={k.id} value={k.id}>
                  {k.nama_kelas}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Tanggal Mulai
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-field pl-8 py-2 px-3 text-sm border border-gray-300 rounded w-full focus:ring-2 focus:ring-primary-200"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Tanggal Akhir
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input-field pl-8 py-2 px-3 text-sm border border-gray-300 rounded w-full focus:ring-2 focus:ring-primary-200"
              />
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchRekap}
              disabled={!selectedKelas || !startDate || !endDate}
              className="btn-primary w-full py-2 rounded font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tampilkan Rekap
            </button>
          </div>
        </div>
        {selectedKelas && startDate && endDate && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Periode:</strong> {formatDate(startDate)} - {formatDate(endDate)} 
              ({calculateTotalDays()} hari)
            </p>
            <p className="text-xs text-blue-800">
              <strong>Kelas:</strong> {kelas.find(k => k.id == selectedKelas)?.nama_kelas}
            </p>
          </div>
        )}
      </div>

      {/* Tabel Rekap */}
      {selectedKelas && startDate && endDate && (
        <div className="card p-4 shadow-sm border border-gray-100 bg-white rounded-lg">
          <div className="mb-3 flex flex-wrap gap-2 justify-between items-center">
            <div className="flex gap-2">
              <button onClick={handleDownloadExcel} className="btn-primary py-2 px-4 rounded font-semibold text-sm">Download Rekap (Sesuai Filter)</button>
              <button onClick={handleDownloadExcelAll} className="btn-secondary py-2 px-4 rounded font-semibold text-sm">Download Semua Data</button>
            </div>
          </div>
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <ChartBarIcon className="h-5 w-5 mr-2" />
              Rekap Absensi Siswa
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <LoadingSpinner size="lg" text="Memuat data rekap..." />
            </div>
          ) : rekapData.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <UserGroupIcon className="h-10 w-10 mx-auto mb-3 text-gray-200" />
              <p>Tidak ada data rekap untuk periode yang dipilih</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <table className="min-w-full text-sm divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider">No</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider">Nama Siswa</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider">Total Hari</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider">Hadir</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider">Sakit</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider">Izin</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider">Alpa</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider">Terlambat</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider">% Kehadiran</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                  {rekapData.map((item, index) => {
                    const attendancePercentage = calculateAttendancePercentage(item.hadir, item.total);
                    return (
                      <tr key={item.siswa.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 whitespace-nowrap text-gray-800 text-center">{index + 1}</td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-xs font-bold text-gray-600">
                                {item.siswa.nama.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {item.siswa.nama}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-gray-800 text-center">{item.total}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor('hadir')}`}>
                            {item.hadir}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor('sakit')}`}>
                            {item.sakit}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor('izin')}`}>
                            {item.izin}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor('alpa')}`}>
                            {item.alpa}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor('terlambat')}`}>
                            {item.terlambat}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-center">
                          {attendancePercentage}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Rekap;