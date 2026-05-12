import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Ticket } from 'lucide-react';
import { ticketService } from '../services/ticketService';
import { api } from '../services/api';
import useTicketStore from '../store/ticketStore';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';

const steps = ['Match', 'Seat', 'Quantity', 'Details', 'Payment'];
const collectionPoints = [
  'Celtics FC Box Office, Main Stadium Gate 1',
  'Naivas - Westgate', 'Naivas - Sarit Centre', 'Naivas - Garden City', 'Naivas - Junction Mall',
  'Equity Bank - CBD', 'Equity Bank - Westlands', 'Equity Bank - Kilimani', 'Equity Bank - Thika Road Mall',
  'Airtel Money Agent (show code at any registered agent)',
];

export default function TicketsPage() {
  const navigate = useNavigate();
  const store = useTicketStore();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [collectionPoint, setCollectionPoint] = useState(collectionPoints[0]);

  useEffect(() => {
    ticketService.getAvailableMatches()
      .then(({ data }) => setMatches(data.data.matches || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handlePurchase = async () => {
    setProcessing(true);
    try {
      const payload = {
        fixtureId: store.selectedMatch._id,
        seatZone: store.selectedZone,
        quantity: store.quantity,
        ticketType: store.ticketType,
        deliveryMethod: store.deliveryMethod,
        collectionPoint: store.deliveryMethod === 'collection' ? store.collectionPoint : undefined,
        deliveryAddress: store.deliveryMethod === 'courier' ? store.buyer : undefined,
        paymentMethod: store.paymentMethod,
        guestEmail: store.buyer.email,
      };
      const { data } = await ticketService.purchaseTickets(payload);
      const ticket = data.data.ticket;

      const payData = {};
      if (store.paymentMethod === 'mpesa') payData.phone = store.buyer.phone;
      await ticketService.payTicket(ticket.bookingRef, payData);

      store.reset();
      navigate(`/ticket-success?ref=${ticket.bookingRef}`);
      toast.success('Tickets purchased successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Purchase failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="pt-20">
      <section className="py-12 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl lg:text-5xl font-display text-white mb-2">
            Match <span className="text-green">Tickets</span>
          </motion.h1>
          <p className="text-gray-400 text-sm">Book your seats at the Fortress.</p>
          <div className="flex items-center gap-2 mt-4">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${i <= store.step ? 'bg-green text-black' : 'bg-card text-gray-500'}`}>
                  {i < store.step ? <Check size={14} /> : i + 1}
                </div>
                <span className={`text-xs hidden sm:inline ${i <= store.step ? 'text-green' : 'text-gray-500'}`}>{s}</span>
                {i < steps.length - 1 && <div className={`w-6 h-0.5 ${i < store.step ? 'bg-green' : 'bg-card'}`} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && store.step === 0 && <Spinner className="py-20" />}

          {store.step === 0 && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="font-display text-xl text-white mb-4">Select Match</h2>
              {matches.length === 0 ? (
                <div className="text-center py-12 text-gray-500"><Ticket size={40} className="mx-auto mb-3 opacity-30" /><p>No upcoming home matches available for ticketing.</p></div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {matches.map((m) => (
                    <button key={m._id} onClick={() => { store.setSelectedMatch(m); store.nextStep(); }}
                      className={`bg-card rounded-xl p-4 border text-left transition-all ${store.selectedMatch?._id === m._id ? 'border-green' : 'border-white/5'} card-hover`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-body font-semibold text-white">vs {m.opponent}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatDate(m.date)}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{m.stadium} | {m.kickoff}</p>
                        </div>
                        <Badge>{m.competition}</Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {store.step === 1 && store.selectedMatch && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="font-display text-xl text-white mb-4">Select Seat Zone</h2>
              <p className="text-sm text-gray-400 mb-4">vs {store.selectedMatch.opponent} — {formatDate(store.selectedMatch.date)}</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {store.zones.map((z) => (
                  <button key={z.zone} onClick={() => { store.setSelectedZone(z.zone); store.nextStep(); }}
                    className={`bg-card rounded-xl p-4 border transition-all ${store.selectedZone === z.zone ? 'border-green bg-green/5' : 'border-white/5'} card-hover`}
                  >
                    <div className="w-6 h-6 rounded-full mb-2" style={{ backgroundColor: z.color }} />
                    <p className="font-body font-medium text-sm text-white">{z.label}</p>
                    <p className="text-lg font-display text-green mt-1">{formatCurrency(z.price)}</p>
                    <p className="text-xs text-gray-500">per ticket</p>
                  </button>
                ))}
              </div>
              <Button variant="ghost" onClick={store.prevStep} className="mt-4">Back</Button>
            </motion.div>
          )}

          {store.step === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="font-display text-xl text-white mb-4">Quantity & Type</h2>
              <div className="bg-card rounded-xl p-6 border border-white/5 space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Number of Tickets</p>
                  <div className="flex items-center gap-3">
                    <button onClick={() => store.setQuantity(store.quantity - 1)} disabled={store.quantity <= 1} className="w-10 h-10 rounded-lg bg-surface text-white disabled:opacity-30">-</button>
                    <span className="text-2xl font-display text-white w-12 text-center">{store.quantity}</span>
                    <button onClick={() => store.setQuantity(store.quantity + 1)} disabled={store.quantity >= 10} className="w-10 h-10 rounded-lg bg-surface text-white disabled:opacity-30">+</button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">Ticket Type</p>
                  <div className="flex gap-2">
                    {[
                      { value: 'adult', label: 'Adult' },
                      { value: 'under16', label: 'Under-16 (-30%)' },
                      { value: 'senior', label: 'Senior 60+ (-20%)' },
                    ].map((t) => (
                      <button key={t.value} onClick={() => store.setTicketType(t.value)}
                        className={`px-4 py-2 rounded-lg text-sm border transition-all ${store.ticketType === t.value ? 'border-green bg-green/10 text-green' : 'border-white/10 text-gray-400'}`}
                      >{t.label}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-4 border border-green/20 mt-4">
                <p className="text-sm text-gray-400">Order Summary</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-white">{store.quantity} x {store.selectedZone && store.zones.find((z) => z.zone === store.selectedZone)?.label}</span>
                  <span className="text-xl font-display text-green">{formatCurrency(store.total)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">@ {formatCurrency(store.pricePerTicket)} per ticket</p>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="ghost" onClick={store.prevStep}>Back</Button>
                <Button onClick={() => store.nextStep()}>Continue</Button>
              </div>
            </motion.div>
          )}

          {store.step === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="font-display text-xl text-white mb-4">Buyer Details</h2>
              <div className="space-y-3">
                <input value={store.buyer.fullName} onChange={(e) => store.setBuyerField('fullName', e.target.value)} placeholder="Full Name (as on ID)" required className="w-full" />
                <input type="email" value={store.buyer.email} onChange={(e) => store.setBuyerField('email', e.target.value)} placeholder="Email Address" required className="w-full" />
                <input value={store.buyer.phone} onChange={(e) => store.setBuyerField('phone', e.target.value)} placeholder="Phone (+254...)" required className="w-full" />
                <input value={store.buyer.idNumber} onChange={(e) => store.setBuyerField('idNumber', e.target.value)} placeholder="National ID Number" required className="w-full" />
              </div>

              <h3 className="font-display text-lg text-green mt-6 mb-3">Delivery Method</h3>
              <div className="space-y-2">
                {[
                  { value: 'eticket', label: 'E-Ticket (PDF to Email)', price: 0 },
                  { value: 'collection', label: 'Physical Collection', price: 0 },
                  { value: 'courier', label: 'Courier Delivery', price: 300 },
                ].map((d) => (
                  <label key={d.value} className={`flex items-center gap-3 bg-card rounded-lg p-3 border cursor-pointer ${store.deliveryMethod === d.value ? 'border-green' : 'border-white/5'}`}>
                    <input type="radio" name="delivery" value={d.value} checked={store.deliveryMethod === d.value} onChange={() => store.setDeliveryMethod(d.value)} className="accent-green" />
                    <div className="flex-1"><p className="text-sm text-white">{d.label}</p></div>
                    <span className="text-sm text-green">{d.price === 0 ? 'Free' : formatCurrency(d.price)}</span>
                  </label>
                ))}
              </div>

              {store.deliveryMethod === 'collection' && (
                <div className="mt-3">
                  <select value={collectionPoint} onChange={(e) => { setCollectionPoint(e.target.value); store.setCollectionPoint(e.target.value); }} className="w-full">
                    {collectionPoints.map((p) => (<option key={p} value={p}>{p}</option>))}
                  </select>
                </div>
              )}

              {store.deliveryMethod === 'courier' && (
                <div className="space-y-3 mt-3">
                  <input placeholder="Street Address" className="w-full" />
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="City" className="w-full" />
                    <input placeholder="County" className="w-full" />
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <Button variant="ghost" onClick={store.prevStep}>Back</Button>
                <Button onClick={() => store.nextStep()}>Continue to Payment</Button>
              </div>
            </motion.div>
          )}

          {store.step === 4 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="font-display text-xl text-white mb-4">Payment</h2>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {['mpesa', 'card', 'airtel', 'kcb'].map((m) => (
                  <button key={m} onClick={() => store.setPaymentMethod(m)}
                    className={`bg-card rounded-lg p-4 border text-center capitalize transition-all ${store.paymentMethod === m ? 'border-green bg-green/5' : 'border-white/5'}`}
                  >{m}</button>
                ))}
              </div>

              {store.paymentMethod === 'mpesa' && (
                <div className="bg-card rounded-lg p-4 border border-white/5">
                  <p className="text-sm text-gray-400 mb-2">STK Push will be sent to:</p>
                  <p className="text-white font-medium">{store.buyer.phone || 'Not provided'}</p>
                </div>
              )}

              <div className="bg-card rounded-xl p-4 border border-green/20 mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Match</span><span className="text-white">vs {store.selectedMatch?.opponent}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Zone</span><span className="text-white">{store.selectedZone && store.zones.find((z) => z.zone === store.selectedZone)?.label}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Qty</span><span className="text-white">{store.quantity}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Type</span><span className="text-white capitalize">{store.ticketType}</span></div>
                <div className="flex justify-between text-lg font-semibold border-t border-white/5 pt-2"><span className="text-white">Total</span><span className="text-green font-display">{formatCurrency(store.total)}</span></div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="ghost" onClick={store.prevStep}>Back</Button>
                <Button onClick={handlePurchase} loading={processing} disabled={processing} className="flex-1">
                  {processing ? 'Processing...' : `Pay ${formatCurrency(store.total)}`}
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
