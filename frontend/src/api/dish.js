import { api } from './apiConfig.js';

export const getDishs = async (queryParams = {}) => {
    try {
        console.log('test at apis');

        const query = new URLSearchParams(queryParams).toString();
        console.log(query);

        const response = await api.get(`/dishs?${query}`);
        console.log('responded');
        return response;
    } catch (e) {
        console.log('Error in apis');
        console.log(e);
        throw e;
    }
};

// Lấy danh sách tất cả dish
export const getAllDishs = async (searchQuery) => {
    const response = await api.get(`/dishs?search=${searchQuery}`);
    return response.data;
};

// Lấy thông tin chi tiết dish theo ID
export const getDishById = async (id) => {
    const response = await api.get(`/dishs/${id}`);
    return response.data;
};

// Tạo mới một dish
export const createDish = async (data) => {
    const response = await api.post('/dishs', data);
    return response.data;
};

// Cập nhật dish theo ID
export const updateDish = async (id, data) => {
    const response = await api.put(`/dishs/${id}`, data);
    return response.data;
};

// Xóa dish theo ID
export const deleteDish = async (id) => {
    const response = await api.delete(`/dishs/${id}`);
    return response.data;
};
