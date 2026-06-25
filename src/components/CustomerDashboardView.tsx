import { useState } from 'react';
import { Booking, WalletTransaction } from '../types';
import { Wallet, Star, Calendar, Clock, MapPin, XCircle, ArrowUpRight, ArrowDownLeft, ShieldCheck, Heart, Award, RefreshCw, Landmark, Gift, ChevronRight, FileText, Download, ExternalLink, ChevronDown, CalendarPlus } from 'lucide-react';

interface CustomerDashboardViewProps {
  bookings: Booking[];
  walletBalance: number;
  walletTransactions: WalletTransaction[];
  onCancelBooking: (id: string) => Promise<any>;
  onAddFunds: (amount: number) => Promise<any>;
}

export default function CustomerDashboardView({
  bookings,
  walletBalance,
  walletTransactions,
  onCancelBooking,
  onAddFunds
}: CustomerDashboardViewProps) {
  
  const [addAmount, setAddAmount] = useState('1500');
  const [isAddingFunds, setIsAddingFunds] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Parse Booking YYYY-MM-DD date and '11:30 AM'/'04:15 PM' time into actual Date objects
  const parseBookingDateTime = (dateStr: string, timeStr: string): { start: Date; end: Date } => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const match = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
    let hours = 12;
    let minutes = 0;
    if (match) {
      hours = Number(match[1]);
      minutes = Number(match[2]);
      const ampm = match[3].toUpperCase();
      if (ampm === 'PM' && hours < 12) {
        hours += 12;
      } else if (ampm === 'AM' && hours === 12) {
        hours = 0;
      }
    }
    const start = new Date(year, month - 1, day, hours, minutes);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 Hour default duration
    return { start, end };
  };

  // Convert Date object into UTC iCal / ICS compliant timestamp format (YYYYMMDDTHHMMSSZ)
  const formatICalDate = (date: Date): string => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
  };

  // Generate and download raw RFC-compliant .ics file
  const handleDownloadICS = (b: Booking) => {
    try {
      const { start, end } = parseBookingDateTime(b.date, b.time);
      const startStr = formatICalDate(start);
      const endStr = formatICalDate(end);
      const stampStr = formatICalDate(new Date());

      const summary = `${b.serviceName} - ${b.salonName}`;
      const description = `Your premium beauty slot at GlowSphere AI is confirmed!\\n\\n` +
        `• Service: ${b.serviceName}\\n` +
        `• Salon: ${b.salonName}\\n` +
        `• Locality: ${b.locality}\\n` +
        `• Stylist: ${b.professionalName}\\n` +
        `• Date: ${b.date}\\n` +
        `• Time: ${b.time}\\n` +
        `• Price: ₹${b.price}\\n\\n` +
        `Need to make changes? Open your Client Hub at GlowSphere AI to manage your slots.`;

      const location = `${b.salonName}, ${b.locality}, Hyderabad`;

      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//GlowSphere//NONSGML Premium Bookings//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:booking-${b.id}@glowsphere.ai`,
        `DTSTAMP:${stampStr}`,
        `DTSTART:${startStr}`,
        `DTEND:${endStr}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${description}`,
        `LOCATION:${location}`,
        'STATUS:CONFIRMED',
        'SEQUENCE:0',
        'BEGIN:VALARM',
        'TRIGGER:-PT1H',
        'ACTION:DISPLAY',
        'DESCRIPTION:Reminder: Your GlowSphere Appointment is in 1 hour!',
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `glowsphere-booking-${b.id}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to generate iCal file:', error);
    }
  };

  // Construct secure, custom deep link for Google Calendar
  const getGoogleCalendarUrl = (b: Booking): string => {
    try {
      const { start, end } = parseBookingDateTime(b.date, b.time);
      const startStr = formatICalDate(start);
      const endStr = formatICalDate(end);
      const dates = `${startStr}/${endStr}`;
      const text = encodeURIComponent(`${b.serviceName} @ ${b.salonName}`);
      const details = encodeURIComponent(
        `✨ Your luxury salon appointment with GlowSphere AI is confirmed!\n\n` +
        `• Service: ${b.serviceName}\n` +
        `• Stylist: ${b.professionalName}\n` +
        `• Amount Paid: ₹${b.price}\n` +
        `• Location: ${b.salonName}, ${b.locality}\n\n` +
        `Manage your appointments anytime via your client panel at GlowSphere AI.`
      );
      const location = encodeURIComponent(`${b.salonName}, ${b.locality}, Hyderabad`);
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`;
    } catch (error) {
      console.error('Failed to generate Google Calendar URL:', error);
      return '#';
    }
  };

  // Construct secure, custom deep link for Outlook Web Calendar
  const getOutlookCalendarUrl = (b: Booking): string => {
    try {
      const { start, end } = parseBookingDateTime(b.date, b.time);
      const startISO = start.toISOString();
      const endISO = end.toISOString();

      const subject = encodeURIComponent(`${b.serviceName} @ ${b.salonName}`);
      const body = encodeURIComponent(
        `✨ Your luxury salon appointment with GlowSphere AI is confirmed!\n\n` +
        `• Service: ${b.serviceName}\n` +
        `• Stylist: ${b.professionalName}\n` +
        `• Amount Paid: ₹${b.price}\n` +
        `• Location: ${b.salonName}, ${b.locality}\n\n` +
        `Manage your appointments anytime via your client panel at GlowSphere AI.`
      );
      const location = encodeURIComponent(`${b.salonName}, ${b.locality}, Hyderabad`);
      return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${subject}&startdt=${startISO}&enddt=${endISO}&body=${body}&location=${location}`;
    } catch (error) {
      console.error('Failed to generate Outlook Calendar URL:', error);
      return '#';
    }
  };

  const handleAddFundsSubmit = async () => {
    const num = Number(addAmount);
    if (!num || num <= 0) return;
    
    setIsAddingFunds(true);
    try {
      await onAddFunds(num);
      alert(`₹${num.toLocaleString()} successfully synchronized to your GlowSphere secure wallet.`);
      setAddAmount('1500');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAddingFunds(false);
    }
  };

  const handleCancelClick = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this slot? Your wallet balance will be instantly refunded.')) return;
    setCancellingId(id);
    try {
      await onCancelBooking(id);
    } catch (err) {
      console.error(err);
    } finally {
      setCancellingId(null);
    }
  };

  const activeBookings = bookings.filter(b => b.status === 'upcoming');
  const pastBookings = bookings.filter(b => b.status !== 'upcoming');

  // Simple stats calculation
  const totalSpent = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.price, 0);

  const rewardPoints = Math.round((totalSpent + walletBalance) / 10);

  return (
    <div id="customer-hub" className="relative min-h-screen text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Title */}
      <div className="mb-10">
        <span className="text-xs font-mono uppercase text-violet-400 block tracking-widest mb-1">CLIENT HUB</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">My Premium Workspace</h1>
        <p className="text-zinc-500 text-xs font-mono mt-1">Account: upoornalakshminarayana@gmail.com • GOLD SUBSCRIPTION ACTIVE</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: ACTIVE BOOKINGS & HISTORY (7 COLS) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Active appointments */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mr-2.5 animate-pulse" />
                Active Appointments ({activeBookings.length})
              </h3>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Real-time status</span>
            </div>

            {activeBookings.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white/5 border border-white/5 text-center text-zinc-500 text-xs italic">
                No upcoming appointments. Go to "Book Salons" to lock a slot.
              </div>
            ) : (
              <div className="space-y-4">
                {activeBookings.map((b) => (
                  <div
                    key={b.id}
                    className="glass-card overflow-hidden border-violet-500/30 bg-zinc-950/40 shadow-xl"
                  >
                    {/* Header bar */}
                    <div className="p-4 bg-white/5 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <img src={b.salonImage} alt={b.salonName} className="w-9 h-9 rounded-lg object-cover" />
                        <div>
                          <h4 className="font-bold text-sm text-white">{b.salonName}</h4>
                          <span className="text-[10px] font-mono text-zinc-400 flex items-center">
                            <MapPin className="w-3 h-3 text-pink-500 mr-1" /> {b.locality}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] uppercase font-mono font-bold bg-violet-600/10 text-violet-400 border border-violet-500/25 px-2.5 py-1 rounded-full">
                          CONFIRMED SLOT
                        </span>
                        {b.isHomeService && (
                          <span className="text-[10px] uppercase font-mono font-bold bg-pink-500/15 text-pink-400 border border-pink-500/20 px-2.5 py-1 rounded-full">
                            HOME ATELIER
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Details and cancel */}
                    <div className="p-5 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      <div className="sm:col-span-8 space-y-1.5">
                        <span className="text-[10px] uppercase font-mono text-zinc-500">Service Required</span>
                        <h5 className="font-bold text-base text-white">{b.serviceName}</h5>
                        
                        <div className="flex flex-wrap gap-4 text-xs text-zinc-400 pt-1 font-light">
                          <span className="flex items-center font-mono text-[11px]">
                            <Calendar className="w-4 h-4 text-violet-400 mr-1.5" /> {b.date}
                          </span>
                          <span className="flex items-center font-mono text-[11px]">
                            <Clock className="w-4 h-4 text-violet-400 mr-1.5" /> {b.time}
                          </span>
                          <span className="flex items-center font-mono text-[11px]">
                            Stylist: <span className="text-white ml-1 font-sans font-bold">{b.professionalName}</span>
                          </span>
                        </div>
                      </div>

                      <div className="sm:col-span-4 flex flex-col items-end space-y-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5 relative">
                        <div className="text-right">
                          <span className="text-[10px] uppercase text-zinc-500 font-mono block">Paid Amount</span>
                          <span className="text-lg font-bold text-emerald-400 font-mono">₹{b.price}</span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-2 w-full justify-end">
                          {/* Calendar Export Dropdown */}
                          <div className="relative w-full sm:w-auto">
                            <button
                              onClick={() => setOpenDropdownId(openDropdownId === b.id ? null : b.id)}
                              className="w-full px-3 py-1.5 bg-violet-600/10 hover:bg-violet-600/20 text-violet-400 hover:text-violet-300 rounded-lg text-xs font-bold font-mono border border-violet-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              title="Export to Calendar"
                            >
                              <CalendarPlus className="w-3.5 h-3.5" />
                              <span>EXPORT</span>
                              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                            </button>

                            {openDropdownId === b.id && (
                              <>
                                <div 
                                  className="fixed inset-0 z-10" 
                                  onClick={() => setOpenDropdownId(null)}
                                />
                                <div className="absolute right-0 bottom-full sm:bottom-auto sm:top-full mt-1 mb-1 sm:mb-0 w-52 rounded-xl bg-zinc-950 border border-white/10 p-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.85)] z-20 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-100">
                                  <div className="px-2 py-1 text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-wider border-b border-white/5 mb-1">
                                    Calendar Formats
                                  </div>
                                  <a
                                    href={getGoogleCalendarUrl(b)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setOpenDropdownId(null)}
                                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer font-medium"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                    <span className="truncate">Google Calendar</span>
                                  </a>
                                  <a
                                    href={getOutlookCalendarUrl(b)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setOpenDropdownId(null)}
                                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer font-medium"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                    <span className="truncate">Outlook Calendar</span>
                                  </a>
                                  <button
                                    onClick={() => {
                                      handleDownloadICS(b);
                                      setOpenDropdownId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer font-medium text-left"
                                  >
                                    <Download className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                                    <span className="truncate">Apple / iCal (.ics)</span>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>

                          <button
                            onClick={() => handleCancelClick(b.id)}
                            disabled={cancellingId === b.id}
                            className="w-full sm:w-auto px-3 py-1.5 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white rounded-lg text-xs font-bold font-mono border border-red-500/20 hover:border-transparent transition-all active:scale-95 disabled:opacity-50"
                          >
                            {cancellingId === b.id ? 'Refunding...' : 'CANCEL BOOKING'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Bookings & History */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center">
              Appointment History
            </h3>

            {pastBookings.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-center text-zinc-500 text-xs italic">
                No past transactions recorded.
              </div>
            ) : (
              <div className="space-y-3">
                {pastBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center text-xs"
                  >
                    <div className="space-y-1">
                      <h5 className="font-bold text-white">{b.serviceName}</h5>
                      <p className="text-zinc-500 text-[10px] font-mono">
                        {b.salonName} • {b.date}
                      </p>
                    </div>

                    <div className="text-right flex items-center space-x-3">
                      <div>
                        <span className="font-mono text-zinc-300 block">₹{b.price}</span>
                        <span className={`text-[9px] uppercase font-mono font-bold ${
                          b.status === 'completed' ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-600" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: WALLET ENGINE & METRICS (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* WALLET BOARD */}
          <div className="glass-card p-6 border border-white/10 space-y-6 bg-gradient-to-b from-zinc-950 to-zinc-900 shadow-2xl">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Wallet className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">GlowSphere Secure Wallet</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold border border-emerald-500/20">Active</span>
            </div>

            {/* Bal display */}
            <div>
              <span className="text-[10px] uppercase text-zinc-500 font-mono block">Available Balance</span>
              <h2 className="text-4xl font-mono font-extrabold text-white">
                ₹{walletBalance.toLocaleString()}
              </h2>
            </div>

            {/* Quick deposit form */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase text-zinc-500 block font-mono">Refill Funds (INR)</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-white/5 focus:border-emerald-500 rounded-xl p-2.5 text-sm text-white focus:outline-none font-mono"
                />
                <button
                  onClick={handleAddFundsSubmit}
                  disabled={isAddingFunds}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
                >
                  {isAddingFunds ? 'Verifying UPI...' : 'Add Balance'}
                </button>
              </div>
            </div>

            {/* Recent statement log */}
            <div className="border-t border-white/5 pt-4 space-y-3">
              <span className="text-[10px] uppercase font-mono text-zinc-500 block">Statement Logs</span>
              
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {walletTransactions.map((tx) => (
                  <div key={tx.id} className="flex justify-between items-center text-[11px] p-2 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {tx.type === 'credit' ? (
                        <ArrowDownLeft className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-zinc-500 shrink-0" />
                      )}
                      <div>
                        <p className="text-white font-medium truncate max-w-[150px]">{tx.description}</p>
                        <p className="text-zinc-500 text-[9px] font-mono">{tx.date}</p>
                      </div>
                    </div>
                    <span className={`font-mono font-bold ${tx.type === 'credit' ? 'text-emerald-400' : 'text-zinc-300'}`}>
                      {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* METRIC BADGES BOARD */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Points block */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center relative overflow-hidden">
              <Award className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono block">Accumulated Glow Points</span>
              <h4 className="text-xl font-extrabold text-yellow-400 mt-1 font-mono">{rewardPoints}</h4>
              <p className="text-[9px] text-zinc-500 font-light mt-1">Unlock flat cashbacks</p>
            </div>

            {/* Membership block */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-600/10 to-pink-500/10 border border-violet-500/20 text-center relative overflow-hidden">
              <ShieldCheck className="w-6 h-6 text-violet-400 mx-auto mb-2" />
              <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-mono block">Membership Tier</span>
              <h4 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400 mt-1 uppercase font-mono">GOLD ELITE</h4>
              <p className="text-[9px] text-pink-400 font-bold mt-1 font-mono">15% Discount Active</p>
            </div>

          </div>

          {/* VVIP PASS */}
          <div className="p-5 rounded-2xl bg-zinc-900 border border-white/5 space-y-3">
            <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center">
              <Gift className="w-4 h-4 text-pink-500 mr-2 shrink-0" />
              Claim Voucher
            </h4>
            <p className="text-xs text-zinc-400 font-light">
              Invite your acquaintances to GlowSphere AI. When they complete their debut hydrafacial, you both receive ₹1,000 instantly credited.
            </p>
            <button
              onClick={() => alert('Referral link copied to clipboard: https://glowsphere.ai/invite/upoorna')}
              className="w-full py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold rounded-xl transition-all"
            >
              Get Invite Code
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
