import { useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Sparkles, ArrowRight, Star, ShieldCheck, MapPin, Search, Scissors, Heart, Gift, Award, HelpCircle, Flame, CheckCircle, TrendingUp, Users } from 'lucide-react';
import { Salon, Service } from '../types';
import { INVESTOR_METRICS, PARTNERS_LOGOS, FAQ_DATA } from '../data';
import GlowCard from './GlowCard';

interface LandingViewProps {
  salons: Salon[];
  setTab: (tab: string) => void;
  setSelectedSalon: (salon: Salon | null) => void;
}

export default function LandingView({ salons, setTab, setSelectedSalon }: LandingViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocality, setSelectedLocality] = useState('All Localities');

  const categories = [
    { id: 'all', label: 'All Services', icon: Scissors },
    { id: 'hair', label: 'Hair Design', icon: Scissors },
    { id: 'treatments', label: 'Aesthetics', icon: Sparkles },
    { id: 'bridal', label: 'Bridal Makeover', icon: Heart },
    { id: 'spa', label: 'Wellness & Spa', icon: Gift },
    { id: 'nails', label: 'Nail Artistry', icon: Award }
  ];

  const handleQuickBook = (salon: Salon) => {
    setSelectedSalon(salon);
    setTab('marketplace');
  };

  const trendingSalons = salons.filter(s => s.isTrending);
  const luxurySalons = salons.filter(s => s.isLuxury);

  const { scrollY } = useScroll();

  // Create a buttery-smooth spring-smoothed representation of the scroll offset
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 70,
    damping: 26,
    restDelta: 0.001
  });

  // Multi-layered vertical, horizontal, and scale transformations for beautiful 3D depth
  const yViolet = useTransform(smoothScrollY, [0, 1200], [0, 180]);
  const xViolet = useTransform(smoothScrollY, [0, 1200], [0, 60]);
  const scaleViolet = useTransform(smoothScrollY, [0, 1200], [1, 1.2]);

  const yPink = useTransform(smoothScrollY, [0, 1200], [0, -150]);
  const xPink = useTransform(smoothScrollY, [0, 1200], [0, -80]);
  const scalePink = useTransform(smoothScrollY, [0, 1200], [1, 0.85]);

  const yCyan = useTransform(smoothScrollY, [0, 2000], [0, 240]);
  const xCyan = useTransform(smoothScrollY, [0, 2000], [0, 70]);
  const scaleCyan = useTransform(smoothScrollY, [0, 2000], [1, 1.15]);

  const ySparkleLeft = useTransform(smoothScrollY, [0, 1200], [0, -160]);
  const xSparkleLeft = useTransform(smoothScrollY, [0, 1200], [0, -30]);

  const ySparkleRight = useTransform(smoothScrollY, [0, 1200], [0, 110]);
  const xSparkleRight = useTransform(smoothScrollY, [0, 1200], [0, 40]);

  return (
    <div id="landing-container" className="relative min-h-screen text-white overflow-x-hidden pt-16">
      {/* Dynamic Background Glowing Blobs with Multi-Axis Parallax Drift */}
      <div className="absolute inset-0 glow-gradient pointer-events-none z-0" />
      <motion.div 
        style={{ y: yViolet, x: xViolet, scale: scaleViolet }}
        className="absolute top-20 left-10 w-96 h-96 bg-violet-600/10 rounded-full blur-[150px] pointer-events-none" 
      />
      <motion.div 
        style={{ y: yPink, x: xPink, scale: scalePink }}
        className="absolute top-96 right-20 w-80 h-80 bg-pink-500/10 rounded-full blur-[130px] pointer-events-none" 
      />
      <motion.div 
        style={{ y: yCyan, x: xCyan, scale: scaleCyan }}
        className="absolute bottom-20 left-1/3 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[180px] pointer-events-none" 
      />

      {/* Decorative Floating Sparkle Objects with dynamic floating drift to enhance visual depth */}
      <motion.div 
        style={{ y: ySparkleLeft, x: xSparkleLeft }}
        className="absolute top-44 left-[15%] text-pink-500/20 pointer-events-none hidden md:block"
      >
        <Sparkles className="w-8 h-8 animate-pulse" />
      </motion.div>
      <motion.div 
        style={{ y: ySparkleRight, x: xSparkleRight }}
        className="absolute top-[480px] right-[10%] text-cyan-400/20 pointer-events-none hidden md:block"
      >
        <Sparkles className="w-12 h-12 animate-pulse" />
      </motion.div>

      {/* HERO SECTION */}
      <section id="hero-section" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text and Search */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col space-y-6"
          >
            <div className="flex">
              <motion.span 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="badge-ai px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#06B6D4] flex items-center gap-2"
              >
                <span>✨</span> Live: Deep GenAI Face Shape &amp; Skin Tone Analyzer
              </motion.span>
            </div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-4xl sm:text-6xl lg:text-[76px] leading-[0.95] font-extrabold tracking-tighter"
            >
              India's Smartest <br />
              <span className="text-gradient">AI Beauty</span> <br />
              Marketplace
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-lg sm:text-xl text-zinc-400 max-w-xl leading-relaxed font-light"
            >
              Experience luxury beauty booking redefined. Discover elite Hyderabad salons with AI-curated recommendations tailored to your unique facial anatomy and style profile.
            </motion.p>

            {/* FLOATING BOOKING & SEARCH WIDGET */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-2xl mt-2 w-full"
            >
              <GlowCard className="p-4 sm:p-5 shadow-2xl border border-white/10 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Search Term Input */}
                  <div className="relative">
                    <label className="block text-[10px] uppercase tracking-wider text-zinc-500 font-mono mb-1">Service or Salon</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        placeholder="e.g. HydraFacial, Balayage"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-violet-500 transition-all font-sans placeholder-zinc-600"
                      />
                    </div>
                  </div>

                  {/* Locality Selector */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-zinc-500 font-mono mb-1">Hyderabad Locality</label>
                    <select
                      value={selectedLocality}
                      onChange={(e) => setSelectedLocality(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/5 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-violet-500 transition-all font-sans"
                    >
                      <option value="All Localities">All Localities</option>
                      <option value="Jubilee Hills">Jubilee Hills</option>
                      <option value="Banjara Hills">Banjara Hills</option>
                      <option value="Gachibowli">Gachibowli</option>
                      <option value="Kondapur">Kondapur</option>
                      <option value="Madhapur">Madhapur</option>
                    </select>
                  </div>

                  {/* Action Trigger */}
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setTab('marketplace');
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-violet-600 via-pink-600 to-cyan-500 rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center space-x-1.5 shadow-[0_0_30px_rgba(139,92,246,0.3)] active:scale-95"
                    >
                      <span>Search Ateliers</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </GlowCard>
            </motion.div>

            {/* Quick Metrics */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-6 sm:gap-8 mt-4 pt-4 border-t border-white/5"
            >
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-extrabold text-white">450+</span>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">Curated Ateliers</span>
              </div>
              <div className="h-8 w-[1px] bg-white/10" />
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-extrabold text-white">4.9/5</span>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">Client Rating</span>
              </div>
              <div className="h-8 w-[1px] bg-white/10" />
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-extrabold text-white">100%</span>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">Verified Stylists</span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-3 mt-4"
            >
              <button onClick={() => setTab('ai-lab')} className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium hover:bg-white/10 transition-all flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>Try Virtual AI Stylist</span>
              </button>
              <button onClick={() => setTab('marketplace')} className="px-5 py-2.5 rounded-full bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-500/20">
                Book Instant Slot
              </button>
            </motion.div>

          </motion.div>

          {/* Right Floating 3D Cards Simulation */}
          <div className="lg:col-span-5 relative h-[420px] flex items-center justify-center">
            
            {/* Back Card: AI Skin Analysis */}
            <motion.div 
              initial={{ opacity: 0, x: 40, y: -20, rotate: 5 }}
              animate={{ opacity: 0.7, x: 0, y: 0, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
              className="glass-card p-5 w-72 absolute -top-4 right-4 lg:right-10 z-10 scale-90 blur-[0.5px] border-cyan-500/20"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 tracking-wider">AI Face Architect</span>
              </div>
              <div className="aspect-[4/3] rounded-xl bg-white/5 mb-3 flex flex-col items-center justify-center border border-white/5">
                <Sparkles className="w-8 h-8 text-cyan-400/50 mb-1 animate-spin" />
                <span className="text-zinc-500 text-[10px] uppercase font-mono tracking-wide">Analyzing Skin Radiance...</span>
              </div>
              <div className="space-y-1.5">
                <div className="h-1.5 bg-cyan-400/20 rounded-full w-full" />
                <div className="h-1.5 bg-cyan-400/20 rounded-full w-4/5" />
              </div>
            </motion.div>

            {/* Front Card: Premium Salon Overview */}
            <motion.div 
              initial={{ opacity: 0, y: 40, rotate: -8 }}
              animate={{ opacity: 1, y: 0, rotate: -3 }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.6 }}
              whileHover={{ rotate: 0, scale: 1.03, transition: { duration: 0.2 } }}
              className="w-80 relative z-20 shadow-2xl"
            >
              <GlowCard className="p-6 w-full border-white/15 bg-zinc-950/40">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center p-[1px]">
                    <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center text-lg">✨</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm tracking-tight text-white">GlowSphere Premium Atelier</h4>
                    <p className="text-[11px] text-zinc-500 flex items-center">
                      <MapPin className="w-3 h-3 text-pink-500 mr-1" />
                      Jubilee Hills, Hyderabad
                    </p>
                  </div>
                  <div className="ml-auto bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-mono">
                    Online
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div className="h-2 bg-white/10 rounded-full w-full" />
                  <div className="h-2 bg-white/10 rounded-full w-3/4" />
                  
                  <div className="flex justify-between items-center mt-4 pt-2 border-t border-white/5">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500 block font-mono">Recommended Service</span>
                      <span className="text-sm font-semibold text-white">AI Tone Perfecting Facial</span>
                    </div>
                    <span className="text-violet-400 text-sm font-mono font-bold">₹4,500</span>
                  </div>

                  <button
                    onClick={() => setTab('marketplace')}
                    className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all text-white border border-white/10"
                  >
                    View Live Slots
                  </button>
                </div>
              </GlowCard>
            </motion.div>

            {/* Bottom Floating: Live Bookings */}
            <motion.div 
              initial={{ opacity: 0, x: -40, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
              className="glass-card p-4 w-64 absolute -bottom-6 left-4 lg:-left-4 z-30 shadow-2xl border-l-4 border-l-pink-500 bg-zinc-950/80"
            >
              <h5 className="text-[9px] font-mono font-bold mb-2 uppercase tracking-widest text-zinc-500">Live Booking Alert</h5>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-sm">💆‍♀️</div>
                <div>
                  <p className="text-xs font-bold text-white">HydraFacial Booking</p>
                  <p className="text-[10px] text-zinc-400">Jubilee Hills • Scheduled Today</p>
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* INVESTMENT & CAPITAL METRICS (SaaS styling) */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        id="investor-section" 
        className="border-y border-white/5 bg-zinc-950/50 py-10 relative z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[11px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-8">
            TRUSTED BY HYDERABAD'S TOP LUXURY BRANDS
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 text-center">
            {INVESTOR_METRICS.map((metric, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center justify-center"
              >
                <span className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                  {metric.value}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono mt-1">
                  {metric.label}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:opacity-70 transition-opacity duration-300">
            {PARTNERS_LOGOS.map((partner, index) => (
              <span key={index} className="text-base sm:text-lg font-serif italic font-bold tracking-widest text-white">
                {partner.logo}
              </span>
            ))}
          </div>
        </div>
      </motion.section>

      {/* POPULAR CATEGORIES */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        id="categories-section" 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-violet-400 block mb-2">CURATED SELECTIONS</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Popular Beauty Disciplines</h2>
          </div>
          <p className="text-zinc-400 max-w-sm text-sm mt-2 md:mt-0">
            Every booking includes complimentary AI color shade-matching or skin tone validation to guarantee flawless luxury results.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(1).map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                onClick={() => {
                  setTab('marketplace');
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ scale: 1.05, borderColor: "rgba(139, 92, 246, 0.5)", transition: { duration: 0.2 } }}
                className="glass-card p-5 hover:bg-white/5 transition-all duration-300 cursor-pointer text-center group flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-pink-400" />
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-pink-400 transition-colors">
                  {cat.label}
                </h4>
                <p className="text-[10px] text-zinc-500 font-mono mt-1">Instant Booking</p>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* AI CAPABILITIES & FEATURES BRIEFING */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        id="ai-briefing" 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 border-t border-white/5"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, x: -30 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-5 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-cyan-500/20 rounded-3xl filter blur-3xl opacity-50" />
            
            <GlowCard className="p-6 border-white/10 relative z-10 space-y-4 bg-zinc-950/40">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">DeepSkin Engine v4.2</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-400 font-mono border border-cyan-400/25">ACTIVE</span>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/5 space-y-2">
                <div className="flex justify-between text-xs font-mono text-zinc-400">
                  <span>Melanin Index:</span>
                  <span className="text-white">Medium Olive (52)</span>
                </div>
                <div className="flex justify-between text-xs font-mono text-zinc-400">
                  <span>Erythema Level:</span>
                  <span className="text-emerald-400">Normal (Healthy)</span>
                </div>
                <div className="flex justify-between text-xs font-mono text-zinc-400">
                  <span>Symmetry Ratio:</span>
                  <span className="text-white">98.4% perfect</span>
                </div>
              </div>

              <div className="text-xs text-zinc-400 italic">
                "Our neural networks analyze 144 facial keypoints to recommend skincare components that elevate natural radiance safely."
              </div>

              <button
                onClick={() => setTab('ai-lab')}
                className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl text-xs font-bold uppercase tracking-wider text-white hover:opacity-90 transition-all flex items-center justify-center space-x-1"
              >
                <span>Launch Skin Analyzer</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </GlowCard>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-7 space-y-6"
          >
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 block">AI-FIRST CORE INFRASTRUCTURE</span>
            <h2 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
              Aesthetic Intelligence For Every Client
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              GlowSphere operates proprietary recommendation models. Instead of selecting blindly, users scan their features to receive matching styling, tone compatibility, and local salon advice instantly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div 
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="p-5 rounded-2xl bg-white/5 border border-white/5"
              >
                <h4 className="font-bold text-sm text-white flex items-center mb-2">
                  <span className="text-pink-400 mr-2 font-mono">01/</span> AI Face Shape Analysis
                </h4>
                <p className="text-xs text-zinc-400">
                  Determines your natural contour structure (Oval, Round, etc.) to pair the ideal precision haircuts and styles.
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="p-5 rounded-2xl bg-white/5 border border-white/5"
              >
                <h4 className="font-bold text-sm text-white flex items-center mb-2">
                  <span className="text-cyan-400 mr-2 font-mono">02/</span> Skin Tone Detection
                </h4>
                <p className="text-xs text-zinc-400">
                  Color-matches cosmetics, highlights, and facials that respect melanin levels and organic skin profiles.
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="p-5 rounded-2xl bg-white/5 border border-white/5"
              >
                <h4 className="font-bold text-sm text-white flex items-center mb-2">
                  <span className="text-violet-400 mr-2 font-mono">03/</span> Dynamic Demand Price Engine
                </h4>
                <p className="text-xs text-zinc-400">
                  Tracks and flags seasonal bridal peak hours, allowing you to lock in up to 20% savings before dynamic price adjustments occur.
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="p-5 rounded-2xl bg-white/5 border border-white/5"
              >
                <h4 className="font-bold text-sm text-white flex items-center mb-2">
                  <span className="text-emerald-400 mr-2 font-mono">04/</span> Automated Concierge Scheduling
                </h4>
                <p className="text-xs text-zinc-400">
                  Book multi-service packages or group bridal sessions with single-click algorithmic timing matching.
                </p>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </motion.section>

      {/* LUXURY ATELIERS GRID */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        id="luxury-ateliers" 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 border-t border-white/5"
      >
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-pink-500 block mb-2">HYDERABAD HIGHLIGHTS</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Elite &amp; Luxury Ateliers</h2>
          </div>
          <button
            onClick={() => setTab('marketplace')}
            className="text-xs font-mono font-bold uppercase tracking-wider text-pink-400 hover:text-pink-300 transition-colors flex items-center space-x-1"
          >
            <span>Browse All Salons</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {luxurySalons.map((salon, idx) => (
            <motion.div
              key={salon.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="glass-card overflow-hidden group hover:border-violet-500/50 hover:shadow-2xl transition-all duration-300 flex flex-col h-full bg-zinc-950/20"
            >
              {/* Image Container with luxury badges */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={salon.image}
                  alt={salon.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-violet-600 text-white px-2.5 py-1 rounded-full shadow-lg">
                    ★ Premium VVIP
                  </span>
                  {salon.isTrending && (
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-pink-500 text-white px-2.5 py-1 rounded-full shadow-lg flex items-center">
                      <Flame className="w-3 h-3 mr-0.5" /> High Demand
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md border border-white/10 text-white font-mono flex items-center">
                    <MapPin className="w-3 h-3 text-pink-500 mr-1" /> {salon.locality}
                  </span>
                  <div className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-zinc-950/80 backdrop-blur-md text-yellow-400 text-xs font-bold">
                    <Star className="w-3 h-3 fill-yellow-400" />
                    <span>{salon.rating}</span>
                  </div>
                </div>
              </div>

              {/* Info Container */}
              <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-pink-400 transition-colors">
                    {salon.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 font-light italic">
                    "{salon.tagline}"
                  </p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {salon.features.slice(0, 3).map((feat, i) => (
                      <span key={i} className="text-[9px] font-mono bg-white/5 border border-white/5 text-zinc-400 px-2 py-0.5 rounded-lg">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer details */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-zinc-500 font-mono block">Average Spend</span>
                    <span className="text-sm font-bold text-white font-mono">₹{salon.averagePrice}+</span>
                  </div>
                  <button
                    onClick={() => handleQuickBook(salon)}
                    className="px-4 py-2 bg-white text-black rounded-lg text-xs font-bold hover:bg-zinc-200 transition-all flex items-center space-x-1 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                  >
                    <span>View Atelier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* HOW IT WORKS */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        id="how-it-works" 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 border-t border-white/5"
      >
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-violet-400 block mb-2">THREE SIMPLE STEPS</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">How GlowSphere Works</h2>
          <p className="text-zinc-400 text-sm mt-3 font-light">
            An elegant integration of generative artificial intelligence and high-touch offline treatment bookings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="p-6 rounded-2xl bg-white/5 border border-white/5 relative"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold text-sm mb-4 border border-violet-500/20">
              01
            </div>
            <h4 className="font-bold text-lg text-white mb-2">Perform AI Feature Scan</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Upload a snapshot or launch our live smart mirror to analyze your natural face shape, skin undertone coordinates, and hair density ratios.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="p-6 rounded-2xl bg-white/5 border border-white/5 relative"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-sm mb-4 border border-pink-500/20">
              02
            </div>
            <h4 className="font-bold text-lg text-white mb-2">Review Algorithmic Matches</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Our AI pairs you with custom salon services (like the HydraFacial with customized serums) and specialized staff based on real experience scores.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="p-6 rounded-2xl bg-white/5 border border-white/5 relative"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm mb-4 border border-cyan-500/20">
              03
            </div>
            <h4 className="font-bold text-lg text-white mb-2">Instantly Lock Your Seat</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Complete payments securely via our fast Stripe integration. Walk into your VVIP suite or request a home-service specialist straight to your door.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* THE BEAUTY JOURNEY ROADMAP */}
      <section 
        id="beauty-journey-roadmap" 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 border-t border-white/5"
      >
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-mono uppercase tracking-[0.3em] text-violet-400 block mb-2"
          >
            PERSONALIZED RADIANCE TIMELINE
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white"
          >
            Your Interactive Beauty Journey
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-sm mt-3 font-light"
          >
            Visualize your personalized pathway from initial AI skin and face analysis to walking into your VVIP booking slot.
          </motion.p>
        </div>

        {/* Roadmap Roadmap Timeline Structure */}
        <div className="relative max-w-5xl mx-auto">
          {/* Central Connecting Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-600 via-pink-500 to-cyan-400 transform -translate-x-1/2 opacity-30 pointer-events-none" />
          
          {/* Dynamic Animated Scroll Progress Overlay on Central Line */}
          <motion.div 
            initial={{ height: "0%" }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute left-4 md:left-1/2 top-0 w-0.5 bg-gradient-to-b from-violet-500 via-pink-500 to-cyan-400 transform -translate-x-1/2 z-0 pointer-events-none origin-top shadow-[0_0_12px_rgba(139,92,246,0.5)]"
          />

          <div className="space-y-16">
            
            {/* Milestone 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="flex flex-col md:flex-row items-stretch relative"
            >
              {/* Left Column (Desktop: Card, Mobile: Content) */}
              <div className="w-full md:w-1/2 pr-0 md:pr-12 flex justify-end items-center order-2 md:order-1">
                <motion.div 
                  whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                  className="w-full bg-zinc-900/60 border border-white/15 p-6 rounded-2xl shadow-xl hover:border-violet-500/50 transition-all duration-300 relative group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">📸</span>
                    <div>
                      <span className="text-[10px] font-mono font-bold tracking-widest text-violet-400 uppercase">PHASE 01</span>
                      <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">Aura Skin &amp; Face Scan</h3>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    Launch our smart scanner. Our neural network processes 144 coordinate points to map face contours, skin undertones, and structural symmetry.
                  </p>
                  
                  {/* Interactive Status Indicator */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/80 border border-white/5">
                    <span className="text-[10px] font-mono text-zinc-500">SYSTEM SCAN</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">Diagnostics Ready (98.4%)</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setTab('ai-lab')}
                    className="mt-4 w-full py-2 bg-violet-600/10 hover:bg-violet-600/20 text-violet-400 hover:text-violet-300 border border-violet-500/20 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Launch Virtual Lab</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              </div>

              {/* Central Node Circle */}
              <div className="absolute left-4 md:left-1/2 top-6 md:top-1/2 transform -translate-x-1/2 md:-translate-y-1/2 z-10 flex items-center justify-center">
                <motion.div 
                  whileHover={{ scale: 1.25 }}
                  className="w-9 h-9 rounded-full bg-zinc-950 border-2 border-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/20 text-xs font-mono font-black text-violet-400 relative"
                >
                  01
                  <span className="absolute inset-0 rounded-full border border-violet-500 animate-ping opacity-30" />
                </motion.div>
              </div>

              {/* Right Column (Desktop: Empty padding, Mobile: Empty) */}
              <div className="hidden md:block w-1/2 pl-12 order-3" />
            </motion.div>

            {/* Milestone 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="flex flex-col md:flex-row items-stretch relative"
            >
              {/* Left Column (Desktop: Empty, Mobile: Empty) */}
              <div className="hidden md:block w-1/2 pr-12 order-1" />

              {/* Central Node Circle */}
              <div className="absolute left-4 md:left-1/2 top-6 md:top-1/2 transform -translate-x-1/2 md:-translate-y-1/2 z-10 flex items-center justify-center">
                <motion.div 
                  whileHover={{ scale: 1.25 }}
                  className="w-9 h-9 rounded-full bg-zinc-950 border-2 border-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/20 text-xs font-mono font-black text-pink-400 relative"
                >
                  02
                  <span className="absolute inset-0 rounded-full border border-pink-500 animate-ping opacity-30" />
                </motion.div>
              </div>

              {/* Right Column (Desktop: Card, Mobile: Content) */}
              <div className="w-full md:w-1/2 pl-0 md:pl-12 flex justify-start items-center order-2">
                <motion.div 
                  whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                  className="w-full bg-zinc-900/60 border border-white/15 p-6 rounded-2xl shadow-xl hover:border-pink-500/50 transition-all duration-300 relative group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">🧠</span>
                    <div>
                      <span className="text-[10px] font-mono font-bold tracking-widest text-pink-400 uppercase">PHASE 02</span>
                      <h3 className="text-lg font-bold text-white group-hover:text-pink-300 transition-colors">Algorithmic Matchmaking</h3>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    Based on your facial contours and skin undertones, receive highly customized service proposals, such as specific custom-blended hair glossing or medical-grade skin hydration treatments.
                  </p>
                  
                  {/* Interactive Status Indicator */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/80 border border-white/5">
                    <span className="text-[10px] font-mono text-zinc-500">DECISION MATCH</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-mono text-pink-400 font-bold">5 Matched Ateliers</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setTab('marketplace')}
                    className="mt-4 w-full py-2 bg-pink-600/10 hover:bg-pink-600/20 text-pink-400 hover:text-pink-300 border border-pink-500/20 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Browse Matches</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              </div>
            </motion.div>

            {/* Milestone 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="flex flex-col md:flex-row items-stretch relative"
            >
              {/* Left Column (Desktop: Card, Mobile: Content) */}
              <div className="w-full md:w-1/2 pr-0 md:pr-12 flex justify-end items-center order-2 md:order-1">
                <motion.div 
                  whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                  className="w-full bg-zinc-900/60 border border-white/15 p-6 rounded-2xl shadow-xl hover:border-cyan-500/50 transition-all duration-300 relative group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">🗺️</span>
                    <div>
                      <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">PHASE 03</span>
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">Interactive Geographic Discovery</h3>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    Filter by high-end local neighborhoods (Jubilee Hills, Gachibowli) or view salons on our elegant dark/light interactive map, comparing Verified Experience Stars.
                  </p>
                  
                  {/* Interactive Status Indicator */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/80 border border-white/5">
                    <span className="text-[10px] font-mono text-zinc-500">VERIFICATION MATRIX</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">100% Quality Audited</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setTab('marketplace')}
                    className="mt-4 w-full py-2 bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-400 hover:text-cyan-300 border border-cyan-500/20 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Open Map View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              </div>

              {/* Central Node Circle */}
              <div className="absolute left-4 md:left-1/2 top-6 md:top-1/2 transform -translate-x-1/2 md:-translate-y-1/2 z-10 flex items-center justify-center">
                <motion.div 
                  whileHover={{ scale: 1.25 }}
                  className="w-9 h-9 rounded-full bg-zinc-950 border-2 border-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-xs font-mono font-black text-cyan-400 relative"
                >
                  03
                  <span className="absolute inset-0 rounded-full border border-cyan-500 animate-ping opacity-30" />
                </motion.div>
              </div>

              {/* Right Column (Desktop: Empty, Mobile: Empty) */}
              <div className="hidden md:block w-1/2 pl-12 order-3" />
            </motion.div>

            {/* Milestone 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="flex flex-col md:flex-row items-stretch relative"
            >
              {/* Left Column (Desktop: Empty, Mobile: Empty) */}
              <div className="hidden md:block w-1/2 pr-12 order-1" />

              {/* Central Node Circle */}
              <div className="absolute left-4 md:left-1/2 top-6 md:top-1/2 transform -translate-x-1/2 md:-translate-y-1/2 z-10 flex items-center justify-center">
                <motion.div 
                  whileHover={{ scale: 1.25 }}
                  className="w-9 h-9 rounded-full bg-zinc-950 border-2 border-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-xs font-mono font-black text-emerald-400 relative"
                >
                  04
                  <span className="absolute inset-0 rounded-full border border-emerald-500 animate-ping opacity-30" />
                </motion.div>
              </div>

              {/* Right Column (Desktop: Card, Mobile: Content) */}
              <div className="w-full md:w-1/2 pl-0 md:pl-12 flex justify-start items-center order-2">
                <motion.div 
                  whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                  className="w-full bg-zinc-900/60 border border-white/15 p-6 rounded-2xl shadow-xl hover:border-emerald-500/50 transition-all duration-300 relative group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">📅</span>
                    <div>
                      <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">PHASE 04</span>
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">Precision Calendar Slot Lock</h3>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    Skip clunky dropdown lists. Interact with our premium monthly visual calendar to identify real-time available, busy, and blocked stylist schedules instantly.
                  </p>
                  
                  {/* Interactive Status Indicator */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/80 border border-white/5">
                    <span className="text-[10px] font-mono text-zinc-500">SCHEDULING ENGINE</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">100% Collision-Free</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setTab('marketplace')}
                    className="mt-4 w-full py-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Open Booking Panel</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              </div>
            </motion.div>

            {/* Milestone 5 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="flex flex-col md:flex-row items-stretch relative"
            >
              {/* Left Column (Desktop: Card, Mobile: Content) */}
              <div className="w-full md:w-1/2 pr-0 md:pr-12 flex justify-end items-center order-2 md:order-1">
                <motion.div 
                  whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                  className="w-full bg-zinc-900/60 border border-white/15 p-6 rounded-2xl shadow-xl hover:border-violet-500/50 transition-all duration-300 relative group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">🥂</span>
                    <div>
                      <span className="text-[10px] font-mono font-bold tracking-widest text-violet-400 uppercase">PHASE 05</span>
                      <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">Arrive &amp; Radiate</h3>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    Lock in with secure Stripe processing. Receive confirmation SMS and head straight into your chosen salon's private VVIP suite, or enjoy professional styling in your residence.
                  </p>
                  
                  {/* Interactive Status Indicator */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/80 border border-white/5">
                    <span className="text-[10px] font-mono text-zinc-500">EXPERIENCE STATUS</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-violet-400 font-bold">VVIP Champagne Check-in</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setTab('marketplace')}
                    className="mt-4 w-full py-2.5 bg-gradient-to-r from-violet-600 to-pink-500 text-white rounded-xl text-xs font-bold tracking-wider hover:opacity-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Secure Your VVIP Booking Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              </div>

              {/* Central Node Circle */}
              <div className="absolute left-4 md:left-1/2 top-6 md:top-1/2 transform -translate-x-1/2 md:-translate-y-1/2 z-10 flex items-center justify-center">
                <motion.div 
                  whileHover={{ scale: 1.25 }}
                  className="w-9 h-9 rounded-full bg-zinc-950 border-2 border-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/20 text-xs font-mono font-black text-violet-400 relative"
                >
                  05
                  <span className="absolute inset-0 rounded-full border border-violet-500 animate-ping opacity-30" />
                </motion.div>
              </div>

              {/* Right Column (Desktop: Empty, Mobile: Empty) */}
              <div className="hidden md:block w-1/2 pl-12 order-3" />
            </motion.div>

          </div>
        </div>
      </section>

      {/* MEMBER SUBSCRIPTION AND REWARDS PLANS */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        id="pricing-section" 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 border-t border-white/5"
      >
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-pink-500 block mb-2">GLOWSPHERE CLUB MEMBERSHIPS</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Unlock Perpetual Radiance</h2>
          <p className="text-zinc-400 text-sm mt-3 font-light">
            Join the elite circle of GlowSphere Gold. Save on bookings, receive premium concierge support, and enjoy free home visits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plan 1 */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative flex flex-col justify-between h-full"
          >
            <GlowCard className="p-8 border-white/10 w-full h-full flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold block mb-1">Glow Classic</span>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-extrabold text-white">Free tier</span>
                  <span className="text-xs text-zinc-500 ml-1">/ always</span>
                </div>
                <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                  Unlock instant access to the GlowSphere Hyderabad marketplace with Standard AI recommendations and direct-pay bookings.
                </p>
                
                <ul className="space-y-3 text-xs text-zinc-300">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-400 mr-2 shrink-0" /> Search 450+ verified salons</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-400 mr-2 shrink-0" /> Basic AI face shape advice</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-400 mr-2 shrink-0" /> standard client support</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-400 mr-2 shrink-0" /> Secure payment processing</li>
                </ul>
              </div>

              <button
                onClick={() => setTab('marketplace')}
                className="w-full mt-8 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-all"
              >
                Start Discovering
              </button>
            </GlowCard>
          </motion.div>

          {/* Plan 2 */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative flex flex-col justify-between shadow-[0_0_40px_rgba(139,92,246,0.15)] h-full"
          >
            {/* Highly Recommended Badge is rendered outside the GlowCard to avoid clipping by overflow-hidden */}
            <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-violet-600 to-pink-500 text-white font-mono font-bold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full border border-violet-400/20 z-20">
              Highly Recommended
            </div>

            <GlowCard className="p-8 border-violet-500/30 bg-zinc-950/60 w-full h-full flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-violet-400 font-bold block mb-1">Glow Gold Elite</span>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-extrabold text-white">₹999</span>
                  <span className="text-xs text-zinc-500 ml-1">/ month</span>
                </div>
                <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                  Save massive amounts with flat discounts, free home-salon visits, priority concierge matching, and VVIP champagne room access.
                </p>
                
                <ul className="space-y-3 text-xs text-zinc-300">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-violet-400 mr-2 shrink-0" /> Flat **15% off** all high-end salons</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-violet-400 mr-2 shrink-0" /> **Free cancellation shield** up to 2h</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-violet-400 mr-2 shrink-0" /> Premium AI Skin and Face tracking</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-violet-400 mr-2 shrink-0" /> Zero convenience fee on bookings</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-violet-400 mr-2 shrink-0" /> **Free home styling** visit service charge</li>
                </ul>
              </div>

              <button
                onClick={() => {
                  alert('Welcome to GlowSphere Gold Membership! Your flat 15% discount is now active across Hyderabad salons.');
                }}
                className="w-full mt-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-pink-600 to-cyan-500 text-xs font-bold uppercase tracking-wider transition-all text-white shadow-lg shadow-violet-500/20 active:scale-95 hover:opacity-90"
              >
                Upgrade To Gold
              </button>
            </GlowCard>
          </motion.div>
        </div>
      </motion.section>

      {/* USER REVIEWS & TESTIMONIALS */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        id="testimonials-section" 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 border-t border-white/5"
      >
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 block mb-2">LOVED BY CROWD</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Client Transformations</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/5"
          >
            <div className="flex items-center space-x-1 text-yellow-400 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400" />)}
            </div>
            <p className="text-xs text-zinc-300 italic mb-4">
              "The AI skincare analysis recommended specific salicylic formulations and paired me with GlowSphere Premium Atelier. Within 3 facials, my skin texture has never felt more uniform. Outstanding!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-800" />
              <div>
                <h5 className="text-xs font-bold text-white">Dr. Shruti Nair</h5>
                <span className="text-[10px] text-zinc-500">Kondapur Patient</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/5"
          >
            <div className="flex items-center space-x-1 text-yellow-400 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400" />)}
            </div>
            <p className="text-xs text-zinc-300 italic mb-4">
              "As a regular user, the GlowSphere Gold membership paid for itself on my very first hair color booking. Secure payment via Stripe and premium VVIP lounge treatment. Absolute class."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-800" />
              <div>
                <h5 className="text-xs font-bold text-white">Aditya Reddy</h5>
                <span className="text-[10px] text-zinc-500">Banjara Hills Tech Entrepreneur</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/5"
          >
            <div className="flex items-center space-x-1 text-yellow-400 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400" />)}
            </div>
            <p className="text-xs text-zinc-300 italic mb-4">
              "Kavitha Reddy did my bridal makeup package. The digital face symmetry match made me super comfortable. Highly recommended to all South Indian brides looking for authentic but modern styling."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-800" />
              <div>
                <h5 className="text-xs font-bold text-white">Deepika S.</h5>
                <span className="text-[10px] text-zinc-500">Hyderabad Bride</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        id="faq-section" 
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 border-t border-white/5"
      >
        <div className="text-center mb-12">
          <HelpCircle className="w-8 h-8 text-violet-400 mx-auto mb-2" />
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {FAQ_DATA.map((faq, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="p-5 rounded-xl bg-white/5 border border-white/5"
            >
              <h4 className="font-bold text-sm text-white flex items-start">
                <span className="text-pink-500 mr-2 font-mono">Q.</span>
                {faq.q}
              </h4>
              <p className="text-xs text-zinc-400 mt-2 pl-5 leading-relaxed">
                {faq.a}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer id="main-footer" className="bg-zinc-950 border-t border-white/10 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white">GlowSphere AI</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed font-light">
              India's first AI-powered beauty marketplace orchestrating custom skincare matching and luxury salon bookings in real-time.
            </p>
            <p className="text-[10px] font-mono text-zinc-600">© 2026 GlowSphere Technologies Private Ltd.</p>
          </div>

          <div>
            <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">Hyderabad Localities</h5>
            <ul className="space-y-2 text-xs text-zinc-500 font-light">
              <li><a href="#" className="hover:text-white transition-colors">Jubilee Hills Ateliers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Banjara Hills Lounges</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Gachibowli Tech Labs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Kondapur Organics</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Madhapur Styling Suites</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">Marketplace</h5>
            <ul className="space-y-2 text-xs text-zinc-500 font-light">
              <li><a href="#" className="hover:text-white transition-colors">Skincare Ateliers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Bridal Transformation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hair Couture &amp; Tinting</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Nail Holographic Labs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Certified Stylists</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">SaaS Portal</h5>
            <ul className="space-y-2 text-xs text-zinc-500 font-light">
              <li><a href="#" className="hover:text-white transition-colors">Salon Partner Portal</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Merchant Dashboard</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Investor Pitch Deck</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers &amp; Aesthetics</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Developer APIs</a></li>
            </ul>
          </div>

        </div>
      </footer>

    </div>
  );
}
