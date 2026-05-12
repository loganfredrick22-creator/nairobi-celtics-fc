import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
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

  return (
    <div className="pt-20">
      <section className="py-20 bg-black">
        <div className="max-w-lg mx-auto px-4 text-center">
          {loading ? <Spinner /> : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <CheckCircle size={64} className="text-green mx-auto mb-4" />
              <h1 className="text-4xl font-display text-white mb-2">Order <span className="text-green">Confirmed!</span></h1>
              <p className="text-gray-400 text-sm mb-6">Thank you for your purchase.</p>

              {order && (
                <div className="bg-card rounded-xl p-6 border border-green/20 text-left space-y-3 mb-6">
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Order Number</span><span className="text-green font-medium">{order.orderNumber}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Total Paid</span><span className="text-white font-display text-lg">{formatCurrency(order.total)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Status</span><span className="text-green capitalize">{order.orderStatus}</span></div>
                  {order.estimatedDelivery && <div className="flex justify-between text-sm"><span className="text-gray-400">Est. Delivery</span><span className="text-white">{new Date(order.estimatedDelivery).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>}
                  <div className="border-t border-white/5 pt-3 mt-3">
                    <p className="text-xs text-gray-500">Items</p>
                    {order.items?.map((item, i) => (
                      <p key={i} className="text-sm text-white">{item.name} x{item.quantity}</p>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <Link to="/account"><Button variant="outline" className="w-full"><Package size={16} className="mr-2" /> Track My Order</Button></Link>
                <Link to="/shop"><Button variant="ghost" className="w-full">Continue Shopping <ArrowRight size={16} className="ml-2" /></Button></Link>
              </div>

              <p className="text-xs text-gray-600 mt-6">A confirmation email has been sent to your email address.</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
