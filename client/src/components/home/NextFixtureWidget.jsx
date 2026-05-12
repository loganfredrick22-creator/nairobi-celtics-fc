import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { fixtureService } from '../../services/fixtureService';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

export default function NextFixtureWidget() {
  const [fixture, setFixture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    fixtureService.getNextFixture()
      .then(({ data }) => setFixture(data.data.fixture))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!fixture) return;
    const tick = () => {
      const diff = new Date(fixture.date) - new Date();
      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff % 86400000) / 3600000),
          minutes: Math.floor((diff % 3600000) / 60000),
          seconds: Math.floor((diff % 60000) / 1000),
        });
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [fixture]);

  if (loading) return <div className="py-12"><Spinner /></div>;
  if (!fixture) return null;

  return (
    <section className="py-16 lg:py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-green/10 to-black border border-green/20 rounded-2xl p-8 lg:p-12 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-green/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <span className="text-green font-display text-lg tracking-widest">NEXT FIXTURE</span>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mt-4">
              <div>
                <h3 className="text-3xl lg:text-4xl font-display text-white">vs {fixture.opponent}</h3>
                <div className="flex flex-wrap gap-4 mt-4 text-gray-400 text-sm">
                  <span className="flex items-center gap-1.5"><Calendar size={14} />{new Date(fixture.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} />{fixture.kickoff}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={14} />{fixture.stadium} ({fixture.isHomeGame ? 'Home' : 'Away'})</span>
                </div>
                <span className="inline-block mt-2 text-xs bg-green/20 text-green px-2 py-0.5 rounded-full font-medium">{fixture.competition}</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex gap-4 lg:gap-6">
                  {Object.entries(countdown).map(([key, val]) => (
                    <div key={key} className="text-center">
                      <div className="w-14 h-14 lg:w-20 lg:h-20 bg-black rounded-xl border border-green/20 flex items-center justify-center">
                        <span className="text-2xl lg:text-3xl font-display text-green">{String(val).padStart(2, '0')}</span>
                      </div>
                      <span className="text-[10px] lg:text-xs text-gray-500 uppercase mt-1 block">{key}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Link to="/tickets"><Button>Get Tickets <ArrowRight size={16} className="ml-2" /></Button></Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
