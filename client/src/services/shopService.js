import { api } from './api';

export const shopService = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  createOrder: (data) => api.post('/orders', data),
  createGuestOrder: (data) => api.post('/orders/guest', data),
  getOrder: (orderId) => api.get(`/orders/${orderId}`),
  getUserOrders: (userId) => api.get(`/orders/user/${userId}`),
  payOrder: (orderId, data) => api.post(`/orders/${orderId}/pay`, data),
};
