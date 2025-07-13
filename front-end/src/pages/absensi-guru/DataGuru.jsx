import React, { useState, useEffect } from 'react';
import { guruAPI } from '../../services/api';

const DataGuru = () => {
  const [guruList, setGuruList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [formNama, setFormNama] = useState('');
  const [batchInput, setBatchInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Ambil data guru dari backend
  const fetchGuru = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await guruAPI.getAll();
      setGuruList(res.data.data);
    } catch (err) {
      setError('Gagal mengambil data guru');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuru();
  }, []);

  // Tambah atau update guru
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formNama.trim()) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (editId) {
        await guruAPI.update(editId, { nama: formNama });
        setSuccess('Guru berhasil diupdate');
      } else {
        await guruAPI.create({ nama: formNama });
        setSuccess('Guru berhasil ditambahkan');
      }
      fetchGuru();
      setShowForm(false);
      setFormNama('');
      setEditId(null);
    } catch (err) {
      setError('Gagal menyimpan data guru');
    } finally {
      setLoading(false);
    }
  };

  // Tambah multiple guru
  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    if (!batchInput.trim()) return;
    
    const namaList = batchInput
      .split('\n')
      .map(nama => nama.trim())
      .filter(nama => nama.length > 0);
    
    if (namaList.length === 0) {
      setError('Masukkan minimal satu nama guru');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const guruData = namaList.map(nama => ({ nama }));
      const response = await guruAPI.createBatch(guruData);
      
      setSuccess(response.data.message);
      setBatchInput('');
      setShowBatchForm(false);
      fetchGuru();
    } catch (err) {
      setError('Gagal menambahkan guru');
    } finally {
      setLoading(false);
    }
  };

  // Edit guru
  const handleEdit = (guru) => {
    setFormNama(guru.nama);
    setEditId(guru.id);
    setShowForm(true);
  };

  // Hapus guru
  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus guru ini?')) return;
    setLoading(true);
    setError('');
    try {
      await guruAPI.delete(id);
      fetchGuru();
    } catch (err) {
      setError('Gagal menghapus guru');
    } finally {
      setLoading(false);
    }
  };

  // Buka form tambah
  const handleAdd = () => {
    setFormNama('');
    setEditId(null);
    setShowForm(true);
    setShowBatchForm(false);
  };

  // Buka form batch tambah
  const handleBatchAdd = () => {
    setBatchInput('');
    setShowBatchForm(true);
    setShowForm(false);
  };

  // Batal
  const handleCancel = () => {
    setFormNama('');
    setEditId(null);
    setShowForm(false);
    setShowBatchForm(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Data Guru</h1>
      <div className="flex gap-2 mb-4">
        <button className="btn-primary" onClick={handleAdd}>+ Tambah Guru</button>
        <button className="btn-secondary" onClick={handleBatchAdd}>+ Tambah Banyak Guru</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 flex gap-2 items-center">
          <input
            type="text"
            className="input-field"
            placeholder="Nama Guru"
            value={formNama}
            onChange={e => setFormNama(e.target.value)}
            autoFocus
            required
            disabled={loading}
          />
          <button type="submit" className="btn-primary" disabled={loading}>{editId ? 'Update' : 'Tambah'}</button>
          <button type="button" className="btn-secondary" onClick={handleCancel} disabled={loading}>Batal</button>
        </form>
      )}
      {showBatchForm && (
        <form onSubmit={handleBatchSubmit} className="mb-4">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Masukkan nama guru (satu nama per baris):
            </label>
            <textarea
              className="input-field w-full h-32"
              placeholder="Nama Guru 1&#10;Nama Guru 2&#10;Nama Guru 3"
              value={batchInput}
              onChange={e => setBatchInput(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary" disabled={loading}>
              Tambah Guru
            </button>
            <button type="button" className="btn-secondary" onClick={handleCancel} disabled={loading}>
              Batal
            </button>
          </div>
        </form>
      )}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <div className="card">
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Guru</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {guruList.map((guru, idx) => (
                <tr key={guru.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{idx + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{guru.nama}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="btn-secondary mr-2" onClick={() => handleEdit(guru)} disabled={loading}>Edit</button>
                    <button className="btn-danger" onClick={() => handleDelete(guru.id)} disabled={loading}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DataGuru; 