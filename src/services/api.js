import axios from 'axios';

// 1. Create the Axios Instance
const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. The "Interceptor" (The Magic)
// Before every request, check if we have a token in localStorage.
// If yes, attach it to the header.
API.interceptors.request.use(
    (req) => {
        const token = localStorage.getItem('authToken') || (localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : null);
        if (token) {
            req.headers.Authorization = `Bearer ${token}`;
        }
        return req;
    },
    (error) => Promise.reject(error)
);

// 3. API Endpoints

// --- USER AUTH ---
export const login = (email, password) => API.post('/users/login', { email, password });
export const register = (name, email, password) => API.post('/users', { name, email, password });

// --- PRODUCTS ---
// keyword = search term, pageNumber = pagination (future proofing)
export const fetchProducts = (keyword = '') => API.get(`/products?keyword=${keyword}`);
export const fetchProductDetails = (id) => API.get(`/products/${id}`);

// --- ORDERS ---
export const createOrder = (orderData) => API.post('/orders', orderData);

// --- UPLOAD ---
export const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data', // Crucial for files
        },
    };

    const { data } = await API.post('/upload', formData, config);
    return data; // Returns the image path string
};

// --- ADMIN USERS ---
export const getUsers = () => API.get('/users');
export const deleteUser = (id) => API.delete(`/users/${id}`);

// --- ADMIN PRODUCTS ---
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const createProduct = (productData) => API.post('/products', productData);
export const updateProduct = (product) => API.put(`/products/${product._id}`, product);

// --- ADMIN ORDERS ---
export const getOrders = () => API.get('/orders');
export const deliverOrder = (id) => API.put(`/orders/${id}/deliver`);
export const getOrderStats = () => API.get('/orders/stats');

// --- NEWSLETTER ---
export const getSubscribers = () => API.get('/newsletter');
export const subscribeToNewsletter = (email) => API.post('/newsletter', { email });

// --- LEGACY EXPORTS (Restoring compatibility) ---

export const authAPI = {
    login: async ({ email, password }) => {
        const { data } = await API.post('/users/login', { email, password });
        if (data) {
            localStorage.setItem('userInfo', JSON.stringify(data));
            localStorage.setItem('authToken', data.token);
        }
        return data;
    },
    register: async ({ name, email, password }) => {
        const { data } = await API.post('/users', { name, email, password });
        if (data) {
            localStorage.setItem('userInfo', JSON.stringify(data));
            localStorage.setItem('authToken', data.token);
        }
        return data;
    },
    getCurrentUser: async () => {
        // Backend missing /me route, fallback to local storage
        const userInfo = localStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo) : null;
    },
    logout: () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('authToken');
    }
};

export const productsAPI = {
    getAll: async () => {
        const { data } = await API.get('/products');
        // Handle various response structures
        if (Array.isArray(data)) return data;
        if (data.products) return data.products;
        return [];
    },
    getById: async (id) => {
        const { data } = await API.get(`/products/${id}`);
        return data;
    }
};

export const ordersAPI = {
    create: async (orderData) => {
        const { data } = await API.post('/orders', orderData);
        return data;
    }
};

export const uploadAPI = {
    upload: async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        const { data } = await API.post('/upload', formData, config);
        return data;
    }
};

export const orderAPI = {
    getOrder: async (id) => {
        const { data } = await API.get(`/orders/${id}`);
        return data;
    }
};

export default API;