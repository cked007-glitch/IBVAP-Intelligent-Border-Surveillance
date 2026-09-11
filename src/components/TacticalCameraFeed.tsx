import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Eye, 
  EyeOff, 
  Maximize2, 
  Minimize2, 
  Camera as SnapshotIcon, 
  Moon, 
  Sun, 
  Move, 
  ZoomIn, 
  ZoomOut, 
  Crosshair, 
  Radio, 
  Layers,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { CameraFeedInfo, DetectedEntity } from '../types';
import { soundEngine } from '../utils/audio';

interface TacticalCameraFeedProps {
  camera: CameraFeedInfo;
  isPrimary?: boolean;
  showAiOverlayDefault?: boolean;
  onSelect?: () => void;
  overrideSceneType?: 'road' | 'checkpoint' | 'bop' | 'fence' | 'terrain' | 'gate' | 'night';
  showControls?: boolean;
  customOverlayEntities?: DetectedEntity[];
  showVirtualFence?: boolean;
  virtualFenceBreached?: boolean;
}

export const TacticalCameraFeed: React.FC<TacticalCameraFeedProps> = ({
  camera,
  isPrimary = false,
  showAiOverlayDefault = true,
  onSelect,
  overrideSceneType,
  showControls = true,
  customOverlayEntities,
  showVirtualFence = false,
  virtualFenceBreached = false,
}) => {
  const [showAi, setShowAi] = useState(showAiOverlayDefault);
  const [filterPerson, setFilterPerson] = useState(true);
  const [filterVehicle, setFilterVehicle] = useState(true);
  const [isThermal, setIsThermal] = useState(camera.type === 'Thermal' || camera.sceneType === 'night');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [timestamp, setTimestamp] = useState('');
  const [snapshotFlash, setSnapshotFlash] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic moving coordinates for mock entities to make the feed feel truly live
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimestamp(now.toLocaleTimeString('en-US', { hour12: false }) + '.' + Math.floor(now.getMilliseconds() / 100));
      setTick((prev) => (prev + 1) % 100);
    }, 200);
    return () => clearInterval(timer);
  }, []);

  const handleSnapshot = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playBeep(1400, 'sine', 0.08, 0.06);
    setSnapshotFlash(true);
    setTimeout(() => setSnapshotFlash(false), 250);
  };

  const handleZoom = (direction: 'in' | 'out', e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playActionConfirm();
    setZoomLevel(prev => direction === 'in' ? Math.min(prev + 0.25, 2.5) : Math.max(prev - 0.25, 1));
  };

  const handlePan = (dx: number, dy: number, e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playActionConfirm();
    setPanOffset(prev => ({
      x: Math.max(Math.min(prev.x + dx, 50), -50),
      y: Math.max(Math.min(prev.y + dy, 40), -40)
    }));
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playActionConfirm();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const scene = overrideSceneType || camera.sceneType;

  // Compute animated positions based on tick
  const person1X = 28 + Math.sin(tick * 0.1) * 6;
  const person1Y = 48 + Math.cos(tick * 0.1) * 4;
  const vehicle1X = (15 + (tick * 0.9)) % 85;
  const vehicle1Y = 62;

  return (
    <div
      ref={containerRef}
      onClick={onSelect}
      className={`relative group bg-[#06080b] border rounded overflow-hidden select-none transition-all flex flex-col ${
        isPrimary ? 'h-full min-h-[420px]' : 'h-64'
      } ${
        virtualFenceBreached 
          ? 'border-rose-600 shadow-[0_0_20px_rgba(225,29,72,0.4)]' 
          : camera.status === 'ONLINE'
          ? 'border-slate-800 hover:border-emerald-500/60'
          : 'border-rose-950/60 opacity-75'
      }`}
    >
      {/* Top CCTV Info Overlay */}
      <div className="absolute top-0 left-0 right-0 z-30 p-2.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between text-xs font-mono pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="font-bold text-emerald-400 bg-black/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
            {camera.id}
          </span>
          <span className="text-slate-200 font-semibold truncate max-w-[140px] sm:max-w-[200px]">
            {camera.name}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-rose-400 font-bold bg-black/60 px-1 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            REC
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-300">
          <span className="hidden sm:inline bg-black/60 px-1.5 py-0.5 rounded text-emerald-300">
            FPS: {camera.fps}
          </span>
          <span className="hidden md:inline bg-black/60 px-1.5 py-0.5 rounded text-slate-300">
            {camera.resolution}
          </span>
          <span className="bg-black/70 px-1.5 py-0.5 rounded text-emerald-400 font-semibold font-mono">
            {timestamp || '16:22:45.0'}
          </span>
        </div>
      </div>

      {/* Snapshot Flash Overlay */}
      {snapshotFlash && (
        <div className="absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-200" />
      )}

      {/* Main CCTV Feed Viewport */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-slate-950">
        {/* Synthetic Video Scene Rendering */}
        <div 
          className={`absolute inset-0 transition-transform duration-300 ${
            isThermal ? 'thermal-mode' : ''
          }`}
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`
          }}
        >
          {camera.status === 'OFFLINE' ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-rose-500 font-mono text-xs p-4 text-center">
              <AlertTriangle className="w-8 h-8 mb-2 animate-bounce" />
              <div className="font-bold text-sm">VIDEO FEED DISCONNECTED</div>
              <div className="text-slate-400 mt-1">ERROR 504: RTSP Stream Signal Loss</div>
              <div className="text-[10px] text-slate-500 mt-1">IP: {camera.ipAddress} • Attempting Auto-Reconnection</div>
            </div>
          ) : (
            <svg 
              className="w-full h-full object-cover select-none" 
              viewBox="0 0 800 450" 
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                {/* Sky & Terrain Gradients */}
                <linearGradient id={`skyGrad-${camera.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={isThermal ? '#031b26' : scene === 'night' ? '#070c18' : '#1e293b'} />
                  <stop offset="100%" stopColor={isThermal ? '#020b12' : scene === 'night' ? '#0a101d' : '#334155'} />
                </linearGradient>
                <linearGradient id={`groundGrad-${camera.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={isThermal ? '#052b36' : scene === 'night' ? '#0d131f' : '#1e2631'} />
                  <stop offset="100%" stopColor={isThermal ? '#093a48' : scene === 'night' ? '#050913' : '#0f172a'} />
                </linearGradient>
                <pattern id={`fenceNet-${camera.id}`} width="12" height="12" patternUnits="userSpaceOnUse">
                  <path d="M 0 0 L 12 12 M 12 0 L 0 12" stroke={isThermal ? '#38bdf8' : '#475569'} strokeWidth="0.8" opacity="0.4" />
                </pattern>
              </defs>

              {/* Sky Background */}
              <rect x="0" y="0" width="800" height="260" fill={`url(#skyGrad-${camera.id})`} />
              
              {/* Distant Mountains / Horizon */}
              <path 
                d="M 0 240 Q 150 180, 320 220 T 600 200 T 800 230 L 800 270 L 0 270 Z" 
                fill={isThermal ? '#0a3d4f' : scene === 'night' ? '#0d1525' : '#1e293b'} 
                opacity="0.8"
              />

              {/* Ground Landscape */}
              <rect x="0" y="240" width="800" height="210" fill={`url(#groundGrad-${camera.id})`} />

              {/* Scene Specific Elements */}
              {scene === 'road' && (
                <g>
                  {/* Asphalt Border Road */}
                  <polygon points="260,240 540,240 760,450 40,450" fill={isThermal ? '#06313d' : '#161e2e'} />
                  {/* Road Center Line */}
                  <line x1="400" y1="240" x2="400" y2="450" stroke={isThermal ? '#38bdf8' : '#e2e8f0'} strokeWidth="3" strokeDasharray="25,18" opacity="0.6" />
                  {/* Side Berms */}
                  <line x1="260" y1="240" x2="40" y2="450" stroke={isThermal ? '#0284c7' : '#334155'} strokeWidth="2" />
                  <line x1="540" y1="240" x2="760" y2="450" stroke={isThermal ? '#0284c7' : '#334155'} strokeWidth="2" />
                </g>
              )}

              {scene === 'checkpoint' && (
                <g>
                  {/* Checkpoint Platform */}
                  <polygon points="180,240 620,240 720,450 80,450" fill={isThermal ? '#073340' : '#1b2333'} />
                  {/* Security Barrier Arm */}
                  <rect x="220" y="320" width="360" height="12" fill={isThermal ? '#f59e0b' : '#ef4444'} />
                  <rect x="220" y="320" width="360" height="12" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="30,30" />
                  {/* Sentry Booth */}
                  <rect x="600" y="260" width="90" height="120" fill={isThermal ? '#0284c7' : '#334155'} rx="4" />
                  <rect x="615" y="275" width="60" height="40" fill={isThermal ? '#38bdf8' : '#64748b'} opacity="0.6" />
                </g>
              )}

              {(scene === 'fence' || showVirtualFence) && (
                <g>
                  {/* Physical Perimeter Chain-Link Fence */}
                  <rect x="40" y="160" width="720" height="200" fill={`url(#fenceNet-${camera.id})`} />
                  {/* Razor Wire Coils on top */}
                  <path d="M 40 160 Q 90 140, 140 160 T 240 160 T 340 160 T 440 160 T 540 160 T 640 160 T 760 160" 
                        stroke={isThermal ? '#f59e0b' : '#94a3b8'} strokeWidth="3" fill="none" />
                  {/* Fence Posts */}
                  {[60, 160, 260, 360, 460, 560, 660, 760].map((x) => (
                    <line key={x} x1={x} y1="140" x2={x} y2="370" stroke={isThermal ? '#38bdf8' : '#64748b'} strokeWidth="4" />
                  ))}
                </g>
              )}

              {scene === 'bop' && (
                <g>
                  {/* Border Outpost Entrance Gates */}
                  <polygon points="120,240 680,240 760,450 40,450" fill={isThermal ? '#052d38' : '#1e293b'} />
                  {/* Watchtower */}
                  <rect x="100" y="120" width="60" height="180" fill={isThermal ? '#0369a1' : '#334155'} />
                  <polygon points="80,120 180,120 130,80" fill={isThermal ? '#0284c7' : '#475569'} />
                  {/* Tower Searchlight Beam */}
                  <polygon points="130,120 40,450 360,450" fill="#ffffff" opacity={isThermal ? "0.15" : "0.07"} />
                </g>
              )}

              {/* Moving Vehicle Mock Graphic */}
              {filterVehicle && (scene === 'road' || scene === 'checkpoint' || scene === 'gate') && (
                <g transform={`translate(${vehicle1X * 8}, ${vehicle1Y * 4.5}) scale(0.85)`}>
                  {/* Vehicle Body */}
                  <rect x="-60" y="-30" width="120" height="42" rx="6" fill={isThermal ? '#f43f5e' : '#22c55e'} opacity={isThermal ? 0.9 : 0.75} />
                  <rect x="-35" y="-52" width="70" height="26" rx="4" fill={isThermal ? '#fb7185' : '#15803d'} opacity="0.9" />
                  {/* Wheels */}
                  <circle cx="-35" cy="14" r="12" fill="#020617" />
                  <circle cx="35" cy="14" r="12" fill="#020617" />
                  {/* Headlight beam */}
                  <polygon points="60,-15 200,-40 200,30" fill="#fef08a" opacity="0.15" />
                </g>
              )}

              {/* Moving Person Mock Graphic */}
              {filterPerson && (
                <g transform={`translate(${person1X * 8}, ${person1Y * 4.5}) scale(0.9)`}>
                  {/* Thermal / Visual Biped Figure */}
                  <circle cx="0" cy="-45" r="8" fill={isThermal ? '#f43f5e' : '#10b981'} />
                  <line x1="0" y1="-37" x2="0" y2="-10" stroke={isThermal ? '#f43f5e' : '#10b981'} strokeWidth="7" strokeLinecap="round" />
                  <line x1="0" y1="-10" x2="-8" y2="15" stroke={isThermal ? '#f43f5e' : '#10b981'} strokeWidth="5" strokeLinecap="round" />
                  <line x1="0" y1="-10" x2="8" y2="15" stroke={isThermal ? '#f43f5e' : '#10b981'} strokeWidth="5" strokeLinecap="round" />
                </g>
              )}

              {/* Virtual Fence Polygon Overlay if enabled */}
              {(showVirtualFence || camera.id === 'CAM-07') && (
                <g>
                  {/* Danger Zone Polygon */}
                  <polygon 
                    points="160,320 420,270 680,290 740,410 120,410" 
                    fill={virtualFenceBreached ? "rgba(225, 29, 72, 0.18)" : "rgba(16, 185, 129, 0.12)"}
                    stroke={virtualFenceBreached ? "#e11d48" : "#10b981"}
                    strokeWidth="2.5"
                    strokeDasharray="10,6"
                  />
                  {/* Warning Beacon Text */}
                  <text 
                    x="420" 
                    y="295" 
                    textAnchor="middle" 
                    fill={virtualFenceBreached ? "#fda4af" : "#6ee7b7"} 
                    fontSize="12" 
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {virtualFenceBreached ? "⚠ VIRTUAL BOUNDARY BREACHED [ZONE 03]" : "VIRTUAL FENCE ACTIVE [ZONE 03]"}
                  </text>
                </g>
              )}
            </svg>
          )}
        </div>

        {/* CRT Scanline Overlay Effect */}
        <div className="scanline-fx" />

        {/* AI Detection Bounding Boxes Overlay */}
        {showAi && camera.status === 'ONLINE' && (
          <div className="absolute inset-0 z-20 pointer-events-none font-mono text-[10px]">
            {/* Person Bounding Box 1 */}
            {filterPerson && (
              <div 
                className="absolute transition-all duration-200"
                style={{
                  left: `${person1X - 3}%`,
                  top: `${person1Y - 14}%`,
                  width: '9%',
                  height: '24%',
                }}
              >
                {/* Tactical Box Frame */}
                <div className="w-full h-full border border-emerald-400 bg-emerald-500/10 relative">
                  {/* Corner Accent Ticks */}
                  <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-emerald-300" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-emerald-300" />
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-emerald-300" />
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-emerald-300" />

                  {/* Identification Tag */}
                  <div className="absolute -top-6 left-0 bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap flex items-center gap-1.5 font-bold">
                    <span>PERSON #P-024</span>
                    <span className="text-[9px] text-emerald-400">97%</span>
                  </div>

                  {/* Direction / Motion Vector */}
                  <div className="absolute -bottom-5 left-0 text-[9px] text-emerald-300 bg-black/80 px-1 rounded whitespace-nowrap">
                    MOVING EAST • 1.4 m/s
                  </div>
                </div>
              </div>
            )}

            {/* Vehicle Bounding Box */}
            {filterVehicle && (scene === 'road' || scene === 'checkpoint' || scene === 'gate') && (
              <div 
                className="absolute transition-all duration-200"
                style={{
                  left: `${vehicle1X - 6}%`,
                  top: `${vehicle1Y - 11}%`,
                  width: '18%',
                  height: '22%',
                }}
              >
                <div className="w-full h-full border border-cyan-400 bg-cyan-500/10 relative">
                  <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-cyan-300" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-cyan-300" />
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-cyan-300" />
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-cyan-300" />

                  <div className="absolute -top-6 left-0 bg-cyan-950/90 border border-cyan-500/60 text-cyan-300 px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap flex items-center gap-1.5 font-bold">
                    <span>VEHICLE #V-108</span>
                    <span className="text-[9px] text-cyan-400">94%</span>
                  </div>

                  <div className="absolute -bottom-5 left-0 text-[9px] text-cyan-300 bg-black/80 px-1 rounded whitespace-nowrap">
                    4x4 PICKUP • 28 km/h
                  </div>
                </div>
              </div>
            )}

            {/* Checkpoint ANPR Box if on checkpoint */}
            {(scene === 'checkpoint' || camera.type === 'ANPR Dedicated') && (
              <div 
                className="absolute"
                style={{ left: '44%', top: '65%', width: '15%', height: '8%' }}
              >
                <div className="w-full h-full border border-amber-400 bg-amber-500/10 relative">
                  <div className="absolute -top-5 left-0 bg-amber-950/90 border border-amber-500 text-amber-300 px-1.5 py-0.5 rounded text-[9px] font-bold">
                    ANPR: TS-09-AB-4721 (98.4%)
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Military HUD Reticle in center */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-35">
          <div className="w-16 h-16 border border-emerald-500/40 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-emerald-500/50 rounded-full" />
            <div className="absolute w-24 h-px bg-emerald-500/30" />
            <div className="absolute h-24 w-px bg-emerald-500/30" />
          </div>
        </div>
      </div>

      {/* Bottom Control Bar */}
      {showControls && (
        <div className="bg-[#090c10] border-t border-slate-800 p-2 flex items-center justify-between z-30 font-mono text-xs select-none">
          {/* AI Overlay Toggles */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                soundEngine.playActionConfirm();
                setShowAi(!showAi);
              }}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold border transition-colors cursor-pointer ${
                showAi
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              {showAi ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>AI OVERLAY</span>
            </button>

            {showAi && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilterPerson(!filterPerson);
                  }}
                  className={`px-1.5 py-0.5 rounded text-[10px] border cursor-pointer ${
                    filterPerson ? 'bg-emerald-900/60 border-emerald-600 text-emerald-300' : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  PERSON
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilterVehicle(!filterVehicle);
                  }}
                  className={`px-1.5 py-0.5 rounded text-[10px] border cursor-pointer ${
                    filterVehicle ? 'bg-cyan-900/60 border-cyan-600 text-cyan-300' : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  VEHICLE
                </button>
              </>
            )}
          </div>

          {/* PTZ & Optics Controls */}
          <div className="flex items-center gap-1 text-slate-400">
            {/* Thermal Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                soundEngine.playActionConfirm();
                setIsThermal(!isThermal);
              }}
              className={`p-1.5 rounded border transition-colors cursor-pointer ${
                isThermal 
                  ? 'bg-amber-950/60 border-amber-500/40 text-amber-300' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Toggle Thermal IR Optics"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>

            {/* Snapshot */}
            <button
              onClick={handleSnapshot}
              className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Capture Frame Snapshot"
            >
              <SnapshotIcon className="w-3.5 h-3.5" />
            </button>

            {/* Zoom In/Out */}
            <button
              onClick={(e) => handleZoom('in', e)}
              className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => handleZoom('out', e)}
              className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
