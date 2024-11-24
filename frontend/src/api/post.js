import axios from 'axios';

// Cấu hình base URL cho Axios
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Lấy danh sách tất cả post
export const getAllPosts = async () => {
  const response = await api.get('/posts');
  return response.data;
};

// Lấy thông tin chi tiết post theo ID
export const getPostById = async (id) => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};

// Tạo mới một post
export const createPost = async (data) => {
  const response = await api.post('/posts', data);
  return response.data;
};

// Cập nhật post theo ID
export const updatePost = async (id, data) => {
  const response = await api.put(`/posts/${id}`, data);
  return response.data;
};

// Xóa post theo ID
export const deletePost = async (id) => {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
};
