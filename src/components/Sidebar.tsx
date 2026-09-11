import React from 'react';
import { 
  LayoutDashboard, 
  Video, 
  Camera, 
  Cpu, 
  Bell, 
  History, 
  Car, 
  ScanFace, 
  Crosshair, 
  ShieldAlert, 
  Radar, 
  Radio, 
  HeartPulse, 
  Sliders, 
  Moon,
  Users,
  Shield,
  Activity,
  CheckCircle2,
  X
} from 'lucide-react';
import { ViewMode } from '../types';
import { soundEngine } from '../utils/audio';

interface SidebarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  activeAlertsCount: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  activeAlertsCount,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navItems: { id: ViewMode; label: string; icon: React.ElementType; badge?: string | number; badgeColor?: string }[] = [
    { id: 'overview', label: '1. Overview', icon: LayoutDashboard },
    { id: 'live-surveillance', label: '2. Live Surveillance', icon: Video, badge: 'REC' },
    { id: 'camera-network', label: '3. Camera Network', icon: Camera, badge: '24/27' },
    { id: 'ai-analytics', label: '4. AI Analytics', icon: Cpu, badge: '97%' },
    { id: 'human-detection', label: '5. Human Detection', icon: Crosshair },
    { id: 'vehicle-detection', label: '6. Vehicle Detection', icon: Car },
    { id: 'face-detection', label: '7. Face Detection', icon: ScanFace },
    { id: 'anpr', label: '8. ANPR Recognition', icon: Car, badge: 'AUTO' },
    { id: 'virtual-fence', label: '9. Virtual Fence', icon: ShieldAlert, badge: 'BREACH', badgeColor: 'bg-rose-600 text-white' },
    { id: 'suspicious-activity', label: '10. Suspicious Activity', icon: Radar },
    { id: 'night-movement', label: '11. Night Surveillance', icon: Moon, badge: 'IR' },
    { id: 'alerts', label: '12. Alerts Center', icon: Bell, badge: activeAlertsCount, badgeColor: 'bg-rose-900 text-rose-200' },
    { id: 'incident-log', label: '13. Incident Log', icon: History },
    { id: 'patrol-management', label: '14. Patrol Dispatch', icon: Radio },
    { id: 'system-health', label: '15. System Health', icon: HeartPulse, badge: 'OK' },
    { id: 'settings', label: '16. System Settings', icon: Sliders },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-30 lg:hidden" 
        />
      )}

      <aside className={`
        fixed lg:static top-16 bottom-0 left-0 z-40
        w-64 bg-[#080a0e] border-r border-slate-800 flex flex-col justify-between select-none shrink-0 
        transition-transform duration-300 ease-in-out
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile close header */}
        <div className="flex items-center justify-between p-3 border-b border-slate-800 lg:hidden">
          <span className="font-display font-bold text-xs text-slate-200">SECTOR NAVIGATION</span>
          <button 
            onClick={onCloseMobile}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 custom-scrollbar">
          <div className="px-3 py-1 text-[10px] font-mono tracking-widest text-slate-500 uppercase">
            OPERATIONAL MATRIX (16 MODULES)
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundEngine.playBeep(isActive ? 500 : 780, 'triangle', 0.04, 0.03);
                  onSelectView(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-mono transition-all text-left cursor-pointer group ${
                  isActive
                    ? 'bg-emerald-950/80 text-emerald-300 font-semibold border-l-2 border-emerald-400 shadow-[inset_0_0_12px_rgba(16,185,129,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    item.badgeColor || (isActive ? 'bg-emerald-900/90 text-emerald-200 border border-emerald-600/40' : 'bg-slate-800 text-slate-400')
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* System Status Panel (at bottom of sidebar as requested) */}
        <div className="p-3 border-t border-slate-800/80 bg-[#06080b] font-mono text-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-slate-200 tracking-wider text-[11px]">SYSTEM STATUS</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold">ALL OPERATIONAL</span>
          </div>

          <div className="space-y-1 text-[11px] bg-slate-950/80 p-2.5 rounded border border-slate-800/80">
            <div className="flex justify-between items-center text-slate-400">
              <span>Cameras Online:</span>
              <span className="font-bold text-emerald-400">24 / 27</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>AI Engine:</span>
              <span className="font-bold text-emerald-400">ACTIVE</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Network:</span>
              <span className="font-bold text-cyan-400">STABLE</span>
            </div>
            <div className="flex justify-between items-center text-slate-400 pt-1 border-t border-slate-900 text-[10px]">
              <span>Sector Latency:</span>
              <span className="text-slate-300 font-semibold">42 ms</span>
            </div>
          </div>

          <div className="mt-2 text-[10px] text-center text-slate-500 font-mono">
            SECTOR 07 • HARDENED NODE
          </div>
        </div>
      </aside>
    </>
  );
};
