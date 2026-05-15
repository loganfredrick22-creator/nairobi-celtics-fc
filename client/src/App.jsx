import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LiveTicker from './components/layout/LiveTicker';
import CartDrawer from './components/shop/CartDrawer';
import useUiStore from './store/uiStore';
import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import NewsArticlePage from './pages/NewsArticlePage';
import SquadPage from './pages/SquadPage';
import PlayerProfilePage from './pages/PlayerProfilePage';
import FixturesPage from './pages/FixturesPage';
import StadiumPage from './pages/StadiumPage';
import AcademyPage from './pages/AcademyPage';
import CommunityPage from './pages/CommunityPage';
import ContactPage from './pages/ContactPage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import TicketsPage from './pages/TicketsPage';
import TicketSuccessPage from './pages/TicketSuccessPage';
import LoginPage from './pages/LoginPage';
import AccountPage from './pages/AccountPage';

export default function App() {
  const location = useLocation();
  const theme = useUiStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <LiveTicker />
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:slug" element={<NewsArticlePage />} />
            <Route path="/squad" element={<SquadPage />} />
            <Route path="/squad/:id" element={<PlayerProfilePage />} />
            <Route path="/fixtures" element={<FixturesPage />} />
            <Route path="/stadium" element={<StadiumPage />} />
            <Route path="/academy" element={<AcademyPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/ticket-success" element={<TicketSuccessPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/account" element={<AccountPage />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
