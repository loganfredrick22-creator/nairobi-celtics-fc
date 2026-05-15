import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Download, ArrowRight } from 'lucide-react';
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
  const [error, setError] = useState(null);
  const ticketRef = useRef(null);
  const bookingRef = searchParams.get('ref');

  useEffect(() => {
    if (!bookingRef) { setLoading(false); setError('No booking reference provided.'); return; }
    ticketService.getTicketByRef(bookingRef)
      .then(({ data }) => setTicket(data.data.ticket))
      .catch((err) => setError(err.response?.data?.message || 'Ticket not found'))
      .finally(() => setLoading(false));
  }, [bookingRef]);

  const handleDownloadPDF = async () => {
    if (!ticketRef.current || !ticket) return;
    try {
      toast.loading('Generating PDF...');
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        backgroundColor: '#111111',
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`NCFC-Ticket-${ticket.bookingRef}.pdf`);
      toast.dismiss();
      toast.success('E-Ticket downloaded!');
    } catch (err) {
      toast.dismiss();
      toast.error('Failed to generate PDF. Try printing instead.');
      window.print();
    }
  };

  if (loading) return <div className="pt-20"><Spinner className="py-20" /></div>;

  if (error || !ticket) {
    return (
      <div className="pt-20 text-center py-20">
        <p className="text-gray-500">{error || 'Ticket not found.'}</p>
        <Link to="/tickets"><Button variant="ghost" className="mt-4">Back to Tickets</Button></Link>
      </div>
    );
  }

  const tierColors = {
    general: { bg: '#006400', text: '#FFFFFF' },
    vip: { bg: '#1a237e', text: '#FFD700' },
    vvip: { bg: '#4a148c', text: '#FFD700' },
    green: { bg: '#006400', text: '#FFFFFF' },
    blue: { bg: '#1a237e', text: '#FFFFFF' },
    silver: { bg: '#757575', text: '#FFFFFF' },
    gold: { bg: '#FFD700', text: '#000000' },
    platinum: { bg: '#E91E63', text: '#FFFFFF' },
  };

  const tc = tierColors[ticket.seatZone?.toLowerCase()] || { bg: '#006400', text: '#FFFFFF' };

  return (
    <div className="pt-20">
      <section className="py-20 bg-black">
        <div className="max-w-lg mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <CheckCircle size={64} className="text-green mx-auto mb-4" />
            <h1 className="text-4xl font-display text-white mb-2">Tickets <span className="text-green">Confirmed!</span></h1>
            <p className="text-gray-400 text-sm mb-6">Your seats at the Fortress are secured.</p>

            <div ref={ticketRef} className="bg-card rounded-xl border border-green/30 overflow-hidden mb-6 text-left">
              <div className="bg-green px-4 py-3 text-center">
                <p className="font-display text-xl text-white tracking-widest">NAIROBI CELTIS FC</p>
                <p className="text-xs text-white/80">Official E-Ticket</p>
              </div>

              <div className="p-4 space-y-2">
                <div className="text-center mb-2">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Booking Reference</p>
                  <p className="text-lg font-display text-green">{ticket.bookingRef}</p>
                </div>

                {ticket.fixture && (
                  <>
                    <div className="flex justify-between text-sm border-b border-white/5 pb-1.5">
                      <span className="text-gray-400">Match</span>
                      <span className="text-white font-medium">vs {ticket.fixture.opponent}</span>
                    </div>
                    <div className="flex justify-between text-sm border-b border-white/5 pb-1.5">
                      <span className="text-gray-400">Date</span>
                      <span className="text-white">{formatDate(ticket.fixture.date)}</span>
                    </div>
                    <div className="flex justify-between text-sm border-b border-white/5 pb-1.5">
                      <span className="text-gray-400">Venue</span>
                      <span className="text-white">Nairobi Celtics Stadium</span>
                    </div>
                  </>
                )}

                <div className="flex justify-between text-sm border-b border-white/5 pb-1.5">
                  <span className="text-gray-400">Ticket Tier</span>
                  <span className="text-white">{ticket.seatZoneLabel || ticket.seatZone}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-white/5 pb-1.5">
                  <span className="text-gray-400">Quantity</span>
                  <span className="text-white">{ticket.quantity}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-white/5 pb-1.5">
                  <span className="text-gray-400">Total Paid</span>
                  <span className="text-green font-display text-lg">{formatCurrency(ticket.total)}</span>
                </div>

                <div className="flex justify-center pt-2">
                  <Barcode value={ticket.bookingRef || ticket._id || 'NCFC-TICKET'} width={1.5} height={50} fontSize={11} background="transparent" lineColor="#006400" />
                </div>
              </div>

              <div className="bg-green/5 border-t border-green/20 px-4 py-2 text-center">
                <p className="text-[10px] text-gray-500">Present this barcode at the gate for entry.</p>
                <p className="text-[10px] text-gray-600">Ticket ID: {ticket._id?.slice(-8).toUpperCase()}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="info">Payment Simulation Active</Badge>
            </div>

            <div className="flex flex-col gap-3">
              <Button className="w-full" onClick={handleDownloadPDF}>
                <Download size={16} className="mr-2" /> Download E-Ticket (PDF)
              </Button>
              <Link to="/tickets"><Button variant="ghost" className="w-full">Buy More Tickets <ArrowRight size={16} className="ml-2" /></Button></Link>
            </div>

            <p className="text-xs text-gray-600 mt-6">E-ticket sent to {ticket.guestEmail || 'your email'}</p>
            <p className="text-xs text-gray-700 mt-1">⚠️ Payment simulation — no real money moved. Integrate M-Pesa/Stripe for live payments.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
