import { useState, useEffect } from 'react';
import { fixtureService } from '../../services/fixtureService';

export default function LiveTicker() {
  const [recent, setRecent] = useState([]);
  const [next, setNext] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [rec, nx] = await Promise.all([
          fixtureService.getRecentFixtures(),
          fixtureService.getNextFixture(),
        ]);
        setRecent(rec.data.data.fixtures || []);
        setNext(nx.data.data.fixture);
      } catch { setError(true); }
    };
    fetch();
  }, []);

  if (error && !recent.length && !next) return null;

  const tickerItems = [
    ...recent.map((f) => ({
      text: `${f.opponent} ${f.result.homeScore ?? ''}-${f.result.awayScore ?? ''} (${f.result.outcome || '-'})`,
      isResult: true,
      outcome: f.result.outcome,
    })),
    ...(next ? [{ text: `NEXT: ${next.opponent} — ${new Date(next.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} ${next.kickoff}`, isResult: false }] : []),
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-green h-7 flex items-center overflow-hidden">
      <div className="flex-shrink-0 bg-black/20 px-3 h-full flex items-center">
        <span className="text-black text-[10px] font-bold font-display tracking-wider uppercase">Live</span>
      </div>
      <div className="overflow-hidden flex-1 relative">
        <div className="whitespace-nowrap animate-scroll flex gap-12" style={{ animation: 'scroll 25s linear infinite' }}>
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className={`inline-block text-[11px] font-body font-medium ${item.isResult ? 'text-black' : 'text-black/80'}`}>
              {item.text}
            </span>
          ))}
        </div>
      </div>
      <style>{`@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
