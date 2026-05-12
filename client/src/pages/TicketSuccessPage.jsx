import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Ticket, ArrowRight } from 'lucide-react';
import { ticketService } from '../services/ticketService';
import { formatDate } from '../utils/formatDate';
import { formatCurrency } from '../utils/formatCurrency';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';

export default function TicketSuccessPage() {
  const [searchParams] = useSearchParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const bookingRef = searchParams.get('ref');

  useEffect(() => {
    if (!bookingRef) { setLoading(false); return; }
    ticketService.getTicketByRef(bookingRef)
      .then(({ data }) => setTicket(data.data.ticket))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [bookingRef]);

  return (
    <div className="pt-20">
      <section className="py-20 bg-black">
        <div className="max-w-lg mx-auto px-4 text-center">
          {loading ? <Spinner /> : !ticket ? (
            <div className="text-gray-500"><p>Ticket not found.</p></div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <CheckCircle size={64} className="text-green mx-auto mb-4" />
              <h1 className="text-4xl font-display text-white mb-2">Tickets <span className="text-green">Confirmed!</span></h1>
              <p className="text-gray-400 text-sm mb-6">Your seats at the Fortress are secured.</p>

              <div className="bg-card rounded-xl p-6 border border-green/20 text-left space-y-3 mb-6">
                <div className="text-center mb-3">
                  <p className="text-xs text-gray-500">Booking Reference</p>
                  <p className="text-xl font-display text-green">{ticket.bookingRef}</p>
                </div>
                {ticket.fixture && (
                  <>
                    <div className="flex justify-between text-sm"><span className="text-gray-400">Match</span><span className="text-white">vs {ticket.fixture.opponent}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-400">Date</span><span className="text-white">{formatDate(ticket.fixture.date)}</span></div>
                  </>
                )}
                <div className="flex justify-between text-sm"><span className="text-gray-400">Zone</span><span className="text-white">{ticket.seatZoneLabel}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">Quantity</span><span className="text-white">{ticket.quantity}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">Total Paid</span><span className="text-green font-display text-lg">{formatCurrency(ticket.total)}</span></div>

                {ticket.qrCode && (
                  <div className="flex justify-center py-3">
                    <img src={ticket.qrCode} alt="QR Code" className="w-32 h-32" />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Button variant="outline" className="w-full" onClick={() => toast.success('E-Ticket download started (simulated)')}>
                  <Download size={16} className="mr-2" /> Download E-Ticket
                </Button>
                <Button variant="outline" className="w-full" onClick={() => toast.success('Added to Apple Wallet (simulated)')}>
                  Add to Wallet
                </Button>
                <Link to="/tickets"><Button variant="ghost" className="w-full">Buy More Tickets <ArrowRight size={16} className="ml-2" /></Button></Link>
              </div>

              <p className="text-xs text-gray-600 mt-6">Your e-ticket has been sent to {ticket.guestEmail || 'your email'}.</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
