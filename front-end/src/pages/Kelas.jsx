import { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  UserGroupIcon 
} from '@heroicons/react/24/outline';
import { kelasAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Kelas = () => {
  const [kelas, setKelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingKelas, setEditingKelas] = useState(null);
  const [formData, setFormData] = useState({ nama_kelas: '' });

  useEffect(() => {
    fetchKelas();
  }, []);

  const fetchKelas = async () => {
    try {
      setLoading(true);
      const response = await kelasAPI.getAll();
      if (response.data.success) {
        setKelas(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching kelas:', error);
      alert('Gagal mengambil data kelas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nama_kelas.trim()) {
      alert('Nama kelas harus diisi');
      return;
    }

    try {
      if (editingKelas) {
        // Update kelas
        await kelasAPI.update(editingKelas.id, formData);
        alert('Kelas berhasil diupdate');
      } else {
        // Create kelas baru
        await kelasAPI.create(formData);
        alert('Kelas berhasil dibuat');
      }
      
      setShowModal(false);
      setEditingKelas(null);
      setFormData({ nama_kelas: '' });
      fetchKelas();
    } catch (error) {
      console.error('Error saving kelas:', error);
      alert(error.response?.data?.message || 'Gagal menyimpan kelas');
    }
  };

  const handleEdit = (kelasData) => {
    setEditingKelas(kelasData);
    setFormData({ nama_kelas: kelasData.nama_kelas });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kelas ini?')) {
      return;
    }

    try {
      await kelasAPI.delete(id);
      alert('Kelas berhasil dihapus');
      fetchKelas();
    } catch (error) {
      console.error('Error deleting kelas:', error);
      alert('Gagal menghapus kelas');
    }
  };

  const openModal = () => {
    setEditingKelas(null);
    setFormData({ nama_kelas: '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingKelas(null);
    setFormData({ nama_kelas: '' });
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Memuat data kelas..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Kelas</h1>
          <p className="text-gray-600 mt-2">Tambah, edit, dan hapus data kelas</p>
        </div>
        <button
          onClick={openModal}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Tambah Kelas
        </button>
      </div>

      {/* Tabel Kelas */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Kelas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah Siswa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {kelas.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    Belum ada data kelas
                  </td>
                </tr>
              ) : (
                kelas.map((kelasItem, index) => (
                  <tr key={kelasItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserGroupIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm font-medium text-gray-900">
                          {kelasItem.nama_kelas}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {typeof kelasItem.jumlah_siswa !== 'undefined' ? kelasItem.jumlah_siswa : 0} siswa
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(kelasItem)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(kelasItem.id)}
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
                {editingKelas ? 'Edit Kelas' : 'Tambah Kelas Baru'}
              </h3>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Kelas
                  </label>
                  <input
                    type="text"
                    value={formData.nama_kelas}
                    onChange={(e) => setFormData({ nama_kelas: e.target.value })}
                    className="input-field"
                    placeholder="Contoh: X-A, XI-B, XII-C"
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn-secondary"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {editingKelas ? 'Update' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kelas; 