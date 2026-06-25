import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { Salon } from '../types';
import { MapPin, Star, Sparkles, Navigation, X, Info, ShieldCheck, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

// Default User coordinates: Jubilee Hills Metro Station, Hyderabad
const USER_LAT = 17.4344;
const USER_LNG = 78.4022;

interface SalonsMapProps {
  salons: Salon[];
  selectedSalonId: string | null;
  onSelectSalon: (salon: Salon) => void;
  hoveredSalonId: string | null;
  onHoverSalon: (salonId: string | null) => void;
}

// Distance helper using Haversine formula
function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number): string {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d.toFixed(1);
}

// Internal controller to handle camera panning smoothly
function MapCameraHandler({ targetCoordinates }: { targetCoordinates: google.maps.LatLngLiteral | null }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !targetCoordinates) return;
    map.panTo(targetCoordinates);
    map.setZoom(14);
  }, [map, targetCoordinates]);

  return null;
}

export default function SalonsMap({
  salons,
  selectedSalonId,
  onSelectSalon,
  hoveredSalonId,
  onHoverSalon
}: SalonsMapProps) {
  const [activeSalon, setActiveSalon] = useState<Salon | null>(null);
  const [mapFilter, setMapFilter] = useState<'all' | 'luxury' | 'budget' | 'top-rated'>('all');

  // Sync activeSalon state with prop changes
  useEffect(() => {
    if (selectedSalonId) {
      const salon = salons.find((s) => s.id === selectedSalonId);
      if (salon) {
        setActiveSalon(salon);
      }
    } else if (hoveredSalonId) {
      const salon = salons.find((s) => s.id === hoveredSalonId);
      if (salon) {
        setActiveSalon(salon);
      }
    }
  }, [selectedSalonId, hoveredSalonId, salons]);

  // Handle Marker click
  const handleMarkerClick = (salon: Salon) => {
    onSelectSalon(salon);
    setActiveSalon(salon);
  };

  // Filter salons according to map filter overlay selection
  const filteredSalonsForMap = salons.filter((salon) => {
    if (mapFilter === 'all') return true;
    if (mapFilter === 'luxury') return salon.isLuxury;
    if (mapFilter === 'budget') return salon.averagePrice <= 1500;
    if (mapFilter === 'top-rated') return salon.rating >= 4.8;
    return true;
  });

  if (!hasValidKey) {
    return (
      <div id="maps-setup-placeholder" className="relative w-full h-full min-h-[450px] rounded-2xl border border-white/10 bg-zinc-950/60 backdrop-blur-md overflow-hidden flex flex-col items-center justify-center p-6 text-center">
        {/* Abstract design elements to simulate a premium styled map */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none animate-pulse" />

        <div className="relative max-w-md space-y-5 z-10">
          <div className="w-12 h-12 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto text-violet-400">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Interactive Atelier Map</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Google Maps API Key is required to render interactive high-fidelity 3D map coordinates, live routes, and geolocated distance tags.
            </p>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-left space-y-3">
            <div className="flex items-start gap-2.5">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] font-mono flex items-center justify-center font-bold text-violet-400">1</span>
              <p className="text-[11px] text-zinc-300">
                Get an API Key from the <a href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">Google Cloud Console</a>.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] font-mono flex items-center justify-center font-bold text-violet-400">2</span>
              <p className="text-[11px] text-zinc-300">
                Open <strong>Settings</strong> (⚙️ gear icon, top-right) &rarr; <strong>Secrets</strong>.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] font-mono flex items-center justify-center font-bold text-violet-400">3</span>
              <p className="text-[11px] text-zinc-300">
                Add <code>GOOGLE_MAPS_PLATFORM_KEY</code> as the name and paste your key.
              </p>
            </div>
          </div>

          <div className="text-[10px] text-zinc-500 font-mono">
            App will automatically reload maps module upon key injection.
          </div>
        </div>
      </div>
    );
  }

  // Camera focus coordinates (defaults to user or first active salon)
  const cameraTarget = activeSalon
    ? { lat: activeSalon.latitude, lng: activeSalon.longitude }
    : { lat: USER_LAT, lng: USER_LNG };

  return (
    <div id="google-maps-wrapper" className="relative w-full h-full min-h-[450px] rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-zinc-950">
      {/* Floating Filter Panel Overlay */}
      <div id="map-filter-overlay" className="absolute top-4 left-4 z-20 flex flex-wrap gap-1 bg-zinc-950/90 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
        <button
          onClick={() => setMapFilter('all')}
          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
            mapFilter === 'all'
              ? 'bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setMapFilter('luxury')}
          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold font-mono transition-all flex items-center gap-1 cursor-pointer ${
            mapFilter === 'luxury'
              ? 'bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          Luxury
        </button>
        <button
          onClick={() => setMapFilter('budget')}
          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold font-mono transition-all flex items-center gap-1 cursor-pointer ${
            mapFilter === 'budget'
              ? 'bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="text-emerald-400 font-bold">₹</span>
          Budget
        </button>
        <button
          onClick={() => setMapFilter('top-rated')}
          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold font-mono transition-all flex items-center gap-1 cursor-pointer ${
            mapFilter === 'top-rated'
              ? 'bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          Top Rated
        </button>
      </div>

      <APIProvider apiKey={API_KEY} version="weekly">
        <Map
          defaultCenter={{ lat: USER_LAT, lng: USER_LNG }}
          defaultZoom={13}
          mapId="bf51a910020fa25a" // Custom elegant map ID
          disableDefaultUI
          gestureHandling="greedy"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
        >
          {/* User Location Marker */}
          <AdvancedMarker position={{ lat: USER_LAT, lng: USER_LNG }} title="Your Location">
            <div className="relative flex items-center justify-center">
              <span className="absolute w-8 h-8 rounded-full bg-cyan-400/20 animate-ping" />
              <div className="w-4 h-4 rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_10px_rgba(6,182,212,0.8)] z-10" />
            </div>
          </AdvancedMarker>

          {/* Salon Location Markers */}
          {filteredSalonsForMap.map((salon) => {
            const isSelected = selectedSalonId === salon.id;
            const isHovered = hoveredSalonId === salon.id;
            const isHighlighted = isSelected || isHovered;

            return (
              <AdvancedMarker
                key={salon.id}
                position={{ lat: salon.latitude, lng: salon.longitude }}
                title={salon.name}
                onClick={() => handleMarkerClick(salon)}
              >
                <div
                  onMouseEnter={() => onHoverSalon(salon.id)}
                  onMouseLeave={() => onHoverSalon(null)}
                  className={`relative cursor-pointer p-2 transition-transform duration-300 ${
                    isHighlighted ? 'scale-125 z-30' : 'scale-100 z-10'
                  }`}
                >
                  {/* Glowing background ripple */}
                  <span
                    className={`absolute inset-0 rounded-full bg-violet-500/20 transition-all duration-300 ${
                      isHighlighted ? 'animate-ping opacity-100' : 'opacity-0'
                    }`}
                  />

                  {/* Pin Dot */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 shadow-xl ${
                      isHighlighted
                        ? 'bg-gradient-to-r from-violet-600 to-pink-500 border-white text-white shadow-[0_0_15px_rgba(236,72,153,0.5)]'
                        : 'bg-zinc-900 border-white/20 text-violet-400'
                    }`}
                  >
                    {salon.isLuxury ? (
                      <Sparkles className="w-4 h-4 text-amber-400" />
                    ) : (
                      <MapPin className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </AdvancedMarker>
            );
          })}

          {/* Smooth camera transition handler */}
          <MapCameraHandler targetCoordinates={cameraTarget} />
        </Map>
      </APIProvider>

      {/* COMPACT REAL-TIME PREVIEW CARD OVERLAY */}
      <AnimatePresence>
        {activeSalon && (
          <motion.div
            key={activeSalon.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="absolute bottom-4 left-4 right-4 z-40"
          >
            <div className="bg-zinc-950/95 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex gap-4 relative overflow-hidden">
              {/* Highlight background light */}
              <div className="absolute top-0 left-0 w-1/2 h-[1px] bg-gradient-to-r from-violet-500 via-pink-500 to-transparent" />
              
              <button
                onClick={() => setActiveSalon(null)}
                className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/5 border border-white/5 text-zinc-400 hover:text-white flex items-center justify-center transition-colors hover:bg-white/10"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
                <img
                  src={activeSalon.image}
                  alt={activeSalon.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between min-w-0 pr-4">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[8px] font-mono font-bold uppercase bg-violet-600/30 text-violet-400 px-1.5 py-0.5 rounded border border-violet-500/10">
                      {activeSalon.locality}
                    </span>
                    <span className="text-[8px] font-mono text-zinc-400 flex items-center gap-0.5 bg-white/5 px-1.5 py-0.5 rounded">
                      <Navigation className="w-2.5 h-2.5 text-cyan-400" />
                      {getDistanceInKm(USER_LAT, USER_LNG, activeSalon.latitude, activeSalon.longitude)} km away
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-white tracking-tight truncate mt-1">
                    {activeSalon.name}
                  </h4>
                  <p className="text-[10px] text-zinc-400 truncate font-light mt-0.5">
                    {activeSalon.tagline}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-white/5 gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-bold text-white font-mono">{activeSalon.rating}</span>
                    </div>
                    <span className="text-[10px] text-zinc-400">
                      Avg: <span className="text-white font-bold font-mono">₹{activeSalon.averagePrice}</span>
                    </span>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeSalon.address || activeSalon.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-500 hover:to-pink-400 text-white text-[10px] font-extrabold tracking-wide uppercase transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_2px_8px_rgba(139,92,246,0.3)]"
                  >
                    <Navigation className="w-3 h-3 text-white animate-pulse" />
                    <span>Get Directions</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
