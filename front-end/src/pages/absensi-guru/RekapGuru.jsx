import React, { useState, useEffect } from 'react';
import { absensiGuruAPI, guruAPI } from '../../services/api';
import { FunnelIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/LoadingSpinner';

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

const RekapGuru = () => {
  const [rekap, setRekap] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [guruList, setGuruList] = useState([]);
  const [filterGuru, setFilterGuru] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchGuru();
  }, []);

  useEffect(() => {
    if (filterGuru && startDate && endDate) {
      fetchRekap();
    }
    // eslint-disable-next-line
  }, [filterGuru, startDate, endDate]);

  const fetchGuru = async () => {
    try {
      const res = await guruAPI.getAll();
      setGuruList(res.data.data);
    } catch {}
  };

  // Helper validasi tanggal
  const isValidDate = (d) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d);

  // Handler input date agar tidak pernah mengirim 'Invalid date'
  const handleStartDate = (e) => {
    const val = e.target.value;
    setStartDate(isValidDate(val) ? val : '');
  };
  const handleEndDate = (e) => {
    const val = e.target.value;
    setEndDate(isValidDate(val) ? val : '');
  };

  const fetchRekap = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filterGuru) params.guru_id = filterGuru;
      if (isValidDate(startDate) && isValidDate(endDate)) {
        params.start_date = startDate;
        params.end_date = endDate;
      }
      const res = await absensiGuruAPI.getRekap(params);
      setRekap(res.data.data);
    } catch (err) {
      setError('Gagal mengambil rekap absensi guru');
    } finally {
      setLoading(false);
    }
  };

  // Statistik sederhana
  const totalHari = (() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  })();

  const totalHadir = rekap.filter(r => r.status === 'hadir').length;
  const persentaseHadir = totalHari > 0 ? Math.round((totalHadir / (rekap.length || 1)) * 100) : 0;

  // Download Excel (dummy, backend bisa ditambah)
  const handleDownloadExcel = async () => {
    try {
      // Validasi filter
      if (!startDate || !endDate) {
        alert('Pilih tanggal mulai dan tanggal akhir terlebih dahulu');
        return;
      }

      setLoading(true);
      
      const params = {};
      if (filterGuru) params.guru_id = filterGuru;
      if (startDate && endDate) {
        params.start_date = startDate;
        params.end_date = endDate;
      }

      const response = await absensiGuruAPI.downloadExcel(params);
      
      // Create blob and download
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from response headers or generate default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'rekap_absensi_guru.xlsx';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      alert('File Excel berhasil diunduh!');
    } catch (error) {
      console.error('Error downloading Excel:', error);
      alert('Gagal mengunduh file Excel. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Rekap Absensi Guru</h1>
        <p className="text-gray-600 mt-2">Lihat rekap kehadiran guru per periode</p>
      </div>
      {/* Filter */}
      <div className="card mb-6">
        <div className="flex items-center mb-4">
          <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Filter Data</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Guru</label>
            <select value={filterGuru} onChange={e => setFilterGuru(e.target.value)} className="input-field">
              <option value="">Semua Guru</option>
              {guruList.map(g => (
                <option key={g.id} value={g.id}>{g.nama}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
            <input type="date" value={startDate} onChange={handleStartDate} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Akhir</label>
            <input type="date" value={endDate} onChange={handleEndDate} className="input-field" />
          </div>
          <div className="flex items-end">
            <button className="btn-primary w-full" onClick={fetchRekap} type="button">Tampilkan</button>
          </div>
        </div>
      </div>
      {/* Statistik */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2 bg-gray-100 rounded px-4 py-2">
          <ChartBarIcon className="h-5 w-5 text-primary-600" />
          <span className="font-semibold">Total Hari:</span> {totalHari}
        </div>
        <div className="flex items-center gap-2 bg-gray-100 rounded px-4 py-2">
          <span className="font-semibold">Total Hadir:</span> {totalHadir}
        </div>
        <div className="flex items-center gap-2 bg-gray-100 rounded px-4 py-2">
          <span className="font-semibold">% Hadir:</span> {persentaseHadir}%
        </div>
        <button 
          className="btn-secondary ml-auto" 
          onClick={handleDownloadExcel}
          disabled={loading || !startDate || !endDate}
        >
          {loading ? 'Mengunduh...' : 'Download Excel'}
        </button>
      </div>
      {/* Tabel Rekap */}
      <div className="card">
        {loading ? (
          <div className="p-4 text-center"><LoadingSpinner /></div>
        ) : error ? (
          <div className="p-4 text-center text-red-600">{error}</div>
        ) : rekap.length === 0 ? (
          <div className="p-4 text-center text-gray-500">Tidak ada data rekap absensi guru.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Guru</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rekap.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tanggal}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.guru?.nama || '-'}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${getStatusColor(item.status)}`}>{getStatusLabel(item.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.keterangan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RekapGuru; 