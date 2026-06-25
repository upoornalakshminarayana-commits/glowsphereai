import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, ShieldCheck, Cpu, Clock, CheckCircle, TrendingUp, AlertTriangle } from 'lucide-react';

interface DataPoint {
  time: string;
  value: number;
}

export default function SystemHealthIndicator() {
  // Real-time latency data history (15 periods)
  const [latencyData, setLatencyData] = useState<DataPoint[]>([
    { time: '22:20', value: 45 },
    { time: '22:21', value: 48 },
    { time: '22:22', value: 52 },
    { time: '22:23', value: 44 },
    { time: '22:24', value: 68 },
    { time: '22:25', value: 75 },
    { time: '22:26', value: 48 },
    { time: '22:27', value: 50 },
    { time: '22:28', value: 42 },
    { time: '22:29', value: 55 },
    { time: '22:30', value: 47 },
    { time: '22:31', value: 49 },
    { time: '22:32', value: 58 },
    { time: '22:33', value: 52 },
    { time: '22:34', value: 50 }
  ]);

  // Real-time success rate data history (15 periods)
  const [successData, setSuccessData] = useState<DataPoint[]>([
    { time: '22:20', value: 100 },
    { time: '22:21', value: 100 },
    { time: '22:22', value: 99.8 },
    { time: '22:23', value: 100 },
    { time: '22:24', value: 100 },
    { time: '22:25', value: 99.4 },
    { time: '22:26', value: 100 },
    { time: '22:27', value: 100 },
    { time: '22:28', value: 100 },
    { time: '22:29', value: 99.9 },
    { time: '22:30', value: 100 },
    { time: '22:31', value: 100 },
    { time: '22:32', value: 100 },
    { time: '22:33', value: 100 },
    { time: '22:34', value: 100 }
  ]);

  // Simulated node stats
  const [activeNode, setActiveNode] = useState('Gachibowli Node #4');
  const [uptime, setUptime] = useState('99.998%');
  const [apiRequestsCount, setApiRequestsCount] = useState(148382);

  // Active indices for user hover interaction
  const [hoveredLatencyIndex, setHoveredLatencyIndex] = useState<number | null>(null);
  const [hoveredSuccessIndex, setHoveredSuccessIndex] = useState<number | null>(null);

  // Container refs for calculating mouse coordinate percentages
  const latencyContainerRef = useRef<HTMLDivElement>(null);
  const successContainerRef = useRef<HTMLDivElement>(null);

  // Simulated live API polling updates
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      // Generate realistic latency fluctuating between 38ms and 70ms, with occasional spike
      const isSpike = Math.random() > 0.93;
      const newLatency = isSpike ? Math.floor(Math.random() * 40) + 75 : Math.floor(Math.random() * 22) + 40;

      // Generate success rate (mostly 100%, occasionally dropping to 99.5% - 99.9%)
      const isMinorDrop = Math.random() > 0.88;
      const newSuccess = isMinorDrop ? parseFloat((99.2 + Math.random() * 0.7).toFixed(2)) : 100;

      setLatencyData(prev => [...prev.slice(1), { time: timeStr, value: newLatency }]);
      setSuccessData(prev => [...prev.slice(1), { time: timeStr, value: newSuccess }]);

      // Randomly switch nodes or increment requests
      setApiRequestsCount(prev => prev + Math.floor(Math.random() * 5) + 1);
      if (Math.random() > 0.95) {
        const nodes = ['Gachibowli Node #4', 'Madhapur Edge Node #2', 'Jubilee Hills Gateway #1'];
        setActiveNode(nodes[Math.floor(Math.random() * nodes.length)]);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Compute stats
  const avgLatency = Math.round(latencyData.reduce((acc, p) => acc + p.value, 0) / latencyData.length);
  const currentLatency = latencyData[latencyData.length - 1].value;

  const avgSuccess = parseFloat((successData.reduce((acc, p) => acc + p.value, 0) / successData.length).toFixed(3));
  const currentSuccess = successData[successData.length - 1].value;

  // Helper function to build SVG path
  const generateSvgPath = (data: DataPoint[], width: number, height: number, minVal: number, maxVal: number) => {
    const pointsCount = data.length;
    if (pointsCount === 0) return '';

    const range = maxVal - minVal || 1;
    return data.map((point, i) => {
      const x = (i / (pointsCount - 1)) * width;
      const y = height - ((point.value - minVal) / range) * height;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  // Helper function to build filled area path underneath sparkline
  const generateSvgArea = (data: DataPoint[], width: number, height: number, minVal: number, maxVal: number) => {
    const linePath = generateSvgPath(data, width, height, minVal, maxVal);
    if (!linePath) return '';
    return `${linePath} L ${width} ${height} L 0 ${height} Z`;
  };

  // Calculate coordinates for mouse hovering
  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    containerRef: React.RefObject<HTMLDivElement | null>,
    setHoverIndex: (idx: number | null) => void,
    dataLen: number
  ) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, mouseX / rect.width));
    const rawIndex = Math.round(percentage * (dataLen - 1));
    setHoverIndex(rawIndex);
  };

  // Sparkline parameters
  const chartWidth = 320;
  const chartHeight = 60;

  // Latency bounds (give some breathing room to visuals)
  const latValues = latencyData.map(d => d.value);
  const minLat = Math.max(0, Math.min(...latValues) - 8);
  const maxLat = Math.max(...latValues) + 12;

  // Success rate bounds
  const sucValues = successData.map(d => d.value);
  const minSuc = Math.min(...sucValues) - 0.2;
  const maxSuc = 100.1;

  return (
    <div className="glass-card p-6 border-white/5 space-y-6 bg-zinc-950/40 backdrop-blur-md relative overflow-hidden">
      
      {/* Background neon effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header with real-time heartbeat and Operational status */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-[#06B6D4] animate-pulse" />
            <h3 className="font-bold text-sm tracking-tight text-white">System API Health Monitor</h3>
          </div>
          <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
            {activeNode} • Live telemetry
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1 text-[9px] font-mono font-bold text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>OPERATIONAL</span>
        </div>
      </div>

      {/* Grid of Sparklines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        
        {/* SPARKLINE 1: API LATENCY */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider">Gateway Latency</span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-xl font-bold font-mono text-white">{currentLatency}</span>
                <span className="text-xs text-zinc-400 font-light">ms</span>
              </div>
            </div>

            <div className="text-right text-[10px] font-mono text-zinc-400">
              <span className="block text-zinc-500">15-Period Average</span>
              <span className="text-cyan-400 font-bold">{avgLatency} ms</span>
            </div>
          </div>

          {/* Interactive sparkline wrapper */}
          <div 
            ref={latencyContainerRef}
            className="relative h-[64px] bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-center cursor-crosshair overflow-hidden group/chart px-1"
            onMouseMove={(e) => handleMouseMove(e, latencyContainerRef, setHoveredLatencyIndex, latencyData.length)}
            onMouseLeave={() => setHoveredLatencyIndex(null)}
          >
            {/* SVG Sparkline */}
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area path */}
              <path 
                d={generateSvgArea(latencyData, chartWidth, chartHeight, minLat, maxLat)} 
                fill="url(#latencyGrad)"
                className="transition-all duration-300 ease-out"
              />

              {/* Line path */}
              <path 
                d={generateSvgPath(latencyData, chartWidth, chartHeight, minLat, maxLat)} 
                fill="none" 
                stroke="#06B6D4" 
                strokeWidth="2" 
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300 ease-out"
              />

              {/* Hover indicator point */}
              {hoveredLatencyIndex !== null && (
                <>
                  <line 
                    x1={(hoveredLatencyIndex / (latencyData.length - 1)) * chartWidth}
                    y1="0"
                    x2={(hoveredLatencyIndex / (latencyData.length - 1)) * chartWidth}
                    y2={chartHeight}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <circle 
                    cx={(hoveredLatencyIndex / (latencyData.length - 1)) * chartWidth}
                    cy={chartHeight - ((latencyData[hoveredLatencyIndex].value - minLat) / (maxLat - minLat)) * chartHeight}
                    r="4"
                    fill="#06B6D4"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                </>
              )}
            </svg>

            {/* Hover Tooltip Overlay */}
            <AnimatePresence>
              {hoveredLatencyIndex !== null && (
                <motion.div 
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-1 right-2 bg-zinc-950/95 border border-white/10 px-2 py-1 rounded-md text-[9px] font-mono flex space-x-2 text-zinc-300 pointer-events-none z-10 shadow-lg"
                >
                  <span className="text-zinc-500">{latencyData[hoveredLatencyIndex].time}</span>
                  <span className="text-cyan-400 font-bold">{latencyData[hoveredLatencyIndex].value}ms</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* SPARKLINE 2: REQUEST SUCCESS RATE */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider">Success Rate</span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-xl font-bold font-mono text-white">{currentSuccess}%</span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase font-mono tracking-widest bg-emerald-500/10 px-1 py-0.25 rounded">
                  Stable
                </span>
              </div>
            </div>

            <div className="text-right text-[10px] font-mono text-zinc-400">
              <span className="block text-zinc-500">15-Period Average</span>
              <span className="text-emerald-400 font-bold">{avgSuccess}%</span>
            </div>
          </div>

          {/* Interactive sparkline wrapper */}
          <div 
            ref={successContainerRef}
            className="relative h-[64px] bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-center cursor-crosshair overflow-hidden group/chart px-1"
            onMouseMove={(e) => handleMouseMove(e, successContainerRef, setHoveredSuccessIndex, successData.length)}
            onMouseLeave={() => setHoveredSuccessIndex(null)}
          >
            {/* SVG Sparkline */}
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="successGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area path */}
              <path 
                d={generateSvgArea(successData, chartWidth, chartHeight, minSuc, maxSuc)} 
                fill="url(#successGrad)"
                className="transition-all duration-300 ease-out"
              />

              {/* Line path */}
              <path 
                d={generateSvgPath(successData, chartWidth, chartHeight, minSuc, maxSuc)} 
                fill="none" 
                stroke="#10B981" 
                strokeWidth="2" 
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300 ease-out"
              />

              {/* Hover indicator point */}
              {hoveredSuccessIndex !== null && (
                <>
                  <line 
                    x1={(hoveredSuccessIndex / (successData.length - 1)) * chartWidth}
                    y1="0"
                    x2={(hoveredSuccessIndex / (successData.length - 1)) * chartWidth}
                    y2={chartHeight}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <circle 
                    cx={(hoveredSuccessIndex / (successData.length - 1)) * chartWidth}
                    cy={chartHeight - ((successData[hoveredSuccessIndex].value - minSuc) / (maxSuc - minSuc)) * chartHeight}
                    r="4"
                    fill="#10B981"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                </>
              )}
            </svg>

            {/* Hover Tooltip Overlay */}
            <AnimatePresence>
              {hoveredSuccessIndex !== null && (
                <motion.div 
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-1 right-2 bg-zinc-950/95 border border-white/10 px-2 py-1 rounded-md text-[9px] font-mono flex space-x-2 text-zinc-300 pointer-events-none z-10 shadow-lg"
                >
                  <span className="text-zinc-500">{successData[hoveredSuccessIndex].time}</span>
                  <span className="text-emerald-400 font-bold">{successData[hoveredSuccessIndex].value}%</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Grid footer metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-white/5 text-xs">
        <div className="space-y-0.5">
          <span className="text-[9px] text-zinc-500 font-mono uppercase block">Active Uptime</span>
          <span className="text-white font-semibold font-mono text-xs">{uptime}</span>
        </div>
        <div className="space-y-0.5">
          <span className="text-[9px] text-zinc-500 font-mono uppercase block">Request Volume</span>
          <span className="text-white font-semibold font-mono text-xs">{apiRequestsCount.toLocaleString()} reqs</span>
        </div>
        <div className="space-y-0.5">
          <span className="text-[9px] text-zinc-500 font-mono uppercase block">SSL Handshake</span>
          <span className="text-white font-semibold font-mono text-xs text-cyan-400">1.2ms TLSv1.3</span>
        </div>
        <div className="space-y-0.5">
          <span className="text-[9px] text-zinc-500 font-mono uppercase block">Active Webhooks</span>
          <span className="text-emerald-400 font-semibold font-mono text-xs flex items-center">
            <CheckCircle className="w-3.5 h-3.5 mr-1" /> 12 Secured
          </span>
        </div>
      </div>

    </div>
  );
}
