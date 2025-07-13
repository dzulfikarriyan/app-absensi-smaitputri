import { useState, useEffect } from 'react';
import { getToday, formatDate, getDayName } from '../../utils/dateUtils';
import LoadingSpinner from '../../components/LoadingSpinner';
import { CheckIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { guruAPI, absensiGuruAPI } from '../../services/api';

const AbsensiGuru = () => {
  const [guruList, setGuruList] = useState([]);
  const [selectedTanggal, setSelectedTanggal] = useState(getToday());
  const [absensiData, setAbsensiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Ambil data guru dari backend
  const fetchGuru = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await guruAPI.getAll();
      setGuruList(res.data.data);
      // Inisialisasi absensiData
      setAbsensiData(res.data.data.map(g => ({ guru_id: g.id, status: 'hadir', keterangan: '' })));
    } catch (err) {
      setErrorMsg('Gagal mengambil data guru');
    } finally {
      setLoading(false);
    }
  };

  // Ambil absensi guru hari ini jika ada
  const fetchAbsensiHariIni = async () => {
    if (!selectedTanggal) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await absensiGuruAPI.getByTanggal(selectedTanggal);
      if (res.data.success && res.data.data.length > 0) {
        // Update absensiData dengan data yang sudah ada
        setAbsensiData(guruList.map(guru => {
          const existing = res.data.data.find(abs => abs.guru_id === guru.id);
          return {
            guru_id: guru.id,
            status: existing ? existing.status : 'hadir',
            keterangan: existing ? existing.keterangan : ''
          };
        }));
      } else {
        // Default hadir
        setAbsensiData(guruList.map(g => ({ guru_id: g.id, status: 'hadir', keterangan: '' })));
      }
    } catch (err) {
      setErrorMsg('Gagal mengambil data absensi guru');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuru();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (guruList.length > 0 && selectedTanggal) {
      fetchAbsensiHariIni();
    }
    // eslint-disable-next-line
  }, [guruList, selectedTanggal]);

  const handleStatusChange = (guruId, status) => {
    setAbsensiData(prev => prev.map(item => item.guru_id === guruId ? { ...item, status } : item));
  };
  const handleKeteranganChange = (guruId, keterangan) => {
    setAbsensiData(prev => prev.map(item => item.guru_id === guruId ? { ...item, keterangan } : item));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    if (!selectedTanggal) {
      setErrorMsg('Tanggal harus diisi');
      return;
    }
    if (absensiData.length === 0) {
      setErrorMsg('Tidak ada data guru untuk diabsensi');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        tanggal: selectedTanggal,
        absensi_data: absensiData
      };
      await absensiGuruAPI.inputBatch(payload);
      setSuccessMsg('Absensi guru berhasil disimpan!');
      fetchAbsensiHariIni();
    } catch (err) {
      setErrorMsg('Gagal menyimpan absensi guru');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-responsive py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Absensi Guru</h1>
        <p className="text-gray-600">Input kehadiran guru untuk hari ini</p>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="alert alert-error mb-6">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="alert alert-success mb-6">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Date Selection */}
        <div className="card mb-6">
          <div className="card-header">
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Pilih Tanggal</h2>
            </div>
          </div>
          <div className="card-body">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <label className="form-label">Tanggal Absensi</label>
                <input 
                  type="date" 
                  value={selectedTanggal} 
                  onChange={e => setSelectedTanggal(e.target.value)} 
                  className="input-field" 
                  required 
                />
              </div>
              {selectedTanggal && (
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  {formatDate(selectedTanggal)} ({getDayName(selectedTanggal)})
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="card mb-6">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">Data Absensi Guru</h2>
          </div>
          <div className="card-body p-0">
            {loading ? (
              <LoadingSpinner text="Memuat data guru..." />
            ) : guruList.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p>Belum ada data guru.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="w-16">No</th>
                      <th>Nama Guru</th>
                      <th className="w-48">Status</th>
                      <th>Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guruList.map((guru, idx) => {
                      const absensiItem = absensiData.find(a => a.guru_id === guru.id) || { status: 'hadir', keterangan: '' };
                      return (
                        <tr key={guru.id}>
                          <td className="text-center">{idx + 1}</td>
                          <td className="font-medium">{guru.nama}</td>
                          <td>
                            <select 
                              value={absensiItem.status} 
                              onChange={e => handleStatusChange(guru.id, e.target.value)} 
                              className="input-field"
                            >
                              <option value="hadir">Hadir</option>
                              <option value="sakit">Sakit</option>
                              <option value="izin">Izin</option>
                              <option value="alpa">Alpa</option>
                              <option value="terlambat">Terlambat</option>
                            </select>
                          </td>
                          <td>
                            <input 
                              type="text" 
                              value={absensiItem.keterangan} 
                              onChange={e => handleKeteranganChange(guru.id, e.target.value)} 
                              className="input-field" 
                              placeholder="Keterangan (opsional)" 
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={submitting || loading} 
            className="btn-primary btn-lg flex items-center"
          >
            {submitting ? (
              <>
                <LoadingSpinner size="sm" text="" />
                <span className="ml-2">Menyimpan...</span>
              </>
            ) : (
              <>
                <CheckIcon className="h-5 w-5 mr-2" />
                Simpan Absensi
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AbsensiGuru; 