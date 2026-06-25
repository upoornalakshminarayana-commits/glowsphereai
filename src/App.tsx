import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import Navbar from './components/Navbar';
import LandingView from './components/LandingView';
import MarketplaceView from './components/MarketplaceView';
import AiBeautyLabView from './components/AiBeautyLabView';
import CustomerDashboardView from './components/CustomerDashboardView';
import OwnerDashboardView from './components/OwnerDashboardView';
import AdminPanelView from './components/AdminPanelView';
import AppSkeleton from './components/AppSkeleton';
import { Salon, Professional, Booking, WalletTransaction, ChatMessage, FaceAnalysis } from './types';

export default function App() {
  const [currentTab, setTab] = useState('landing');
  const [userRole, setUserRole] = useState<'customer' | 'owner' | 'admin'>('customer');
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('glowsphere-theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    localStorage.setItem('glowsphere-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Backend States
  const [salons, setSalons] = useState<Salon[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [walletBalance, setWalletBalance] = useState(1850);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);
  const [merchantStats, setMerchantStats] = useState<any>({});
  
  // Cross-Tab state
  const [selectedSalonFromLanding, setSelectedSalonFromLanding] = useState<Salon | null>(null);

  // Smooth Scroll State & Position Triggers
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to top when currentTab shifts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initialize and Fetch data from Express API
  const fetchData = async () => {
    try {
      // 1. Get Salons
      const salonsRes = await fetch('/api/salons');
      const salonsData = await salonsRes.json();
      setSalons(salonsData);

      // 2. Get Professionals
      const profsRes = await fetch('/api/professionals');
      const profsData = await profsRes.json();
      setProfessionals(profsData);

      // 3. Get Bookings
      const bookingsRes = await fetch('/api/bookings');
      const bookingsData = await bookingsRes.json();
      setBookings(bookingsData);

      // 4. Get Wallet Details
      const walletRes = await fetch('/api/wallet');
      const walletData = await walletRes.json();
      setWalletBalance(walletData.balance);
      setWalletTransactions(walletData.transactions);

      // 5. Get Owner Stats
      const statsRes = await fetch('/api/dashboard/stats');
      const statsData = await statsRes.json();
      setMerchantStats(statsData);
    } catch (err) {
      console.error('Error fetching data from server APIs:', err);
    } finally {
      // Introduce an artistic sub-second delay to ensure high-end transition visuals are legible
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // API Call: Book Salon appointment
  const handleCreateBooking = async (bookingData: any) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      const newBooking = await res.json();
      
      // Update local states immediately
      setBookings(prev => [newBooking, ...prev]);
      await fetchData(); // Fetch clean synchronized values
      return newBooking;
    } catch (err) {
      console.error('Create booking failed:', err);
      throw err;
    }
  };

  // API Call: Cancel appointment slot
  const handleCancelBooking = async (id: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}/cancel`, {
        method: 'POST'
      });
      const updated = await res.json();
      
      // Update locally
      setBookings(prev => prev.map(b => b.id === id ? updated : b));
      await fetchData();
      return updated;
    } catch (err) {
      console.error('Cancel booking failed:', err);
      throw err;
    }
  };

  // API Call: Add Wallet Funds
  const handleAddFunds = async (amount: number) => {
    try {
      const res = await fetch('/api/wallet/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      const wallet = await res.json();
      setWalletBalance(wallet.balance);
      setWalletTransactions(wallet.transactions);
      await fetchData();
      return wallet;
    } catch (err) {
      console.error('Adding funds failed:', err);
      throw err;
    }
  };

  // AI API Call: Chat consultation
  const handleSendMessage = async (messages: ChatMessage[]) => {
    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
      });
      const data = await res.json();
      return data.text;
    } catch (err) {
      console.error('Gemini chat error:', err);
      throw err;
    }
  };

  // AI API Call: Deep Mirror Analysis
  const handleAnalyzeFace = async (imageBase64: string, prompt?: string) => {
    try {
      const res = await fetch('/api/gemini/analyze-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, customPrompt: prompt })
      });
      const analysis: FaceAnalysis = await res.json();
      return analysis;
    } catch (err) {
      console.error('Aesthetic scan failed:', err);
      throw err;
    }
  };

  // AI API Call: Algorithmic Recommendations
  const handleRecommendSalons = async (query: string, budget: number) => {
    try {
      const res = await fetch('/api/gemini/recommend-salons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, budget })
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Matching recommendation failed:', err);
      throw err;
    }
  };

  // Admin Toggle
  const handleToggleLuxury = (id: string) => {
    setSalons(prev => prev.map(s => s.id === id ? { ...s, isLuxury: !s.isLuxury } : s));
  };

  if (isLoading) {
    return <AppSkeleton />;
  }

  return (
    <div className="bg-zinc-950 min-h-screen text-white font-sans relative">
      
      {/* Sticky Premium Navbar */}
      <Navbar
        currentTab={currentTab}
        setTab={setTab}
        walletBalance={walletBalance}
        userRole={userRole}
        setUserRole={setUserRole}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Render Current Tab Page with editorial layouts */}
      <main className="relative">
        <AnimatePresence mode="wait">
          {currentTab === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <LandingView
                salons={salons}
                setTab={setTab}
                setSelectedSalon={setSelectedSalonFromLanding}
              />
            </motion.div>
          )}

          {currentTab === 'marketplace' && (
            <motion.div
              key="marketplace"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <MarketplaceView
                salons={salons}
                professionals={professionals}
                onCreateBooking={handleCreateBooking}
                selectedSalonFromLanding={selectedSalonFromLanding}
                setSelectedSalonFromLanding={setSelectedSalonFromLanding}
              />
            </motion.div>
          )}

          {currentTab === 'ai-lab' && (
            <motion.div
              key="ai-lab"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <AiBeautyLabView
                onSendMessage={handleSendMessage}
                onAnalyzeFace={handleAnalyzeFace}
                onRecommendSalons={handleRecommendSalons}
              />
            </motion.div>
          )}

          {currentTab === 'customer' && (
            <motion.div
              key="customer"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <CustomerDashboardView
                bookings={bookings}
                walletBalance={walletBalance}
                walletTransactions={walletTransactions}
                onCancelBooking={handleCancelBooking}
                onAddFunds={handleAddFunds}
              />
            </motion.div>
          )}

          {currentTab === 'owner' && (
            <motion.div
              key="owner"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <OwnerDashboardView
                stats={merchantStats}
              />
            </motion.div>
          )}

          {currentTab === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <AdminPanelView
                salons={salons}
                onToggleLuxury={handleToggleLuxury}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Smooth Scroll to Top Trigger */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            key="scroll-to-top"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            whileHover={{ scale: 1.1, translateY: -3 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-gradient-to-r from-violet-600 via-pink-600 to-cyan-500 text-white shadow-[0_4px_20px_rgba(139,92,246,0.4)] border border-white/20 cursor-pointer backdrop-blur-md hover:shadow-[0_4px_30px_rgba(139,92,246,0.6)] group transition-shadow duration-300"
            title="Scroll to Top"
          >
            <ArrowUp className="w-5 h-5 text-white stroke-[2.5px] transition-transform duration-300 group-hover:-translate-y-0.5" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
