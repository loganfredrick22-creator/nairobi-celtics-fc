import { Link } from 'react-router-dom';

const footerLinks = {
  Club: [
    { label: 'News', path: '/news' }, { label: 'Squad', path: '/squad' }, { label: 'Fixtures', path: '/fixtures' },
    { label: 'Stadium', path: '/stadium' }, { label: 'History', path: '/community' },
  ],
  Tickets: [
    { label: 'Buy Tickets', path: '/tickets' }, { label: 'Seat Map', path: '/stadium' },
    { label: 'Hospitality', path: '/stadium' }, { label: 'Season Tickets', path: '/tickets' },
  ],
  Shop: [
    { label: 'Kits', path: '/shop?category=kit' }, { label: 'Accessories', path: '/shop?category=accessory' },
    { label: 'Training Gear', path: '/shop?category=training' }, { label: 'Premium', path: '/shop?category=premium' },
  ],
  Academy: [
    { label: 'Programs', path: '/academy' }, { label: 'Join Us', path: '/academy' },
    { label: 'Community', path: '/community' }, { label: 'Contact', path: '/contact' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green flex items-center justify-center">
                <span className="text-black font-display text-lg font-bold">N</span>
              </div>
              <span className="font-display text-xl tracking-wider text-white">
                NAIROBI <span className="text-green">CELTICS</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm mb-4">Kasarani, Nairobi, Kenya</p>
            <p className="text-gray-500 text-xs">The Green Machine. Unapologetically Elite.</p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display text-green text-lg mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path} className="text-gray-400 hover:text-green text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">&copy; {new Date().getFullYear()} Nairobi Celtics FC. All rights reserved.</p>
          <div className="flex gap-4 text-gray-500 text-xs">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
