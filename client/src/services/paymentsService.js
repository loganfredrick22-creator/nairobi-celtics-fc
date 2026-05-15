import { api } from './api';

export const paymentsService = {
  getConfig: () => api.get('/payments/config'),
  createPaymentIntent: (amount, currency, orderNumber) =>
    api.post('/payments/create-payment-intent', { amount, currency, orderNumber }),
  getPaymentIntent: (id) => api.get(`/payments/payment-intent/${id}`),
};
