import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Ticket } from 'lucide-react';
import Button from '../ui/Button';

export default function HeroSection() {
  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/hero.jpg)' }} />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center lg:text-left w-full">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="lg:max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-green font-display text-lg sm:text-xl tracking-[0.3em] mb-4"
          >
            KENYAN PREMIER LEAGUE
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display text-white leading-none mb-6"
          >
            THE GREEN<br />
            <span className="text-green">MACHINE.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="text-lg sm:text-xl text-gray-300 font-body mb-8 max-w-xl mx-auto lg:mx-0"
          >
            Elite football. African soul. Unapologetically Nairobi.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Link to="/tickets"><Button size="lg"><Ticket size={18} className="mr-2" /> Buy Tickets</Button></Link>
            <Link to="/shop"><Button variant="outline" size="lg">Shop Kits <ArrowRight size={18} className="ml-2" /></Button></Link>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-6 h-10 border-2 border-green/50 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-1.5 bg-green rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
