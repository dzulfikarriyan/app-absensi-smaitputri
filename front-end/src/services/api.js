import axios from 'axios';

const API_BASE_URL = 'http://localhost:3002/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Kelas API
export const kelasAPI = {
  getAll: () => api.get('/kelas'),
  getById: (id) => api.get(`/kelas/${id}`),
  create: (data) => api.post('/kelas', data),
  update: (id, data) => api.put(`/kelas/${id}`, data),
  delete: (id) => api.delete(`/kelas/${id}`),
};

// Siswa API
export const siswaAPI = {
  getAll: () => api.get('/siswa'),
  getByKelas: (kelasId) => api.get(`/siswa/kelas/${kelasId}`),
  getById: (id) => api.get(`/siswa/${id}`),
  create: (data) => api.post('/siswa', data),
  update: (id, data) => api.put(`/siswa/${id}`, data),
  delete: (id) => api.delete(`/siswa/${id}`),
  createMany: (dataArray) => api.post('/siswa/batch', { siswa: dataArray }),
};

// Absensi API
export const absensiAPI = {
  inputSingle: (data) => api.post('/absensi', data),
  inputBatch: (data) => api.post('/absensi/batch', data),
  getByTanggalKelas: (tanggal, kelasId) => api.get(`/absensi/${tanggal}/${kelasId}`),
  getRekap: (params) => api.get('/absensi/rekap', { params }),
  getRekapKelas: (params) => api.get('/absensi/rekap/kelas', { params }),
};

export default api; 