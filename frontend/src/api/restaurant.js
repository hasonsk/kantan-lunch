import { api } from './apiConfig.js';

export const getRestaurants = async (queryParams = {}) => {
  try {
    console.log('test at apis');

    const query = new URLSearchParams(queryParams).toString();
    console.log(query);

    const response = await api.get(`/restaurants?${query}`);
    console.log('responded');
    return response;
  } catch (e) {
    console.log('Error in apis');
    console.log(e);
    throw e;
  }
};

// Lấy danh sách tất cả nhà hàng
export const getAllRestaurants = async (searchQuery) => {
  const response = await api.get(`/restaurants?search=${searchQuery}`);
  return response.data;
};

// Lấy thông tin chi tiết nhà hàng theo ID
export const getRestaurantById = async (id) => {
  const response = await api.get(`/restaurants/${id}`);
  return response.data;
};

// Tạo mới một nhà hàng
export const createRestaurant = async (data) => {
  const response = await api.post('/restaurants', data);
  return response.data;
};

// Cập nhật nhà hàng theo ID
export const updateRestaurant = async (id, data) => {
  const response = await api.put(`/restaurants/${id}`, data);
  return response.data;
};

// Xóa nhà hàng theo ID
export const deleteRestaurant = async (id) => {
  const response = await api.delete(`/restaurants/${id}`);
  return response.data;
};
