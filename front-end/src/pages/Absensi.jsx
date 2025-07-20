import { useState, useEffect } from 'react';
import { 
  CalendarIcon,
  UserGroupIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { kelasAPI, siswaAPI, absensiAPI } from '../services/api';
import { getToday, formatDate, getDayName } from '../utils/dateUtils';
import LoadingSpinner from '../components/LoadingSpinner';

const Absensi = () => {
  const [kelas, setKelas] = useState([]);
  const [siswa, setSiswa] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState('');
  const [selectedTanggal, setSelectedTanggal] = useState(getToday());
  const [absensiData, setAbsensiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchKelas();
  }, []);

  // Load students immediately when class is selected
  useEffect(() => {
    if (selectedKelas) {
      fetchSiswa(selectedKelas);
    } else {
      setSiswa([]);
      setAbsensiData([]);
    }
  }, [selectedKelas]);

  // Load attendance data when both class and date are available
  useEffect(() => {
    if (selectedKelas && selectedTanggal && siswa.length > 0) {
      fetchAbsensiHariIni();
    }
  }, [selectedKelas, selectedTanggal, siswa]);

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

  const fetchSiswa = async (kelasId) => {
    try {
      setLoading(true);
      const response = await siswaAPI.getByKelas(kelasId);
      if (response.data.success) {
        setSiswa(response.data.data);
        // Initialize absensi data immediately when students are loaded
        const initialAbsensi = response.data.data.map(siswa => ({
          siswa_id: siswa.id,
          status: 'hadir',
          keterangan: ''
        }));
        setAbsensiData(initialAbsensi);
      }
    } catch (error) {
      console.error('Error fetching siswa:', error);
      alert('Gagal mengambil data siswa');
    } finally {
      setLoading(false);
    }
  };

  const fetchAbsensiHariIni = async () => {
    try {
      const response = await absensiAPI.getByTanggalKelas(selectedTanggal, selectedKelas);
      if (response.data.success) {
        // Update absensi data dengan data yang sudah ada
        const existingAbsensi = response.data.data;
        const updatedAbsensi = siswa.map(siswa => {
          const existing = existingAbsensi.find(abs => abs.siswa_id === siswa.id);
          return {
            siswa_id: siswa.id,
            status: existing ? existing.status : 'hadir',
            keterangan: existing ? existing.keterangan : ''
          };
        });
        setAbsensiData(updatedAbsensi);
      }
    } catch (error) {
      // Jika tidak ada absensi untuk tanggal tersebut, gunakan default
      const defaultAbsensi = siswa.map(siswa => ({
        siswa_id: siswa.id,
        status: 'hadir',
        keterangan: ''
      }));
      setAbsensiData(defaultAbsensi);
    }
  };

  const handleStatusChange = (siswaId, status) => {
    setAbsensiData(prev => 
      prev.map(item => 
        item.siswa_id === siswaId 
          ? { ...item, status } 
          : item
      )
    );
  };

  const handleKeteranganChange = (siswaId, keterangan) => {
    setAbsensiData(prev => 
      prev.map(item => 
        item.siswa_id === siswaId 
          ? { ...item, keterangan } 
          : item
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedKelas) {
      alert('Pilih kelas terlebih dahulu');
      return;
    }

    if (absensiData.length === 0) {
      alert('Tidak ada data siswa untuk diabsensi');
      return;
    }

    try {
      setSubmitting(true);
      
      const payload = {
        kelas_id: selectedKelas,
        tanggal: selectedTanggal,
        absensi_data: absensiData
      };

      await absensiAPI.inputBatch(payload);
      alert('Absensi berhasil disimpan!');
      
      // Refresh data
      fetchAbsensiHariIni();
    } catch (error) {
      console.error('Error saving absensi:', error);
      alert(error.response?.data?.message || 'Gagal menyimpan absensi');
    } finally {
      setSubmitting(false);
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

  return (
    <div className="max-w-3xl mx-auto px-2 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Input Absensi</h1>
        <p className="text-gray-500 mt-1 text-base">Catat kehadiran siswa per kelas</p>
      </div>

      {/* Form Filter */}
      <div className="card mb-4 p-4 shadow-sm border border-gray-100 bg-white rounded-lg">
        <form>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Pilih Kelas
              </label>
              <select
                value={selectedKelas}
                onChange={(e) => setSelectedKelas(e.target.value)}
                className="input-field py-2 px-3 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-200 w-full"
                required
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
                Tanggal
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={selectedTanggal}
                  onChange={(e) => setSelectedTanggal(e.target.value)}
                  className="input-field pl-8 py-2 px-3 text-sm border border-gray-300 rounded w-full focus:ring-2 focus:ring-primary-200"
                  required
                />
              </div>
              {selectedTanggal && (
                <p className="text-xs text-gray-400 mt-1">
                  {formatDate(selectedTanggal)} ({getDayName(selectedTanggal)})
                </p>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Tabel Absensi - Show immediately when class is selected */}
      {selectedKelas && (
        <div className="card p-4 shadow-sm border border-gray-100 bg-white rounded-lg">
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Daftar Siswa - {kelas.find(k => k.id == selectedKelas)?.nama_kelas}
            </h2>
            <p className="text-xs text-gray-500">
              Tanggal: {formatDate(selectedTanggal)}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <LoadingSpinner size="lg" text="Memuat data siswa..." />
            </div>
          ) : siswa.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <UserGroupIcon className="h-10 w-10 mx-auto mb-3 text-gray-200" />
              <p>Belum ada siswa di kelas ini</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-gray-100">
                <table className="min-w-full text-sm divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider">No</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider">Nama Siswa</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-50">
                    {siswa.map((siswaItem, index) => {
                      const absensiItem = absensiData.find(abs => abs.siswa_id === siswaItem.id);
                      return (
                        <tr key={siswaItem.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 whitespace-nowrap text-gray-800 text-center">{index + 1}</td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-xs font-bold text-gray-600">
                                  {siswaItem.nama.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {siswaItem.nama}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <select
                              value={absensiItem?.status || 'hadir'}
                              onChange={(e) => handleStatusChange(siswaItem.id, e.target.value)}
                              className={`px-2 py-1 rounded text-xs font-medium border border-gray-200 focus:ring-2 focus:ring-primary-200 ${getStatusColor(absensiItem?.status || 'hadir')}`}
                            >
                              <option value="hadir">Hadir</option>
                              <option value="sakit">Sakit</option>
                              <option value="izin">Izin</option>
                              <option value="alpa">Alpa</option>
                              <option value="terlambat">Terlambat</option>
                            </select>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <input
                              type="text"
                              value={absensiItem?.keterangan || ''}
                              onChange={(e) => handleKeteranganChange(siswaItem.id, e.target.value)}
                              placeholder="Keterangan (opsional)"
                              className="input-field text-xs border border-gray-200 rounded px-2 py-1 w-full focus:ring-2 focus:ring-primary-200"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || !selectedKelas}
                  className="btn-primary px-6 py-2 rounded shadow font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? (
                    <LoadingSpinner size="sm" text="" />
                  ) : (
                    <>
                      <CheckIcon className="h-5 w-5" />
                      Simpan Absensi
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Absensi; 