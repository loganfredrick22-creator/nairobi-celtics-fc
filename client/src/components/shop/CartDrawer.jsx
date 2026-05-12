import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Trash2, Minus, Plus } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import { formatCurrency } from '../../utils/formatCurrency';
import ImageWithFallback from '../ui/ImageWithFallback';
import Button from '../ui/Button';

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, removeItem, updateQuantity, subtotal, promoDiscount, promoCode, setPromoCode, applyPromo } = useCartStore();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50" onClick={closeDrawer} />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-surface border-l border-white/5 z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-green" />
                <span className="font-display text-lg text-white">Cart ({items.length})</span>
              </div>
              <button onClick={closeDrawer} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <ShoppingBag size={48} className="mb-3 opacity-30" />
                  <p className="font-body">Your cart is empty</p>
                  <Link to="/shop" onClick={closeDrawer} className="text-green text-sm mt-2 hover:underline">Browse Shop</Link>
                </div>
              ) : (
                items.map((item) => {
                  const price = item.onSale && item.salePrice ? item.salePrice : item.price;
                  return (
                    <div key={`${item._id}-${item.size}`} className="flex gap-3 bg-card rounded-lg p-3">
                      <ImageWithFallback src={item.images?.[0]} alt={item.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-body font-medium text-white truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.size}</p>
                        <p className="text-sm text-green font-semibold mt-1">{formatCurrency(price)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)} className="p-0.5 text-gray-400 hover:text-white"><Minus size={14} /></button>
                          <span className="text-sm w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)} className="p-0.5 text-gray-400 hover:text-white"><Plus size={14} /></button>
                          <button onClick={() => removeItem(item._id, item.size)} className="ml-auto text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-white/5 p-4 space-y-3">
                <div className="flex gap-2">
                  <input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Promo code" className="flex-1 py-2 text-sm" />
                  <Button size="sm" variant="outline" onClick={applyPromo}>Apply</Button>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">{formatCurrency(subtotal)}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green">Discount</span>
                    <span className="text-green">-{formatCurrency(promoDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-semibold">
                  <span className="text-white">Total</span>
                  <span className="text-green">{formatCurrency(Math.max(0, subtotal - promoDiscount))}</span>
                </div>
                <Link to="/checkout" onClick={closeDrawer}>
                  <Button className="w-full" size="lg">Checkout</Button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
