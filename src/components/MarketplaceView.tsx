import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Salon, Service, Professional, Booking, Review } from '../types';
import { Search, MapPin, Star, Clock, Calendar, Sparkles, User, Gift, Check, ArrowRight, ShieldAlert, CheckCircle, ChevronRight, X, PhoneCall, MessageSquare, ChevronLeft } from 'lucide-react';
import { HYDERABAD_LOCALITIES } from '../data';
import SalonsMap from './SalonsMap';

const CATEGORY_IMAGES: Record<Service['category'], string> = {
  hair: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=300&q=80',
  skin: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=300&q=80',
  bridal: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80',
  spa: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=300&q=80',
  nails: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=300&q=80',
  treatments: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=300&q=80'
};

interface MarketplaceViewProps {
  salons: Salon[];
  professionals: Professional[];
  onCreateBooking: (bookingData: any) => Promise<any>;
  selectedSalonFromLanding: Salon | null;
  setSelectedSalonFromLanding: (salon: Salon | null) => void;
}

export default function MarketplaceView({
  salons,
  professionals,
  onCreateBooking,
  selectedSalonFromLanding,
  setSelectedSalonFromLanding
}: MarketplaceViewProps) {
  
  // Filters
  const [selectedLocality, setSelectedLocality] = useState('All Localities');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Salon Details State
  const [viewingSalon, setViewingSalon] = useState<Salon | null>(null);
  
  // Booking Workflow State
  const [bookingService, setBookingService] = useState<Service | null>(null);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [bookingProfessional, setBookingProfessional] = useState<Professional | null>(null);
  const [bookingDate, setBookingDate] = useState('2026-06-25');
  const [bookingTime, setBookingTime] = useState('11:30 AM');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [isHomeService, setIsHomeService] = useState(false);
  const [customerName, setCustomerName] = useState('Upoorna Lakshmi');
  const [customerEmail, setCustomerEmail] = useState('upoorna@example.com');
  const [bookingCompleted, setBookingCompleted] = useState<Booking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Visual Calendar States
  const [calendarYear, setCalendarYear] = useState(2026);
  const [calendarMonth, setCalendarMonth] = useState(5); // June is index 5

  // Helper to determine slot blocking status deterministically based on salon, date, slot time, and professional
  const getSlotStatus = (salonId: string, dateStr: string, slotTime: string, professionalId: string | null) => {
    const hashString = `${salonId}-${dateStr}-${slotTime}-${professionalId || 'any'}`;
    let hash = 0;
    for (let i = 0; i < hashString.length; i++) {
      hash = hashString.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Deterministic blocking: around 30% of slots are blocked
    const isBlocked = Math.abs(hash) % 7 === 0 || Math.abs(hash) % 7 === 3;
    return isBlocked ? 'blocked' : 'available';
  };

  // Helper to determine if a day has blocked or available slots
  const getDayStatus = (salonId: string, dateStr: string, professionalId: string | null) => {
    const slots = ["10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM", "7:00 PM"];
    const blockedCount = slots.filter(slot => getSlotStatus(salonId, dateStr, slot, professionalId) === 'blocked').length;
    if (blockedCount === slots.length) return 'blocked';
    if (blockedCount >= 4) return 'busy';
    return 'available';
  };

  // Sync selectedServices with bookingService if bookingService is set directly from outside
  useEffect(() => {
    if (bookingService && selectedServices.length === 0) {
      setSelectedServices([bookingService]);
    }
  }, [bookingService]);

  // Sync calendarMonth/Year when bookingDate changes (e.g. initially or set from external AI recommendations)
  useEffect(() => {
    if (bookingDate) {
      const parts = bookingDate.split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1; // 0-indexed
        setCalendarYear(y);
        setCalendarMonth(m);
      }
    }
  }, [bookingDate]);

  // Automatically select the first available slot if the current selection is blocked on a newly chosen date
  useEffect(() => {
    if (viewingSalon && bookingDate) {
      const slotsList = ["10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM", "7:00 PM"];
      const currentStatus = getSlotStatus(viewingSalon.id, bookingDate, bookingTime, bookingProfessional?.id || null);
      if (currentStatus === 'blocked') {
        const firstAvailable = slotsList.find(slot => 
          getSlotStatus(viewingSalon.id, bookingDate, slot, bookingProfessional?.id || null) === 'available'
        );
        if (firstAvailable) {
          setBookingTime(firstAvailable);
        }
      }
    }
  }, [bookingDate, bookingProfessional, viewingSalon]);

  // Salon Reviews State
  const [activeReviews, setActiveReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [newReviewName, setNewReviewName] = useState('Upoorna Lakshmi');
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewService, setNewReviewService] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState('');

  // Fetch reviews when viewingSalon changes
  useEffect(() => {
    if (viewingSalon) {
      setLoadingReviews(true);
      fetch(`/api/salons/${viewingSalon.id}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch salon reviews');
          return res.json();
        })
        .then(data => {
          if (data && data.reviews) {
            setActiveReviews(data.reviews);
          }
        })
        .catch(err => {
          console.error("Error fetching salon reviews:", err);
        })
        .finally(() => {
          setLoadingReviews(false);
        });
    } else {
      setActiveReviews([]);
      setReviewSuccessMessage('');
      setNewReviewName('Upoorna Lakshmi');
      setNewReviewText('');
      setNewReviewRating(5);
      setNewReviewService('');
    }
  }, [viewingSalon]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingSalon) return;
    if (!newReviewName.trim() || !newReviewText.trim()) {
      alert('Please fill in your name and feedback message.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const response = await fetch(`/api/salons/${viewingSalon.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: newReviewName,
          rating: newReviewRating,
          text: newReviewText,
          serviceName: newReviewService || 'General Service'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const createdReview = await response.json();
      setActiveReviews(prev => [createdReview, ...prev]);
      setReviewSuccessMessage('Thank you! Your review has been submitted successfully.');
      
      // Clear form inputs except name
      setNewReviewText('');
      setNewReviewRating(5);
      setNewReviewService('');
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setReviewSuccessMessage('');
      }, 5000);

    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Map and Selection States
  const [showMap, setShowMap] = useState(true);
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [selectedSalonId, setSelectedSalonId] = useState<string | null>(null);
  const [hoveredSalonId, setHoveredSalonId] = useState<string | null>(null);

  // Auto load selected salon from landing page if it was passed
  useEffect(() => {
    if (selectedSalonFromLanding) {
      setViewingSalon(selectedSalonFromLanding);
      // Reset after loading
      setSelectedSalonFromLanding(null);
    }
  }, [selectedSalonFromLanding]);

  // Categories
  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'hair', label: 'Hair Design' },
    { id: 'treatments', label: 'AI Aesthetics' },
    { id: 'bridal', label: 'Bridal Makeovers' },
    { id: 'spa', label: 'Wellness & Spa' },
    { id: 'nails', label: 'Nails & Art' }
  ];

  // Filtering Salons Client-Side or based on search
  const filteredSalons = salons.filter(salon => {
    const matchLocality = selectedLocality === 'All Localities' || salon.locality.toLowerCase() === selectedLocality.toLowerCase();
    const matchCategory = selectedCategory === 'all' || salon.services.some(s => s.category === selectedCategory);
    
    const query = searchQuery.toLowerCase().trim();
    const matchSearch = query === '' || 
      salon.name.toLowerCase().includes(query) ||
      salon.locality.toLowerCase().includes(query) ||
      salon.tagline.toLowerCase().includes(query) ||
      salon.features.some(f => f.toLowerCase().includes(query)) ||
      salon.services.some(s => s.name.toLowerCase().includes(query) || (s.description && s.description.toLowerCase().includes(query)));
    
    return matchLocality && matchCategory && matchSearch;
  });

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'GLOWAI20') {
      setCouponApplied(true);
    } else {
      alert('Invalid coupon. Try using "GLOWAI20" for 20% off!');
    }
  };

  const calculateFinalPrice = (price: number) => {
    if (couponApplied) {
      return Math.round(price * 0.8);
    }
    return price;
  };

  const handleBookNow = async () => {
    if (!viewingSalon || selectedServices.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const result = await onCreateBooking({
        salonId: viewingSalon.id,
        serviceId: selectedServices[0].id,
        serviceIds: selectedServices.map(s => s.id),
        professionalId: bookingProfessional?.id || '',
        date: bookingDate,
        time: bookingTime,
        customerName,
        customerEmail,
        isHomeService,
        couponCode: couponApplied ? 'GLOWAI20' : ''
      });
      setBookingCompleted(result);
      
      // Celebrate with premium confetti styling matching brand theme colors (Violet, Pink, Cyan, Amber, Emerald)
      confetti({
        particleCount: 140,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#EC4899', '#06B6D4', '#FBBF24', '#10B981']
      });
    } catch (err) {
      console.error(err);
      alert('Failed to complete booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetBookingFlow = () => {
    setBookingService(null);
    setSelectedServices([]);
    setBookingProfessional(null);
    setCouponApplied(false);
    setCouponCode('');
    setIsHomeService(false);
    setBookingCompleted(null);
  };

  const currentSalonPros = viewingSalon 
    ? professionals.filter(p => p.salonId === viewingSalon.id) 
    : [];

  return (
    <div id="marketplace-container" className="relative min-h-screen text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Search Header */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <span className="badge-ai px-4 py-1 rounded-full text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest inline-block mb-3">
          HYDERABAD PREMIUM DIRECTORY
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Couture Booking <span className="text-gradient">Engine</span>
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-xl mx-auto">
          Secure elite appointments across high-fidelity Hyderabad beauty landmarks. Instant confirmation, cancellation shield coverage, and Gold membership rewards.
        </p>
      </div>

      {/* FILTERS PANEL */}
      <div className="glass-card p-5 border border-white/10 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Query Search */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search salons, treatments, master stylists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/5 focus:border-violet-500 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none transition-all placeholder-zinc-500"
            />
          </div>

          {/* Locality Switcher */}
          <div className="md:col-span-3">
            <select
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              className="w-full bg-zinc-900 border border-white/5 focus:border-violet-500 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none transition-all"
            >
              {HYDERABAD_LOCALITIES.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Quick Categories Bar */}
          <div className="md:col-span-4 flex overflow-x-auto space-x-1.5 py-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-md shadow-violet-500/10'
                    : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>

        {/* Popular Tags / Service Keywords Row */}
        <div id="popular-service-keywords" className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Popular Keywords:</span>
          {['Balayage', 'Keratin', 'Facial', 'Massage', 'Pedicure', 'Nail Art', 'Bridal'].map((tag) => {
            const isSelected = searchQuery.toLowerCase() === tag.toLowerCase();
            return (
              <button
                key={tag}
                onClick={() => setSearchQuery(isSelected ? '' : tag)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-violet-600 to-pink-500 text-white font-bold border border-transparent'
                    : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {tag}
              </button>
            );
          })}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 transition-all cursor-pointer border border-pink-500/20"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>

      {/* DIRECTORY CONTROL BAR */}
      <div id="directory-control-bar" className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 pb-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-zinc-400">
            {filteredSalons.length} {filteredSalons.length === 1 ? 'Atelier' : 'Ateliers'} found in Hyderabad
          </span>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Mobile View Toggle */}
          <div className="flex md:hidden bg-zinc-900 border border-white/5 rounded-xl p-1 w-full">
            <button
              onClick={() => setMobileView('list')}
              className={`flex-1 py-1.5 px-4 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                mobileView === 'list'
                  ? 'bg-white text-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setMobileView('map')}
              className={`flex-1 py-1.5 px-4 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                mobileView === 'map'
                  ? 'bg-white text-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Map View
            </button>
          </div>

          {/* Desktop Toggle Map */}
          <button
            onClick={() => setShowMap(!showMap)}
            className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-all active:scale-95 cursor-pointer"
          >
            <MapPin className={`w-4 h-4 text-pink-500 ${showMap ? 'animate-bounce' : ''}`} />
            <span>{showMap ? 'Hide Map Sidebar' : 'Show Map Sidebar'}</span>
          </button>
        </div>
      </div>

      {/* SALONS DISPLAY LAYOUT */}
      {filteredSalons.length === 0 ? (
        <div id="no-salons-fallback" className="glass-card p-12 text-center border-dashed border-white/10">
          <ShieldAlert className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
          <h3 className="font-bold text-lg text-white mb-2">No matching salons found</h3>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            Try adjusting your locality filters or keyword criteria to discover high-end salons in other areas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LIST COLUMN */}
          <div className={`space-y-8 lg:col-span-7 xl:col-span-8 ${
            mobileView === 'map' ? 'hidden md:block' : 'block'
          }`}>
            <div className={`grid grid-cols-1 md:grid-cols-2 ${showMap ? 'lg:grid-cols-1 xl:grid-cols-2' : 'lg:grid-cols-3'} gap-8`}>
              {filteredSalons.map((salon) => {
                const isSelected = selectedSalonId === salon.id;
                const isHovered = hoveredSalonId === salon.id;

                return (
                  <div
                    key={salon.id}
                    onMouseEnter={() => setHoveredSalonId(salon.id)}
                    onMouseLeave={() => setHoveredSalonId(null)}
                    className={`glass-card overflow-hidden group hover:border-violet-500/50 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full bg-zinc-950/20 ${
                      isSelected ? 'border-violet-500/80 shadow-[0_0_20px_rgba(139,92,246,0.15)] bg-violet-950/5' : ''
                    } ${isHovered ? 'border-pink-500/30' : ''}`}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={salon.image}
                        alt={salon.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {salon.isLuxury ? (
                          <span className="text-[9px] font-mono font-bold uppercase bg-violet-600 text-white px-2.5 py-1 rounded-full">
                            ★ LUXURY ATELIER
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono font-bold uppercase bg-cyan-600 text-white px-2.5 py-1 rounded-full">
                            ★ HIGH-TECH
                          </span>
                        )}
                        {salon.isTrending && (
                          <span className="text-[9px] font-mono font-bold uppercase bg-pink-500 text-white px-2.5 py-1 rounded-full">
                            🔥 IN HIGH DEMAND
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md border border-white/10 text-white font-mono flex items-center">
                          <MapPin className="w-3 h-3 text-pink-500 mr-1" /> {salon.locality}
                        </span>
                        <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-zinc-950/80 backdrop-blur-md text-yellow-400 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-yellow-400" />
                          <span>{salon.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-4 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-pink-400 transition-colors">
                          {salon.name}
                        </h3>
                        <p className="text-xs text-zinc-400 mt-1 italic font-light leading-relaxed">
                          "{salon.tagline}"
                        </p>

                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {salon.features.map((feat, i) => (
                            <span key={i} className="text-[9px] font-mono bg-white/5 border border-white/5 text-zinc-400 px-2.5 py-0.5 rounded-lg">
                              {feat}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase text-zinc-500 font-mono block">AVERAGE BILL</span>
                          <span className="text-sm font-bold text-white font-mono">₹{salon.averagePrice}+</span>
                        </div>
                        <div className="flex items-center">
                          <button
                            onClick={() => {
                              setSelectedSalonId(salon.id);
                              if (window.innerWidth < 768) {
                                setMobileView('map');
                              }
                            }}
                            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-zinc-300 hover:text-white transition-all cursor-pointer mr-2 active:scale-95"
                            title="Show on map"
                          >
                            <MapPin className="w-4 h-4 text-pink-500" />
                          </button>
                          <button
                            onClick={() => setViewingSalon(salon)}
                            className="px-4 py-2 bg-white text-black rounded-xl text-xs font-bold hover:bg-zinc-200 transition-all flex items-center space-x-1 shadow-lg shadow-white/5 cursor-pointer active:scale-95"
                          >
                            <span>View Menu</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MAP COLUMN */}
          <div className={`lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 h-[500px] lg:h-[calc(100vh-140px)] min-h-[450px] w-full ${
            showMap ? 'block' : 'lg:hidden'
          } ${
            mobileView === 'list' ? 'hidden md:block' : 'block'
          }`}>
            <SalonsMap
              salons={filteredSalons}
              selectedSalonId={selectedSalonId}
              onSelectSalon={(salon) => {
                setSelectedSalonId(salon.id);
              }}
              hoveredSalonId={hoveredSalonId}
              onHoverSalon={setHoveredSalonId}
            />
          </div>

        </div>
      )}


      {/* SALON VIEWING DIALOG & BOOKING STEPPER */}
      {viewingSalon && (
        <div className="fixed inset-0 bg-zinc-950/90 backdrop-blur-xl z-50 flex justify-end transition-all duration-300">
          
          {/* Backdrop Closer */}
          <div className="absolute inset-0 -z-10" onClick={() => { setViewingSalon(null); resetBookingFlow(); }} />

          {/* Sliding Content Container */}
          <div className="w-full max-w-2xl bg-zinc-950 border-l border-white/10 h-full overflow-y-auto flex flex-col justify-between shadow-2xl relative">
            
            {/* Header image details */}
            <div>
              <div className="relative aspect-[21/9]">
                <img src={viewingSalon.image} alt={viewingSalon.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
                
                <button
                  onClick={() => { setViewingSalon(null); resetBookingFlow(); }}
                  className="absolute top-4 right-4 p-2 bg-zinc-950/60 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-950 transition-colors border border-white/10"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-4 left-6">
                  <span className="text-[10px] uppercase font-mono bg-violet-600 text-white px-2.5 py-1 rounded-full mb-2 inline-block">
                    {viewingSalon.isLuxury ? 'VVIP Luxury Suite' : 'Advanced Lab'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{viewingSalon.name}</h2>
                  <p className="text-xs text-zinc-300 font-mono mt-1 flex items-center">
                    <MapPin className="w-3.5 h-3.5 text-pink-500 mr-1" />
                    {viewingSalon.address}
                  </p>
                </div>
              </div>

              {/* Booking completed success screen */}
              {bookingCompleted ? (
                <div className="p-8 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-extrabold text-white">Appointment Confirmed!</h3>
                    <p className="text-xs text-zinc-400 mt-2">
                      Your premium slot has been secured via GlowSphere Secure Booking. An SMS verification code has been dispatched.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-left max-w-sm mx-auto space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Booking ID:</span>
                      <span className="text-white font-mono font-bold">{bookingCompleted.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Service:</span>
                      <span className="text-white">{bookingCompleted.serviceName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Scheduled:</span>
                      <span className="text-pink-400 font-bold">{bookingCompleted.date} @ {bookingCompleted.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Stylist:</span>
                      <span className="text-white">{bookingCompleted.professionalName}</span>
                    </div>
                    <div className="flex justify-between border-t border-white/5 pt-2 mt-2">
                      <span className="text-zinc-400 font-bold">Paid Amount:</span>
                      <span className="text-emerald-400 font-mono font-bold">₹{bookingCompleted.price}</span>
                    </div>
                  </div>

                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => {
                        setViewingSalon(null);
                        resetBookingFlow();
                      }}
                      className="px-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase transition-all"
                    >
                      Back to Directory
                    </button>
                    <button
                      onClick={() => {
                        setViewingSalon(null);
                        resetBookingFlow();
                        // Redirect to Hub tab
                        const hubButton = document.querySelector('[id="main-navbar"]');
                        if (hubButton) {
                          const target = Array.from(hubButton.querySelectorAll('button')).find(b => b.textContent?.includes('My Hub'));
                          if (target) (target as HTMLButtonElement).click();
                        }
                      }}
                      className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl text-xs font-bold uppercase transition-all text-white shadow-lg"
                    >
                      View Live Tracking
                    </button>
                  </div>
                </div>
              ) : bookingService ? (
                
                /* STEP 2: STYLIST, TIMING & COUPONS CONFIG */
                <div className="p-6 space-y-6">
                  
                  {/* Selected service summary supporting multiple selections */}
                  <div className="p-4 rounded-2xl bg-zinc-950/60 border border-white/10 space-y-3 shadow-inner">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">
                        Selected Treatments ({selectedServices.length || 1})
                      </span>
                      <span className="text-[9px] font-mono bg-pink-500/10 text-pink-400 px-2 py-0.5 rounded-full border border-pink-500/20 uppercase font-extrabold tracking-widest">
                        Cancellation Shield Active
                      </span>
                    </div>

                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      {(selectedServices.length > 0 ? selectedServices : [bookingService]).map((svc) => (
                        <div key={svc.id} className="flex justify-between items-center text-xs py-1">
                          <div className="min-w-0 flex-1 pr-4">
                            <p className="font-bold text-white truncate">{svc.name}</p>
                            <span className="text-[10px] text-zinc-500 flex items-center font-mono">
                              <Clock className="w-3.5 h-3.5 text-zinc-500 mr-1" />
                              Estimated Duration: {svc.duration} mins
                            </span>
                          </div>
                          <div className="text-right font-mono">
                            <span className="text-zinc-300 font-bold">₹{svc.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-white/5 pt-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                        <Clock className="w-4 h-4 text-violet-400" />
                        <span>Total Estimated Time:</span>
                        <strong className="text-white text-sm font-bold">
                          {selectedServices.length > 0
                            ? selectedServices.reduce((sum, s) => sum + s.duration, 0)
                            : bookingService.duration}{' '}
                          mins
                        </strong>
                      </div>
                      
                      <div className="text-right font-mono">
                        <div className="text-[10px] text-zinc-500">
                          Subtotal Price:{' '}
                          <span className="line-through">
                            ₹{selectedServices.length > 0
                              ? selectedServices.reduce((sum, s) => sum + s.price, 0)
                              : bookingService.price}
                          </span>
                        </div>
                        <div className="text-sm font-black text-pink-400">
                          Total Payable:{' '}
                          <span className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
                            ₹{calculateFinalPrice(
                              selectedServices.length > 0
                                ? selectedServices.reduce((sum, s) => sum + s.price, 0)
                                : bookingService.price
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 1. Choose Professional */}
                  <div>
                    <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-3">1. Select Master Stylist / Professional</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Default "Any Available" */}
                      <div
                        onClick={() => setBookingProfessional(null)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center space-x-3 ${
                          bookingProfessional === null
                            ? 'border-violet-500 bg-violet-600/10'
                            : 'border-white/5 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Any Premium Stylist</p>
                          <p className="text-[10px] text-zinc-500">Allocated automatically</p>
                        </div>
                      </div>

                      {/* Real options */}
                      {currentSalonPros.map((pro) => (
                        <div
                          key={pro.id}
                          onClick={() => setBookingProfessional(pro)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center space-x-3 ${
                            bookingProfessional?.id === pro.id
                              ? 'border-violet-500 bg-violet-600/10'
                              : 'border-white/5 bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <img src={pro.avatar} alt={pro.name} className="w-10 h-10 rounded-full object-cover" />
                          <div>
                            <p className="text-xs font-bold text-white flex items-center">
                              {pro.name}
                              <span className="ml-1 text-[10px] text-yellow-400 font-bold flex items-center">
                                <Star className="w-3 h-3 fill-yellow-400 mr-0.5" />
                                {pro.rating}
                              </span>
                            </p>
                            <p className="text-[10px] text-zinc-400">{pro.specialization}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. Pick Date & Time (Interactive Visual Calendar) */}
                  <div className="space-y-4">
                    <div className="border-t border-white/5 pt-4">
                      <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2">2. Select Appointment Date &amp; Preferred Slot</h5>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                      
                      {/* Left side: Interactive Monthly Calendar */}
                      <div className="md:col-span-7 bg-zinc-950/60 border border-white/10 rounded-2xl p-4 shadow-xl">
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                          <span className="text-xs font-mono font-black uppercase tracking-widest text-zinc-200 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-violet-400" />
                            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][calendarMonth]} {calendarYear}
                          </span>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                if (calendarMonth === 0) {
                                  setCalendarMonth(11);
                                  setCalendarYear(prev => prev - 1);
                                } else {
                                  setCalendarMonth(prev => prev - 1);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
                              title="Previous Month"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (calendarMonth === 11) {
                                  setCalendarMonth(0);
                                  setCalendarYear(prev => prev + 1);
                                } else {
                                  setCalendarMonth(prev => prev + 1);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
                              title="Next Month"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Weekday Labels */}
                        <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((dayName) => (
                            <div key={dayName} className="text-[10px] font-mono font-bold uppercase text-zinc-500 py-0.5">
                              {dayName}
                            </div>
                          ))}
                        </div>

                        {/* Calendar Days Grid */}
                        <div className="grid grid-cols-7 gap-1">
                          {/* Blank days padding for the start of the month */}
                          {Array.from({ length: new Date(calendarYear, calendarMonth, 1).getDay() }).map((_, idx) => (
                            <div key={`blank-${idx}`} className="w-full aspect-square" />
                          ))}

                          {/* Real days */}
                          {Array.from({ length: new Date(calendarYear, calendarMonth + 1, 0).getDate() }).map((_, idx) => {
                            const dayNum = idx + 1;
                            const dStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                            const isSelected = bookingDate === dStr;
                            
                            // Let's check past boundaries (today is June 25, 2026)
                            const todayDate = new Date(2026, 5, 25);
                            const thisDate = new Date(calendarYear, calendarMonth, dayNum);
                            const isPast = thisDate < todayDate;
                            const isToday = calendarYear === 2026 && calendarMonth === 5 && dayNum === 25;

                            // Get day status
                            const dayStatus = viewingSalon ? getDayStatus(viewingSalon.id, dStr, bookingProfessional?.id || null) : 'available';

                            return (
                              <button
                                key={`day-${dayNum}`}
                                type="button"
                                disabled={isPast}
                                onClick={() => setBookingDate(dStr)}
                                className={`w-full aspect-square flex flex-col items-center justify-center rounded-xl transition-all relative cursor-pointer group ${
                                  isPast
                                    ? 'bg-transparent text-zinc-700 text-xs pointer-events-none line-through'
                                    : isSelected
                                      ? 'bg-gradient-to-br from-violet-600 to-pink-500 text-white font-black text-xs ring-2 ring-violet-500/50 shadow-md scale-105 z-10'
                                      : isToday
                                        ? 'bg-zinc-900 border border-violet-500/50 text-violet-400 hover:text-violet-300 font-bold text-xs'
                                        : 'bg-zinc-900/60 hover:bg-zinc-800 border border-white/5 text-zinc-300 hover:text-white text-xs'
                                }`}
                              >
                                <span className={isSelected ? 'mb-0.5' : ''}>{dayNum}</span>
                                
                                {/* Tiny Status Dot */}
                                {!isPast && (
                                  <span className={`w-1 h-1 rounded-full absolute bottom-1.5 transition-all ${
                                    isSelected
                                      ? 'bg-white'
                                      : dayStatus === 'blocked'
                                        ? 'bg-rose-500 group-hover:scale-125'
                                        : dayStatus === 'busy'
                                          ? 'bg-amber-500 group-hover:scale-125'
                                          : 'bg-emerald-500 group-hover:scale-125'
                                  }`} />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Calendar Legend */}
                        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-4 pt-3 border-t border-white/5 text-[9px] text-zinc-500 font-mono">
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Available</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span>Busy</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            <span>Fully Booked</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                            <span>Selected</span>
                          </div>
                        </div>
                      </div>

                      {/* Right side: Available Slots Grid */}
                      <div className="md:col-span-5 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between pb-1">
                            <h6 className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                              Available Hour Slots
                            </h6>
                            <span className="text-[10px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/5 font-bold">
                              {new Date(bookingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
                            {["10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM", "7:00 PM"].map((slot) => {
                              const status = viewingSalon ? getSlotStatus(viewingSalon.id, bookingDate, slot, bookingProfessional?.id || null) : 'available';
                              const isBlocked = status === 'blocked';
                              const isSelected = bookingTime === slot;

                              return (
                                <button
                                  key={slot}
                                  type="button"
                                  disabled={isBlocked}
                                  onClick={() => setBookingTime(slot)}
                                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer group ${
                                    isBlocked
                                      ? 'border-white/5 bg-zinc-950/20 text-zinc-600 cursor-not-allowed opacity-45'
                                      : isSelected
                                        ? 'border-violet-500 bg-gradient-to-r from-violet-600/20 to-pink-500/10 text-white font-bold shadow-[0_0_12px_rgba(139,92,246,0.12)]'
                                        : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 text-zinc-300 hover:text-white'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <Clock className={`w-3.5 h-3.5 ${isBlocked ? 'text-zinc-700' : isSelected ? 'text-violet-400' : 'text-zinc-500 group-hover:text-zinc-400'}`} />
                                    <span className="text-xs font-mono font-bold">{slot}</span>
                                  </div>
                                  
                                  {isBlocked ? (
                                    <span className="text-[9px] uppercase font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/15">
                                      Fully Booked
                                    </span>
                                  ) : isSelected ? (
                                    <span className="text-[9px] uppercase font-bold text-violet-400 bg-violet-500/15 px-2 py-0.5 rounded border border-violet-500/25 flex items-center gap-1 shadow-inner">
                                      <span className="w-1 h-1 rounded-full bg-violet-400 animate-ping" />
                                      Selected
                                    </span>
                                  ) : (
                                    <span className="text-[9px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/15 opacity-80 group-hover:opacity-100 transition-opacity">
                                      Available
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Interactive dynamic note */}
                        {bookingTime && (
                          <div className="p-3 rounded-xl bg-zinc-950/60 border border-white/5 text-[11px] leading-relaxed text-zinc-400 mt-3">
                            {bookingTime === '11:30 AM' || bookingTime === '4:00 PM' ? (
                              <p>
                                <span className="text-amber-400 font-bold">🔥 Busy Slot: </span>
                                This is one of the most requested hours on weekends. Securing it now prevents conflicts!
                              </p>
                            ) : (
                              <p>
                                <span className="text-violet-400 font-bold">✨ Great Choice: </span>
                                Your selected stylist is available and has ample preparation time before your treatment.
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* 3. Delivery Type & Customer Info */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">4. Service Mode &amp; Info</h5>
                    
                    <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/5">
                      <input
                        type="checkbox"
                        id="homeserv-check"
                        checked={isHomeService}
                        onChange={(e) => setIsHomeService(e.target.checked)}
                        className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 accent-violet-600 cursor-pointer"
                      />
                      <label htmlFor="homeserv-check" className="text-xs text-zinc-300 cursor-pointer">
                        Request Home Salon Service (Specialist drives to your coordinates in Hyderabad)
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] uppercase text-zinc-500 block font-mono mb-1">Full Name</label>
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full bg-zinc-900 border border-white/5 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase text-zinc-500 block font-mono mb-1">Email Address</label>
                        <input
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="w-full bg-zinc-900 border border-white/5 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Coupons & Promo */}
                  <div>
                    <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2">5. Applied Offers / Coupons</h5>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code (try GLOWAI20)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={couponApplied}
                        className="flex-1 bg-zinc-900 border border-white/5 rounded-xl p-2 text-xs text-white uppercase tracking-wider font-mono focus:outline-none"
                      />
                      <button
                        onClick={applyCoupon}
                        disabled={couponApplied}
                        className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                      >
                        {couponApplied ? 'Applied' : 'Apply'}
                      </button>
                    </div>
                    {couponApplied && (
                      <p className="text-[11px] text-emerald-400 font-mono mt-1">✓ GLOWAI20 active: 20% flat discount applied successfully!</p>
                    )}
                  </div>

                  {/* Stripe Payment Simulator Banner */}
                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/10 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xs font-bold">S</div>
                    <div>
                      <p className="text-xs font-bold text-white">Stripe Instant Payment Active</p>
                      <p className="text-[10px] text-zinc-500">Amounts are automatically synchronized. Cancellation shield guarantees refund.</p>
                    </div>
                  </div>

                </div>
               ) : (
                 /* STEP 1: SERVICE SELECTION MENU */
                 <div className="p-6 space-y-6">
                   <div>
                     <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 mb-4">Treatment &amp; Aesthetic Menu</h4>
                     
                     <div className="space-y-3">
                       {viewingSalon.services.map((svc) => {
                         const isSelected = selectedServices.some(s => s.id === svc.id);
                         return (
                           <div
                             key={svc.id}
                             className={`p-4 rounded-xl border transition-all duration-300 flex gap-4 items-start ${
                               isSelected
                                 ? 'bg-violet-950/20 border-violet-500/40 shadow-md shadow-violet-950/20'
                                 : 'bg-white/5 border-white/5 hover:border-white/15 hover:bg-white/10'
                             }`}
                           >
                             {/* Category Thumbnail Image */}
                             <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-white/5 relative">
                               <img
                                 src={CATEGORY_IMAGES[svc.category] || CATEGORY_IMAGES.hair}
                                 alt={svc.category}
                                 className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                 referrerPolicy="no-referrer"
                               />
                               <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 to-transparent" />
                               <span className="absolute bottom-1 right-1 text-[8px] font-mono font-bold bg-zinc-950/80 text-zinc-300 px-1 py-0.2 rounded uppercase">
                                 {svc.category}
                               </span>
                             </div>

                             <div className="flex-1 space-y-1.5 min-w-0">
                               <div className="flex items-center space-x-2 flex-wrap">
                                 <h5 className="font-bold text-sm text-white truncate">{svc.name}</h5>
                                 {svc.popular && (
                                   <span className="text-[8px] font-mono font-bold bg-pink-500/20 text-pink-400 px-1.5 py-0.5 rounded border border-pink-500/20 uppercase tracking-widest">
                                     POPULAR
                                   </span>
                                 )}
                               </div>
                               <p className="text-xs text-zinc-400 leading-relaxed font-light">
                                 {svc.description}
                               </p>
                               <span className="text-[10px] font-mono text-zinc-400 flex items-center bg-zinc-900/40 px-2 py-0.5 rounded-md w-fit border border-white/5">
                                 <Clock className="w-3.5 h-3.5 text-pink-400 mr-1.5 shrink-0" />
                                 <span>Est. Duration: </span>
                                 <strong className="text-white ml-1">{svc.duration} mins</strong>
                               </span>
                             </div>

                             <div className="text-right flex flex-col items-end space-y-3 shrink-0">
                               <span className="font-mono text-base font-extrabold text-white">₹{svc.price}</span>
                               <button
                                 onClick={() => {
                                   if (isSelected) {
                                     setSelectedServices(prev => prev.filter(s => s.id !== svc.id));
                                   } else {
                                     setSelectedServices(prev => [...prev, svc]);
                                   }
                                 }}
                                 className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer ${
                                   isSelected
                                     ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/10 hover:opacity-90'
                                     : 'bg-white/10 hover:bg-white/20 text-zinc-300 border border-white/10'
                                 }`}
                               >
                                 {isSelected ? (
                                   <span className="flex items-center gap-1">
                                     <Check className="w-3.5 h-3.5" /> Added
                                   </span>
                                 ) : (
                                   '+ Add'
                                 )}
                               </button>
                             </div>
                           </div>
                         );
                       })}
                     </div>

                     {/* Dynamic Multi-Service Summary Panel */}
                     {selectedServices.length > 0 && (
                       <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-violet-950/40 via-zinc-900 to-pink-950/40 border border-violet-500/20 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2">
                         <div className="flex items-center gap-4">
                           <div className="p-2.5 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400">
                             <Sparkles className="w-5 h-5 text-violet-400 animate-pulse" />
                           </div>
                           <div>
                             <p className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                               {selectedServices.length} {selectedServices.length === 1 ? 'Service' : 'Services'} Selected
                             </p>
                             <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-[11px] text-zinc-400">
                               <span className="flex items-center">
                                 <Clock className="w-3.5 h-3.5 text-pink-400 mr-1.5 shrink-0" />
                                 <span>Total Time: </span>
                                 <strong className="text-white ml-1 font-mono">{selectedServices.reduce((sum, s) => sum + s.duration, 0)} mins</strong>
                               </span>
                               <span>•</span>
                               <span>
                                 Subtotal:{' '}
                                 <strong className="text-white font-mono">₹{selectedServices.reduce((sum, s) => sum + s.price, 0)}</strong>
                               </span>
                             </div>
                           </div>
                         </div>

                         <button
                           onClick={() => setBookingService(selectedServices[0])}
                           className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-violet-600 to-pink-500 text-white rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all duration-300 hover:scale-102 hover:shadow-[0_4px_15px_rgba(139,92,246,0.3)] active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                         >
                           <span>Proceed to Booking</span>
                           <ArrowRight className="w-3.5 h-3.5" />
                         </button>
                       </div>
                     )}
                   </div>

                  {/* Reviews & Ratings Section */}
                  <div className="border-t border-white/10 pt-6 mt-8 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/5">
                      <div>
                        <h4 className="text-sm font-bold text-white tracking-wide">Client Reviews &amp; Ratings</h4>
                        <p className="text-xs text-zinc-500 font-mono">Real-time feedback from verified guests</p>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-zinc-950/60 px-3 py-1.5 rounded-xl border border-white/5 w-fit">
                        <div className="flex items-center text-yellow-400">
                          <Star className="w-4 h-4 fill-yellow-400 mr-1" />
                          <span className="text-sm font-black font-mono">{viewingSalon.rating}</span>
                        </div>
                        <span className="text-zinc-600 font-mono text-xs">|</span>
                        <span className="text-xs text-zinc-400 font-mono font-bold uppercase">
                          {activeReviews.length || viewingSalon.reviewsCount} Reviews
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      
                      {/* Left: Reviews List */}
                      <div className="md:col-span-7 space-y-4">
                        <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
                          Latest Feedback ({activeReviews.length})
                        </h5>

                        {loadingReviews ? (
                          <div className="py-8 text-center text-zinc-500 text-xs font-mono">
                            <span className="inline-block animate-pulse">Retrieving salon reviews...</span>
                          </div>
                        ) : activeReviews.length === 0 ? (
                          <div className="py-8 text-center rounded-xl bg-white/5 border border-white/5 border-dashed">
                            <p className="text-xs text-zinc-500 font-mono">No reviews yet. Be the first to share your experience!</p>
                          </div>
                        ) : (
                          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
                            {activeReviews.map((rev) => (
                              <div key={rev.id} className="p-4 rounded-xl bg-zinc-950/40 border border-white/5 hover:border-white/10 transition-all duration-200 space-y-2">
                                <div className="flex justify-between items-start gap-2">
                                  <div className="min-w-0">
                                    <span className="text-xs font-bold text-zinc-200 block truncate">{rev.customerName}</span>
                                    <span className="text-[10px] text-zinc-500 font-mono">{rev.date}</span>
                                  </div>
                                  <div className="flex items-center gap-1 bg-yellow-400/5 px-2 py-0.5 rounded-md border border-yellow-400/10 text-yellow-400 shrink-0">
                                    <Star className="w-3 h-3 fill-yellow-400" />
                                    <span className="text-[11px] font-bold font-mono">{rev.rating.toFixed(1)}</span>
                                  </div>
                                </div>
                                
                                <p className="text-xs text-zinc-400 leading-relaxed font-light italic">
                                  "{rev.text}"
                                </p>
                                
                                {rev.serviceName && (
                                  <div className="pt-1.5 flex items-center">
                                    <span className="text-[9px] font-mono bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded border border-violet-500/10 uppercase font-extrabold tracking-wider">
                                      {rev.serviceName}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right: Submit Review Form */}
                      <div className="md:col-span-5 bg-white/5 border border-white/5 rounded-2xl p-4 sm:p-5 h-fit space-y-4">
                        <div>
                          <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-white">Share Your Experience</h5>
                          <p className="text-[10px] text-zinc-500 mt-0.5">Your honest rating helps the community grow.</p>
                        </div>

                        {reviewSuccessMessage ? (
                          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono space-y-1 animate-in fade-in zoom-in-95 duration-200">
                            <p className="font-bold flex items-center gap-1.5 text-emerald-400">
                              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> Review Submitted
                            </p>
                            <p className="text-[11px] text-zinc-400">{reviewSuccessMessage}</p>
                          </div>
                        ) : (
                          <form onSubmit={handleSubmitReview} className="space-y-3.5">
                            {/* Rating Selector */}
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-mono uppercase font-bold tracking-wider text-zinc-400 block">Your Rating</label>
                              <div className="flex items-center gap-1.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setNewReviewRating(star)}
                                    className="p-1 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                                    title={`${star} Star${star > 1 ? 's' : ''}`}
                                  >
                                    <Star 
                                      className={`w-5.5 h-5.5 transition-all duration-150 ${
                                        star <= newReviewRating 
                                          ? 'fill-yellow-400 text-yellow-400 filter drop-shadow-[0_0_4px_rgba(234,179,8,0.3)]' 
                                          : 'text-zinc-600 hover:text-zinc-400'
                                      }`} 
                                    />
                                  </button>
                                ))}
                                <span className="text-xs font-mono text-zinc-400 font-bold ml-1.5">
                                  ({newReviewRating}.0 / 5.0)
                                </span>
                              </div>
                            </div>

                            {/* Service dropdown */}
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-mono uppercase font-bold tracking-wider text-zinc-400 block">Service Received</label>
                              <select
                                value={newReviewService}
                                onChange={(e) => setNewReviewService(e.target.value)}
                                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 font-medium transition-all"
                              >
                                <option value="">General / Other Service</option>
                                {viewingSalon.services.map((svc) => (
                                  <option key={svc.id} value={svc.name}>
                                    {svc.name} (₹{svc.price})
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Name input */}
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-mono uppercase font-bold tracking-wider text-zinc-400 block">Your Name</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Rachel Green"
                                value={newReviewName}
                                onChange={(e) => setNewReviewName(e.target.value)}
                                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-medium"
                              />
                            </div>

                            {/* Review Text */}
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-mono uppercase font-bold tracking-wider text-zinc-400 block">Review Feedback</label>
                              <textarea
                                required
                                rows={3}
                                placeholder="Tell us about the expertise, professional care, clean spaces, and final look..."
                                value={newReviewText}
                                onChange={(e) => setNewReviewText(e.target.value)}
                                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-light leading-relaxed resize-none"
                              />
                            </div>

                            {/* Submit button */}
                            <button
                              type="submit"
                              disabled={isSubmittingReview}
                              className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-pink-500 hover:opacity-95 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <span>{isSubmittingReview ? 'Posting Feedback...' : 'Submit Review'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </form>
                        )}
                      </div>

                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Stepper Footer Action */}
            {!bookingCompleted && bookingService && (
              <div className="p-4 bg-zinc-950 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => setBookingService(null)}
                  className="px-4 py-2 text-zinc-400 hover:text-white text-xs font-mono font-bold"
                >
                  ← BACK TO MENU
                </button>
                <button
                  onClick={handleBookNow}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-violet-600 via-pink-600 to-cyan-500 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-violet-500/20 active:scale-95 hover:opacity-90 disabled:opacity-50 flex items-center space-x-1.5 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Allocating Seat...</span>
                  ) : (
                    <>
                      <span>Secure Booking</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
