import axios from 'axios';
import { useAuthStore } from '../../store/authStore.js';

const getBaseURL = () => {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    if (typeof window !== 'undefined') {
        const { hostname } = window.location;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:5005/api';
        }
    }
    return 'https://rush-jewels.onrender.com/api';
};

const adminApi = axios.create({
    baseURL: getBaseURL(),
    headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token
adminApi.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Handle 401
adminApi.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) {
            import('../../store/authStore.js').then(({ useAuthStore }) => {
                useAuthStore.getState().logout();
                window.location.href = '/login';
            });
        }
        return Promise.reject(error);
    }
);

export default adminApi;
