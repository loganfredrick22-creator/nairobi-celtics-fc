import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  items: [],
  promoCode: '',
  promoDiscount: 0,
  isDrawerOpen: false,

  addItem: (product, size, quantity = 1) => {
    const items = get().items;
    const existing = items.find((i) => i._id === product._id && i.size === size);
    if (existing) {
      set({ items: items.map((i) => i._id === product._id && i.size === size ? { ...i, quantity: i.quantity + quantity } : i) });
    } else {
      set({ items: [...items, { ...product, size, quantity }] });
    }
  },

  removeItem: (productId, size) => {
    set({ items: get().items.filter((i) => !(i._id === productId && i.size === size)) });
  },

  updateQuantity: (productId, size, quantity) => {
    if (quantity < 1) return;
    set({ items: get().items.map((i) => i._id === productId && i.size === size ? { ...i, quantity } : i) });
  },

  clearCart: () => set({ items: [], promoCode: '', promoDiscount: 0 }),

  toggleDrawer: () => set({ isDrawerOpen: !get().isDrawerOpen }),
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),

  setPromoCode: (code) => set({ promoCode: code }),
  applyPromo: () => {
    const code = get().promoCode.toUpperCase();
    const validCodes = { 'CELTICS10': 0.1, 'GREEN10': 0.1, 'NCFC20': 0.2 };
    if (validCodes[code]) {
      const subtotal = get().subtotal;
      set({ promoDiscount: Math.round(subtotal * validCodes[code]) });
      return true;
    }
    return false;
  },

  get subtotal() {
    return get().items.reduce((sum, item) => {
      const price = item.onSale ? item.salePrice || item.price : item.price;
      return sum + price * item.quantity;
    }, 0);
  },

  get total() {
    const subtotal = get().subtotal;
    return Math.max(0, subtotal - get().promoDiscount);
  },

  get itemCount() {
    return get().items.reduce((sum, i) => sum + i.quantity, 0);
  },
}));

export default useCartStore;
