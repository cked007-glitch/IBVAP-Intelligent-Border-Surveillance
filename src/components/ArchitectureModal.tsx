import React from 'react';
import { 
  Camera, 
  Tv, 
  Cpu, 
  Crosshair, 
  BarChart3, 
  BellRing, 
  ShieldCheck, 
  X, 
  Check, 
  ArrowRight,
  Layers,
  Sparkles
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const pipelineSteps = [
    {
      step: '01',
      title: 'EXISTING CCTV INFRASTRUCTURE',
      subtitle: 'Legacy IP, PTZ, Fixed & Thermal Cams',
      desc: 'Connects directly to pre-deployed field cameras via RTSP/ONVIF without hardware replacement.',
      icon: Camera,
      tag: 'HARDWARE REUSE',
      color: 'border-emerald-500 text-emerald-400',
    },
    {
      step: '02',
      title: 'VIDEO STREAM INGESTION',
      subtitle: 'Multi-Channel RTSP Matrix',
      desc: 'High-throughput low-latency H.264/H.265 decoders normalize 24+ streams at 25-30 FPS.',
      icon: Tv,
      tag: 'STREAM BUFFER',
      color: 'border-emerald-500 text-emerald-400',
    },
    {
      step: '03',
      title: 'AI / COMPUTER VISION ENGINE',
      subtitle: 'Edge + Server Neural Inferencing',
      desc: 'Zero-latency deep neural networks detect humans, vehicles, license plates, and posture.',
      icon: Cpu,
      tag: 'CORE INFERENCE',
      color: 'border-cyan-500 text-cyan-400',
    },
    {
      step: '04',
      title: 'DETECTION & MULTI-OBJECT TRACKING',
      subtitle: 'ByteTrack + Kalman Filters',
      desc: 'Maintains trajectory vectors, speed metrics, occlusion recovery, and persistent IDs (#P-024, #V-108).',
      icon: Crosshair,
      tag: 'TRACKING MATRIX',
      color: 'border-teal-500 text-teal-400',
    },
    {
      step: '05',
      title: 'BEHAVIORAL & GEOMETRIC ANALYTICS',
      subtitle: 'Virtual Fences, ANPR, Face & Anomaly',
      desc: 'Applies polygon breach rules, loitering timers, blacklist ANPR plates, and heat contour maps.',
      icon: BarChart3,
      tag: 'INTELLIGENCE LAYER',
      color: 'border-amber-500 text-amber-400',
    },
    {
      step: '06',
      title: 'REAL-TIME ALERT GENERATION',
      subtitle: 'Sub-Second Event Dispatch',
      desc: 'Classifies threat levels (CRITICAL, HIGH, MEDIUM, LOW) and triggers audio/visual sirens.',
      icon: BellRing,
      tag: 'INSTANT SIREN',
      color: 'border-rose-500 text-rose-400',
    },
    {
      step: '07',
      title: 'COMMAND CENTER (IBVAP)',
      subtitle: 'C3 Tactical Operational UI',
      desc: 'Presents live threat map, video overlays, and dispatch commands to BSF duty officers.',
      icon: ShieldCheck,
      tag: 'TACTICAL HUD',
      color: 'border-emerald-400 text-emerald-300',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#0b0e14] border border-emerald-500/40 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-950/80 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-display font-bold text-slate-100 tracking-wider">
                  SYSTEM ARCHITECTURE & PROCESSING PIPELINE
                </h2>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-600/40">
                  PATENT PENDING
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Existing CCTV Infrastructure + Software AI = High-Precision Military Border Defense
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Value Proposition Callout */}
        <div className="px-6 py-3 bg-emerald-950/30 border-b border-emerald-900/40 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-emerald-400">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span className="font-semibold">Core Value:</span>
            <span className="text-slate-300">No costly optical hardware overhaul required. Turns standard camera feeds into AI tactical sensors.</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>END-TO-END LATENCY: <strong className="text-emerald-400">42 ms</strong></span>
            <span>ACCURACY RATE: <strong className="text-emerald-400">97.4%</strong></span>
          </div>
        </div>

        {/* Pipeline Diagram Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3 relative">
            {pipelineSteps.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.step} 
                  className="relative group bg-slate-900/70 border border-slate-800 hover:border-emerald-500/60 rounded-md p-3.5 transition-all flex flex-col justify-between"
                >
                  {/* Step badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[11px] font-bold text-slate-500 group-hover:text-emerald-400 transition-colors">
                      {item.step}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700">
                      {item.tag}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className={`p-2.5 rounded mb-3 bg-slate-950/80 border ${item.color} w-fit shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Text */}
                  <div className="space-y-1">
                    <h3 className="text-xs font-display font-bold text-slate-200 uppercase tracking-wide leading-tight">
                      {item.title}
                    </h3>
                    <div className="text-[10px] font-mono text-emerald-400/90 font-medium">
                      {item.subtitle}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed pt-1">
                      {item.desc}
                    </p>
                  </div>

                  {/* Arrow Indicator for flow */}
                  {index < pipelineSteps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full bg-slate-900 border border-emerald-500/40 text-emerald-400 items-center justify-center pointer-events-none">
                      <ArrowRight className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Technical Deep Dive Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-[#07090c] border border-slate-800 rounded p-4 font-mono text-xs space-y-2">
              <div className="text-emerald-400 font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Camera Protocol Compatibility</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Connects directly to ONVIF Profile S/G/T, RTSP, RTMP, WebRTC, and proprietary NVR/DVR streams (Hikvision, Dahua, Axis, Hanwha, CP Plus, Pelco).
              </p>
            </div>

            <div className="bg-[#07090c] border border-slate-800 rounded p-4 font-mono text-xs space-y-2">
              <div className="text-cyan-400 font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400" />
                <span>AI Analytics Core Capabilities</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Parallel YOLOv8-Border architecture for personnel & vehicle recognition, ByteTrack multi-target trajectory, ANPR OCR matrix, and low-light night enhancement.
              </p>
            </div>

            <div className="bg-[#07090c] border border-slate-800 rounded p-4 font-mono text-xs space-y-2">
              <div className="text-amber-400 font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400" />
                <span>Operational Advantage</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Reduces manual monitor fatigue by 92%. Shifts operators from passive watching to rapid response upon verified high-confidence alerts.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/60 flex justify-between items-center text-xs font-mono">
          <span className="text-slate-400">
            IBVAP ARCHITECTURE • BORDER SECURITY FORCES SPECIFICATION
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded transition-colors cursor-pointer"
          >
            CLOSE PIPELINE VIEW
          </button>
        </div>
      </div>
    </div>
  );
};
