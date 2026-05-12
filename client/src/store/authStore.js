import { create } from 'zustand';
import { api } from '../services/api';

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setAccessToken: (token) => set({ accessToken: token }),
  setLoading: (loading) => set({ loading }),

  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    set({ user: data.data.user, accessToken: data.data.accessToken, isAuthenticated: true });
    return data;
  },

  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    set({ user: data.data.user, accessToken: data.data.accessToken, isAuthenticated: true });
    return data;
  },

  logout: async () => {
    try { await api.post('/auth/logout'); } catch {}
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  refreshAuth: async () => {
    try {
      const { data } = await api.post('/auth/refresh');
      set({ accessToken: data.data.accessToken });
      return data.data.accessToken;
    } catch {
      set({ user: null, accessToken: null, isAuthenticated: false });
      return null;
    }
  },

  fetchMe: async () => {
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.data.user, isAuthenticated: true, loading: false });
    } catch {
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },
}));

export default useAuthStore;
