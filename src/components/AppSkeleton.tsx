import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Compass, Shield } from 'lucide-react';

// Reusable Premium Shimmer Component that adapts beautifully to both dark and light themes
interface PremiumShimmerProps {
  className?: string;
  children?: React.ReactNode;
  key?: React.Key;
}

function PremiumShimmer({ className = "", children }: PremiumShimmerProps) {
  return (
    <div className={`relative overflow-hidden bg-zinc-900/60 border border-white/5 rounded-2xl ${className}`}>
      {/* Moving gradient light flare */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
      />
      {children}
    </div>
  );
}

export default function AppSkeleton() {
  const cardSkeletons = [1, 2, 3];

  return (
    <div id="app-loading-skeleton" className="min-h-screen bg-zinc-950 text-white overflow-hidden relative font-sans flex flex-col justify-between transition-colors duration-500">
      
      {/* Background ambient glowing spheres */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-[180px] pointer-events-none -z-10" />

      {/* 1. Navbar Skeleton with Luxury Glow Logo */}
      <header className="w-full border-b border-white/5 py-4 px-4 sm:px-6 lg:px-8 bg-zinc-950/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand/Logo Section with active breathing indicator */}
          <div className="flex items-center space-x-3">
            <motion.div 
              animate={{ 
                scale: [1, 1.04, 1],
                boxShadow: [
                  "0 0 0px rgba(139, 92, 246, 0)",
                  "0 0 20px rgba(139, 92, 246, 0.45)",
                  "0 0 0px rgba(139, 92, 246, 0)"
                ]
              }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center shadow-lg relative overflow-hidden"
            >
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
              />
            </motion.div>
            <div className="space-y-0.5">
              <span className="text-sm font-black tracking-wider bg-gradient-to-r from-violet-400 via-pink-400 to-amber-300 bg-clip-text text-transparent uppercase font-mono">
                Glowsphere
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse relative">
                  <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
                </span>
                <span className="text-[8px] text-zinc-500 tracking-widest font-mono uppercase">ATELIER NODE ONLINE</span>
              </div>
            </div>
          </div>

          {/* Nav Items skeleton */}
          <div className="hidden lg:flex items-center space-x-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-8 w-20 bg-white/5 rounded-lg animate-pulse" />
            ))}
          </div>

          {/* Right actions skeleton */}
          <div className="flex items-center space-x-3">
            <div className="h-8 w-24 bg-white/5 rounded-xl animate-pulse" />
            <div className="h-8 w-32 bg-white/5 rounded-xl animate-pulse" />
          </div>
        </div>
      </header>

      {/* 2. Main Content Skeleton (Matches Landing page grid) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-12">
        
        {/* Brand/Hero Skeleton */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 text-center max-w-3xl mx-auto pt-4 flex flex-col items-center"
        >
          {/* Centered Premium Concentric Breathing Logo */}
          <div className="relative flex items-center justify-center mb-2">
            {/* Pulsing Concentric Outer Glow Rings */}
            <motion.div 
              animate={{ 
                scale: [1, 1.4, 1],
                opacity: [0.15, 0.4, 0.15]
              }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute w-24 h-24 rounded-full border border-violet-500/20"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.8, 1],
                opacity: [0.05, 0.2, 0.05]
              }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.6 }}
              className="absolute w-24 h-24 rounded-full border border-pink-500/10"
            />
            
            {/* The core glowing logo card */}
            <motion.div 
              animate={{ 
                scale: [0.97, 1.03, 0.97],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden z-10"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-pink-500/20" />
              <Sparkles className="w-8 h-8 text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
              
              <motion.div 
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
              />
            </motion.div>
          </div>

          {/* Live Action Status Badge */}
          <div className="mx-auto h-6 w-56 bg-gradient-to-r from-violet-600/20 to-pink-500/20 rounded-full border border-violet-500/20 flex items-center justify-center py-1">
            <motion.div 
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="text-[9px] font-mono tracking-widest text-pink-300 font-bold uppercase flex items-center space-x-1"
            >
              <Sparkles className="w-3 h-3 text-cyan-400 mr-1 animate-spin" />
              <span>SYNCHRONIZING ATELIER NETWORK</span>
            </motion.div>
          </div>

          {/* Main heading skeleton with premium shimmer overlay */}
          <div className="space-y-3 w-full">
            <PremiumShimmer className="h-10 sm:h-14 w-4/5 sm:w-2/3 mx-auto" />
            <PremiumShimmer className="h-10 sm:h-14 w-1/2 mx-auto" />
          </div>

          {/* Subtitle placeholders */}
          <div className="space-y-2 w-full max-w-lg mx-auto">
            <div className="h-3 w-full bg-white/5 rounded-md animate-pulse" />
            <div className="h-3 w-4/5 bg-white/5 rounded-md animate-pulse mx-auto" />
          </div>
        </motion.div>

        {/* Categories Skeletons with premium subtle outlines */}
        <div className="flex justify-center space-x-3">
          {[1, 2, 3].map((idx) => (
            <PremiumShimmer key={idx} className="h-10 w-28" />
          ))}
        </div>

        {/* Salon cards grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {cardSkeletons.map((idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-white/5 border border-white/10 rounded-[28px] overflow-hidden p-4 space-y-4 relative"
            >
              {/* Image Shimmer Area */}
              <PremiumShimmer className="h-56 w-full rounded-2xl">
                {/* Rating badge placeholder */}
                <div className="absolute top-3 right-3 h-6 w-14 bg-black/40 rounded-lg animate-pulse" />
              </PremiumShimmer>

              {/* Title & Tagline placeholders */}
              <div className="space-y-2.5 px-1">
                <div className="flex justify-between items-center">
                  <div className="h-5 w-1/2 bg-white/10 rounded-md animate-pulse" />
                  <div className="h-4 w-12 bg-emerald-500/10 rounded-md animate-pulse" />
                </div>
                <div className="h-3 w-2/3 bg-white/5 rounded-md animate-pulse" />
              </div>

              {/* Decorative premium divider line */}
              <div className="h-[1px] bg-white/5 w-full" />

              {/* Bottom details placeholder */}
              <div className="flex justify-between items-center px-1">
                <div className="space-y-1">
                  <div className="h-2 w-16 bg-white/5 rounded-md animate-pulse" />
                  <div className="h-4 w-24 bg-white/10 rounded-md animate-pulse" />
                </div>
                <PremiumShimmer className="h-9 w-24 rounded-xl" />
              </div>
            </motion.div>
          ))}
        </div>

      </main>

      {/* 3. High-End Footer Loader */}
      <footer className="w-full border-t border-white/5 py-4 px-4 sm:px-6 lg:px-8 bg-zinc-950/20 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2 text-zinc-500 font-mono">
            <Shield className="w-3.5 h-3.5 text-violet-400" />
            <span>GLOWSPHERE SHIELD SECURED</span>
          </div>
          <div className="text-zinc-400 font-mono text-[10px] tracking-wider uppercase animate-pulse">
            Gemini 1.5 Flash • Gachibowli Node Online • Hyderabad Registry
          </div>
        </div>
      </footer>

    </div>
  );
}
