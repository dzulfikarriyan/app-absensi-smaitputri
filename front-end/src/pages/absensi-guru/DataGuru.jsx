import React, { useState, useEffect } from 'react';
import { guruAPI } from '../../services/api';
import { PlusIcon, PencilIcon, TrashIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/LoadingSpinner';

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
    <div className="container-responsive py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Guru</h1>
        <p className="text-gray-600">Kelola data guru untuk sistem absensi</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button className="btn-primary flex items-center justify-center" onClick={handleAdd}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Tambah Guru
        </button>
        <button className="btn-secondary flex items-center justify-center" onClick={handleBatchAdd}>
          <UserGroupIcon className="h-5 w-5 mr-2" />
          Tambah Banyak Guru
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-error mb-6">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success mb-6">
          {success}
        </div>
      )}

      {/* Single Add Form */}
      {showForm && (
        <div className="card mb-6">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">
              {editId ? 'Edit Guru' : 'Tambah Guru Baru'}
            </h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  className="input-field"
                  placeholder="Masukkan nama guru"
                  value={formNama}
                  onChange={e => setFormNama(e.target.value)}
                  autoFocus
                  required
                  disabled={loading}
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {editId ? 'Update' : 'Tambah'}
                </button>
                <button type="button" className="btn-secondary" onClick={handleCancel} disabled={loading}>
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batch Add Form */}
      {showBatchForm && (
        <div className="card mb-6">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">Tambah Banyak Guru</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleBatchSubmit}>
              <div className="form-group">
                <label className="form-label">
                  Masukkan nama guru (satu nama per baris):
                </label>
                <textarea
                  className="input-field w-full h-32 resize-none"
                  placeholder="Nama Guru 1&#10;Nama Guru 2&#10;Nama Guru 3"
                  value={batchInput}
                  onChange={e => setBatchInput(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button type="submit" className="btn-primary" disabled={loading}>
                  Tambah Guru
                </button>
                <button type="button" className="btn-secondary" onClick={handleCancel} disabled={loading}>
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="card">
        {loading ? (
          <LoadingSpinner text="Memuat data guru..." />
        ) : guruList.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <UserGroupIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Belum ada data guru.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th className="w-16">No</th>
                  <th>Nama Guru</th>
                  <th className="w-48">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {guruList.map((guru, idx) => (
                  <tr key={guru.id}>
                    <td className="text-center">{idx + 1}</td>
                    <td className="font-medium">{guru.nama}</td>
                    <td>
                      <div className="flex gap-2">
                        <button 
                          className="btn-secondary btn-sm flex items-center" 
                          onClick={() => handleEdit(guru)} 
                          disabled={loading}
                        >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        <button 
                          className="btn-danger btn-sm flex items-center" 
                          onClick={() => handleDelete(guru.id)} 
                          disabled={loading}
                        >
                          <TrashIcon className="h-4 w-4 mr-1" />
                          Hapus
                        </button>
                      </div>
                    </td>
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

export default DataGuru; 