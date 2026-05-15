import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, Menu, X, Ticket, Sun, Moon } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import useUiStore from '../../store/uiStore';
import useAuthStore from '../../store/authStore';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/news', label: 'News' },
  { path: '/squad', label: 'Squad' },
  { path: '/fixtures', label: 'Fixtures' },
  { path: '/tickets', label: 'Tickets' },
  { path: '/shop', label: 'Shop' },
  { path: '/stadium', label: 'Stadium' },
  { path: '/academy', label: 'Academy' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { toggleDrawer } = useCartStore();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu, theme, toggleTheme } = useUiStore();
  const { isAuthenticated } = useAuthStore();
  const itemCount = useCartStore((s) => s.items.reduce((a, i) => a + i.quantity, 0));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { closeMobileMenu(); }, [location]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'glass shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-3" onClick={closeMobileMenu}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green flex items-center justify-center">
              <span className="text-black font-display text-sm sm:text-base font-bold">N</span>
            </div>
            <span className="font-display text-lg sm:text-xl tracking-wider text-white hidden sm:block">
              NAIROBI <span className="text-green">CELTICS</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}
                className={`px-3 py-2 text-sm font-body font-medium rounded-lg transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'text-green bg-green/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={toggleTheme} className="p-2 text-gray-300 hover:text-green transition-colors" title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={toggleDrawer} className="relative p-2 text-gray-300 hover:text-white transition-colors">
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-green text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
            <Link to="/tickets" className="p-2 text-gray-300 hover:text-green transition-colors">
              <Ticket size={20} />
            </Link>
            <Link to={isAuthenticated ? '/account' : '/login'} className="p-2 text-gray-300 hover:text-green transition-colors">
              <User size={20} />
            </Link>
            <button onClick={toggleMobileMenu} className="lg:hidden p-2 text-gray-300 hover:text-white">
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/5 bg-black/95 backdrop-blur-md"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path}
                  className={`block px-4 py-3 rounded-lg text-sm font-body transition-colors ${
                    location.pathname === link.path ? 'text-green bg-green/10' : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
