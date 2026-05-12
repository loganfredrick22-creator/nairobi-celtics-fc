import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import Spinner from '../components/ui/Spinner';

const positions = ['All', 'GK', 'DEF', 'MID', 'FWD'];
const teams = ['men', 'women', 'academy'];

export default function SquadPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [team, setTeam] = useState('men');

  useEffect(() => {
    setLoading(true);
    const params = { team };
    if (filter !== 'All') params.position = filter;
    api.get('/players', { params })
      .then(({ data }) => setPlayers(data.data.players))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter, team]);

  return (
    <div className="pt-20">
      <section className="py-12 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl lg:text-5xl font-display text-white mb-2">
            First <span className="text-green">Team</span>
          </motion.h1>
          <p className="text-gray-400 font-body text-sm">The gladiators wearing the green.</p>
        </div>
      </section>

      <section className="py-8 bg-black border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {teams.map((t) => (
              <button key={t} onClick={() => { setTeam(t); setFilter('All'); }}
                className={`px-4 py-2 rounded-full text-sm font-body transition-all capitalize ${team === t ? 'bg-green text-black font-semibold' : 'bg-card text-gray-400 hover:text-white'}`}
              >{t.replace('men', 'Men').replace('women', 'Women')}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {positions.map((pos) => (
              <button key={pos} onClick={() => setFilter(pos)}
                className={`px-4 py-1.5 rounded-full text-xs font-body transition-all ${filter === pos ? 'bg-green/20 text-green border border-green/40' : 'text-gray-400 border border-white/10 hover:border-green/30'}`}
              >{pos}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? <Spinner className="py-20" /> : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {players.map((player, i) => (
                <motion.div
                  key={player._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link to={`/squad/${player._id}`} className="block group">
                    <div className="bg-card rounded-xl overflow-hidden border border-white/5 card-hover">
                      <div className="aspect-[3/4] relative overflow-hidden">
                        <ImageWithFallback src={player.image} alt={`${player.firstName} ${player.lastName}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" fallbackText={`${player.firstName} ${player.lastName}`} />
                        <div className="absolute top-2 right-2">
                          <span className="text-xs bg-black/60 text-green px-2 py-0.5 rounded-full font-display">{player.position}</span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                          <span className="text-3xl font-display text-green/40 absolute -bottom-1 right-3">{player.jerseyNumber}</span>
                          <h3 className="font-display text-lg text-white">{player.firstName} {player.lastName}</h3>
                          <div className="flex gap-3 text-xs text-gray-400 mt-1">
                            <span>{player.nationality}</span>
                            <span>{player.stats?.appearances} apps</span>
                            <span>{player.stats?.goals} goals</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
