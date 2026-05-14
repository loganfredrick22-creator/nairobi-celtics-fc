import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Ticket, ArrowRight } from 'lucide-react';
import Barcode from 'react-barcode';
import { ticketService } from '../services/ticketService';
import { formatDate } from '../utils/formatDate';
import { formatCurrency } from '../utils/formatCurrency';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
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

  const handleDownloadPDF = () => {
    const el = document.getElementById('eticket');
    if (!el) return;
    const win = window.open('', '_blank');
    if (!win) { toast.error('Please allow popups'); return; }
    win.document.write(`
      <html><head><title>E-Ticket ${ticket.bookingRef}</title>
      <style>
        body { font-family: 'Arial', sans-serif; background: #111; color: #fff; padding: 40px; }
        .ticket { max-width: 500px; margin: 0 auto; background: #1a1a1a; border: 2px solid #00C853; border-radius: 16px; padding: 32px; }
        h1 { color: #00C853; text-align: center; font-size: 28px; margin-bottom: 4px; }
        .sub { color: #888; text-align: center; font-size: 14px; margin-bottom: 24px; }
        .detail { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #333; font-size: 14px; }
        .detail span:first-child { color: #888; }
        .detail span:last-child { color: #fff; }
        .barcode { text-align: center; margin: 24px 0; }
        .barcode svg { max-width: 100%; }
        .footer { text-align: center; color: #555; font-size: 11px; margin-top: 16px; }
      </style></head><body>
      <div class="ticket">
        <h1>NCFC</h1>
        <p class="sub">Nairobi Celtics FC — E-Ticket</p>
        <div class="detail"><span>Booking Ref</span><span>${ticket.bookingRef}</span></div>
        <div class="detail"><span>Match</span><span>vs ${ticket.fixture?.opponent || 'TBD'}</span></div>
        <div class="detail"><span>Date</span><span>${ticket.fixture ? formatDate(ticket.fixture.date) : 'TBD'}</span></div>
        <div class="detail"><span>Venue</span><span>Nairobi Celtics Stadium</span></div>
        <div class="detail"><span>Zone</span><span>${ticket.seatZoneLabel}</span></div>
        <div class="detail"><span>Qty</span><span>${ticket.quantity}</span></div>
        <div class="detail"><span>Paid</span><span>KES ${ticket.total?.toLocaleString()}</span></div>
        <div class="barcode">${document.getElementById('barcode-svg')?.outerHTML || ''}</div>
        <p class="footer">Present this barcode at the gate for entry.</p>
        <p class="footer">Payment simulation active — not a real transaction.</p>
      </div></body></html>
    `);
    win.document.close();
    win.print();
    toast.success('E-Ticket downloaded');
  };

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

              <div id="eticket" className="bg-card rounded-xl p-6 border border-green/20 text-left space-y-3 mb-6">
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
                <div className="flex justify-between text-sm"><span className="text-gray-400">Venue</span><span className="text-white">Nairobi Celtics Stadium</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">Zone</span><span className="text-white">{ticket.seatZoneLabel}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">Quantity</span><span className="text-white">{ticket.quantity}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">Total Paid</span><span className="text-green font-display text-lg">{formatCurrency(ticket.total)}</span></div>

                <div className="flex justify-center py-3" id="barcode-svg">
                  <Barcode value={ticket.bookingRef || 'NCFC-TICKET'} width={1.5} height={60} fontSize={12} background="transparent" lineColor="#00C853" />
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge variant="info">Payment Simulation Active</Badge>
              </div>

              <div className="flex flex-col gap-3">
                <Button variant="outline" className="w-full" onClick={handleDownloadPDF}>
                  <Download size={16} className="mr-2" /> Download E-Ticket (PDF)
                </Button>
                <Link to="/tickets"><Button variant="ghost" className="w-full">Buy More Tickets <ArrowRight size={16} className="ml-2" /></Button></Link>
              </div>

              <p className="text-xs text-gray-600 mt-6">Your e-ticket has been sent to {ticket.guestEmail || 'your email'}.</p>
              <p className="text-xs text-gray-700 mt-1">⚠️ Payment simulation — no real money moved. Integrate M-Pesa/Stripe for live payments.</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
