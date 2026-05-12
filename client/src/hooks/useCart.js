import useCartStore from '../store/cartStore';

export const useCart = () => {
  const store = useCartStore();
  return {
    items: store.items,
    itemCount: store.itemCount,
    subtotal: store.subtotal,
    total: store.total,
    promoDiscount: store.promoDiscount,
    isDrawerOpen: store.isDrawerOpen,
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    toggleDrawer: store.toggleDrawer,
    openDrawer: store.openDrawer,
    closeDrawer: store.closeDrawer,
    promoCode: store.promoCode,
    setPromoCode: store.setPromoCode,
    applyPromo: store.applyPromo,
  };
};
