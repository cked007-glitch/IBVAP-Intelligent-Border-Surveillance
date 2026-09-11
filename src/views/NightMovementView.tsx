import React, { useState } from 'react';
import { CameraFeedInfo } from '../types';
import { TacticalCameraFeed } from '../components/TacticalCameraFeed';
import { 
  Moon, 
  Eye, 
  Flame, 
  SunMedium, 
  Sliders, 
  ShieldAlert, 
  Activity, 
  Clock, 
  Maximize2 
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface NightMovementViewProps {
  cameras: CameraFeedInfo[];
}

export const NightMovementView: React.FC<NightMovementViewProps> = ({ cameras }) => {
  const thermalCam = cameras.find(c => c.id === 'CAM-19') || cameras[0];
  const [thermalMode, setThermalMode] = useState<'thermal' | 'nvg' | 'normal'>('thermal');
  const [irPalette, setIrPalette] = useState<'white-hot' | 'black-hot' | 'ironbow'>('white-hot');

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-mono text-xs">
      {/* Top Banner with Palette & Low-Light Controls */}
      <div className="bg-[#090c10] border border-slate-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-indigo-950/70 border border-indigo-500/40 text-indigo-400">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base text-slate-100 uppercase tracking-wider">
              LONG-RANGE THERMAL & LOW-LIGHT FLIR SURVEILLANCE
            </h2>
            <p className="text-slate-400 text-[11px]">
              Microbolometer infrared sensor array • Foliage penetration • Crawling low-profile gait discriminator
            </p>
          </div>
        </div>

        {/* Optical Filter Mode Toggles */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded p-0.5">
            <button
              onClick={() => {
                soundEngine.playActionConfirm();
                setThermalMode('thermal');
              }}
              className={`px-3 py-1 rounded font-bold cursor-pointer transition-colors ${
                thermalMode === 'thermal' ? 'bg-amber-600 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              THERMAL FLIR
            </button>
            <button
              onClick={() => {
                soundEngine.playActionConfirm();
                setThermalMode('nvg');
              }}
              className={`px-3 py-1 rounded font-bold cursor-pointer transition-colors ${
                thermalMode === 'nvg' ? 'bg-emerald-600 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              NVG GREEN
            </button>
            <button
              onClick={() => {
                soundEngine.playActionConfirm();
                setThermalMode('normal');
              }}
              className={`px-3 py-1 rounded font-bold cursor-pointer transition-colors ${
                thermalMode === 'normal' ? 'bg-slate-700 text-slate-100' : 'text-slate-400 hover:text-white'
              }`}
            >
              RAW OPTICAL
            </button>
          </div>
        </div>
      </div>

      {/* 4 Thermal Status & Night Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#090c10] border border-slate-800 p-3 rounded-lg">
          <div className="text-slate-400 text-[10px] uppercase">NIGHT MOVEMENT DETECTIONS</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">16</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Between 20:00 - 05:00</div>
        </div>

        <div className="bg-[#090c10] border border-slate-800 p-3 rounded-lg">
          <div className="text-slate-400 text-[10px] uppercase">CRAWLING / LOW-PROFILE</div>
          <div className="text-2xl font-bold text-rose-400 mt-1">02</div>
          <div className="text-[10px] text-rose-400/80 mt-0.5">Gully Concealment Flagged</div>
        </div>

        <div className="bg-[#090c10] border border-slate-800 p-3 rounded-lg">
          <div className="text-slate-400 text-[10px] uppercase">IR OPTICAL SENSITIVITY</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">&lt; 35 mK</div>
          <div className="text-[10px] text-slate-500 mt-0.5">NETD Thermal Contrast</div>
        </div>

        <div className="bg-[#090c10] border border-slate-800 p-3 rounded-lg">
          <div className="text-slate-400 text-[10px] uppercase">ATMOSPHERIC PIERCING</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">94%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Fog & Dust Penetration</div>
        </div>
      </div>

      {/* Main Thermal Video Viewer + Telemetry Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed with Thermal Filter */}
        <div className="lg:col-span-2 space-y-3">
          <div className="h-[480px] w-full">
            <TacticalCameraFeed
              camera={thermalCam}
              isPrimary={true}
              showAiOverlayDefault={true}
              forceNightMode={thermalMode === 'nvg'}
              forceThermalMode={thermalMode === 'thermal'}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between text-slate-400 text-[11px] px-1">
            <span>SENSOR: {thermalCam.id} • DUAL COOLED THERMAL CORE</span>
            <span className="text-emerald-400 font-bold">LOW-LIGHT ENHANCEMENT: DSP ACCELERATED</span>
          </div>
        </div>

        {/* Right: Night Anomaly Alert Feed */}
        <div className="space-y-3">
          <div className="bg-[#080a0e] border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-slate-200">THERMAL HEAT ANOMALIES</span>
              <span className="text-amber-400 text-[10px]">INFRARED SIGNATURES</span>
            </div>

            <div className="space-y-2.5">
              <div className="bg-rose-950/40 border border-rose-600/70 p-3 rounded">
                <div className="flex items-center justify-between text-rose-300 font-bold mb-1">
                  <span>LOW PROFILE CRAWL #IR-04</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-900">CRITICAL</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Heat signature moving at 0.4 m/s in prone position along dried irrigation canal (Sector 07 Marker 12).
                </p>
                <div className="mt-2 text-[10px] text-slate-400 flex justify-between border-t border-slate-800 pt-1">
                  <span>Delta T: +3.2°C above ambient</span>
                  <span>Time: 02:18:40</span>
                </div>
              </div>

              <div className="bg-slate-900/70 border border-slate-800 p-3 rounded">
                <div className="flex items-center justify-between text-amber-300 font-bold mb-1">
                  <span>STATIONARY HEAT BLOOM #IR-02</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950">HIGH</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Engine block thermal persistence detected behind acacia shrub line. Vehicle concealed.
                </p>
                <div className="mt-2 text-[10px] text-slate-400 flex justify-between border-t border-slate-800 pt-1">
                  <span>Delta T: +8.4°C engine cooling</span>
                  <span>Time: 03:04:12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
