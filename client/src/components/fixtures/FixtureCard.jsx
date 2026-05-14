import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Ticket } from 'lucide-react';
import ClubLogo from '../ui/ClubLogo';
import Badge from '../ui/Badge';
import { formatDate } from '../../utils/formatDate';

export default function FixtureCard({ fixture, linkToTickets = false, showFull = true }) {
  const isUpcoming = fixture.status === 'scheduled';
  const isLive = fixture.status === 'live';

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`bg-card rounded-xl border transition-all ${
        isLive ? 'border-green animate-pulse' : 'border-white/5 hover:border-green/30'
      } card-hover p-4 sm:p-5`}
    >
      <div className="flex items-center justify-between mb-3">
        <Badge variant={fixture.venue === 'home' ? 'default' : 'info'}>
          {fixture.venue === 'home' ? 'HOME' : 'AWAY'}
        </Badge>
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">{fixture.competition}</span>
      </div>

      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex flex-col items-center text-center flex-1">
          {fixture.isHomeGame ? (
            <ClubLogo club="Nairobi Celtics FC" size="lg" />
          ) : (
            <ClubLogo club={fixture.opponent} size="lg" />
          )}
          <span className="text-xs font-body font-medium text-white mt-1.5">
            {fixture.isHomeGame ? 'NCFC' : fixture.opponent}
          </span>
        </div>

        <div className="flex flex-col items-center">
          {fixture.status === 'completed' && fixture.result?.homeScore != null ? (
            <div className="text-center">
              <div className="text-3xl font-display text-white flex items-center gap-3">
                <span className={fixture.result.outcome === 'W' ? 'text-green' : fixture.result.outcome === 'L' ? 'text-red-400' : ''}>
                  {fixture.isHomeGame ? fixture.result.homeScore : fixture.result.awayScore}
                </span>
                <span className="text-gray-600">-</span>
                <span className={fixture.result.outcome === 'W' ? 'text-green' : fixture.result.outcome === 'L' ? 'text-red-400' : ''}>
                  {fixture.isHomeGame ? fixture.result.awayScore : fixture.result.homeScore}
                </span>
              </div>
              <Badge variant={fixture.result.outcome === 'W' ? 'success' : fixture.result.outcome === 'D' ? 'warning' : 'danger'}>
                {fixture.result.outcome}
              </Badge>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-2xl font-display text-green mb-1">VS</div>
              {isLive && <Badge variant="danger">LIVE</Badge>}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center text-center flex-1">
          {fixture.isHomeGame ? (
            <ClubLogo club={fixture.opponent} size="lg" />
          ) : (
            <ClubLogo club="Nairobi Celtics FC" size="lg" />
          )}
          <span className="text-xs font-body font-medium text-white mt-1.5">
            {fixture.isHomeGame ? fixture.opponent : 'NCFC'}
          </span>
        </div>
      </div>

      {showFull && (
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-400 border-t border-white/5 pt-3 mt-2">
          <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(fixture.date)}</span>
          <span className="flex items-center gap-1"><Clock size={11} />{fixture.kickoff}</span>
          <span className="flex items-center gap-1"><MapPin size={11} />{fixture.stadium}</span>
        </div>
      )}

      {linkToTickets && isUpcoming && fixture.isHomeGame && (
        <div className="mt-3">
          <Link
            to={`/tickets?match=${fixture._id}`}
            className="w-full py-2.5 bg-green/10 text-green border border-green/30 rounded-lg hover:bg-green hover:text-black transition-all text-sm font-semibold flex items-center justify-center gap-2"
          >
            <Ticket size={15} /> Get Tickets
          </Link>
        </div>
      )}
    </motion.div>
  );

  return card;
}
