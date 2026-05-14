import { useState } from 'react';

const clubColors = {
  'Gor Mahia': { bg: '#006837', text: '#FFD700' },
  'AFC Leopards': { bg: '#003366', text: '#FFFFFF' },
  'Tusker FC': { bg: '#8B4513', text: '#FFD700' },
  'Bandari FC': { bg: '#1A237E', text: '#FFFFFF' },
  'KCB FC': { bg: '#004D40', text: '#FFD700' },
  'Sofapaka': { bg: '#B71C1C', text: '#FFFFFF' },
  'Mathare United': { bg: '#1B5E20', text: '#FFFFFF' },
  'Ulinzi Stars': { bg: '#4A148C', text: '#00C853' },
  'Posta Rangers': { bg: '#E65100', text: '#FFFFFF' },
  'Wazito FC': { bg: '#0D47A1', text: '#FFD700' },
  'Muranga SEAL': { bg: '#33691E', text: '#FFFFFF' },
  'Talanta FC': { bg: '#FF6F00', text: '#000000' },
  'Kariobangi Sharks': { bg: '#006064', text: '#FF5722' },
  'Kakamega Homeboyz': { bg: '#4E342E', text: '#FFD700' },
  'Bidco United': { bg: '#1565C0', text: '#FFFFFF' },
  'Nzoia Sugar': { bg: '#2E7D32', text: '#FFFFFF' },
  'FC Talanta': { bg: '#311B92', text: '#00E5FF' },
  'Nairobi Celtics FC': { bg: '#00C853', text: '#000000' },
  'Kenya Police FC': { bg: '#1A237E', text: '#FFFFFF' },
};

const clubLogoMap = {
  'Nairobi Celtics FC': 'celtics-logo.jpg',
  'AFC Leopards': 'afc-leopards-logo.jpg',
  'Bandari FC': 'bandari-fc-logo.jpg',
  'Bidco United': 'bidco-united-logo.jpg',
  'Kariobangi Sharks': 'kariobangi-sharks-fc.jpg',
  'Mathare United': 'mathare-united-fc.jpg',
  'Muranga SEAL': 'muranga-seal-fc-logo.jpg',
  'Sofapaka': 'sofapaka-fc-logo.jpg',
  'Tusker FC': 'tusker-fc-logo.jpg',
  'Ulinzi Stars': 'ulinzi-stars-logo.jpg',
  'Kenya Police FC': 'kenya-police-fc.jpg',
};

const initials = (name) => {
  return name.replace(/FC$/i, '').trim().split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase();
};

const sizes = { sm: 'w-8 h-8 text-[8px]', md: 'w-12 h-12 text-xs', lg: 'w-16 h-16 text-sm', xl: 'w-20 h-20 text-base' };

export default function ClubLogo({ club, size = 'md', className = '' }) {
  const colors = clubColors[club] || { bg: '#333333', text: '#00C853' };
  const [imgError, setImgError] = useState(false);
  const filename = clubLogoMap[club];
  const showImage = filename && !imgError;

  if (showImage) {
    return (
      <div className={`rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${sizes[size]} ${className}`}>
        <img
          src={`/club-logos/${filename}`}
          alt={club}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center font-display font-bold flex-shrink-0 ${sizes[size]} ${className}`}
      style={{ background: `linear-gradient(135deg, ${colors.bg}, ${colors.bg}dd)`, color: colors.text, border: `2px solid ${colors.text}33` }}
      title={club}
    >
      {initials(club)}
    </div>
  );
}
