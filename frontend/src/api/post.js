import axios from 'axios';

// Cấu hình base URL cho Axios
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const formDataAPI = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Lấy danh sách tất cả post
export const getAllPosts = async (option = {}) => {
  try {
    const { page = 1, limit = 10, type = 'Feedback', userId } = option;
    const response = await api.get('/posts', {
      params: {
        page: page,
        limit: limit,
        type: type,
        userId: userId, //this is mandatory
      },
    });
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const getPostsByRestaurantId = async (restaurantId) => {
  try {
    const response = await api.get(`/posts?restaurant_id=${restaurantId}`);
    return response.data;
  } catch (e) {
    console.log(e);
  }
}

// Lấy thông tin chi tiết post theo ID
export const getPostById = async (id) => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};

// Tạo mới một post
export const createPost = async (data) => {
  // attch the token
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  formDataAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  const response = await formDataAPI.post('/posts', data);
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
