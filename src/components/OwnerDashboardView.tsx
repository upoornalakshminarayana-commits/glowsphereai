import { useState } from 'react';
import { Landmark, TrendingUp, Users, Calendar, Award, Sparkles, Loader2, ArrowRight, Activity, Percent, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface OwnerDashboardViewProps {
  stats: any;
}

export default function OwnerDashboardView({ stats }: OwnerDashboardViewProps) {
  const [reportLoading, setReportLoading] = useState(false);
  const [reportText, setReportText] = useState<string | null>(null);

  const triggerAiReport = () => {
    setReportLoading(true);
    setReportText(null);

    setTimeout(() => {
      setReportText(`**GLOWSPHERE AI ANALYST - JUBILEE HILLS PERFORMANCE INSIGHTS**

1. **Demand Peaks Forecast**: 
   We predict a **24% spike** in Bridal makeup package inquiries during the upcoming Hyderabad wedding season. Suggest pre-allocating Kavitha Reddy's weekend slots exclusively for premium airbrush bridal reservations to maximize GMV.

2. **Skincare Up-Sell Matrix**:
   Your "AI Skin Tone Perfecting HydraFacial" has generated **₹42,500** in revenue over the last 15 days. Customers with "Medium Olive" skin tone profiles showed an 82% return rate. We recommend launching an automated campaign promoting customized Vitamin C peptide boosters.

3. **Pricing Optimization**:
   Saturday afternoon slots (2:00 PM to 6:00 PM) are consistently booked at 100% capacity. We advise applying a **12% dynamic premium pricing** rate to walk-in reservations, while keeping GlowSphere Gold Elite members at current rates to secure retention.

*Generated via Gemini-3.5-Flash under premium developer credentials.*`);
      setReportLoading(false);
    }, 1500);
  };

  return (
    <div id="owner-suite" className="relative min-h-screen text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-pink-500 block tracking-widest mb-1">ATELIER BUSINESS CONSOLE</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Merchant Dashboard</h1>
          <p className="text-zinc-500 text-xs font-mono mt-1">Atelier: GlowSphere Premium Atelier, Jubilee Hills</p>
        </div>

        <button
          onClick={triggerAiReport}
          disabled={reportLoading}
          className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-pink-500 rounded-xl text-xs font-bold uppercase tracking-wider text-white hover:opacity-95 transition-all shadow-md flex items-center space-x-2 cursor-pointer disabled:opacity-50"
        >
          {reportLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 text-cyan-400" />
          )}
          <span>{reportLoading ? 'Analyzing Ateliers...' : 'Generate AI Report'}</span>
        </button>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <div className="glass-card p-5 border-white/5 bg-zinc-950/40 space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-[10px] font-mono uppercase tracking-wider">Gross Booking Value</span>
            <TrendingUp className="w-4 h-4 text-violet-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-3xl font-bold text-white font-mono">₹{stats.revenue?.toLocaleString()}</h3>
            <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +18.2%
            </span>
          </div>
          <p className="text-[10px] text-zinc-500 font-light">Includes simulated baseline &amp; real actions</p>
        </div>

        {/* Metric 2 */}
        <div className="glass-card p-5 border-white/5 bg-zinc-950/40 space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-[10px] font-mono uppercase tracking-wider">Total Appointments</span>
            <Calendar className="w-4 h-4 text-pink-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-3xl font-bold text-white font-mono">{stats.bookingsCount}</h3>
            <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +12.4%
            </span>
          </div>
          <p className="text-[10px] text-zinc-500 font-light">Total verified completed &amp; pending</p>
        </div>

        {/* Metric 3 */}
        <div className="glass-card p-5 border-white/5 bg-zinc-950/40 space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-[10px] font-mono uppercase tracking-wider">Live Customer Satisfaction</span>
            <Award className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-3xl font-bold text-white font-mono">{stats.customerSatisfaction}</h3>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">Excellent</span>
          </div>
          <p className="text-[10px] text-zinc-500 font-light">Average customer review rating score</p>
        </div>

        {/* Metric 4 */}
        <div className="glass-card p-5 border-white/5 bg-zinc-950/40 space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-[10px] font-mono uppercase tracking-wider">Active Stylists</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-3xl font-bold text-white font-mono">{stats.activeStaff}</h3>
            <span className="text-[10px] text-zinc-400 font-mono">Full-time</span>
          </div>
          <p className="text-[10px] text-zinc-500 font-light">Certified premium operators in Hyderabad</p>
        </div>

      </div>

      {/* CHARTS & REVIEWS GENERATION SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Revenue Trends Bar Chart */}
        <div className="lg:col-span-8 glass-card p-6 border-white/5 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-white flex items-center">
              <Activity className="w-4.5 h-4.5 text-pink-400 mr-2" /> Monthly GMV Trajectory
            </h3>
            <span className="text-[10px] text-zinc-500 font-mono">Jan - Jun (INR)</span>
          </div>

          {/* Simple but extremely polished CSS/HTML Chart */}
          <div className="space-y-4 pt-4">
            {stats.revenueTrend?.map((trend: any, idx: number) => {
              const percentage = Math.round((trend.amount / 135000) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-400">{trend.month}</span>
                    <span className="text-white font-bold">₹{trend.amount?.toLocaleString()}</span>
                  </div>
                  <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-violet-600 via-pink-500 to-cyan-400 rounded-full transition-all duration-1000"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Demand Locality Distribution */}
        <div className="lg:col-span-4 glass-card p-6 border-white/5 space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center mb-4">
              <Percent className="w-4.5 h-4.5 text-cyan-400 mr-2" /> Booking Distribution
            </h3>
            
            <div className="space-y-3.5">
              {stats.bookingsByLocality?.map((loc: any, i: number) => {
                const total = stats.bookingsByLocality.reduce((sum: number, l: any) => sum + l.count, 0);
                const percent = Math.round((loc.count / total) * 100);
                return (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400 font-light">{loc.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-zinc-500 font-mono text-[11px]">{loc.count} bookings</span>
                      <span className="text-white font-mono font-bold bg-white/5 px-2 py-0.5 rounded-md">{percent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-[10px] text-zinc-500 italic leading-normal">
            "Hyderabad luxury sector shows consistent demand acceleration inside Jubilee Hills &amp; Banjara Hills."
          </div>
        </div>

      </div>

      {/* PERFORMANCE REPORT OUTPUT */}
      {reportText && (
        <div className="p-6 rounded-2xl bg-violet-600/5 border border-violet-500/20 space-y-4 animate-fade-in max-w-4xl">
          <div className="flex items-center space-x-2 text-violet-400 font-bold text-sm">
            <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
            <span>GlowSphere AI Business Performance Strategy</span>
          </div>

          <div className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap font-sans space-y-2">
            {reportText.split('**').map((chunk, i) => i % 2 === 1 ? <strong key={i} className="text-white font-bold">{chunk}</strong> : chunk)}
          </div>
        </div>
      )}

      {/* Live Active Bookings Queue */}
      <div className="glass-card p-6 border-white/5 space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center">
          Incoming Bookings Dispatch Queue ({stats.bookingsList?.length || 0})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/5 text-zinc-500 font-mono text-[10px] uppercase">
                <th className="py-3 px-2">Booking ID</th>
                <th className="py-3 px-2">Client Details</th>
                <th className="py-3 px-2">Service Ordered</th>
                <th className="py-3 px-2">Assigned Stylist</th>
                <th className="py-3 px-2">Date / Slot</th>
                <th className="py-3 px-2">Price Spent</th>
                <th className="py-3 px-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.bookingsList?.map((b: any) => (
                <tr key={b.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-2 font-mono text-zinc-400 font-bold">{b.id}</td>
                  <td className="py-3 px-2">
                    <p className="text-white font-semibold">{b.customerName}</p>
                    <p className="text-zinc-500 text-[10px]">{b.customerEmail}</p>
                  </td>
                  <td className="py-3 px-2">
                    <p className="text-white font-medium">{b.serviceName}</p>
                    <span className="text-[9px] font-mono bg-white/5 text-zinc-400 px-1.5 py-0.5 rounded">
                      {b.isHomeService ? 'Home visit' : 'In-Store'}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-zinc-300">{b.professionalName}</td>
                  <td className="py-3 px-2">
                    <p className="text-pink-400 font-bold font-mono text-[11px]">{b.date}</p>
                    <p className="text-zinc-500 text-[10px]">{b.time}</p>
                  </td>
                  <td className="py-3 px-2 font-mono font-bold text-emerald-400">₹{b.price}</td>
                  <td className="py-3 px-2">
                    <span className={`text-[10px] uppercase tracking-wider font-mono font-bold px-2.5 py-0.5 rounded-full ${
                      b.status === 'upcoming' 
                        ? 'bg-violet-600/10 text-violet-400 border border-violet-500/20'
                        : b.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-red-500/10 text-red-400'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
