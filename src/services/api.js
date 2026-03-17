import axios from 'axios';
import toast from 'react-hot-toast';

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

// Request interceptor - Add logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method.toUpperCase()} ${config.url}`);
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
    console.log(`✅ API Response: ${response.config.url}`, response.data);
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
      
      // Don't show toast here - let component handle it
      return Promise.reject({
        message: errorMsg,
        isNetworkError: true,
      });
    }

    // Server responded with error
    const { status, data } = error.response;
    console.error(`Server Error: ${status}`, data);

    // Handle specific status codes
    switch (status) {
      case 400:
        // Bad Request - validation errors
        console.log('Validation Error:', data);
        break;

      case 401:
        // Unauthorized - invalid credentials or no token
        console.log('Unauthorized:', data.message);
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/register')) {
          localStorage.removeItem('user');
          // Don't redirect immediately - let component handle it
        }
        break;

      case 403:
        // Forbidden - user doesn't have permission
        console.log('Forbidden:', data.message);
        break;

      case 404:
        // Not Found
        console.log('Not Found:', data.message);
        break;

      case 423:
        // Locked - account locked
        console.log('Account Locked:', data.message);
        break;

      case 429:
        // Too Many Requests - rate limited
        console.log('Rate Limited:', data.message);
        break;

      case 500:
      case 502:
      case 503:
        // Server Error
        console.log('Server Error:', data.message);
        break;

      default:
        console.log('Unknown Error:', status, data);
    }

    // Return error with response data
    return Promise.reject(error);
  }
);

// ═══════════════════════════════════════════════════════════
// AUTH API
// ═══════════════════════════════════════════════════════════

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data),
  addAddress: (data) => api.post('/auth/addresses', data),
  updateAddress: (id, data) => api.put(`/auth/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/auth/addresses/${id}`),
  getWishlist: () => api.get('/auth/wishlist'),
  addToWishlist: (productId) => api.post(`/auth/wishlist/${productId}`),
  removeFromWishlist: (productId) => api.delete(`/auth/wishlist/${productId}`),
};

// ═══════════════════════════════════════════════════════════
// PRODUCT API
// ═══════════════════════════════════════════════════════════

export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getOne: (id) => api.get(`/products/${id}`),
  getFeatured: () => api.get('/products/featured'),
  getNewArrivals: () => api.get('/products/new-arrivals'),
  getBestSellers: () => api.get('/products/best-sellers'),
  getRelated: (id) => api.get(`/products/${id}/related`),
  getFilters: () => api.get('/products/filters/options'),
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
  uploadImage: (formData) => api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

export default api;