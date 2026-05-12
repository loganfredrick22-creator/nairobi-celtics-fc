import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fixtureService } from '../../services/fixtureService';

const statsConfig = [
  { key: 'totalGoals', label: 'Goals Scored', icon: '⚽' },
  { key: 'cleanSheets', label: 'Clean Sheets', icon: '🧤' },
  { key: 'winStreak', label: 'Wins Streak', icon: '🏆' },
  { key: 'totalMatches', label: 'Matches Played', icon: '📊' },
];

export default function StatsBar() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fixtureService.getSeasonStats()
      .then(({ data }) => setStats(data.data.stats))
      .catch(() => {});
  }, []);

  const items = stats ? statsConfig.map((cfg) => ({ ...cfg, value: stats[cfg.key] ?? 0 })) : statsConfig.map((cfg) => ({ ...cfg, value: 0 }));

  return (
    <section className="py-12 bg-black border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {items.map((item, i) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-3xl md:text-4xl font-display text-green">{item.value}</div>
              <div className="text-xs md:text-sm text-gray-500 font-body mt-1">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
