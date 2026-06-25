import { useState } from 'react';
import { Sparkles, Send, Brain, Bot, HelpCircle, Loader2, RefreshCw, Upload, Camera, Smile, Droplets, Scissors, Paintbrush } from 'lucide-react';
import { ChatMessage, FaceAnalysis } from '../types';

interface AiBeautyLabViewProps {
  onSendMessage: (messages: ChatMessage[]) => Promise<string>;
  onAnalyzeFace: (imageBase64: string, prompt?: string) => Promise<FaceAnalysis>;
  onRecommendSalons: (query: string, budget: number) => Promise<any>;
}

export default function AiBeautyLabView({ onSendMessage, onAnalyzeFace, onRecommendSalons }: AiBeautyLabViewProps) {
  
  // Chatbot State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: 'Greetings, I am your **GlowSphere AI Aesthetic Architect**. Share your hair density, skincare dilemmas, or bridal goals, and I will recommend bespoke treatments in Hyderabad.',
      timestamp: 'Just now'
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Face Analyzer State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FaceAnalysis | null>(null);
  const [analyzerPrompt, setAnalyzerPrompt] = useState('Perform comprehensive aesthetic mapping for oval haircut optimization and skin color tone.');
  const [simulatedPhotoName, setSimulatedPhotoName] = useState<string | null>(null);

  // Recommendations Engine State
  const [recsQuery, setRecsQuery] = useState('Ultra-premium hydrafacial with custom hair styling under five thousand');
  const [recsBudget, setRecsBudget] = useState(5000);
  const [recsLoading, setRecsLoading] = useState(false);
  const [recsResult, setRecsResult] = useState<any | null>(null);

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };

    const updated = [...chatMessages, userMsg];
    setChatMessages(updated);
    setChatInput('');
    setChatLoading(true);

    try {
      const reply = await onSendMessage(updated);
      setChatMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: reply,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: 'Apologies, my premium neural pathways are heavily loaded. Please verify your Gemini API key in secrets.',
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Simulate photo capture or upload
  const triggerSimulatedUpload = () => {
    setIsAnalyzing(true);
    setSimulatedPhotoName('hyderabad_portrait_hq.jpg');
    
    // Simulate analyzing via Gemini API
    setTimeout(async () => {
      try {
        // We pass empty base64 to trigger the high-fidelity response in backend
        const result = await onAnalyzeFace('', analyzerPrompt);
        setAnalysisResult(result);
      } catch (err) {
        console.error(err);
      } finally {
        setIsAnalyzing(false);
      }
    }, 1500);
  };

  // Recommendations trigger
  const triggerRecsMatch = async () => {
    setRecsLoading(true);
    try {
      const result = await onRecommendSalons(recsQuery, recsBudget);
      setRecsResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setRecsLoading(false);
    }
  };

  return (
    <div id="ai-lab-view" className="relative min-h-screen text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background radial highlight */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <span className="badge-ai px-4 py-1.5 rounded-full text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest inline-block mb-3">
          AESTHETIC INTELLIGENCE LABORATORY
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
          GlowSphere <span className="text-gradient">AI Suite</span>
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-xl mx-auto">
          Utilizing advanced Gemini 1.5 Flash models to extract facial contours, skin color undertones, and deliver personalized atelier pairings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: INTERACTIVE CONCIERGE CHAT & RECS (7 COLS) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Chat box */}
          <div className="glass-card border border-white/10 flex flex-col h-[520px] justify-between relative bg-zinc-950/20">
            
            {/* Header bar */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-violet-600/10 text-violet-400 flex items-center justify-center border border-violet-500/25">
                  <Bot className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">GlowSphere AI Concierge</h3>
                  <span className="text-[10px] text-zinc-500 font-mono">Powered by Gemini AI • Online</span>
                </div>
              </div>
              
              <button 
                onClick={() => setChatMessages([{
                  id: 'init-1',
                  sender: 'ai',
                  text: 'Greetings, I am your **GlowSphere AI Aesthetic Architect**. Share your hair density, skincare dilemmas, or bridal goals, and I will recommend bespoke treatments.',
                  timestamp: 'Just now'
                }])}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                title="Reset conversation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Message Area */}
            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-1.5 ${
                    msg.sender === 'user'
                      ? 'bg-violet-600 text-white rounded-br-none'
                      : 'bg-white/5 border border-white/5 text-zinc-200 rounded-bl-none'
                  }`}>
                    {/* Render basic markdown/bold simulation */}
                    <div className="font-sans whitespace-pre-wrap">
                      {msg.text.split('**').map((chunk, i) => i % 2 === 1 ? <strong key={i} className="text-white font-bold">{chunk}</strong> : chunk)}
                    </div>
                    <span className="text-[9px] text-zinc-500 font-mono block text-right mt-1">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-bl-none flex items-center space-x-2 text-xs text-zinc-400">
                    <Loader2 className="w-4 h-4 text-pink-400 animate-spin" />
                    <span className="font-mono">Synthesizing luxury recommendation...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-white/5 flex space-x-2">
              <input
                type="text"
                placeholder="Ask about skin tone, hair matching, or Gachibowli salons..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                className="flex-1 bg-zinc-900 border border-white/5 focus:border-violet-500 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none transition-all placeholder-zinc-500"
              />
              <button
                onClick={handleSendChat}
                className="p-2.5 bg-gradient-to-r from-violet-600 to-pink-500 rounded-xl text-white hover:opacity-95 transition-all flex items-center justify-center cursor-pointer shadow-md shadow-violet-500/10 active:scale-95 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* BUDGET SALON ALLOCATOR */}
          <div className="glass-card p-6 border border-white/10 space-y-4">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-sm text-white">Algorithmic Salon Matching</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase text-zinc-500 block font-mono mb-1">Target Description</label>
                <input
                  type="text"
                  value={recsQuery}
                  onChange={(e) => setRecsQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/5 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-zinc-500 block font-mono mb-1">Budget Limit (INR)</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={recsBudget}
                    onChange={(e) => setRecsBudget(Number(e.target.value))}
                    className="flex-1 bg-zinc-900 border border-white/5 rounded-xl p-2.5 text-xs text-white focus:outline-none font-mono"
                  />
                  <button
                    onClick={triggerRecsMatch}
                    disabled={recsLoading}
                    className="px-4 py-2.5 bg-white text-black text-xs font-bold rounded-xl transition-all cursor-pointer hover:bg-zinc-200"
                  >
                    {recsLoading ? 'Mapping...' : 'Match'}
                  </button>
                </div>
              </div>
            </div>

            {/* Recs result */}
            {recsResult && (
              <div className="p-4 rounded-xl bg-violet-600/5 border border-violet-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono text-violet-400 font-bold">Allocation Output</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Matched 2 Ateliers</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed font-light">{recsResult.aiRationale}</p>
                <p className="text-[11px] text-pink-400 font-mono mt-1 font-semibold">{recsResult.pricePrediction}</p>
              </div>
            )}

          </div>

        </div>

        {/* RIGHT COLUMN: AI DEEP FACE MAPPING & ANALYSIS (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-card p-6 border border-white/10 space-y-6 relative overflow-hidden bg-zinc-950/20">
            {/* Design header */}
            <div className="flex items-center space-x-2.5">
              <Camera className="w-5 h-5 text-pink-500" />
              <h3 className="font-bold text-sm text-white">DeepSkin AI Mirror Scan</h3>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Upload a snapshot or align your camera below to perform instant neural-contour profiling, shade matching, and custom hairstyle pair advice.
            </p>

            {/* Custom target query parameter */}
            <div>
              <label className="text-[10px] uppercase text-zinc-500 block font-mono mb-1">Custom Mapping Directives</label>
              <textarea
                value={analyzerPrompt}
                onChange={(e) => setAnalyzerPrompt(e.target.value)}
                rows={2}
                className="w-full bg-zinc-900 border border-white/5 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-violet-500 font-sans"
              />
            </div>

            {/* Interactive Upload/Capture button */}
            <div className="space-y-3">
              <button
                onClick={triggerSimulatedUpload}
                disabled={isAnalyzing}
                className="w-full py-4 rounded-2xl border border-dashed border-white/10 hover:border-violet-500/50 bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center justify-center space-y-2 cursor-pointer relative group"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-8 h-8 text-pink-400 animate-spin" />
                    <span className="text-xs font-mono text-zinc-400">Constructing 3D Vector Landmarks...</span>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-violet-600/10 text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Camera className="w-5 h-5 text-pink-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white text-center">Capture Portrait from Live Mirror</p>
                      <p className="text-[10px] text-zinc-500 text-center mt-0.5">Supports instant video feed or file upload</p>
                    </div>
                  </>
                )}
              </button>

              {simulatedPhotoName && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-400 font-mono">
                  <span>✓ {simulatedPhotoName} loaded successfully</span>
                  <Smile className="w-4 h-4 shrink-0" />
                </div>
              )}
            </div>

            {/* Deep Analysis Output */}
            {analysisResult && (
              <div className="border-t border-white/5 pt-6 space-y-5 animate-fade-in">
                
                {/* 3 Metrics */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono">Face Contour</span>
                    <h5 className="font-bold text-sm text-white mt-1">{analysisResult.faceShape}</h5>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono">Skin Tone</span>
                    <h5 className="font-bold text-sm text-white mt-1 truncate">{analysisResult.skinTone.split(' ')[0]}</h5>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono">Hair Texture</span>
                    <h5 className="font-bold text-sm text-white mt-1 truncate">{analysisResult.hairType.split(',')[0]}</h5>
                  </div>
                </div>

                {/* Skin color swatch */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 font-mono uppercase block">Identified Undertone</span>
                    <span className="text-xs font-bold text-white">{analysisResult.skinTone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-zinc-400 font-mono">{analysisResult.skinToneHex}</span>
                    <div 
                      className="w-8 h-8 rounded-full border border-white/20 shadow-md"
                      style={{ backgroundColor: analysisResult.skinToneHex }}
                    />
                  </div>
                </div>

                {/* Haircut recommendations */}
                <div className="space-y-2">
                  <span className="text-[10px] text-violet-400 font-mono uppercase font-bold tracking-widest block">
                    <Scissors className="w-3.5 h-3.5 inline mr-1" /> Curated Hairstyles Matches
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.recommendedHairstyles.map((style, idx) => (
                      <span key={idx} className="text-xs px-3 py-1.5 rounded-xl bg-violet-600/10 border border-violet-500/20 text-white font-medium">
                        {style}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skincare recommendations */}
                <div className="space-y-2">
                  <span className="text-[10px] text-cyan-400 font-mono uppercase font-bold tracking-widest block">
                    <Droplets className="w-3.5 h-3.5 inline mr-1" /> AI Skincare Serum Formula
                  </span>
                  <ul className="space-y-1.5 text-xs text-zinc-300 pl-4 list-disc font-light">
                    {analysisResult.recommendedSkincare.map((sk, idx) => (
                      <li key={idx}>{sk}</li>
                    ))}
                  </ul>
                </div>

                {/* Colors palette */}
                <div className="space-y-2">
                  <span className="text-[10px] text-pink-400 font-mono uppercase font-bold tracking-widest block">
                    <Paintbrush className="w-3.5 h-3.5 inline mr-1" /> Ideal Styling Swatches
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {analysisResult.suitableColors.map((color, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-zinc-900 border border-white/5 text-[10px] font-mono text-center text-zinc-400">
                        {color}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
