import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Tv, Shield, Users } from 'lucide-react';
import HeroSection from '../components/home/HeroSection';
import NextFixtureWidget from '../components/home/NextFixtureWidget';
import StatsBar from '../components/home/StatsBar';
import NewsGrid from '../components/home/NewsGrid';
import Button from '../components/ui/Button';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <StatsBar />
      <NextFixtureWidget />

      <motion.section {...fadeUp} className="py-16 lg:py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/squad" className="group bg-card rounded-xl p-6 border border-white/5 card-hover">
              <Shield className="text-green mb-3" size={28} />
              <h3 className="font-display text-xl text-white">The Squad</h3>
              <p className="text-sm text-gray-400 mt-1">Meet the 22 gladiators wearing the green.</p>
              <span className="text-green text-sm font-medium mt-3 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Meet the Team <ArrowRight size={12} />
              </span>
            </Link>
            <Link to="/fixtures" className="group bg-card rounded-xl p-6 border border-white/5 card-hover">
              <Users className="text-green mb-3" size={28} />
              <h3 className="font-display text-xl text-white">Fixtures</h3>
              <p className="text-sm text-gray-400 mt-1">Full 34-match season schedule & results.</p>
              <span className="text-green text-sm font-medium mt-3 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                View Fixtures <ArrowRight size={12} />
              </span>
            </Link>
            <Link to="/stadium" className="group bg-card rounded-xl p-6 border border-white/5 card-hover">
              <Tv className="text-green mb-3" size={28} />
              <h3 className="font-display text-xl text-white">The Fortress</h3>
              <p className="text-sm text-gray-400 mt-1">Experience the 88,500-capacity cathedral.</p>
              <span className="text-green text-sm font-medium mt-3 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Explore <ArrowRight size={12} />
              </span>
            </Link>
          </div>
        </div>
      </motion.section>

      <NewsGrid />

      <motion.section {...fadeUp} className="py-16 lg:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-green/10 to-black border border-green/20 rounded-2xl p-8 lg:p-12 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-green/5 rounded-full" />
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-green flex items-center justify-center">
                  <Tv size={36} className="text-black" />
                </div>
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-2xl lg:text-3xl font-display text-white">Celtics <span className="text-green">TV</span></h2>
                <p className="text-gray-400 text-sm mt-2 max-w-lg">Exclusive behind-the-scenes content, match highlights, player interviews, and original documentaries. Coming soon.</p>
              </div>
              <Button variant="outline" disabled>Coming Soon</Button>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
