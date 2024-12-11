import axios from 'axios';

// Cấu hình base URL cho Axios
export const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});