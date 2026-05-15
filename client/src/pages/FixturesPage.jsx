import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Ticket, X, Check, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { ticketService } from '../services/ticketService';
import ClubLogo from '../components/ui/ClubLogo';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import { formatDate } from '../utils/formatDate';
import { formatCurrency } from '../utils/formatCurrency';
import toast from 'react-hot-toast';

const filters = ['All', 'Home', 'Away'];
const comps = ['All', 'FKF Premier League', 'KSL', 'Kenyan Cup', 'CAF CL'];

export default function FixturesPage() {
  const navigate = useNavigate();
  const [fixtures, setFixtures] = useState([]);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [venueFilter, setVenueFilter] = useState('All');
  const [compFilter, setCompFilter] = useState('All');

  const [showModal, setShowModal] = useState(false);
  const [selectedFixture, setSelectedFixture] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = { limit: 50, sort: 'date' };
    if (venueFilter !== 'All') params.venue = venueFilter === 'Home' ? 'home' : 'away';
    if (compFilter !== 'All') params.competition = compFilter;
    Promise.all([
      api.get('/fixtures', { params }).then(r => r.data.data.fixtures),
      api.get('/season/table').then(r => r.data.data.standings || []).catch(() => []),
    ]).then(([fix, tbl]) => {
      setFixtures(fix);
      setStandings(tbl);
    }).catch((err) => {
      setError(err.response?.data?.message || 'Failed to load fixtures');
    }).finally(() => setLoading(false));
  }, [venueFilter, compFilter]);

  const openTicketModal = (fixture) => {
    setSelectedFixture(fixture);
    setSelectedTier(null);
    setBuyerName('');
    setBuyerEmail('');
    setShowModal(true);
  };

  const handlePurchase = async () => {
    if (!selectedTier) { toast.error('Select a ticket tier'); return; }
    if (!buyerName.trim() || !buyerEmail.trim()) { toast.error('Enter name and email'); return; }
    setPurchasing(true);
    try {
      const payload = {
        fixtureId: selectedFixture._id,
        seatZone: selectedTier.name.toLowerCase(),
        quantity: 1,
        ticketType: 'adult',
        deliveryMethod: 'eticket',
        guestEmail: buyerEmail,
        paymentMethod: 'simulated',
      };
      const { data } = await ticketService.purchaseTickets(payload);
      const ticket = data.data.ticket;
      await ticketService.payTicket(ticket.bookingRef, { phone: '+254700000000' });
      setShowModal(false);
      navigate(`/ticket-success?ref=${ticket.bookingRef}`);
      toast.success('Tickets purchased successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Purchase failed');
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="pt-20">
      <section className="py-12 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl lg:text-5xl font-display text-white mb-2">
            Fixtures & <span className="text-green">Results</span>
          </motion.h1>
          <p className="text-gray-400 text-sm">Full season schedule — buy tickets for upcoming home games.</p>
        </div>
      </section>

      <section className="py-6 bg-black border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap gap-3">
          <div className="flex gap-2">
            {filters.map((f) => (
              <button key={f} onClick={() => setVenueFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-body transition-all ${venueFilter === f ? 'bg-green text-black font-semibold' : 'bg-card text-gray-400 hover:text-white'}`}
              >{f}</button>
            ))}
          </div>
          <div className="flex gap-2">
            {comps.map((c) => (
              <button key={c} onClick={() => setCompFilter(c)}
                className={`px-4 py-1.5 rounded-full text-xs font-body transition-all ${compFilter === c ? 'bg-green text-black font-semibold' : 'bg-card text-gray-400 hover:text-white'}`}
              >{c}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? <Spinner className="py-20" /> : error ? (
            <div className="flex flex-col items-center py-20 text-center">
              <AlertCircle size={48} className="text-red-400 mb-4" />
              <p className="text-red-400 text-sm">{error}</p>
              <Button variant="ghost" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {fixtures.length === 0 ? (
                  <div className="text-center py-20 text-gray-500">
                    <Calendar size={48} className="mx-auto mb-4 opacity-30" />
                    <p>No fixtures found.</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {fixtures.map((f) => {
                      const isUpcoming = f.status === 'scheduled';
                      return (
                        <div key={f._id} className="bg-card rounded-xl border border-white/5 card-hover p-4">
                          <div className="flex items-center justify-between mb-3">
                            <Badge variant={f.isHomeGame ? 'default' : 'info'}>
                              {f.isHomeGame ? 'HOME' : 'AWAY'}
                            </Badge>
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">{f.competition}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3 mb-3">
                            <div className="flex flex-col items-center text-center flex-1">
                              <ClubLogo club={f.isHomeGame ? 'Nairobi Celtics FC' : f.opponent} size="lg" />
                              <span className="text-xs font-body font-medium text-white mt-1.5">
                                {f.isHomeGame ? 'NCFC' : f.opponent}
                              </span>
                            </div>
                            <div className="text-lg font-display text-green">VS</div>
                            <div className="flex flex-col items-center text-center flex-1">
                              <ClubLogo club={f.isHomeGame ? f.opponent : 'Nairobi Celtics FC'} size="lg" />
                              <span className="text-xs font-body font-medium text-white mt-1.5">
                                {f.isHomeGame ? f.opponent : 'NCFC'}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-400 border-t border-white/5 pt-3">
                            <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(f.date)}</span>
                            <span className="flex items-center gap-1"><Clock size={11} />{f.kickoff}</span>
                            <span className="flex items-center gap-1"><MapPin size={11} />{f.stadium}</span>
                          </div>
                          {isUpcoming && f.isHomeGame && (
                            <button onClick={() => openTicketModal(f)}
                              className="w-full mt-3 py-2.5 bg-green/10 text-green border border-green/30 rounded-lg hover:bg-green hover:text-black transition-all text-sm font-semibold flex items-center justify-center gap-2"
                            >
                              <Ticket size={15} /> Buy Tickets
                            </button>
                          )}
                          {f.status === 'completed' && f.result?.homeScore != null && (
                            <div className="mt-3 text-center">
                              <Badge variant={f.result.outcome === 'W' ? 'success' : f.result.outcome === 'D' ? 'warning' : 'danger'}>
                                {f.result.outcome} {f.result.homeScore}-{f.result.awayScore}
                              </Badge>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <div className="bg-card rounded-xl border border-white/5 overflow-hidden sticky top-24">
                  <div className="p-4 border-b border-white/5">
                    <h3 className="font-display text-lg text-green">FKF Premier League Standings</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="text-[10px] text-gray-500 uppercase border-b border-white/5">
                        <th className="p-2 text-left">#</th><th className="p-2 text-left">Club</th><th className="p-2">P</th><th className="p-2">W</th><th className="p-2">D</th><th className="p-2">L</th><th className="p-2">GD</th><th className="p-2 text-green">Pts</th>
                      </tr></thead>
                      <tbody>
                        {standings.slice(0, 10).map((s, i) => (
                          <tr key={i} className={`border-b border-white/5 ${s.club === 'Nairobi Celtics FC' ? 'bg-green/5' : ''}`}>
                            <td className="p-2 text-gray-400">{i + 1}</td>
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <ClubLogo club={s.club} size="sm" />
                                <span className={`font-medium ${i < 4 ? 'text-green' : i > 7 ? 'text-red-400' : 'text-white'} ${s.club === 'Nairobi Celtics FC' ? 'font-bold' : ''}`}>{s.club}</span>
                              </div>
                            </td>
                            <td className="p-2 text-center text-gray-400">{s.played}</td>
                            <td className="p-2 text-center text-gray-400">{s.won}</td>
                            <td className="p-2 text-center text-gray-400">{s.drawn}</td>
                            <td className="p-2 text-center text-gray-400">{s.lost}</td>
                            <td className="p-2 text-center text-gray-400">{s.goalDifference > 0 ? `+${s.goalDifference}` : s.goalDifference}</td>
                            <td className="p-2 text-center text-green font-bold">{s.points}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {showModal && selectedFixture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl border border-green/30 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h2 className="font-display text-lg text-white">Buy Tickets</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>

            <div className="p-4 space-y-4">
              <div className="text-center">
                <p className="font-body font-semibold text-white">Nairobi Celtics FC vs {selectedFixture.opponent}</p>
                <p className="text-sm text-gray-400">{formatDate(selectedFixture.date)} at {selectedFixture.kickoff}</p>
                <p className="text-sm text-gray-400">{selectedFixture.stadium}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-green mb-2">Select Ticket Tier</p>
                <div className="space-y-2">
                  {(selectedFixture.ticketTiers || [
                    { name: 'General', price: 500, available: 100 },
                    { name: 'VIP', price: 1500, available: 50 },
                    { name: 'VVIP', price: 3000, available: 20 },
                  ]).map((tier) => (
                    <button key={tier.name} onClick={() => setSelectedTier(tier)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${selectedTier?.name === tier.name ? 'border-green bg-green/10' : 'border-white/10 bg-card hover:border-green/50'}`}
                    >
                      <div className="text-left">
                        <p className="text-sm text-white font-medium">{tier.name}</p>
                        <p className="text-xs text-gray-400">{tier.available || tier.available === 0 ? `${tier.available} seats left` : 'Available'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green font-display">KES {tier.price?.toLocaleString()}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-green mb-2">Your Details</p>
                <input value={buyerName} onChange={(e) => setBuyerName(e.target.value)} placeholder="Full Name" className="w-full mb-2" />
                <input type="email" value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} placeholder="Email Address" className="w-full" />
              </div>

              <p className="text-xs text-gray-600">⚠️ Payment simulation active — no real money moved.</p>
            </div>

            <div className="p-4 border-t border-white/5 flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handlePurchase} loading={purchasing} disabled={purchasing || !selectedTier}>
                {selectedTier ? `Pay KES ${selectedTier.price?.toLocaleString()}` : 'Select Tier'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
