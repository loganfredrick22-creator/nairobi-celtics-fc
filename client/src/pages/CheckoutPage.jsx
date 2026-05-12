import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { shopService } from '../services/shopService';
import { formatCurrency } from '../utils/formatCurrency';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const steps = ['Review Cart', 'Delivery', 'Payment', 'Confirm'];
const deliveryOptions = [
  { value: 'clickcollect', label: 'Click & Collect', price: 0, desc: 'Megastore Gate 3 (Mon–Sat 9am–7pm)' },
  { value: 'nairobi', label: 'Nairobi Same-Day', price: 350, desc: 'Order before 12pm' },
  { value: 'nationwide', label: 'Nationwide', price: 500, desc: '3–5 business days' },
  { value: 'eastafrica', label: 'East Africa', price: 1500, desc: '7–10 business days' },
  { value: 'international', label: 'International', price: 3500, desc: '14–21 business days' },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, promoDiscount, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [step, setStep] = useState(0);
  const [delivery, setDelivery] = useState({ method: 'clickcollect', fullName: user ? `${user.firstName} ${user.lastName}` : '', email: user?.email || '', phone: user?.phone || '', street: '', city: '', county: '' });
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [processing, setProcessing] = useState(false);

  const deliveryFee = deliveryOptions.find((d) => d.value === delivery.method)?.price || 0;
  const total = Math.max(0, subtotal - promoDiscount + deliveryFee);

  const handlePlaceOrder = async () => {
    setProcessing(true);
    try {
      const orderData = {
        items: items.map((i) => ({ productId: i._id, size: i.size, quantity: i.quantity })),
        deliveryMethod: delivery.method,
        deliveryAddress: delivery,
        paymentMethod,
      };

      if (!user) orderData.guestEmail = delivery.email;
      const { data } = await shopService.createOrder(orderData);
      const order = data.data.order;

      const payData = {};
      if (paymentMethod === 'mpesa') payData.phone = delivery.phone;
      await shopService.payOrder(order.orderNumber, payData);

      clearCart();
      navigate(`/order-success?order=${order.orderNumber}`);
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (items.length === 0 && step === 0) {
    return (
      <div className="pt-20 text-center py-20">
        <p className="text-gray-500">Your cart is empty.</p>
        <Button onClick={() => navigate('/shop')} className="mt-4">Go to Shop</Button>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <section className="py-12 bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-display text-white mb-2">
            Check<span className="text-green">out</span>
          </motion.h1>
          <div className="flex items-center gap-2 mt-4">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${i <= step ? 'bg-green text-black' : 'bg-card text-gray-500'}`}>
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                <span className={`text-xs ${i <= step ? 'text-green' : 'text-gray-500'}`}>{s}</span>
                {i < steps.length - 1 && <div className={`w-8 h-0.5 ${i < step ? 'bg-green' : 'bg-card'}`} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {step === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="font-display text-xl text-white mb-4">Review Your Cart</h2>
              <div className="space-y-3">
                {items.map((item) => {
                  const price = item.onSale && item.salePrice ? item.salePrice : item.price;
                  return (
                    <div key={`${item._id}-${item.size}`} className="bg-card rounded-lg p-3 flex gap-3 border border-white/5">
                      <ImageWithFallback src={item.images?.[0]} alt={item.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{item.name}</p>
                        <p className="text-xs text-gray-400">Size: {item.size} | Qty: {item.quantity}</p>
                        <p className="text-sm text-green">{formatCurrency(price * item.quantity)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button onClick={() => setStep(1)} className="mt-6">Continue to Delivery</Button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="font-display text-xl text-white mb-4">Delivery Details</h2>
              <div className="space-y-3">
                <input value={delivery.fullName} onChange={(e) => setDelivery({ ...delivery, fullName: e.target.value })} placeholder="Full Name" required className="w-full" />
                <input type="email" value={delivery.email} onChange={(e) => setDelivery({ ...delivery, email: e.target.value })} placeholder="Email" required className="w-full" />
                <input value={delivery.phone} onChange={(e) => setDelivery({ ...delivery, phone: e.target.value })} placeholder="Phone (+254...)" required className="w-full" />
                <input value={delivery.street} onChange={(e) => setDelivery({ ...delivery, street: e.target.value })} placeholder="Street Address" required className="w-full" />
                <div className="grid grid-cols-2 gap-3">
                  <input value={delivery.city} onChange={(e) => setDelivery({ ...delivery, city: e.target.value })} placeholder="City" required />
                  <input value={delivery.county} onChange={(e) => setDelivery({ ...delivery, county: e.target.value })} placeholder="County" required />
                </div>
              </div>
              <h3 className="font-display text-lg text-green mt-6 mb-3">Delivery Method</h3>
              <div className="space-y-2">
                {deliveryOptions.map((opt) => (
                  <label key={opt.value} className={`flex items-center gap-3 bg-card rounded-lg p-3 border cursor-pointer transition-all ${delivery.method === opt.value ? 'border-green' : 'border-white/5'}`}>
                    <input type="radio" name="delivery" value={opt.value} checked={delivery.method === opt.value} onChange={() => setDelivery({ ...delivery, method: opt.value })} className="accent-green" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{opt.label}</p>
                      <p className="text-xs text-gray-400">{opt.desc}</p>
                    </div>
                    <span className="text-sm text-green font-display">{opt.price === 0 ? 'Free' : formatCurrency(opt.price)}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="ghost" onClick={() => setStep(0)}>Back</Button>
                <Button onClick={() => setStep(2)}>Continue to Payment</Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="font-display text-xl text-white mb-4">Payment Method</h2>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {['mpesa', 'card', 'airtel', 'paypal'].map((m) => (
                  <button key={m} onClick={() => setPaymentMethod(m)}
                    className={`bg-card rounded-lg p-4 border text-center capitalize transition-all ${paymentMethod === m ? 'border-green bg-green/5' : 'border-white/5'}`}
                  >{m}</button>
                ))}
              </div>

              {paymentMethod === 'mpesa' && (
                <div className="bg-card rounded-lg p-4 border border-white/5">
                  <p className="text-sm text-gray-400 mb-2">M-Pesa STK Push will be sent to your phone.</p>
                  <p className="text-sm text-white">Phone: {delivery.phone || 'Not provided'}</p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <input placeholder="Card Number" className="w-full" />
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="MM/YY" className="w-full" />
                    <input placeholder="CVV" className="w-full" />
                  </div>
                </div>
              )}

              <div className="bg-card rounded-lg p-4 border border-white/5 mt-6">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Delivery</span><span>{deliveryFee === 0 ? 'Free' : formatCurrency(deliveryFee)}</span></div>
                  {promoDiscount > 0 && <div className="flex justify-between"><span className="text-green">Discount</span><span className="text-green">-{formatCurrency(promoDiscount)}</span></div>}
                  <div className="flex justify-between text-lg font-semibold border-t border-white/5 pt-2"><span className="text-white">Total</span><span className="text-green">{formatCurrency(total)}</span></div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)}>Review Order</Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="font-display text-xl text-white mb-4">Confirm Order</h2>
              <div className="bg-card rounded-lg p-4 border border-white/5 space-y-2 text-sm mb-6">
                <p><span className="text-gray-400">Delivery:</span> <span className="text-white">{delivery.fullName}, {delivery.city}</span></p>
                <p><span className="text-gray-400">Method:</span> <span className="text-white capitalize">{delivery.method}</span></p>
                <p><span className="text-gray-400">Payment:</span> <span className="text-white capitalize">{paymentMethod}</span></p>
                <p><span className="text-gray-400">Items:</span> <span className="text-white">{items.length}</span></p>
                <div className="border-t border-white/5 pt-2 flex justify-between text-lg">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-green font-display">{formatCurrency(total)}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={handlePlaceOrder} loading={processing} disabled={processing} className="flex-1">
                  {processing ? 'Processing...' : `Pay ${formatCurrency(total)}`}
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
