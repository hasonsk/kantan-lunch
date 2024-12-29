import { api } from './apiConfig.js';

export const getDishs = async (queryParams = {}) => {
    try {
        console.log('test at apis');

        const query = new URLSearchParams(queryParams).toString();
        console.log(query);

        const response = await api.get(`/dishes?${query}`);
        console.log('responded');
        return response;
    } catch (e) {
        console.log('Error in apis');
        console.log(e);
        throw e;
    }
};

export const getDishesByRestaurantId = async (restaurantId) => {
    try {
        const response = await api.get(`/dishes?restaurant_id=${restaurantId}`);
        return response.data;
    } catch (e) {
        console.log(e);
    }
}

// Lấy danh sách tất cả dish
export const getAllDishs = async (searchQuery) => {
    const response = await api.get(`/dishes?search=${searchQuery}`);
    return response.data;
};

// Lấy thông tin chi tiết dish theo ID
export const getDishById = async (id) => {
    const response = await api.get(`/dishes/${id}`);
    return response.data;
};

// Tạo mới một dish
export const createDish = async (data) => {
    const response = await api.post('/dishes', data);
    return response.data;
};

// Cập nhật dish theo ID
export const updateDish = async (id, data) => {
    const response = await api.put(`/dishes/${id}`, data);
    return response.data;
};

// Xóa dish theo ID
export const deleteDish = async (id) => {
    const response = await api.delete(`/dishes/${id}`);
    return response.data;
};
