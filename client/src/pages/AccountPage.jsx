import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, Ticket, Heart, LogOut, ShoppingBag } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { api } from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';

export default function AccountPage() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tickets');
  const [tickets, setTickets] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    if (!user) return;
    setLoadingData(true);
    Promise.all([
      api.get(`/tickets/user/${user.id}`).catch(() => ({ data: { data: { tickets: [] } } })),
      api.get(`/orders/user/${user.id}`).catch(() => ({ data: { data: { orders: [] } } })),
    ]).then(([tick, ord]) => {
      setTickets(tick.data.data.tickets || []);
      setOrders(ord.data.data.orders || []);
    }).catch(() => {}).finally(() => setLoadingData(false));
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (authLoading) return <div className="pt-20"><Spinner className="py-20" /></div>;

  return (
    <div className="pt-20">
      <section className="py-12 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green flex items-center justify-center"><User size={32} className="text-black" /></div>
            <div>
              <h1 className="text-3xl font-display text-white">My <span className="text-green">Account</span></h1>
              <p className="text-sm text-gray-400">{user?.firstName} {user?.lastName} | {user?.email}</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-8 bg-black border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2">
            {[
              { key: 'tickets', label: 'My Tickets', icon: Ticket },
              { key: 'orders', label: 'Orders', icon: Package },
            ].map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${activeTab === tab.key ? 'bg-green text-black font-semibold' : 'bg-card text-gray-400 hover:text-white'}`}
              ><tab.icon size={16} /> {tab.label}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loadingData ? <Spinner /> : activeTab === 'tickets' ? (
            tickets.length === 0 ? (
              <div className="text-center py-12">
                <Ticket size={48} className="mx-auto text-gray-600 mb-3" />
                <p className="text-gray-500 mb-3">No tickets yet.</p>
                <Link to="/tickets"><Button>Buy Tickets</Button></Link>
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map((t) => (
                  <div key={t._id} className="bg-card rounded-xl p-4 border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="font-body font-medium text-white">{t.fixture?.opponent || 'Match'}</p>
                      <p className="text-xs text-gray-400">{t.seatZoneLabel} | Qty: {t.quantity} | {formatCurrency(t.total)}</p>
                      <p className="text-xs text-gray-500">Ref: {t.bookingRef}</p>
                    </div>
                    <Badge variant={t.status === 'active' ? 'success' : t.status === 'used' ? 'default' : 'danger'}>{t.status}</Badge>
                  </div>
                ))}
              </div>
            )
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-gray-600 mb-3" />
              <p className="text-gray-500 mb-3">No orders yet.</p>
              <Link to="/shop"><Button><ShoppingBag size={16} className="mr-2" /> Start Shopping</Button></Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o._id} className="bg-card rounded-xl p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-body font-medium text-white">{o.orderNumber}</p>
                      <p className="text-xs text-gray-500">{formatDate(o.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={o.paymentStatus === 'paid' ? 'success' : 'warning'}>{o.paymentStatus}</Badge>
                      <p className="text-green font-display text-sm mt-1">{formatCurrency(o.total)}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{o.items?.length} item(s) | {o.deliveryMethod}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-8 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button variant="outline" onClick={handleLogout}><LogOut size={16} className="mr-2" /> Sign Out</Button>
        </div>
      </section>
    </div>
  );
}
