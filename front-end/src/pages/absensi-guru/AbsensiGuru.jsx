import { useState, useEffect } from 'react';
import { getToday, formatDate, getDayName } from '../../utils/dateUtils';
import LoadingSpinner from '../../components/LoadingSpinner';
import { CheckIcon } from '@heroicons/react/24/outline';
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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Absensi Guru</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
          <input type="date" value={selectedTanggal} onChange={e => setSelectedTanggal(e.target.value)} className="input-field" required />
          {selectedTanggal && (
            <p className="text-sm text-gray-500 mt-1">{formatDate(selectedTanggal)} ({getDayName(selectedTanggal)})</p>
          )}
        </div>
        {errorMsg && <div className="text-red-600 mb-2">{errorMsg}</div>}
        {successMsg && <div className="text-green-600 mb-2">{successMsg}</div>}
        <div className="card mb-6">
          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Guru</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {guruList.map((guru, idx) => {
                  const absensiItem = absensiData.find(a => a.guru_id === guru.id) || { status: 'hadir', keterangan: '' };
                  return (
                    <tr key={guru.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{idx + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{guru.nama}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select value={absensiItem.status} onChange={e => handleStatusChange(guru.id, e.target.value)} className="input-field">
                          <option value="hadir">Hadir</option>
                          <option value="sakit">Sakit</option>
                          <option value="izin">Izin</option>
                          <option value="alpa">Alpa</option>
                          <option value="terlambat">Terlambat</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input type="text" value={absensiItem.keterangan} onChange={e => handleKeteranganChange(guru.id, e.target.value)} className="input-field text-sm" placeholder="Keterangan (opsional)" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={submitting || loading} className="btn-primary px-6 py-2 flex items-center justify-center disabled:opacity-50">
            {submitting ? <LoadingSpinner size="sm" text="" /> : (<><CheckIcon className="h-5 w-5 mr-2" /> Simpan Absensi</>)}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AbsensiGuru; 