import { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  UserIcon 
} from '@heroicons/react/24/outline';
import { kelasAPI, siswaAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Siswa = () => {
  const [kelas, setKelas] = useState([]);
  const [siswa, setSiswa] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSiswa, setEditingSiswa] = useState(null);
  const [formData, setFormData] = useState({ nama: '', kelas_id: '' });
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchData, setBatchData] = useState([{ nama: '', kelas_id: selectedKelas || '' }]);
  const [showPasteArea, setShowPasteArea] = useState(false);
  const [pasteText, setPasteText] = useState('');

  useEffect(() => {
    fetchKelas();
  }, []);

  useEffect(() => {
    if (selectedKelas) {
      fetchSiswaByKelas(selectedKelas);
    } else {
      fetchAllSiswa();
    }
  }, [selectedKelas]);

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

  const fetchAllSiswa = async () => {
    try {
      setLoading(true);
      const response = await siswaAPI.getAll();
      if (response.data.success) {
        setSiswa(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching siswa:', error);
      alert('Gagal mengambil data siswa');
    } finally {
      setLoading(false);
    }
  };

  const fetchSiswaByKelas = async (kelasId) => {
    try {
      setLoading(true);
      const response = await siswaAPI.getByKelas(kelasId);
      if (response.data.success) {
        setSiswa(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching siswa:', error);
      alert('Gagal mengambil data siswa');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const namaList = formData.nama.split(/\r?\n/).map(n => n.trim()).filter(Boolean);
    if (namaList.length === 0 || !formData.kelas_id) {
      alert('Nama dan kelas harus diisi');
      return;
    }
    try {
      if (editingSiswa) {
        // Update siswa
        await siswaAPI.update(editingSiswa.id, { nama: namaList[0], kelas_id: formData.kelas_id });
        alert('Siswa berhasil diupdate');
      } else if (namaList.length === 1) {
        // Create siswa tunggal
        await siswaAPI.create({ nama: namaList[0], kelas_id: formData.kelas_id });
        alert('Siswa berhasil ditambahkan');
      } else {
        // Batch create
        await siswaAPI.createMany(namaList.map(nama => ({ nama, kelas_id: formData.kelas_id })));
        alert('Semua siswa berhasil ditambahkan!');
      }
      setShowModal(false);
      setEditingSiswa(null);
      setFormData({ nama: '', kelas_id: '' });
      if (selectedKelas) fetchSiswaByKelas(selectedKelas); else fetchAllSiswa();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal menyimpan siswa');
    }
  };

  const handleEdit = (siswaData) => {
    setEditingSiswa(siswaData);
    setFormData({ nama: siswaData.nama, kelas_id: siswaData.kelas_id });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus siswa ini?')) {
      return;
    }

    try {
      await siswaAPI.delete(id);
      alert('Siswa berhasil dihapus');
      
      // Refresh data
      if (selectedKelas) {
        fetchSiswaByKelas(selectedKelas);
      } else {
        fetchAllSiswa();
      }
    } catch (error) {
      console.error('Error deleting siswa:', error);
      alert('Gagal menghapus siswa');
    }
  };

  const openModal = () => {
    setEditingSiswa(null);
    setFormData({ nama: '', kelas_id: selectedKelas || '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSiswa(null);
    setFormData({ nama: '', kelas_id: '' });
  };

  const openBatchModal = () => {
    setBatchData([{ nama: '', kelas_id: selectedKelas || '' }]);
    setShowBatchModal(true);
  };

  const closeBatchModal = () => {
    setShowBatchModal(false);
    setBatchData([{ nama: '', kelas_id: selectedKelas || '' }]);
  };

  const handleBatchChange = (idx, field, value) => {
    setBatchData(batchData => batchData.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  };

  const addBatchRow = () => {
    setBatchData(batchData => [...batchData, { nama: '', kelas_id: selectedKelas || '' }]);
  };

  const removeBatchRow = (idx) => {
    setBatchData(batchData => batchData.length === 1 ? batchData : batchData.filter((_, i) => i !== idx));
  };

  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    if (batchData.some(row => !row.nama.trim() || !row.kelas_id)) {
      alert('Semua nama dan kelas harus diisi!');
      return;
    }
    try {
      await siswaAPI.createMany(batchData);
      alert('Semua siswa berhasil ditambahkan!');
      closeBatchModal();
      if (selectedKelas) fetchSiswaByKelas(selectedKelas); else fetchAllSiswa();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal menambah siswa batch');
    }
  };

  const handlePasteProcess = () => {
    const lines = pasteText.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    if (lines.length === 0) {
      alert('Tidak ada nama yang dipaste!');
      return;
    }
    setBatchData(lines.map(nama => ({ nama, kelas_id: selectedKelas || '' })));
    setShowPasteArea(false);
    setPasteText('');
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Memuat data siswa..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Siswa</h1>
          <p className="text-gray-600 mt-2">Tambah, edit, dan hapus data siswa</p>
        </div>
        <button onClick={openModal} className="btn-primary flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />Tambah Siswa
        </button>
      </div>

      {/* Filter Kelas */}
      <div className="card mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter Kelas:</label>
          <select
            value={selectedKelas}
            onChange={(e) => setSelectedKelas(e.target.value)}
            className="input-field max-w-xs"
          >
            <option value="">Semua Kelas</option>
            {kelas.map(k => (
              <option key={k.id} value={k.id}>
                {k.nama_kelas}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabel Siswa */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Siswa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kelas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {siswa.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    Belum ada data siswa
                  </td>
                </tr>
              ) : (
                siswa.map((siswaItem, index) => (
                  <tr key={siswaItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm font-medium text-gray-900">
                          {siswaItem.nama}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {siswaItem.kelas?.nama_kelas || 'Tidak ada kelas'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(siswaItem)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(siswaItem.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingSiswa ? 'Edit Siswa' : 'Tambah Siswa'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Siswa
                  </label>
                  <textarea
                    value={formData.nama}
                    onChange={e => setFormData({ ...formData, nama: e.target.value })}
                    className="input-field"
                    placeholder={editingSiswa ? 'Masukkan nama siswa' : 'Bisa paste banyak nama, satu nama per baris'}
                    rows={editingSiswa ? 1 : 4}
                    required
                  />
                  {!editingSiswa && (
                    <p className="text-xs text-gray-500 mt-1">Bisa paste banyak nama, satu nama per baris</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kelas
                  </label>
                  <select
                    value={formData.kelas_id}
                    onChange={e => setFormData({ ...formData, kelas_id: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="">Pilih Kelas</option>
                    {kelas.map(k => (
                      <option key={k.id} value={k.id}>{k.nama_kelas}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button type="button" onClick={closeModal} className="btn-secondary">Batal</button>
                  <button type="submit" className="btn-primary">{editingSiswa ? 'Update' : 'Simpan'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showBatchModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[520px] shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tambah Banyak Siswa</h3>
              <div className="flex justify-between mb-2">
                <button type="button" onClick={() => setShowPasteArea(v => !v)} className="btn-secondary text-xs">Paste dari Excel</button>
              </div>
              {showPasteArea && (
                <div className="mb-4">
                  <textarea
                    className="input-field w-full"
                    rows={5}
                    placeholder="Paste nama-nama siswa dari Excel, satu nama per baris"
                    value={pasteText}
                    onChange={e => setPasteText(e.target.value)}
                  />
                  <div className="flex justify-end space-x-2 mt-2">
                    <button type="button" onClick={() => setShowPasteArea(false)} className="btn-secondary text-xs">Batal</button>
                    <button type="button" onClick={handlePasteProcess} className="btn-primary text-xs">Proses</button>
                  </div>
                </div>
              )}
              <form onSubmit={handleBatchSubmit}>
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-2 text-xs font-medium text-gray-500 uppercase">Nama Siswa</th>
                        <th className="px-2 py-2 text-xs font-medium text-gray-500 uppercase">Kelas</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {batchData.map((row, idx) => (
                        <tr key={idx}>
                          <td className="px-2 py-2">
                            <input type="text" value={row.nama} onChange={e => handleBatchChange(idx, 'nama', e.target.value)} className="input-field" placeholder="Nama siswa" required />
                          </td>
                          <td className="px-2 py-2">
                            <select value={row.kelas_id} onChange={e => handleBatchChange(idx, 'kelas_id', e.target.value)} className="input-field" required>
                              <option value="">Pilih Kelas</option>
                              {kelas.map(k => (
                                <option key={k.id} value={k.id}>{k.nama_kelas}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-2 py-2">
                            <button type="button" onClick={() => removeBatchRow(idx)} className="btn-danger text-xs">Hapus</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <button type="button" onClick={addBatchRow} className="btn-secondary">+ Tambah Baris</button>
                  <div className="space-x-2">
                    <button type="button" onClick={closeBatchModal} className="btn-secondary">Batal</button>
                    <button type="submit" className="btn-primary">Simpan Semua</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Siswa; 