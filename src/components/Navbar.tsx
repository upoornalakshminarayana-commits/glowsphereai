import { useState, useEffect } from 'react';
import { Sparkles, Compass, User, KeyRound, Wallet, Menu, X, Landmark, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  walletBalance: number;
  userRole: 'customer' | 'owner' | 'admin';
  setUserRole: (role: 'customer' | 'owner' | 'admin') => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export default function Navbar({ currentTab, setTab, walletBalance, userRole, setUserRole, theme, toggleTheme }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'landing', label: 'Discover', icon: Compass },
    { id: 'marketplace', label: 'Book Salons', icon: Sparkles },
    { id: 'ai-lab', label: 'AI Beauty Lab', icon: Sparkles },
    { id: 'customer', label: 'My Hub', icon: User },
    { id: 'owner', label: 'Owner Suite', icon: Landmark },
    { id: 'admin', label: 'Control Panel', icon: KeyRound }
  ];

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-zinc-950/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/50 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div 
            onClick={() => setTab('landing')} 
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-pink-500 to-cyan-400 p-[1px] shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all duration-300">
              <div className="w-full h-full rounded-xl bg-zinc-950 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-sans font-bold text-xl tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                  GlowSphere
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 font-mono font-medium tracking-wide">
                  AI
                </span>
              </div>
              <p className="text-[9px] text-zinc-500 tracking-wider uppercase font-mono">Hyderabad Marketplace</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-1.5 ${
                    isActive
                      ? 'text-white'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-pink-400' : 'text-zinc-500'}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-violet-500 to-pink-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Side Info & Role Selector */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Wallet Quickview */}
            <div 
              onClick={() => setTab('customer')}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/30 cursor-pointer transition-all duration-300 hover:bg-white/10"
            >
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-medium text-zinc-300">
                ₹{walletBalance.toLocaleString()}
              </span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/30 text-zinc-300 hover:text-white transition-all duration-300 hover:bg-white/10 cursor-pointer flex items-center justify-center"
              title={theme === 'light' ? 'Switch to Dark Theme' : 'Switch to High-Contrast Light Theme'}
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-pink-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Quick Role Switcher for judges */}
            <div className="flex items-center bg-zinc-900/80 border border-white/5 p-1 rounded-xl">
              <button
                onClick={() => setUserRole('customer')}
                className={`px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider font-mono font-bold transition-all duration-200 ${
                  userRole === 'customer'
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                User
              </button>
              <button
                onClick={() => setUserRole('owner')}
                className={`px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider font-mono font-bold transition-all duration-200 ${
                  userRole === 'owner'
                    ? 'bg-pink-600 text-white shadow-md'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Owner
              </button>
              <button
                onClick={() => setUserRole('admin')}
                className={`px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider font-mono font-bold transition-all duration-200 ${
                  userRole === 'admin'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 px-2 py-1 rounded-xl bg-white/5 border border-white/10">
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-mono font-medium text-zinc-300">
                ₹{walletBalance}
              </span>
            </div>

            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center justify-center"
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-pink-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-zinc-950/95 backdrop-blur-2xl border-b border-white/10 px-4 py-6 space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 flex flex-col items-center space-y-1.5 ${
                    isActive
                      ? 'bg-violet-600/10 border border-violet-500/30 text-white'
                      : 'bg-white/5 border border-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-pink-400' : 'text-zinc-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="border-t border-white/10 pt-4 space-y-3">
            <p className="text-xs text-zinc-500 font-mono text-center">SIMULATE PLATFORM ROLE (JUDGES DEMO)</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setUserRole('customer');
                  setIsOpen(false);
                }}
                className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  userRole === 'customer' ? 'bg-violet-600 text-white' : 'bg-white/5 text-zinc-400'
                }`}
              >
                CUSTOMER
              </button>
              <button
                onClick={() => {
                  setUserRole('owner');
                  setIsOpen(false);
                }}
                className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  userRole === 'owner' ? 'bg-pink-600 text-white' : 'bg-white/5 text-zinc-400'
                }`}
              >
                OWNER
              </button>
              <button
                onClick={() => {
                  setUserRole('admin');
                  setIsOpen(false);
                }}
                className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  userRole === 'admin' ? 'bg-cyan-600 text-white' : 'bg-white/5 text-zinc-400'
                }`}
              >
                ADMIN
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
