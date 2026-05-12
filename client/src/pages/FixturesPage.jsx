import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';

const filters = ['All', 'Home', 'Away'];
const competitions = ['All', 'KSL', 'Kenyan Cup', 'CAF CL'];

const outcomeColors = { W: 'bg-green/20 text-green border-green/40', D: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40', L: 'bg-red-500/20 text-red-400 border-red-500/40' };

export default function FixturesPage() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [venueFilter, setVenueFilter] = useState('All');
  const [compFilter, setCompFilter] = useState('All');
  const [standings, setStandings] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const params = {};
    if (venueFilter !== 'All') params.venue = venueFilter === 'Home' ? 'home' : 'away';
    if (compFilter !== 'All') params.competition = compFilter;
    Promise.all([
      api.get('/fixtures', { params }),
      api.get('/season/table'),
      api.get('/season/stats'),
    ]).then(([fix, tbl, st]) => {
      setFixtures(fix.data.data.fixtures);
      setStandings(tbl.data.data.standings || []);
      setStats(st.data.data.stats);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [venueFilter, compFilter]);

  return (
    <div className="pt-20">
      <section className="py-12 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl lg:text-5xl font-display text-white mb-2">
            Fixtures & <span className="text-green">Results</span>
          </motion.h1>
        </div>
      </section>

      {stats && (
        <section className="py-6 bg-black border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[{ label: 'Played', value: stats.totalMatches }, { label: 'Goals', value: stats.totalGoals }, { label: 'Top Scorer', value: stats.topScorer || '-' }, { label: 'Most Assists', value: stats.mostAssists || '-' }, { label: 'Clean Sheets', value: stats.cleanSheets }].map((s, i) => (
                <div key={i} className="text-center bg-card rounded-lg p-3 border border-white/5">
                  <div className="text-lg font-display text-green">{s.value}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
            {competitions.map((c) => (
              <button key={c} onClick={() => setCompFilter(c)}
                className={`px-4 py-1.5 rounded-full text-xs font-body transition-all ${compFilter === c ? 'bg-green text-black font-semibold' : 'bg-card text-gray-400 hover:text-white'}`}
              >{c}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? <Spinner className="py-20" /> : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-2">
                {fixtures.length === 0 && <div className="text-center py-12 text-gray-500">No fixtures found.</div>}
                {fixtures.map((f, i) => (
                  <motion.div key={f._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    className="bg-card rounded-xl p-4 border border-white/5 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="text-center flex-shrink-0 w-12">
                        <div className="text-xs text-gray-500">{new Date(f.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
                        <div className="text-[10px] text-gray-600">{f.kickoff}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-body font-medium text-sm text-white">{f.isHomeGame ? 'NCFC' : f.opponent}</span>
                          <span className="text-xs text-gray-500">vs</span>
                          <span className="font-body font-medium text-sm text-white">{f.isHomeGame ? f.opponent : 'NCFC'}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-gray-600">{f.competition}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${f.venue === 'home' ? 'text-green' : 'text-yellow-400'}`}>{f.venue === 'home' ? 'H' : 'A'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      {f.status === 'completed' && f.result?.outcome ? (
                        <Badge variant={f.result.outcome === 'W' ? 'success' : f.result.outcome === 'D' ? 'warning' : 'danger'}>
                          {f.result.outcome} {f.result.homeScore}-{f.result.awayScore}
                        </Badge>
                      ) : f.status === 'scheduled' ? (
                        <span className="text-xs text-gray-500">Scheduled</span>
                      ) : (
                        <Badge variant="info">{f.status}</Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div>
                <div className="bg-card rounded-xl border border-white/5 overflow-hidden sticky top-24">
                  <div className="p-4 border-b border-white/5">
                    <h3 className="font-display text-lg text-green">KSL Standings</h3>
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
                            <td className={`p-2 font-medium ${s.club === 'Nairobi Celtics FC' ? 'text-green' : 'text-white'}`}>{s.club}</td>
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
    </div>
  );
}
