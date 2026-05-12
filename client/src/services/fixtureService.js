import { api } from './api';

export const fixtureService = {
  getFixtures: (params) => api.get('/fixtures', { params }),
  getNextFixture: () => api.get('/fixtures/next'),
  getRecentFixtures: () => api.get('/fixtures/recent'),
  getFixture: (id) => api.get(`/fixtures/${id}`),
  getSeasonTable: () => api.get('/season/table'),
  getSeasonStats: () => api.get('/season/stats'),
};
