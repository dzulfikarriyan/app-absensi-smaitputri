import React, { useState, useEffect } from 'react';
import { absensiGuruAPI, guruAPI } from '../../services/api';
import { FunnelIcon, ChartBarIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDate } from '../../utils/dateUtils';

const getStatusColor = (status) => {
  switch (status) {
    case 'hadir':
      return 'status-hadir';
    case 'sakit':
      return 'status-sakit';
    case 'izin':
      return 'status-izin';
    case 'alpa':
      return 'status-alpa';
    case 'terlambat':
      return 'status-terlambat';
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

// Function to format date for display (13 Juli 2025)
const formatDateForDisplay = (dateString) => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // Return original if invalid date
  
  const options = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  };
  
  return date.toLocaleDateString('id-ID', options);
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
  const totalSakit = rekap.filter(r => r.status === 'sakit').length;
  const totalIzin = rekap.filter(r => r.status === 'izin').length;
  const totalAlpa = rekap.filter(r => r.status === 'alpa').length;
  const totalTerlambat = rekap.filter(r => r.status === 'terlambat').length;
  const persentaseHadir = totalHari > 0 ? Math.round((totalHadir / (rekap.length || 1)) * 100) : 0;

  // Download Excel
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
    <div className="container-responsive py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rekap Absensi Guru</h1>
        <p className="text-gray-600">Lihat rekap kehadiran guru per periode</p>
      </div>

      {/* Filter Card */}
      <div className="card mb-6">
        <div className="card-header">
          <div className="flex items-center">
            <FunnelIcon className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Filter Data</h2>
          </div>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="form-group">
              <label className="form-label">Pilih Guru</label>
              <select value={filterGuru} onChange={e => setFilterGuru(e.target.value)} className="input-field">
                <option value="">Semua Guru</option>
                {guruList.map(g => (
                  <option key={g.id} value={g.id}>{g.nama}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tanggal Mulai</label>
              <input type="date" value={startDate} onChange={handleStartDate} className="input-field" />
            </div>
            <div className="form-group">
              <label className="form-label">Tanggal Akhir</label>
              <input type="date" value={endDate} onChange={handleEndDate} className="input-field" />
            </div>
            <div className="form-group flex items-end">
              <button className="btn-primary w-full" onClick={fetchRekap} type="button">
                Tampilkan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="card">
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-primary-600">{totalHari}</div>
            <div className="text-sm text-gray-600">Total Hari</div>
          </div>
        </div>
        <div className="card">
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-success-600">{totalHadir}</div>
            <div className="text-sm text-gray-600">Hadir</div>
          </div>
        </div>
        <div className="card">
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-warning-600">{totalSakit}</div>
            <div className="text-sm text-gray-600">Sakit</div>
          </div>
        </div>
        <div className="card">
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-primary-600">{totalIzin}</div>
            <div className="text-sm text-gray-600">Izin</div>
          </div>
        </div>
        <div className="card">
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-danger-600">{totalAlpa}</div>
            <div className="text-sm text-gray-600">Alpa</div>
          </div>
        </div>
        <div className="card">
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{totalTerlambat}</div>
            <div className="text-sm text-gray-600">Terlambat</div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="flex justify-end mb-6">
        <button 
          className="btn-secondary flex items-center" 
          onClick={handleDownloadExcel}
          disabled={loading || !startDate || !endDate}
        >
          <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
          {loading ? 'Mengunduh...' : 'Download Excel'}
        </button>
      </div>

      {/* Data Table */}
      <div className="card">
        {loading ? (
          <LoadingSpinner text="Memuat data..." />
        ) : error ? (
          <div className="p-6 text-center">
            <div className="alert alert-error">{error}</div>
          </div>
        ) : rekap.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <ChartBarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Tidak ada data rekap absensi guru.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Nama Guru</th>
                  <th>Status</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {rekap.map((item, idx) => (
                  <tr key={idx}>
                    <td>{formatDateForDisplay(item.tanggal)}</td>
                    <td className="font-medium">{item.guru?.nama || '-'}</td>
                    <td>
                      <span className={`status-badge ${getStatusColor(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                    <td>{item.keterangan || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RekapGuru; 