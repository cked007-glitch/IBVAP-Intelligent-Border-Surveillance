import React, { useState } from 'react';
import { CameraFeedInfo } from '../types';
import { TacticalCameraFeed } from '../components/TacticalCameraFeed';
import { 
  ShieldAlert, 
  AlertTriangle, 
  ShieldCheck, 
  Radio, 
  Sliders, 
  Volume2, 
  RotateCcw, 
  Play, 
  Pause,
  Zap
} from 'lucide-react';
import { MOCK_ZONES } from '../data/mockData';
import { soundEngine } from '../utils/audio';

interface VirtualFenceViewProps {
  cameras: CameraFeedInfo[];
  onTriggerSiren?: () => void;
}

export const VirtualFenceView: React.FC<VirtualFenceViewProps> = ({ cameras }) => {
  const fenceCam = cameras.find(c => c.id === 'CAM-07') || cameras[0];
  const [zones, setZones] = useState(MOCK_ZONES);
  const [selectedZone, setSelectedZone] = useState('ZONE-03');
  const [isBreached, setIsBreached] = useState(true);

  const toggleBreachSimulation = () => {
    if (!isBreached) {
      soundEngine.playAlert();
      setIsBreached(true);
    } else {
      soundEngine.playActionConfirm();
      setIsBreached(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-mono text-xs">
      {/* Intrusion Alert Banner if breached */}
      {isBreached && (
        <div className="bg-rose-950/80 border-2 border-rose-500 rounded-lg p-4 shadow-[0_0_25px_rgba(225,29,72,0.4)] flex flex-wrap items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-rose-600 text-white animate-bounce">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg text-white tracking-wider">
                  ⚠ INTRUSION DETECTED — CRITICAL PERIMETER BREACH
                </h3>
                <span className="px-2 py-0.5 rounded bg-black text-rose-300 border border-rose-400 text-[10px] font-bold">
                  CODE RED
                </span>
              </div>
              <div className="text-rose-200 text-xs mt-1 flex flex-wrap gap-x-4 gap-y-1">
                <span>Zone: <strong>PERIMETER-03</strong></span>
                <span>Object: <strong>PERSON #P-021</strong></span>
                <span>Confidence: <strong>96%</strong></span>
                <span>Direction: <strong>NORTH-EAST (1.8 m/s)</strong></span>
                <span>Time: <strong>22:41:17</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEngine.playAlert();
              }}
              className="px-3 py-1.5 rounded bg-rose-900 hover:bg-rose-800 text-rose-100 border border-rose-600 font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>TEST SIREN</span>
            </button>
            <button
              onClick={toggleBreachSimulation}
              className="px-4 py-1.5 rounded bg-slate-100 hover:bg-white text-slate-950 font-bold transition-all cursor-pointer"
            >
              ACKNOWLEDGE / RESET BREACH
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Large CCTV Feed with Fence Polygon + Zone Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Feed (2 Cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="h-[480px] w-full">
            <TacticalCameraFeed
              camera={fenceCam}
              isPrimary={true}
              showAiOverlayDefault={true}
              showVirtualFence={true}
              virtualFenceBreached={isBreached}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between text-slate-400 text-[11px] px-1 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>POLYGON BOUNDARY SENSOR: {fenceCam.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleBreachSimulation}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold cursor-pointer"
              >
                {isBreached ? 'Reset Boundary Normal' : 'Simulate Target Intrusion Breach'}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Zone Management Panel as requested */}
        <div className="space-y-3">
          <div className="bg-[#080a0e] border border-slate-800 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-slate-200">PERIMETER ZONE MATRIX</span>
              <span className="text-[10px] text-emerald-400 font-semibold">4 ZONES MONITORED</span>
            </div>

            {/* Zone List */}
            <div className="space-y-2.5">
              {zones.map((z) => {
                const isSelected = selectedZone === z.id;
                const isBreach = z.status === 'BREACH DETECTED';
                return (
                  <div
                    key={z.id}
                    onClick={() => {
                      soundEngine.playActionConfirm();
                      setSelectedZone(z.id);
                    }}
                    className={`p-3 rounded border cursor-pointer transition-all ${
                      isBreach
                        ? 'bg-rose-950/40 border-rose-600/70 shadow-[0_0_12px_rgba(225,29,72,0.2)]'
                        : isSelected
                        ? 'bg-emerald-950/70 border-emerald-500/60'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-100 text-xs">{z.name}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isBreach ? 'bg-rose-900 text-rose-200' : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                      }`}>
                        {z.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 mt-2">
                      <div>PERIMETER: <strong>{z.perimeterLengthMeters}m</strong></div>
                      <div>SENSITIVITY: <strong>{z.sensitivity}%</strong></div>
                      <div>CAMERA: <strong>{z.camera}</strong></div>
                      <div>BREACHES TODAY: <strong className={isBreach ? 'text-rose-400' : 'text-slate-300'}>{z.breachCountToday}</strong></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Calibration Controls */}
            <div className="pt-3 border-t border-slate-800 space-y-2 text-[11px] text-slate-400">
              <div className="flex justify-between">
                <span>Boundary Tripwire Buffer:</span>
                <span className="text-emerald-400 font-bold">2.5 Meters</span>
              </div>
              <div className="flex justify-between">
                <span>False Alarm Filter (Wildlife):</span>
                <span className="text-emerald-400 font-bold">ACTIVE (&lt;15kg ignore)</span>
              </div>
              <div className="flex justify-between">
                <span>Siren Auto-Trigger:</span>
                <span className="text-emerald-400 font-bold">ENABLED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
