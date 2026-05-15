import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CreditCard, Smartphone, Shield, ArrowLeft, AlertCircle, Phone, Loader2, Building2, Globe, ShoppingBag } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { shopService } from '../services/shopService';
import { formatCurrency } from '../utils/formatCurrency';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const steps = ['Review', 'Delivery', 'Payment', 'Pay'];

const deliveryOptions = [
  { value: 'clickcollect', label: 'Click & Collect', price: 0, desc: 'Megastore Gate 3 (Mon–Sat 9am–7pm)' },
  { value: 'nairobi', label: 'Nairobi Same-Day', price: 350, desc: 'Order before 12pm' },
  { value: 'nationwide', label: 'Nationwide', price: 500, desc: '3–5 business days' },
  { value: 'eastafrica', label: 'East Africa', price: 1500, desc: '7–10 business days' },
  { value: 'international', label: 'International', price: 3500, desc: '14–21 business days' },
];

const paymentMethods = [
  { id: 'mpesa', label: 'M-Pesa', icon: Smartphone, desc: 'STK Push to your phone' },
  { id: 'card', label: 'Card', icon: CreditCard, desc: 'Visa, Mastercard, Amex' },
  { id: 'airtel', label: 'Airtel Money', icon: Phone, desc: 'Airtel Money STK Push' },
  { id: 'paypal', label: 'PayPal', icon: Globe, desc: 'Pay with PayPal account' },
];

const cardIcons = { Visa: '💳', Mastercard: '💳', 'American Express': '💳', Discover: '💳' };

const formatCardNumber = (v) => v.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);

const formatExpiry = (v) => {
  const d = v.replace(/\D/g, '');
  if (d.length > 2) return d.slice(0, 2) + '/' + d.slice(2, 4);
  return d;
};

const detectCardType = (n) => {
  const c = n.replace(/\s/g, '');
  if (/^4/.test(c)) return 'Visa';
  if (/^5[1-5]/.test(c)) return 'Mastercard';
  if (/^3[47]/.test(c)) return 'American Express';
  if (/^6(?:011|5)/.test(c)) return 'Discover';
  return '';
};

const mpesaPrefixes = ['070', '071', '072', '074', '075', '076', '079', '010', '011'];
const isValidMpesaPhone = (p) => {
  const d = p.replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('254')) return mpesaPrefixes.some((pre) => d.startsWith('254' + pre.slice(1)));
  if (d.length === 10 && d.startsWith('07')) return mpesaPrefixes.some((pre) => d.startsWith('0' + pre.slice(1)));
  return false;
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, promoDiscount, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [step, setStep] = useState(0);
  const [delivery, setDelivery] = useState({
    method: 'clickcollect', fullName: user ? `${user.firstName} ${user.lastName}` : '',
    email: user?.email || '', phone: user?.phone || '', street: '', city: '', county: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [processing, setProcessing] = useState(false);
  const [payState, setPayState] = useState('idle'); // idle | stk_sent | authenticating | success | failed
  const [payError, setPayError] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [cardErrors, setCardErrors] = useState({});
  const [phoneInput, setPhoneInput] = useState(user?.phone || '');
  const [phoneError, setPhoneError] = useState('');
  const orderRef = useRef(null);

  const deliveryFee = deliveryOptions.find((d) => d.value === delivery.method)?.price || 0;
  const total = Math.max(0, subtotal - promoDiscount + deliveryFee);

  const validateCard = () => {
    const errs = {};
    const cleaned = cardDetails.number.replace(/\s/g, '');
    if (!cleaned || cleaned.length < 13) errs.number = 'Enter a valid card number';
    if (!cardDetails.expiry || cardDetails.expiry.length < 5) errs.expiry = 'Enter MM/YY';
    if (cardDetails.expiry.length >= 5) {
      const [mm, yy] = cardDetails.expiry.split('/');
      const now = new Date();
      if (parseInt(yy) < now.getFullYear() % 100 || (parseInt(yy) === now.getFullYear() % 100 && parseInt(mm) < now.getMonth() + 1)) {
        errs.expiry = 'Card has expired';
      }
    }
    const ct = detectCardType(cleaned);
    const expectedCvv = ct === 'American Express' ? 4 : 3;
    if (!cardDetails.cvv || cardDetails.cvv.length !== expectedCvv) errs.cvv = `${expectedCvv} digits required`;
    if (!cardDetails.name.trim()) errs.name = 'Enter cardholder name';
    setCardErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'card' && !validateCard()) return;
    if ((paymentMethod === 'mpesa' || paymentMethod === 'airtel') && !phoneInput.trim()) {
      setPhoneError('Enter your phone number');
      return;
    }
    if ((paymentMethod === 'mpesa' || paymentMethod === 'airtel') && !isValidMpesaPhone(phoneInput)) {
      setPhoneError('Enter a valid Safaricom number (e.g. 0712 345 678)');
      return;
    }

    setProcessing(true);
    setPayError('');
    setPayState('idle');

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
      orderRef.current = order;

      if (paymentMethod === 'mpesa' || paymentMethod === 'airtel') {
        setPayState('stk_sent');
        await new Promise((r) => setTimeout(r, 2500));
        setPayState('authenticating');
        await new Promise((r) => setTimeout(r, 1500));
      }

      if (paymentMethod === 'paypal') {
        setPayState('authenticating');
        await new Promise((r) => setTimeout(r, 3000));
      }

      const payData = {};
      if (paymentMethod === 'mpesa' || paymentMethod === 'airtel') payData.phone = phoneInput;
      if (paymentMethod === 'card') {
        payData.cardNumber = cardDetails.number;
        payData.expiry = cardDetails.expiry;
        payData.cvv = cardDetails.cvv;
        payData.name = cardDetails.name;
      }

      await shopService.payOrder(order.orderNumber, payData);

      setPayState('success');
      await new Promise((r) => setTimeout(r, 1000));
      clearCart();
      navigate(`/order-success?order=${order.orderNumber}`);
      toast.success('Payment successful!');
    } catch (err) {
      setPayState('failed');
      const msg = err.response?.data?.message || 'Payment failed. Please try again.';
      setPayError(msg);
      toast.error(msg);
    } finally {
      setProcessing(false);
    }
  };

  if (items.length === 0 && step === 0) {
    return (
      <div className="pt-20 text-center py-20 max-w-lg mx-auto px-4">
        <ShoppingBag size={48} className="mx-auto mb-4 text-gray-500" />
        <p className="text-gray-500">Your cart is empty.</p>
        <Button onClick={() => navigate('/shop')} className="mt-4">Go to Shop</Button>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <section className="py-8 lg:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg hover:bg-card transition-colors"><ArrowLeft size={20} className="text-gray-400" /></button>
            <h1 className="text-3xl lg:text-4xl font-display">Secure <span className="text-green">Checkout</span></h1>
          </div>

          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${i <= step ? 'bg-green text-black' : 'bg-card text-gray-500'}`}>
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                <span className={`text-xs hidden sm:inline ${i <= step ? 'text-green font-medium' : 'text-gray-500'}`}>{s}</span>
                {i < steps.length - 1 && <div className={`w-6 sm:w-10 h-0.5 ${i < step ? 'bg-green' : 'bg-card'}`} />}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {step === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-lg font-display mb-4">Review Items ({items.length})</h2>
                  <div className="space-y-3">
                    {items.map((item) => {
                      const price = item.onSale && item.salePrice ? item.salePrice : item.price;
                      return (
                        <div key={`${item._id}-${item.size}`} className="bg-card rounded-xl p-3 flex gap-3 border border-white/5">
                          <ImageWithFallback src={item.images?.[0]} alt={item.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{item.name}</p>
                            <p className="text-xs text-gray-400">Size: {item.size} &middot; Qty: {item.quantity}</p>
                            <p className="text-sm text-green font-display mt-1">{formatCurrency(price * item.quantity)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <Button onClick={() => setStep(1)} className="mt-6 w-full sm:w-auto">Continue to Delivery</Button>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-lg font-display mb-4">Delivery Details</h2>
                  <div className="bg-card rounded-xl p-4 border border-white/5 space-y-3">
                    <input value={delivery.fullName} onChange={(e) => setDelivery({ ...delivery, fullName: e.target.value })} placeholder="Full Name" required className="w-full" />
                    <input type="email" value={delivery.email} onChange={(e) => setDelivery({ ...delivery, email: e.target.value })} placeholder="Email Address" required className="w-full" />
                    <input value={delivery.phone} onChange={(e) => setDelivery({ ...delivery, phone: e.target.value })} placeholder="Phone Number (+254...)" required className="w-full" />
                    <input value={delivery.street} onChange={(e) => setDelivery({ ...delivery, street: e.target.value })} placeholder="Street Address" required className="w-full" />
                    <div className="grid grid-cols-2 gap-3">
                      <input value={delivery.city} onChange={(e) => setDelivery({ ...delivery, city: e.target.value })} placeholder="City" required />
                      <input value={delivery.county} onChange={(e) => setDelivery({ ...delivery, county: e.target.value })} placeholder="County" required />
                    </div>
                  </div>
                  <h3 className="text-base font-display text-green mt-6 mb-3">Delivery Method</h3>
                  <div className="space-y-2">
                    {deliveryOptions.map((opt) => (
                      <label key={opt.value} className={`flex items-center gap-3 bg-card rounded-xl p-3 border cursor-pointer transition-all ${delivery.method === opt.value ? 'border-green bg-green/[0.03]' : 'border-white/5 hover:border-white/20'}`}>
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
                  <h2 className="text-lg font-display mb-4">Payment Method</h2>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {paymentMethods.map((m) => {
                      const Icon = m.icon;
                      return (
                        <button key={m.id} onClick={() => { setPaymentMethod(m.id); setPayError(''); setPhoneError(''); setCardErrors({}); }}
                          className={`bg-card rounded-xl p-4 border text-center transition-all ${paymentMethod === m.id ? 'border-green bg-green/[0.03] ring-1 ring-green/30' : 'border-white/5 hover:border-white/20'}`}
                        >
                          <Icon size={24} className={`mx-auto mb-2 ${paymentMethod === m.id ? 'text-green' : 'text-gray-400'}`} />
                          <p className="text-sm font-medium text-white">{m.label}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{m.desc}</p>
                        </button>
                      );
                    })}
                  </div>

                  <AnimatePresence mode="wait">
                    {(paymentMethod === 'mpesa' || paymentMethod === 'airtel') && (
                      <motion.div key="mobile-money" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-card rounded-xl p-4 border border-white/5 space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                          {paymentMethod === 'mpesa' ? (
                            <img src="https://www.safaricom.co.ke/images/logo.png" alt="M-Pesa" className="h-6" onError={(e) => { e.target.style.display = 'none' }} />
                          ) : (
                            <Phone size={20} className="text-red-500" />
                          )}
                          <span className="text-sm font-medium">{paymentMethod === 'mpesa' ? 'M-Pesa' : 'Airtel Money'}</span>
                        </div>
                        <p className="text-xs text-gray-400">You will receive an STK Push prompt on your phone to enter your PIN.</p>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Phone Number</label>
                          <input
                            value={phoneInput}
                            onChange={(e) => { setPhoneInput(e.target.value); setPhoneError(''); }}
                            placeholder="e.g. 0712 345 678"
                            className={`w-full ${phoneError ? 'border-red-500' : ''}`}
                          />
                          {phoneError && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={11} />{phoneError}</p>}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-black/30 rounded-lg p-2">
                          <Shield size={12} className="text-green" />
                          Secured by {paymentMethod === 'mpesa' ? 'Safaricom' : 'Airtel Kenya'}
                        </div>
                      </motion.div>
                    )}

                    {paymentMethod === 'card' && (
                      <motion.div key="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <div className="bg-card rounded-xl p-4 border border-white/5 space-y-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">Card Details</span>
                            <div className="flex gap-1 text-lg" title={detectCardType(cardDetails.number) || 'Card types accepted'}>
                              <span>Visa</span><span className="text-xs text-gray-500">|</span><span>MC</span><span className="text-xs text-gray-500">|</span><span>Amex</span>
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">Card Number</label>
                            <input
                              value={cardDetails.number}
                              onChange={(e) => setCardDetails({ ...cardDetails, number: formatCardNumber(e.target.value) })}
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                              className={`w-full ${cardErrors.number ? 'border-red-500' : ''}`}
                            />
                            {cardErrors.number && <p className="text-xs text-red-400 mt-1">{cardErrors.number}</p>}
                            {detectCardType(cardDetails.number) && !cardErrors.number && (
                              <p className="text-xs text-green mt-1">{detectCardType(cardDetails.number)} detected</p>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-gray-500 mb-1 block">Expiry</label>
                              <input
                                value={cardDetails.expiry}
                                onChange={(e) => setCardDetails({ ...cardDetails, expiry: formatExpiry(e.target.value) })}
                                placeholder="MM/YY"
                                maxLength={5}
                                className={`w-full ${cardErrors.expiry ? 'border-red-500' : ''}`}
                              />
                              {cardErrors.expiry && <p className="text-xs text-red-400 mt-1">{cardErrors.expiry}</p>}
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 mb-1 block">
                                CVV
                                <span className="text-gray-600 ml-1">({detectCardType(cardDetails.number) === 'American Express' ? '4' : '3'} digits)</span>
                              </label>
                              <input
                                value={cardDetails.cvv}
                                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                                placeholder="•••"
                                maxLength={4}
                                type="password"
                                className={`w-full ${cardErrors.cvv ? 'border-red-500' : ''}`}
                              />
                              {cardErrors.cvv && <p className="text-xs text-red-400 mt-1">{cardErrors.cvv}</p>}
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">Cardholder Name</label>
                            <input
                              value={cardDetails.name}
                              onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                              placeholder="John Doe"
                              className={`w-full ${cardErrors.name ? 'border-red-500' : ''}`}
                            />
                            {cardErrors.name && <p className="text-xs text-red-400 mt-1">{cardErrors.name}</p>}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 bg-black/30 rounded-lg p-2">
                            <Shield size={12} className="text-green" />
                            3D Secure enabled. Your card details are encrypted.
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {paymentMethod === 'paypal' && (
                      <motion.div key="paypal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-card rounded-xl p-4 border border-white/5 space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Globe size={20} className="text-blue-500" />
                          <span className="text-sm font-medium">PayPal</span>
                        </div>
                        <p className="text-xs text-gray-400">You will be redirected to PayPal to complete your purchase securely.</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-black/30 rounded-lg p-2">
                          <Shield size={12} className="text-green" />
                          PayPal Buyer Protection included.
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-3 mt-6">
                    <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                    <Button onClick={() => setStep(3)} disabled={processing}>Review Order</Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-lg font-display mb-4">Confirm & Pay</h2>

                  {payState === 'failed' && payError && (
                    <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 mb-4 flex items-start gap-3">
                      <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-red-300 font-medium">Payment Failed</p>
                        <p className="text-xs text-red-400 mt-1">{payError}</p>
                        <button onClick={() => setPayState('idle')} className="text-xs text-green mt-2 underline">Try again</button>
                      </div>
                    </div>
                  )}

                  <div className="bg-card rounded-xl p-4 border border-white/5 space-y-3 text-sm mb-6">
                    <div className="flex justify-between"><span className="text-gray-400">Delivery to</span><span className="text-white text-right">{delivery.fullName}, {delivery.city || delivery.county || '—'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Method</span><span className="text-white capitalize">{deliveryOptions.find((d) => d.value === delivery.method)?.label}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Payment</span><span className="text-white capitalize">{paymentMethod === 'mpesa' ? 'M-Pesa' : paymentMethod === 'card' ? `Card (${detectCardType(cardDetails.number) || '••••'} ${cardDetails.number.slice(-4)})` : paymentMethod === 'airtel' ? 'Airtel Money' : 'PayPal'}</span></div>
                    <div className="border-t border-white/5 pt-3 space-y-1">
                      {items.map((item, i) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span className="text-gray-400 truncate mr-2">{item.name} x{item.quantity}</span>
                          <span className="text-white">{formatCurrency((item.onSale && item.salePrice ? item.salePrice : item.price) * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {payState === 'stk_sent' && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-xl p-6 border border-green/30 text-center space-y-3 mb-4">
                      <div className="w-16 h-16 bg-green/10 rounded-full flex items-center justify-center mx-auto">
                        <Smartphone size={32} className="text-green animate-pulse" />
                      </div>
                      <p className="text-white font-medium">STK Push Sent!</p>
                      <p className="text-sm text-gray-400">Check your phone and enter your {paymentMethod === 'mpesa' ? 'M-Pesa' : 'Airtel Money'} PIN to complete payment.</p>
                      <p className="text-xs text-gray-500">Amount: <span className="text-green font-display">{formatCurrency(total)}</span></p>
                      <Loader2 size={18} className="animate-spin mx-auto text-green" />
                    </motion.div>
                  )}

                  {payState === 'authenticating' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-xl p-6 border border-white/10 text-center space-y-3 mb-4">
                      <Loader2 size={28} className="animate-spin mx-auto text-green" />
                      <p className="text-white font-medium">
                        {paymentMethod === 'paypal' ? 'Redirecting to PayPal...' : paymentMethod === 'card' ? 'Processing card payment...' : 'Confirming payment...'}
                      </p>
                      <p className="text-xs text-gray-500">Please do not close this page.</p>
                    </motion.div>
                  )}

                  {payState === 'success' && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-green/5 border border-green/30 rounded-xl p-6 text-center space-y-2 mb-4">
                      <div className="w-12 h-12 bg-green rounded-full flex items-center justify-center mx-auto">
                        <Check size={24} className="text-black" />
                      </div>
                      <p className="text-green font-medium">Payment Successful!</p>
                      <p className="text-xs text-gray-400">Redirecting to confirmation...</p>
                    </motion.div>
                  )}

                  {payState === 'idle' && (
                    <div className="flex gap-3">
                      <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                      <Button onClick={handlePlaceOrder} loading={processing} disabled={processing} className="flex-1">
                        {processing ? 'Processing...' : `Pay ${formatCurrency(total)}`}
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl border border-white/5 p-4 sticky top-24 space-y-3">
                <h3 className="text-sm font-display text-green">Order Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Subtotal ({items.length} items)</span><span>{formatCurrency(subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Delivery</span><span className={deliveryFee === 0 ? 'text-green' : ''}>{deliveryFee === 0 ? 'Free' : formatCurrency(deliveryFee)}</span></div>
                  {promoDiscount > 0 && <div className="flex justify-between"><span className="text-green">Discount</span><span className="text-green">-{formatCurrency(promoDiscount)}</span></div>}
                </div>
                <div className="border-t border-white/5 pt-3 flex justify-between items-baseline">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-green text-xl font-display">{formatCurrency(total)}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-600 pt-2 border-t border-white/5">
                  <Shield size={12} className="text-green" />
                  Secured checkout. No real money processed.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
