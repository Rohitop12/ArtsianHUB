import axios from 'axios';

const BASE_URL = `http://${window.location.hostname}:5001/api`;

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach JWT token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('artisanhub_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Global response error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('artisanhub_token');
            localStorage.removeItem('artisanhub_user');
        }
        return Promise.reject(error);
    }
);

export default api;
