import axios from 'axios';

// Cấu hình base URL cho Axios
export const api = axios.create({
    baseURL: '/api',
});

// Thêm interceptor để gắn bearer token nếu có
api.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

//DONT SET THE HEADER CONTENT TYPE, I NEED AXIOS TO DETECT THE FORMDATA
