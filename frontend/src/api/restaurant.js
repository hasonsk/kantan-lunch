import { api } from './apiConfig.js';

// Lấy danh sách tất cả nhà hàng
export const getAllRestaurants = async () => {
  const response = await api.get('/restaurants');
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