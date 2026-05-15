import { create } from 'zustand';

const getInitialTheme = () => {
  try {
    const stored = localStorage.getItem('ncfc-theme');
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {}
  return 'dark';
};

const useUiStore = create((set, get) => ({
  isMobileMenuOpen: false,
  activeModal: null,
  modalData: null,
  isScrolled: false,
  theme: getInitialTheme(),

  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  openModal: (modal, data = null) => set({ activeModal: modal, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  setScrolled: (scrolled) => set({ isScrolled: scrolled }),

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('ncfc-theme', next);
    document.documentElement.setAttribute('data-theme', next);
    set({ theme: next });
  },
}));

export default useUiStore;
