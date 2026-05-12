import { api } from './api';

export const newsService = {
  getNews: (params) => api.get('/news', { params }),
  getArticle: (slug) => api.get(`/news/${slug}`),
};
