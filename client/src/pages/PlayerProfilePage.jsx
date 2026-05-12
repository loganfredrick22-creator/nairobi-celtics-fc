import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Ruler, Weight, Trophy } from 'lucide-react';
import { api } from '../services/api';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';

export default function PlayerProfilePage() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/players/${id}`)
      .then(({ data }) => setPlayer(data.data.player))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pt-20"><Spinner className="py-20" /></div>;
  if (!player) return <div className="pt-20 text-center py-20 text-gray-500">Player not found.</div>;

  const statItems = [
    { label: 'Appearances', value: player.stats?.appearances || 0 },
    { label: 'Goals', value: player.stats?.goals || 0 },
    { label: 'Assists', value: player.stats?.assists || 0 },
    { label: 'Clean Sheets', value: player.stats?.cleanSheets || 0 },
    { label: 'Rating', value: player.stats?.rating?.toFixed(1) || '0.0' },
  ];

  return (
    <div className="pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link to="/squad" className="inline-flex items-center gap-2 text-gray-400 hover:text-green text-sm transition-colors">
          <ArrowLeft size={16} /> Back to Squad
        </Link>
      </div>

      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="relative rounded-xl overflow-hidden aspect-[3/4]">
              <ImageWithFallback src={player.image} alt={`${player.firstName} ${player.lastName}`} className="w-full h-full object-cover" fallbackText={`${player.firstName} ${player.lastName}`} />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <span className="text-6xl font-display text-green/30 absolute -bottom-2 right-4">{player.jerseyNumber}</span>
                <h1 className="text-3xl font-display text-white">{player.firstName} {player.lastName}</h1>
                <Badge className="mt-2">{player.position}</Badge>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-gray-400">
              <p className="flex items-center gap-2"><MapPin size={14} /> {player.nationality}</p>
              {player.height && <p className="flex items-center gap-2"><Ruler size={14} /> {player.height} cm</p>}
              {player.weight && <p className="flex items-center gap-2"><Weight size={14} /> {player.weight} kg</p>}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-2xl font-display text-green mb-6">Season Stats</h2>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-8">
              {statItems.map((s) => (
                <div key={s.label} className="bg-card rounded-xl p-4 text-center border border-white/5">
                  <div className="text-2xl font-display text-green">{s.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {player.career && player.career.length > 0 && (
              <>
                <h2 className="text-2xl font-display text-green mb-4">Career</h2>
                <div className="space-y-2">
                  {player.career.map((c, i) => (
                    <div key={i} className="bg-card rounded-lg p-4 border border-white/5 flex items-center justify-between">
                      <div>
                        <p className="font-body font-medium text-white">{c.club}</p>
                        <p className="text-xs text-gray-500">{c.years}</p>
                      </div>
                      <div className="text-right text-sm text-gray-400">
                        <span>{c.appearances} apps</span>
                        <span className="ml-3">{c.goals} goals</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
