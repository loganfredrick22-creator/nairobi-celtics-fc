import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, Printer, CreditCard } from 'lucide-react';
import { shopService } from '../services/shopService';
import { formatCurrency } from '../utils/formatCurrency';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const orderNumber = searchParams.get('order');

  useEffect(() => {
    if (!orderNumber) { setLoading(false); return; }
    shopService.getOrder(orderNumber)
      .then(({ data }) => setOrder(data.data.order))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderNumber]);

  const handlePrint = () => window.print();

  return (
    <div className="pt-20 min-h-screen">
      <section className="py-12 lg:py-20">
        <div className="max-w-lg mx-auto px-4 sm:px-6">
          {loading ? (
            <Spinner className="py-20" />
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={36} className="text-black" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-display">Payment <span className="text-green">Successful!</span></h1>
                <p className="text-gray-400 text-sm mt-2">Thank you for your purchase. Your order has been confirmed.</p>
              </div>

              {order && (
                <div className="bg-card rounded-2xl border border-green/20 overflow-hidden mb-6">
                  <div className="bg-green/5 px-6 py-4 border-b border-green/10">
                    <p className="text-xs text-gray-400">Order Number</p>
                    <p className="text-green font-mono text-sm font-semibold tracking-wider">{order.orderNumber}</p>
                  </div>

                  <div className="px-6 py-4 space-y-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-gray-400 text-sm">Total Paid</span>
                      <span className="text-white text-2xl font-display">{formatCurrency(order.total)}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">Status</p>
                        <p className="text-green capitalize font-medium">{order.orderStatus}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Payment</p>
                        <p className="capitalize text-white">{order.paymentMethod} {order.paymentRef && <span className="text-gray-500 text-[10px] ml-1">({order.paymentRef.slice(-8)})</span>}</p>
                      </div>
                    </div>

                    {order.estimatedDelivery && (
                      <div className="bg-black/30 rounded-xl p-3">
                        <p className="text-gray-500 text-xs">Estimated Delivery</p>
                        <p className="text-white font-medium">
                          {new Date(order.estimatedDelivery).toLocaleDateString('en-GB', {
                            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                          })}
                        </p>
                      </div>
                    )}

                    <div className="border-t border-white/5 pt-4">
                      <p className="text-gray-500 text-xs mb-2">Items ({order.items?.length || 0})</p>
                      <div className="space-y-2">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-white truncate mr-2">{item.name} <span className="text-gray-500">x{item.quantity}</span></span>
                            <span className="text-gray-300">{formatCurrency(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-3 flex justify-between text-sm">
                      <span className="text-gray-400">Delivery</span>
                      <span className="text-white capitalize">{order.deliveryMethod}</span>
                    </div>

                    {order.deliveryAddress && (
                      <div className="border-t border-white/5 pt-3 text-sm">
                        <p className="text-gray-500 text-xs mb-1">Shipping To</p>
                        <p className="text-white">{order.deliveryAddress.fullName}</p>
                        <p className="text-gray-400">{order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.county}</p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-green/10 px-6 py-3 bg-green/[0.02]">
                    <p className="text-[10px] text-gray-600 flex items-center gap-1.5">
                      <CreditCard size={10} />
                      Transaction ref: {order.paymentRef || order.orderNumber}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <Link to="/account">
                  <Button variant="outline" className="w-full">
                    <Package size={16} className="mr-2" /> Track My Order
                  </Button>
                </Link>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={handlePrint} className="py-2.5 px-4 rounded-xl border border-white/10 text-sm text-gray-400 hover:text-white hover:border-white/30 transition-all flex items-center justify-center gap-2">
                    <Printer size={15} /> Print
                  </button>
                  <Link to="/shop">
                    <Button variant="ghost" className="w-full">
                      Shop More <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>

              <p className="text-xs text-gray-600 mt-6 text-center">
                A confirmation email has been sent to {order?.deliveryAddress?.email || 'your email'}.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
