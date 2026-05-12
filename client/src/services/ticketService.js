import { api } from './api';

export const ticketService = {
  getAvailableMatches: () => api.get('/tickets/matches'),
  getMatchSeatAvailability: (id) => api.get(`/tickets/matches/${id}`),
  purchaseTickets: (data) => api.post('/tickets', data),
  payTicket: (bookingRef, data) => api.post(`/tickets/${bookingRef}/pay`, data),
  getTicketByRef: (bookingRef) => api.get(`/tickets/${bookingRef}`),
  getUserTickets: (userId) => api.get(`/tickets/user/${userId}`),
};
