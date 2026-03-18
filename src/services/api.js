import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for httpOnly cookies
  timeout: 30000, // 30 second timeout
});

// Simple cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cached GET request
const cachedGet = async (url, config) => {
  const cacheKey = url + JSON.stringify(config?.params || {});
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('📦 Using cached data for:', url);
    return cached.data;
  }
  
  const response = await api.get(url, config);
  cache.set(cacheKey, { data: response, timestamp: Date.now() });
  return response;
};

// Request interceptor - Add logging and Auth Header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    // console.log(`✅ API Response: ${response.config.url}`, response.data);
    return response.data;
  },
  (error) => {
    console.error('❌ API Error:', error);

    // Network error - no response from server
    if (!error.response) {
      console.error('Network Error - No Response');
      const errorMsg = error.message === 'Network Error' 
        ? 'Cannot connect to server. Please check your internet connection.'
        : 'Request timeout. Please try again.';
      
      return Promise.reject({
        message: errorMsg,
        isNetworkError: true,
      });
    }

    // Server responded with error
    const { status, data } = error.response;
    console.error(`Server Error: ${status}`, data);

    if (status === 401) {
      // Clear invalid session
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }

    // Return error with response data
    return Promise.reject(error);
  }
);

// ═══════════════════════════════════════════════════════════
// AUTH API
// ═══════════════════════════════════════════════════════════

export const authAPI = {
  register: (data) => api.post('/users', data),
  login: (data) => api.post('/users/login', data),
  logout: () => { localStorage.removeItem('user'); localStorage.removeItem('token'); return Promise.resolve(); },
  getMe: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/password', data),
  addAddress: (data) => api.post('/users/addresses', data),
  updateAddress: (id, data) => api.put(`/users/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/users/addresses/${id}`),
  getWishlist: () => api.get('/users/wishlist'),
  addToWishlist: (productId) => api.post(`/users/wishlist/${productId}`),
  removeFromWishlist: (productId) => api.delete(`/users/wishlist/${productId}`),
};

// ═══════════════════════════════════════════════════════════
// PRODUCT API
// ═══════════════════════════════════════════════════════════

export const productAPI = {
  getAll: (params) => cachedGet('/products', { params }),
  getOne: (id) => cachedGet(`/products/${id}`),
  getFeatured: () => cachedGet('/products/featured'),
  getNewArrivals: () => cachedGet('/products/new-arrivals'),
  getBestSellers: () => cachedGet('/products/best-sellers'),
  getRelated: (id) => cachedGet(`/products/${id}/related`),
  getFilters: () => cachedGet('/products/filters/options'),
  addReview: (id, data) => api.post(`/products/${id}/reviews`, data),
  updateReview: (productId, reviewId, data) => 
    api.put(`/products/${productId}/reviews/${reviewId}`, data),
  deleteReview: (productId, reviewId) => 
    api.delete(`/products/${productId}/reviews/${reviewId}`),
};

// ═══════════════════════════════════════════════════════════
// CART API
// ═══════════════════════════════════════════════════════════

export const cartAPI = {
  get: () => api.get('/cart'),
  addItem: (data) => api.post('/cart/items', data),
  updateItem: (id, data) => api.put(`/cart/items/${id}`, data),
  removeItem: (id) => api.delete(`/cart/items/${id}`),
  clear: () => api.delete('/cart'),
  applyCoupon: (code) => api.post('/cart/coupon', { code }),
  removeCoupon: () => api.delete('/cart/coupon'),
};

// ═══════════════════════════════════════════════════════════
// ORDER API
// ═══════════════════════════════════════════════════════════

export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getOne: (id) => api.get(`/orders/${id}`),
  cancel: (id, reason) => api.put(`/orders/${id}/cancel`, { reason }),
};

// ═══════════════════════════════════════════════════════════
// ADMIN API
// ═══════════════════════════════════════════════════════════

export const adminAPI = {
  // Products
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  
  // Orders
  getAllOrders: (params) => api.get('/orders', { params }),
  updateOrderStatus: (id, status) => 
    api.put(`/orders/${id}/status`, { status }),
  updatePaymentStatus: (id, paymentStatus) => 
    api.put(`/orders/${id}/payment`, { paymentStatus }),
  
  // Users
  getAllUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  
  // Dashboard
  getDashboardStats: () => api.get('/admin/stats/dashboard'),
};

export const getUsers = () => api.get('/users');
export const deleteUser = (id) => api.delete(`/users/${id}`);

export const adminLogsAPI = {
  getStats: () => api.get('/admin/logs/stats'),
  getSecurityLogs: () => api.get('/admin/logs/security'),
  getAuditLogs: () => api.get('/admin/logs/audit'),
};

export const uploadAPI = {
  /**
   * @param {FormData} formData
   * @returns {Promise<{ image: string }>}
   */
  uploadImage: (formData) => api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

export const contactAPI = {
  submit: (data) => api.post('/messages', data),
  getAll: () => api.get('/messages'),
  markAsRead: (id) => api.put(`/messages/${id}/read`),
  delete: (id) => api.delete(`/messages/${id}`),
};

export default api;