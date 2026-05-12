import { create } from 'zustand';

const useUiStore = create((set) => ({
  isMobileMenuOpen: false,
  activeModal: null,
  modalData: null,
  isScrolled: false,

  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  openModal: (modal, data = null) => set({ activeModal: modal, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  setScrolled: (scrolled) => set({ isScrolled: scrolled }),
}));

export default useUiStore;
