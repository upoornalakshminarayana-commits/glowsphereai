import { useState } from 'react';
import { ShieldCheck, ShieldAlert, KeyRound, Star, MapPin, RefreshCw, Layers, Check, Activity, Sparkles, CheckCircle } from 'lucide-react';
import { Salon } from '../types';
import SystemHealthIndicator from './SystemHealthIndicator';

interface AdminPanelViewProps {
  salons: Salon[];
  onToggleLuxury: (id: string) => void;
}

export default function AdminPanelView({ salons, onToggleLuxury }: AdminPanelViewProps) {
  const [partners, setPartners] = useState([
    { name: 'L’Oréal Professionnel', country: 'France', status: 'Approved' },
    { name: 'Kérastase Paris', country: 'France', status: 'Approved' },
    { name: 'O.P.I', country: 'USA', status: 'Approved' },
    { name: 'Dyson Beauty', country: 'UK', status: 'Approved' }
  ]);

  const [fraudLogs, setFraudLogs] = useState([
    { id: 'frd-102', description: 'Repetitive debit refill requests', customer: 'unknown_bot@hack.in', status: 'Resolved (Blocked)', severity: 'High' },
    { id: 'frd-103', description: 'Simulated location mismatches inside Madhapur', customer: 'arun_re@gmail.com', status: 'Cleared (False Positive)', severity: 'Low' }
  ]);

  const [coupons, setCoupons] = useState([
    { code: 'GLOWAI20', discount: '20% off', usage: '482 times', active: true },
    { code: 'BRIDAL10', discount: 'Flat ₹1,000 off', usage: '124 times', active: true },
    { code: 'HYDCON50', discount: '50% off first trial', usage: '8 times', active: false }
  ]);

  const toggleCoupon = (code: string) => {
    setCoupons(prev => prev.map(c => c.code === code ? { ...c, active: !c.active } : c));
  };

  return (
    <div id="admin-panel" className="relative min-h-screen text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Title */}
      <div>
        <span className="text-xs font-mono uppercase text-cyan-400 block tracking-widest mb-1">GLOBAL CONTROL PANEL</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Platform Administration</h1>
        <p className="text-zinc-500 text-xs font-mono mt-1">Superuser Status: ACTIVE • Hyderabad Region Registry</p>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
          <div className="flex justify-between items-center text-zinc-500 text-[10px] uppercase font-mono font-bold">
            <span>Fraud Shield Status</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <h4 className="text-2xl font-bold text-white font-mono">100% SECURED</h4>
          <p className="text-[10px] text-zinc-400">Zero active breaches flagged over past 30 days.</p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
          <div className="flex justify-between items-center text-zinc-500 text-[10px] uppercase font-mono font-bold">
            <span>Global active listings</span>
            <Layers className="w-4 h-4 text-violet-400" />
          </div>
          <h4 className="text-2xl font-bold text-white font-mono">{salons.length} Ateliers</h4>
          <p className="text-[10px] text-zinc-400">All matched with live booking slot APIs.</p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
          <div className="flex justify-between items-center text-zinc-500 text-[10px] uppercase font-mono font-bold">
            <span>CMS Voucher Rules</span>
            <KeyRound className="w-4 h-4 text-pink-500" />
          </div>
          <h4 className="text-2xl font-bold text-white font-mono">{coupons.filter(c => c.active).length} Active Promos</h4>
          <p className="text-[10px] text-zinc-400">Synchronized with Stripe checkout controllers.</p>
        </div>

      </div>

      {/* SYSTEM TELEMETRY & HEALTH */}
      <SystemHealthIndicator />

      {/* ATELIERS REGISTRY TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Salon Listings Registry */}
        <div className="lg:col-span-8 glass-card p-6 border-white/5 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-white flex items-center">
              <Activity className="w-4.5 h-4.5 text-cyan-400 mr-2" /> Global Salon Registries
            </h3>
            <span className="text-[10px] text-zinc-500 font-mono">Interactive Category Approvals</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-zinc-500 font-mono text-[10px] uppercase">
                  <th className="py-3 px-2">Salon Atelier</th>
                  <th className="py-3 px-2">Locality</th>
                  <th className="py-3 px-2">Rating</th>
                  <th className="py-3 px-2">Category Status</th>
                  <th className="py-3 px-2">Action toggle</th>
                </tr>
              </thead>
              <tbody>
                {salons.map((salon) => (
                  <tr key={salon.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2 flex items-center space-x-3">
                      <img src={salon.image} alt={salon.name} className="w-8 h-8 rounded-lg object-cover" />
                      <div>
                        <p className="text-white font-bold">{salon.name}</p>
                        <p className="text-[10px] text-zinc-500 font-mono">API State: Synchronized</p>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-zinc-300 font-mono text-[11px]">{salon.locality}</td>
                    <td className="py-3 px-2 text-zinc-300 font-mono font-bold flex items-center pt-4">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 mr-1 shrink-0" />
                      <span>{salon.rating}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        salon.isLuxury 
                          ? 'bg-violet-600/15 text-violet-400 border border-violet-500/20'
                          : 'bg-cyan-600/10 text-cyan-400 border border-cyan-500/20'
                      }`}>
                        {salon.isLuxury ? 'VVIP Luxury' : 'High-Tech'}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => onToggleLuxury(salon.id)}
                        className="px-2.5 py-1 rounded bg-white/5 hover:bg-violet-600 hover:text-white transition-all text-[10px] font-mono font-bold"
                      >
                        Toggle VVIP
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dynamic Vouchers & CMS panel */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="glass-card p-6 border-white/5 space-y-4">
            <h3 className="font-bold text-sm text-white">Dynamic Promo Controls</h3>
            
            <div className="space-y-3">
              {coupons.map((cp) => (
                <div key={cp.code} className="p-3 bg-white/5 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-white uppercase block">{cp.code}</span>
                    <span className="text-[10px] text-zinc-500 font-light">{cp.discount} • Used {cp.usage}</span>
                  </div>
                  
                  <button
                    onClick={() => toggleCoupon(cp.code)}
                    className={`px-2 py-1 rounded font-mono font-bold text-[9px] uppercase tracking-wider transition-all ${
                      cp.active 
                        ? 'bg-emerald-600/15 text-emerald-400 border border-emerald-500/20'
                        : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {cp.active ? 'ACTIVE' : 'PAUSED'}
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const code = prompt('Enter new Promo code:');
                if (code) {
                  setCoupons(prev => [...prev, { code: code.toUpperCase(), discount: 'Flat 15% off', usage: '0 times', active: true }]);
                }
              }}
              className="w-full py-2 bg-white text-black font-bold text-xs rounded-xl hover:bg-zinc-200 transition-all uppercase tracking-wider"
            >
              Generate Coupon Rules
            </button>
          </div>

          {/* FRAUD SHIELD REAL TIME LOGGER */}
          <div className="glass-card p-6 border-white/5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-white flex items-center">
                <ShieldAlert className="w-4 h-4 text-pink-500 mr-2" /> Fraud Shield Logger
              </h3>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="space-y-3.5 max-h-[180px] overflow-y-auto">
              {fraudLogs.map((log) => (
                <div key={log.id} className="p-3 bg-zinc-950/80 rounded-xl space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-zinc-500 font-bold">{log.id}</span>
                    <span className={`font-bold ${log.severity === 'High' ? 'text-pink-500' : 'text-zinc-400'}`}>
                      {log.severity} Severity
                    </span>
                  </div>
                  <p className="text-xs text-white font-medium">{log.description}</p>
                  <p className="text-[9px] text-zinc-400 font-mono truncate">{log.customer}</p>
                  <span className="text-[9px] font-mono bg-white/5 text-zinc-400 px-1.5 py-0.5 rounded-md inline-block">
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
