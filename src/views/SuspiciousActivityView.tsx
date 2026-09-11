import React, { useState } from 'react';
import { CameraFeedInfo } from '../types';
import { TacticalCameraFeed } from '../components/TacticalCameraFeed';
import { 
  Radar, 
  AlertTriangle, 
  Clock, 
  Activity, 
  ShieldAlert, 
  Filter, 
  CheckCircle,
  Eye,
  Sliders
} from 'lucide-react';
import { MOCK_SUSPICIOUS_ACTIVITIES } from '../data/mockData';
import { soundEngine } from '../utils/audio';

interface SuspiciousActivityViewProps {
  cameras: CameraFeedInfo[];
}

export const SuspiciousActivityView: React.FC<SuspiciousActivityViewProps> = ({ cameras }) => {
  const gullyCam = cameras.find(c => c.id === 'CAM-05') || cameras[0];
  const [selectedActivity, setSelectedActivity] = useState(MOCK_SUSPICIOUS_ACTIVITIES[0]);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-mono text-xs">
      {/* Top Banner */}
      <div className="bg-[#090c10] border border-slate-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-amber-950/70 border border-amber-500/40 text-amber-400">
            <Radar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base text-slate-100 uppercase tracking-wider">
              BEHAVIORAL ANALYTICS & PATTERN OF LIFE ANOMALIES
            </h2>
            <p className="text-slate-400 text-[11px]">
              Spatial-temporal gait analysis, loitering accumulation timers, abandoned luggage heuristic, and rapid movement detection
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <div className="text-right">
            <div className="text-slate-400">HIGH RISK ANOMALIES</div>
            <div className="text-rose-400 font-bold text-sm">3 ACTIVE EVENTS</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Feed with Behavior Bounding Box + Suspicious Cards List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Feed (2 Columns) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="h-[460px] w-full">
            <TacticalCameraFeed
              camera={gullyCam}
              isPrimary={true}
              showAiOverlayDefault={true}
            />
          </div>

          <div className="bg-[#090c10] border border-slate-800 rounded-lg p-3 flex items-center justify-between text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>ACTIVE BEHAVIORAL INVESTIGATION: <strong>{selectedActivity.type}</strong></span>
            </div>
            <span className="text-emerald-400 font-bold">RISK CALCULATION: {selectedActivity.riskScore} / 100</span>
          </div>
        </div>

        {/* Right: Suspicious Activity Cards List as requested */}
        <div className="space-y-3">
          <div className="bg-[#080a0e] border border-slate-800 rounded-lg p-3 flex flex-col h-full max-h-[520px]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <span className="font-bold text-slate-200">SUSPICIOUS ACTIVITY LOGS</span>
              <span className="text-amber-400 text-[10px]">REAL-TIME HEURISTICS</span>
            </div>

            <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
              {MOCK_SUSPICIOUS_ACTIVITIES.map((item) => {
                const isHigh = item.severity === 'HIGH';
                const isSelected = selectedActivity.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      soundEngine.playRadarPing();
                      setSelectedActivity(item);
                    }}
                    className={`p-3 rounded border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-500/70 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                        : isHigh
                        ? 'bg-slate-900/80 border-slate-800 hover:border-amber-500/50'
                        : 'bg-slate-900/50 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-slate-100 text-xs">{item.type}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.riskScore > 80 
                          ? 'bg-rose-950 text-rose-300 border border-rose-700' 
                          : 'bg-amber-950 text-amber-300 border border-amber-700'
                      }`}>
                        RISK: {item.riskScore}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 mt-2.5 pt-2 border-t border-slate-800">
                      <div>CAMERA: <strong className="text-slate-200">{item.camera}</strong></div>
                      <div>ACTIVE TIME: <strong className="text-amber-400">{item.timeActive}</strong></div>
                      <div>LOCATION: <span className="truncate">{item.location}</span></div>
                      <div>STATUS: <strong className="text-emerald-400">{item.status}</strong></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
