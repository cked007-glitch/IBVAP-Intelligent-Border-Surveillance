import React from 'react';
import { 
  Camera, 
  Users, 
  Car, 
  Bell, 
  ShieldAlert, 
  CreditCard, 
  ScanFace, 
  Radar, 
  ChevronRight, 
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertOctagon,
  Eye,
  CheckCircle,
  Clock
} from 'lucide-react';
import { CameraFeedInfo, AlertItem, ViewMode } from '../types';
import { TacticalCameraFeed } from '../components/TacticalCameraFeed';
import { TacticalMap } from '../components/TacticalMap';
import { soundEngine } from '../utils/audio';

interface OverviewViewProps {
  cameras: CameraFeedInfo[];
  alerts: AlertItem[];
  onSelectCamera: (cam: CameraFeedInfo) => void;
  onNavigate: (view: ViewMode) => void;
  onAcknowledgeAlert: (id: string) => void;
  onOpenArchitecture: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  cameras = [],
  alerts = [],
  onSelectCamera,
  onNavigate,
  onAcknowledgeAlert,
  onOpenArchitecture,
}) => {
  // Select the 6 specific demonstration cameras requested
  const gridCameras = [
    cameras.find(c => c.id === 'CAM-01') || cameras[0], // Border road
    cameras.find(c => c.id === 'CAM-02') || cameras[1], // BOP entrance
    cameras.find(c => c.id === 'CAM-03') || cameras[2], // Check post
    cameras.find(c => c.id === 'CAM-07') || cameras[6], // Perimeter fence
    cameras.find(c => c.id === 'CAM-05') || cameras[4], // Remote terrain
    cameras.find(c => c.id === 'CAM-06') || cameras[5], // Vehicle checkpoint
  ];

  const statCards = [
    {
      title: 'Cameras Online',
      value: '24 / 27',
      sub: '88.9% availability',
      icon: Camera,
      color: 'border-emerald-500/40 text-emerald-400',
      trend: '+2 back online',
      view: 'camera-network' as ViewMode,
    },
    {
      title: 'Active Personnel Detected',
      value: '18',
      sub: '12 friendly / 6 unverified',
      icon: Users,
      color: 'border-emerald-500/40 text-emerald-400',
      trend: 'ByteTrack tracking',
      view: 'human-detection' as ViewMode,
    },
    {
      title: 'Vehicles Detected',
      value: '07',
      sub: '4 cars, 2 trucks, 1 pickup',
      icon: Car,
      color: 'border-cyan-500/40 text-cyan-400',
      trend: 'Avg speed: 38 km/h',
      view: 'vehicle-detection' as ViewMode,
    },
    {
      title: 'Active Alerts',
      value: '03',
      sub: '1 Critical, 1 High, 1 Med',
      icon: AlertOctagon,
      color: 'border-rose-500/50 text-rose-400 animate-pulse',
      trend: 'Action Required',
      view: 'alerts' as ViewMode,
    },
    {
      title: 'Intrusions Today',
      value: '02',
      sub: 'Zone 03 wire line',
      icon: ShieldAlert,
      color: 'border-rose-500/40 text-rose-400',
      trend: 'QRT Dispatched',
      view: 'virtual-fence' as ViewMode,
    },
    {
      title: 'ANPR Events',
      value: '47',
      sub: '98.2% OCR confidence',
      icon: CreditCard,
      color: 'border-teal-500/40 text-teal-400',
      trend: '1 Watchlist flag',
      view: 'anpr' as ViewMode,
    },
    {
      title: 'Faces Detected',
      value: '31',
      sub: '28 match / 3 unknown',
      icon: ScanFace,
      color: 'border-amber-500/40 text-amber-400',
      trend: 'Demo Database',
      view: 'face-detection' as ViewMode,
    },
    {
      title: 'Suspicious Activities',
      value: '05',
      sub: 'Loitering & rapid pace',
      icon: Radar,
      color: 'border-amber-500/40 text-amber-400',
      trend: 'Risk score > 70',
      view: 'suspicious-activity' as ViewMode,
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 overflow-y-auto max-w-7xl mx-auto">
      {/* Visual Value Proposition & Architecture Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900/90 to-slate-900/80 border border-emerald-500/40 rounded-lg p-4 sm:p-5 shadow-lg flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-300 border border-emerald-600/50">
              TACTICAL ADVANTAGE
            </span>
            <span className="text-xs font-mono text-slate-400">MISSION STATEMENT</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-100 tracking-wider">
            EXISTING CCTV + AI SOFTWARE = INTELLIGENT BORDER SURVEILLANCE
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
            Leveraging legacy frontier camera networks without hardware replacement. Real-time neural inferencing for human, vehicle, perimeter breach, and night-vision detection.
          </p>
        </div>

        <button
          onClick={() => {
            soundEngine.playActionConfirm();
            onOpenArchitecture();
          }}
          className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-display font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
        >
          <span>Inspect Architecture Pipeline</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 8 Security Overview Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              onClick={() => onNavigate(card.view)}
              className="group bg-[#0a0d13] hover:bg-slate-900/80 border border-slate-800 hover:border-emerald-500/60 rounded-md p-3 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className={`p-1.5 rounded bg-slate-950 border ${card.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9px] font-mono text-slate-500 group-hover:text-emerald-400 transition-colors">
                  VIEW →
                </span>
              </div>

              <div>
                <div className="text-[11px] font-mono text-slate-400 leading-tight mb-1 truncate" title={card.title}>
                  {card.title}
                </div>
                <div className="text-lg sm:text-xl font-mono font-bold text-slate-100 group-hover:text-emerald-300">
                  {card.value}
                </div>
                <div className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                  {card.sub}
                </div>
              </div>

              <div className="mt-2 pt-1.5 border-t border-slate-800/80 text-[9px] font-mono text-emerald-400/80 truncate">
                {card.trend}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Live Threat Map */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-base text-slate-200 uppercase tracking-wider">
              1. SECTOR THREAT MAP & SATELLITE TACTICAL MATRIX
            </span>
          </div>
          <button 
            onClick={() => onNavigate('virtual-fence')}
            className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            <span>CONFIGURE VIRTUAL FENCE</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <TacticalMap 
          onSelectCamera={(camId) => {
            const found = cameras.find(c => c.id === camId);
            if (found) onSelectCamera(found);
          }}
          onSelectIncident={() => onNavigate('virtual-fence')}
        />
      </div>

      {/* Split Section: Live Camera Grid (6 feeds) + Alert Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left (2 Columns): 6 CCTV Feeds Grid */}
        <div className="xl:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-display font-bold text-base text-slate-200 uppercase tracking-wider">
                2. LIVE CCTV MATRIX (6 SECTOR CHANNELS)
              </span>
            </div>
            <button
              onClick={() => onNavigate('live-surveillance')}
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>OPEN SURVEILLANCE SUITE</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {gridCameras.map((cam) => (
              <div key={cam.id} className="relative">
                <TacticalCameraFeed
                  camera={cam}
                  isPrimary={false}
                  showAiOverlayDefault={true}
                  onSelect={() => onSelectCamera(cam)}
                  showVirtualFence={cam.id === 'CAM-07'}
                  virtualFenceBreached={cam.id === 'CAM-07'}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right (1 Column): Real-Time Alert Panel */}
        <div className="space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="font-display font-bold text-base text-slate-200 uppercase tracking-wider">
                3. REAL-TIME ALERT FEED
              </span>
            </div>
            <button
              onClick={() => onNavigate('alerts')}
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>MANAGE ALL</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-[#080a0e] border border-slate-800 rounded-lg p-3 space-y-2.5 flex-1 max-h-[560px] overflow-y-auto font-mono">
            {alerts.map((alert) => {
              const isCrit = alert.severity === 'CRITICAL';
              const isHigh = alert.severity === 'HIGH';
              return (
                <div
                  key={alert.id}
                  className={`p-3 rounded border transition-all ${
                    isCrit
                      ? 'bg-rose-950/40 border-rose-600/60 shadow-[0_0_12px_rgba(225,29,72,0.15)]'
                      : isHigh
                      ? 'bg-amber-950/30 border-amber-600/50'
                      : 'bg-slate-900/70 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isCrit
                        ? 'bg-rose-900 text-rose-100 border border-rose-500'
                        : isHigh
                        ? 'bg-amber-900 text-amber-100 border border-amber-500'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {alert.severity}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {alert.timeAgo}
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-sm text-slate-100 leading-snug">
                    {alert.title}
                  </h4>
                  <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                    <span>CAM: <strong className="text-emerald-400">{alert.camera}</strong></span>
                    <span>{alert.location}</span>
                  </div>

                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {alert.description}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-[10px] text-slate-400">
                      CONFIDENCE: <strong className="text-emerald-400">{alert.confidence}%</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      {alert.status === 'ACTIVE' && (
                        <button
                          onClick={() => {
                            soundEngine.playActionConfirm();
                            onAcknowledgeAlert(alert.id);
                          }}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] cursor-pointer"
                        >
                          ACKNOWLEDGE
                        </button>
                      )}
                      <button
                        onClick={() => {
                          soundEngine.playRadarPing();
                          if (alert.eventType.includes('Fence') || alert.severity === 'CRITICAL') {
                            onNavigate('virtual-fence');
                          } else {
                            onNavigate('alerts');
                          }
                        }}
                        className="px-2 py-0.5 bg-emerald-600/90 hover:bg-emerald-500 text-slate-950 font-bold rounded text-[10px] flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>VIEW INCIDENT</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
