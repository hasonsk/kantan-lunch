import { api } from './apiConfig.js';

// Register
export const register = async (data) => {
  const response = await api.post('/users/register', data);
  return response.data;
};

// Login
export const login = async (data) => {
  const response = await api.post('/users/login', data);
  return response.data;
};

// lấy profile người dùng hiện tại
export const getProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

// Lấy danh sách tất cả người dùng
export const updateProfile = async (data) => {
  const response = await api.post('/users/profile', data);
  return response.data;
};

// Register
export const registerAdmin = async (data) => {
  const response = await api.post('/users/register-admin', data);
  return response.data;
};

// Lấy danh sách tất cả người dùng
export const getAllUsers = async () => {
  const response = await api.get('/users/');
  return response.data;
};

// Lấy người dùng theo ID
export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// Update ban người dùng theo ID
export const updateBanUser = async (id) => {
  const response = await api.delete(`/users/${id}/ban`);
  return response.data;
};
