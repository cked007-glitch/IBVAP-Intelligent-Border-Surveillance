import React, { useState } from 'react';
import { 
  Cpu, 
  Users, 
  Car, 
  ScanFace, 
  CreditCard, 
  Crosshair, 
  ShieldAlert, 
  Radar, 
  Moon, 
  Activity, 
  CheckCircle, 
  Sliders, 
  Zap, 
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { ViewMode } from '../types';
import { soundEngine } from '../utils/audio';

interface AiAnalyticsViewProps {
  onNavigate: (view: ViewMode) => void;
}

export const AiAnalyticsView: React.FC<AiAnalyticsViewProps> = ({ onNavigate }) => {
  const [modules, setModules] = useState([
    {
      id: 'human',
      name: 'Human Detection',
      desc: 'Bipedal contour segmentation, posture analysis, and crowd counting',
      icon: Users,
      active: true,
      detectionsCount: 142,
      accuracy: '97.8%',
      eventsToday: 24,
      status: 'REAL-TIME 30 FPS',
      view: 'human-detection' as ViewMode,
    },
    {
      id: 'vehicle',
      name: 'Vehicle Detection & Classification',
      desc: 'Car, SUV, Truck, Bus, Motorcycle, and Unknown classification matrix',
      icon: Car,
      active: true,
      detectionsCount: 88,
      accuracy: '96.4%',
      eventsToday: 19,
      status: 'REAL-TIME 30 FPS',
      view: 'vehicle-detection' as ViewMode,
    },
    {
      id: 'face',
      name: 'Face Detection & Identification',
      desc: 'Synthetic biometric matching against border security personnel registry',
      icon: ScanFace,
      active: true,
      detectionsCount: 31,
      accuracy: '95.2%',
      eventsToday: 8,
      status: 'REAL-TIME 25 FPS',
      view: 'face-detection' as ViewMode,
    },
    {
      id: 'anpr',
      name: 'Automatic Number Plate Recognition (ANPR)',
      desc: 'Multi-state license plate OCR extraction under variable illumination',
      icon: CreditCard,
      active: true,
      detectionsCount: 47,
      accuracy: '98.6%',
      eventsToday: 47,
      status: 'REAL-TIME 30 FPS',
      view: 'anpr' as ViewMode,
    },
    {
      id: 'tracking',
      name: 'Object & Multi-Target Tracking',
      desc: 'Kalman filter vector estimation and persistent ID tracking across camera boundaries',
      icon: Crosshair,
      active: true,
      detectionsCount: 230,
      accuracy: '94.9%',
      eventsToday: 52,
      status: 'REAL-TIME 30 FPS',
      view: 'human-detection' as ViewMode,
    },
    {
      id: 'intrusion',
      name: 'Intrusion & Virtual Fence Detection',
      desc: 'Dynamic polygon perimeter breach, tripwire triggers, and buffer alerts',
      icon: ShieldAlert,
      active: true,
      detectionsCount: 2,
      accuracy: '99.1%',
      eventsToday: 2,
      status: 'INSTANT DISPATCH',
      view: 'virtual-fence' as ViewMode,
    },
    {
      id: 'suspicious',
      name: 'Suspicious Activity & Behavior',
      desc: 'Loitering detection, erratic acceleration, abandoned objects, and formation analysis',
      icon: Radar,
      active: true,
      detectionsCount: 5,
      accuracy: '91.8%',
      eventsToday: 5,
      status: 'HEURISTIC EVAL',
      view: 'suspicious-activity' as ViewMode,
    },
    {
      id: 'night',
      name: 'Night Movement & Thermal Analytics',
      desc: 'Low-light enhancement, infrared heat signature detection, and crawling identification',
      icon: Moon,
      active: true,
      detectionsCount: 16,
      accuracy: '93.7%',
      eventsToday: 6,
      status: 'THERMAL FLIR',
      view: 'night-movement' as ViewMode,
    },
  ]);

  const toggleModule = (id: string) => {
    soundEngine.playActionConfirm();
    setModules(prev => prev.map(m => m.id === id ? { ...m, active: !m.active } : m));
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-mono text-xs">
      {/* AI Engine Status Master Panel (as requested) */}
      <div className="bg-[#090c10] border border-emerald-500/40 rounded-lg p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-400">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-display font-bold text-slate-100 uppercase tracking-wider">
                  AI ENGINE CONTROL CENTER & TELEMETRY
                </h2>
                <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-600/40 text-[10px] font-bold">
                  CUDA ACCELERATED
                </span>
              </div>
              <p className="text-slate-400 text-xs">
                Parallel YOLOv8 Frontier Core • ByteTrack Multi-Target • Neural ONVIF Ingestion
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-400 font-bold">ALL 8 MODULES SYNCHRONIZED</span>
          </div>
        </div>

        {/* 5 Hardware & Inference Specs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 text-center">
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded">
            <div className="text-slate-400 text-[10px] uppercase">MODEL STATUS</div>
            <div className="text-lg font-bold text-emerald-400 mt-1">ONLINE</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Dual TensorRT Engines</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded">
            <div className="text-slate-400 text-[10px] uppercase">PROCESSING</div>
            <div className="text-lg font-bold text-emerald-400 mt-1">REAL-TIME</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Zero Pipeline Buffer Loss</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded">
            <div className="text-slate-400 text-[10px] uppercase">STREAMS PROCESSED</div>
            <div className="text-lg font-bold text-slate-100 mt-1">24 / 27</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Simultaneous RTSP Matrix</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded">
            <div className="text-slate-400 text-[10px] uppercase">AVERAGE LATENCY</div>
            <div className="text-lg font-bold text-emerald-400 mt-1">42 ms</div>
            <div className="text-[10px] text-slate-500 mt-0.5">End-to-End Inferencing</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded col-span-2 sm:col-span-1">
            <div className="text-slate-400 text-[10px] uppercase">GPU UTILIZATION</div>
            <div className="text-lg font-bold text-cyan-400 mt-1">67%</div>
            <div className="text-[10px] text-slate-500 mt-0.5">NVIDIA RTX 6000 Ada</div>
          </div>
        </div>
      </div>

      {/* 8 AI Detection Modules Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-base text-slate-200 uppercase tracking-wider">
            SOFTWARE-BASED AI MODULE MATRIX
          </span>
          <span className="text-slate-400 text-[11px]">
            Toggle individual inferencing modules or click to inspect live visual detector
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                className={`bg-[#0a0d13] border rounded-lg p-4 transition-all flex flex-col justify-between ${
                  mod.active 
                    ? 'border-slate-800 hover:border-emerald-500/60' 
                    : 'border-slate-900 opacity-60'
                }`}
              >
                {/* Module Header & Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded ${
                      mod.active ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40' : 'bg-slate-900 text-slate-500'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        mod.active ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50' : 'bg-slate-900 text-slate-500'
                      }`}>
                        {mod.active ? 'ACTIVE' : 'STANDBY'}
                      </span>
                      <button
                        onClick={() => toggleModule(mod.id)}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                          mod.active ? 'bg-emerald-600' : 'bg-slate-800'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          mod.active ? 'translate-x-4' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-sm text-slate-100 uppercase tracking-wide">
                    {mod.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>

                {/* Module Stats Breakdown */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Detections:</span>
                    <span className="font-bold text-slate-200">{mod.detectionsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Model Accuracy:</span>
                    <span className="font-bold text-emerald-400">{mod.accuracy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Events Today:</span>
                    <span className="font-bold text-slate-200">{mod.eventsToday}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-900 text-[10px]">
                    <span className="text-slate-500">Processing Status:</span>
                    <span className="text-cyan-400 font-semibold">{mod.status}</span>
                  </div>

                  {/* Open Dedicated View Button */}
                  <button
                    onClick={() => {
                      soundEngine.playRadarPing();
                      onNavigate(mod.view);
                    }}
                    className="w-full mt-3 flex items-center justify-center gap-1.5 py-1.5 rounded bg-slate-900 hover:bg-emerald-950/80 border border-slate-800 hover:border-emerald-500/50 text-emerald-400 hover:text-emerald-300 font-bold text-[10px] transition-colors cursor-pointer"
                  >
                    <span>OPEN DETECTOR CONSOLE</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
