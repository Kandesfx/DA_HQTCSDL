import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào mọi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý lỗi 401 (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API cho CLB
export const clbAPI = {
  getAll: async () => {
    const response = await api.get('/clb');
    return response.data;
  },
  getById: async (MaCLB) => {
    const response = await api.get(`/clb/${MaCLB}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/clb', data);
    return response.data;
  },
  update: async (MaCLB, data) => {
    const response = await api.put(`/clb/${MaCLB}`, data);
    return response.data;
  },
  delete: async (MaCLB) => {
    const response = await api.delete(`/clb/${MaCLB}`);
    return response.data;
  },
  // Các cấu trúc SQL cho QLCLB
  thongKe: async () => {
    const response = await api.get('/clb/thongke/tatca');
    return response.data;
  },
  getSoLuongDoiNhom: async (MaCLB) => {
    const response = await api.get(`/clb/${MaCLB}/soluong-doinhom`);
    return response.data;
  },
  baoCaoTongHop: async () => {
    const response = await api.get('/clb/baocao/tonghop');
    return response.data;
  },
  taoVoiDoiNhom: async (data) => {
    const response = await api.post('/clb/tao-voi-doinhom', data);
    return response.data;
  },
  demoTransaction: async (data) => {
    const response = await api.post('/clb/demo-transaction', data);
    return response.data;
  },
};

// API cho Đội Nhóm
export const doinhomAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.MaCLB) params.append('MaCLB', filters.MaCLB);
    const response = await api.get(`/doinhom?${params.toString()}`);
    return response.data;
  },
  getById: async (MaDoi) => {
    const response = await api.get(`/doinhom/${MaDoi}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/doinhom', data);
    return response.data;
  },
  update: async (MaDoi, data) => {
    const response = await api.put(`/doinhom/${MaDoi}`, data);
    return response.data;
  },
  delete: async (MaDoi) => {
    const response = await api.delete(`/doinhom/${MaDoi}`);
    return response.data;
  },
};

// API cho Authentication
export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  getMe: async (token) => {
    const response = await api.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },
};

export default api;

