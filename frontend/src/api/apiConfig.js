import axios from 'axios';

// Cấu hình base URL cho Axios
export const api = axios.create({
    baseURL: '/api',
});

//DONT SET THE HEADER CONTENT TYPE, I NEED AXIOS TO DETECT THE FORMDATA
