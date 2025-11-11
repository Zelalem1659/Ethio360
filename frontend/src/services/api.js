import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
            headers: { Authorization: `Bearer ${refreshToken}` }
          });
          
          const newToken = response.data.access_token;
          localStorage.setItem('access_token', newToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (currentPassword, newPassword) => 
    api.post('/auth/change-password', { current_password: currentPassword, new_password: newPassword }),
  refresh: () => api.post('/auth/refresh'),
};

// Articles API
export const articlesAPI = {
  getArticles: (params = {}) => api.get('/articles', { params }),
  getArticle: (slug) => api.get(`/articles/slug/${slug}`),
  getFeaturedArticles: () => api.get('/featured-articles'),
  getBreakingNews: () => api.get('/breaking-news'),
  getArticlesByCategory: (category, params = {}) => 
    api.get('/articles', { params: { category, ...params } }),
  searchArticles: (query, params = {}) => 
    api.get('/search', { params: { q: query, ...params } }),
  createArticle: (articleData) => api.post('/articles', articleData),
  updateArticle: (id, articleData) => api.put(`/articles/${id}`, articleData),
  deleteArticle: (id) => api.delete(`/articles/${id}`),
  likeArticle: (id) => api.post(`/articles/${id}/like`),
  shareArticle: (id) => api.post(`/articles/${id}/share`),
};

// Subscriptions API
export const subscriptionsAPI = {
  getPlans: () => api.get('/subscriptions/plans'),
  getCurrentSubscription: () => api.get('/subscriptions/current'),
  createPaymentIntent: (planType) => 
    api.post('/subscriptions/create-payment-intent', { plan_type: planType }),
  confirmPayment: (paymentData) => api.post('/subscriptions/confirm-payment', paymentData),
  cancelSubscription: () => api.post('/subscriptions/cancel'),
};

// Donations API
export const donationsAPI = {
  createPaymentIntent: (donationData) => 
    api.post('/donations/create-payment-intent', donationData),
  confirmDonation: (paymentData) => api.post('/donations/confirm', paymentData),
  getDonationHistory: (params = {}) => api.get('/donations/history', { params }),
  getRecentDonations: (limit = 10) => 
    api.get('/donations/recent', { params: { limit } }),
  getDonationStats: () => api.get('/donations/stats'),
};

// Admin API
export const adminAPI = {
  // Users management
  getUsers: (params = {}) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
  // Content management
  getAllArticles: (params = {}) => api.get('/admin/articles', { params }),
  updateArticleStatus: (id, status) => 
    api.put(`/admin/articles/${id}/status`, { status }),
  
  // Analytics
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getSubscriptionStats: () => api.get('/admin/subscriptions/stats'),
  getDonationStats: () => api.get('/admin/donations/stats'),
  getUserStats: () => api.get('/admin/users/stats'),
};

// Comments API
export const commentsAPI = {
  getComments: (articleId, params = {}) => 
    api.get(`/articles/${articleId}/comments`, { params }),
  createComment: (articleId, content, parentId = null) => 
    api.post(`/articles/${articleId}/comments`, { content, parent_id: parentId }),
  updateComment: (commentId, content) => 
    api.put(`/comments/${commentId}`, { content }),
  deleteComment: (commentId) => api.delete(`/comments/${commentId}`),
};

export default api;