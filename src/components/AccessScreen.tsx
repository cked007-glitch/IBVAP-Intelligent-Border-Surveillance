import React, { useState } from 'react';
import { Shield, Lock, Eye, Terminal, CheckCircle2, ChevronRight, Activity, Radio, Cpu } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface AccessScreenProps {
  onAccess: (operatorName: string, sector: string) => void;
}

export const AccessScreen: React.FC<AccessScreenProps> = ({ onAccess }) => {
  const [operatorId, setOperatorId] = useState('BSF-OPR-4491');
  const [accessKey, setAccessKey] = useState('ALPHA-SECTOR-77');
  const [sector, setSector] = useState('BORDER SECTOR 07');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playActionConfirm();
    setIsAuthenticating(true);
    setAuthStep('VERIFYING ENCRYPTED CREDENTIALS...');

    setTimeout(() => {
      setAuthStep('ESTABLISHING SECURE CCTV MATRIX FEED...');
      soundEngine.playBeep(980, 'triangle', 0.1, 0.05);
    }, 450);

    setTimeout(() => {
      setAuthStep('AI NEURAL PIPELINE ONLINE: SECTOR 07');
      soundEngine.playBeep(1200, 'sine', 0.12, 0.06);
    }, 850);

    setTimeout(() => {
      onAccess(operatorId || 'BSF-OPR-4491', sector);
    }, 1250);
  };

  return (
    <div className="min-h-screen w-full bg-[#07090c] text-slate-200 bg-tactical-grid flex flex-col justify-between p-4 md:p-8 relative overflow-hidden select-none">
      {/* Background Ambience Lines */}
      <div className="absolute inset-0 bg-radial from-emerald-950/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      
      {/* Top Bar */}
      <header className="flex justify-between items-center z-10 border-b border-emerald-950/60 pb-3 text-xs tracking-wider">
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-emerald-400 font-semibold tracking-widest">DEFENSE INTRANET PROTOCOL v4.2</span>
        </div>
        <div className="flex items-center gap-6 font-mono text-slate-400 text-[11px]">
          <span className="hidden sm:inline">MIL-SPEC CLASSIFIED LEVEL 3</span>
          <span className="text-emerald-400/80">LAT: 32°14'18"N | LON: 74°52'09"E</span>
        </div>
      </header>

      {/* Main Access Card */}
      <div className="relative z-10 w-full max-w-xl mx-auto my-auto py-6">
        <div className="relative bg-[#0b0e14]/90 border border-emerald-500/30 rounded-lg p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {/* Tactical Corner Marks */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400 pointer-events-none" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400 pointer-events-none" />

          {/* Header Branding */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center justify-center p-3 rounded-md bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 mb-2 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <Shield className="w-9 h-9 stroke-[1.75]" />
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-600/40">
                DEFENSE SYSTEMS
              </span>
              <span className="font-mono text-xs text-slate-400">RESTRICTED ACCESS</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-wider text-slate-100 uppercase">
              IBVAP
            </h1>
            <p className="font-display text-sm tracking-widest text-emerald-400 font-semibold uppercase">
              Intelligent Border Video Analytics Platform
            </p>
            <p className="text-xs text-slate-400 max-w-md mx-auto italic">
              "AI-Powered Surveillance Using Existing CCTV & IP Camera Infrastructure"
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono tracking-wider text-slate-400 uppercase mb-1 flex justify-between">
                <span>Operator Identifier</span>
                <span className="text-emerald-500/80">AUTHORIZED USER</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={operatorId}
                  onChange={(e) => setOperatorId(e.target.value)}
                  className="w-full bg-[#07090c] border border-slate-700 focus:border-emerald-500 rounded px-3 py-2.5 text-sm font-mono text-slate-100 placeholder-slate-600 outline-none transition-colors"
                  placeholder="BSF-OPR-XXXX"
                  required
                />
                <Terminal className="w-4 h-4 text-emerald-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono tracking-wider text-slate-400 uppercase mb-1 flex justify-between">
                <span>Tactical Access Key</span>
                <span className="text-slate-500">256-BIT ENCRYPTION</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  className="w-full bg-[#07090c] border border-slate-700 focus:border-emerald-500 rounded px-3 py-2.5 text-sm font-mono text-slate-100 placeholder-slate-600 outline-none transition-colors"
                  placeholder="••••••••••••••••"
                  required
                />
                <Lock className="w-4 h-4 text-emerald-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono tracking-wider text-slate-400 uppercase mb-1">
                Command Sector Designation
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full bg-[#07090c] border border-slate-700 focus:border-emerald-500 rounded px-3 py-2.5 text-sm font-mono text-slate-100 outline-none transition-colors"
              >
                <option value="BORDER SECTOR 07">BORDER SECTOR 07 — NORTHERN FRONTIER</option>
                <option value="BORDER SECTOR 04">BORDER SECTOR 04 — RIVERINE CORRIDOR</option>
                <option value="BORDER SECTOR 11">BORDER SECTOR 11 — DESERT DEFENSE POST</option>
              </select>
            </div>

            {isAuthenticating ? (
              <div className="pt-2">
                <div className="bg-emerald-950/40 border border-emerald-500/40 rounded p-3 text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-mono text-xs font-semibold animate-pulse">
                    <Activity className="w-4 h-4 animate-spin" />
                    <span>{authStep}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1 rounded overflow-hidden">
                    <div className="bg-emerald-500 h-full animate-[progress_1.2s_ease-in-out_infinite]" style={{ width: '80%' }} />
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full mt-3 group bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-slate-950 font-display font-bold text-sm tracking-wider uppercase py-3 rounded transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4 stroke-[2.5]" />
                <span>Access Command Center</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            )}
          </form>

          {/* Tactical Specs Footprint */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
            <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
              <div className="flex items-center justify-center gap-1 text-emerald-400 font-semibold mb-0.5">
                <CheckCircle2 className="w-3 h-3" />
                <span>SECURE</span>
              </div>
              <span className="text-slate-400">HARDENED NODE</span>
            </div>
            <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
              <div className="flex items-center justify-center gap-1 text-emerald-400 font-semibold mb-0.5">
                <Radio className="w-3 h-3" />
                <span>ENCRYPTED</span>
              </div>
              <span className="text-slate-400">TLS 1.3 / AES-256</span>
            </div>
            <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
              <div className="flex items-center justify-center gap-1 text-emerald-400 font-semibold mb-0.5">
                <Cpu className="w-3 h-3" />
                <span>AI ENGINE</span>
              </div>
              <span className="text-slate-400">ACTIVE & READY</span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <span className="font-mono text-[11px] text-slate-500">
              Frontend Simulation Mode • Preloaded with realistic tactical CCTV telemetry
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 flex flex-col sm:flex-row justify-between items-center text-slate-500 font-mono text-[11px] gap-2 pt-2 border-t border-slate-900">
        <div>BORDER SECURITY FORCE • COMMAND, CONTROL & COMMUNICATIONS (C3)</div>
        <div className="flex items-center gap-4">
          <span>OPERATIONAL READINESS: 100%</span>
          <span>● SECTOR 07 CAMERAS: 24/27</span>
        </div>
      </footer>
    </div>
  );
};
