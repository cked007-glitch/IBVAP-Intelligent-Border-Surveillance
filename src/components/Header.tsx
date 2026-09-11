import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Activity, 
  Wifi, 
  Bell, 
  Volume2, 
  VolumeX, 
  Layers, 
  User, 
  LogOut, 
  ChevronDown,
  Clock,
  Radio,
  Maximize2,
  Menu
} from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { AlertItem } from '../types';

interface HeaderProps {
  operatorName?: string;
  officerName?: string;
  officerRole?: string;
  sector?: string;
  onOpenArchitecture: () => void;
  onLockSession?: () => void;
  onLogout?: () => void;
  alerts?: AlertItem[];
  activeAlertsCount?: number;
  onSelectAlert?: (alert: AlertItem) => void;
  onOpenAlerts?: () => void;
  onToggleMobileMenu?: () => void;
  activeView?: string;
}

export const Header: React.FC<HeaderProps> = ({
  operatorName,
  officerName,
  officerRole = 'SECTOR COMMANDER',
  sector = 'SECTOR 07',
  onOpenArchitecture,
  onLockSession,
  onLogout,
  alerts = [],
  activeAlertsCount: propActiveAlertsCount,
  onSelectAlert,
  onOpenAlerts,
  onToggleMobileMenu,
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [utcTime, setUtcTime] = useState('');
  const [isMuted, setIsMuted] = useState(soundEngine.isMuted);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const displayName = officerName || operatorName || 'MAJOR V. SHARMA';
  const handleLogoutAction = onLogout || onLockSession || (() => {});
  const safeAlerts = alerts || [];
  const activeAlertsCount = propActiveAlertsCount !== undefined 
    ? propActiveAlertsCount 
    : safeAlerts.filter(a => a.status === 'ACTIVE').length;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
      setUtcTime(now.toISOString().replace('T', ' ').slice(0, 19) + ' UTC');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleSound = () => {
    soundEngine.isMuted = !soundEngine.isMuted;
    setIsMuted(soundEngine.isMuted);
    if (!soundEngine.isMuted) {
      soundEngine.playBeep(900, 'sine', 0.08, 0.05);
    }
  };

  return (
    <header className="h-16 bg-[#090c10] border-b border-emerald-950/80 px-4 flex items-center justify-between z-30 select-none">
      {/* Left: Branding & Mobile Menu Toggle */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 transition-colors"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center justify-center w-10 h-10 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
          <Shield className="w-6 h-6 stroke-[2]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-xl tracking-wider text-slate-100">
              IBVAP
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              SYSTEM OPERATIONAL
            </span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 hidden md:block">
            Intelligent Border Video Analytics Platform • <span className="text-emerald-400 font-semibold">{sector}</span>
          </div>
        </div>
      </div>

      {/* Middle: Mission Time & Telemetry */}
      <div className="hidden lg:flex items-center gap-6 font-mono text-xs">
        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded border border-slate-800">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-300 font-semibold">{currentTime}</span>
          <span className="text-slate-500 text-[10px]">({utcTime})</span>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded border border-slate-800 text-[11px]">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-slate-400">NET:</span>
          <span className="text-emerald-400 font-semibold">STABLE 42ms</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">AI INFERENCE:</span>
          <span className="text-emerald-400 font-semibold">24 STREAMS</span>
        </div>
      </div>

      {/* Right: Quick Action Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Architecture Pipeline Button */}
        <button
          onClick={() => {
            soundEngine.playActionConfirm();
            onOpenArchitecture();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono bg-slate-900 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/50 text-emerald-400 transition-all cursor-pointer"
          title="Inspect System Architecture Pipeline"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-semibold">PIPELINE</span>
        </button>

        {/* Audio Mute Toggle */}
        <button
          onClick={toggleSound}
          className={`p-2 rounded border transition-colors cursor-pointer ${
            isMuted 
              ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300' 
              : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/40'
          }`}
          title={isMuted ? 'Tactical Audio Muted' : 'Tactical Audio Active'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              soundEngine.playActionConfirm();
              setShowNotifications(!showNotifications);
            }}
            className="p-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors relative cursor-pointer"
            title="Real-Time Alerts Feed"
          >
            <Bell className="w-4 h-4" />
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white font-mono text-[9px] font-bold flex items-center justify-center animate-pulse">
                {activeAlertsCount}
              </span>
            )}
          </button>

          {/* Quick Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0b0e14] border border-slate-700 rounded-lg shadow-2xl p-3 z-50 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="font-bold text-slate-200">ACTIVE INCIDENTS ({activeAlertsCount})</span>
                {onOpenAlerts && (
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      onOpenAlerts();
                    }}
                    className="text-[10px] text-emerald-400 hover:underline cursor-pointer"
                  >
                    VIEW ALL ALERTS
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto space-y-1.5 custom-scrollbar">
                {safeAlerts.length === 0 ? (
                  <div className="text-center py-4 text-slate-500">No active alerts logged</div>
                ) : (
                  safeAlerts.slice(0, 5).map((alert) => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        if (onSelectAlert) onSelectAlert(alert);
                        else if (onOpenAlerts) onOpenAlerts();
                        setShowNotifications(false);
                      }}
                      className={`p-2 rounded border cursor-pointer transition-colors ${
                        alert.severity === 'CRITICAL' 
                          ? 'bg-rose-950/40 border-rose-600/50 hover:bg-rose-900/40' 
                          : alert.severity === 'HIGH'
                          ? 'bg-amber-950/40 border-amber-600/50 hover:bg-amber-900/40'
                          : 'bg-slate-900/80 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          alert.severity === 'CRITICAL' ? 'bg-rose-900 text-rose-200' : 'bg-amber-900 text-amber-200'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="text-[10px] text-slate-400">{alert.timeAgo}</span>
                      </div>
                      <div className="font-semibold text-slate-200 mt-1">{alert.title}</div>
                      <div className="text-[11px] text-slate-400 flex justify-between mt-0.5">
                        <span>{alert.camera} • {alert.location}</span>
                        <span className="text-emerald-400">{alert.confidence}% conf</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Operator Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors text-xs font-mono cursor-pointer"
          >
            <div className="w-5 h-5 rounded bg-emerald-900 border border-emerald-600 flex items-center justify-center text-emerald-300 text-[10px] font-bold">
              OP
            </div>
            <span className="hidden sm:inline font-semibold text-emerald-400">{displayName}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0b0e14] border border-slate-700 rounded-md shadow-2xl p-2 z-50 font-mono text-xs space-y-2">
              <div className="px-2 py-1.5 border-b border-slate-800">
                <div className="text-slate-300 font-bold">{displayName}</div>
                <div className="text-[10px] text-emerald-400 uppercase">{officerRole}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{sector} OPS ROOM</div>
              </div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  handleLogoutAction();
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Lock Console / Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
