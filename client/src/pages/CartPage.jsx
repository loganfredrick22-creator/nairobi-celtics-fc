import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';
import useCartStore from '../store/cartStore';
import { formatCurrency } from '../utils/formatCurrency';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import Button from '../components/ui/Button';

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, promoDiscount, promoCode, setPromoCode, applyPromo } = useCartStore();

  return (
    <div className="pt-20">
      <section className="py-12 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl lg:text-5xl font-display text-white">
            Shopping <span className="text-green">Cart</span>
          </motion.h1>
        </div>
      </section>

      <section className="py-12 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag size={64} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-500 mb-4">Your cart is empty.</p>
              <Link to="/shop"><Button>Continue Shopping</Button></Link>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => {
                const price = item.onSale && item.salePrice ? item.salePrice : item.price;
                return (
                  <div key={`${item._id}-${item.size}`} className="bg-card rounded-xl p-4 border border-white/5 flex gap-4 items-center">
                    <ImageWithFallback src={item.images?.[0]} alt={item.name} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-medium text-white">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.size}</p>
                      <p className="text-green font-display text-lg mt-1">{formatCurrency(price)}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-card border border-white/10 rounded-lg">
                      <button onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)} className="p-2 text-gray-400 hover:text-white"><Minus size={14} /></button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)} className="p-2 text-gray-400 hover:text-white"><Plus size={14} /></button>
                    </div>
                    <p className="text-white font-display text-lg w-24 text-right">{formatCurrency(price * item.quantity)}</p>
                    <button onClick={() => removeItem(item._id, item.size)} className="text-red-400 hover:text-red-300 p-2"><Trash2 size={16} /></button>
                  </div>
                );
              })}

              <div className="bg-card rounded-xl p-6 border border-white/5 mt-6">
                <div className="flex gap-2 items-center mb-4">
                  <input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Promo code" className="flex-1" />
                  <Button variant="outline" size="sm" onClick={applyPromo}>Apply</Button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Subtotal</span><span className="text-white">{formatCurrency(subtotal)}</span></div>
                  {promoDiscount > 0 && <div className="flex justify-between"><span className="text-green">Discount</span><span className="text-green">-{formatCurrency(promoDiscount)}</span></div>}
                  <div className="flex justify-between text-lg font-semibold border-t border-white/5 pt-2"><span className="text-white">Total</span><span className="text-green">{formatCurrency(Math.max(0, subtotal - promoDiscount))}</span></div>
                </div>
                <Link to="/checkout" className="block mt-4"><Button className="w-full" size="lg">Proceed to Checkout</Button></Link>
              </div>

              <div className="text-center mt-4">
                <Link to="/shop" className="text-gray-400 hover:text-green text-sm inline-flex items-center gap-1"><ArrowLeft size={14} /> Continue Shopping</Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
