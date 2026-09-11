import React, { useState } from 'react';
import { 
  Crosshair, 
  MapPin, 
  Shield, 
  Radio, 
  Eye, 
  AlertTriangle, 
  Users, 
  Car, 
  Compass, 
  Maximize2, 
  Layers,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface TacticalMapProps {
  onSelectCamera?: (cameraId: string) => void;
  onSelectIncident?: () => void;
}

export const TacticalMap: React.FC<TacticalMapProps> = ({ onSelectCamera, onSelectIncident }) => {
  const [activeLegendFilter, setActiveLegendFilter] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<string | null>('CAM-07');
  const [zoom, setZoom] = useState(1);

  const camerasOnMap = [
    { id: 'CAM-01', name: 'Border Road East', x: 280, y: 190, fov: 45, angle: 90, status: 'ONLINE' },
    { id: 'CAM-02', name: 'BOP Alpha Gateway', x: 190, y: 260, fov: 60, angle: 45, status: 'ONLINE' },
    { id: 'CAM-03', name: 'Check Post 03 North', x: 420, y: 160, fov: 50, angle: 180, status: 'ONLINE' },
    { id: 'CAM-04', name: 'Perimeter Fence West', x: 110, y: 170, fov: 70, angle: 120, status: 'ONLINE' },
    { id: 'CAM-05', name: 'Remote Gully Observer', x: 340, y: 70, fov: 40, angle: 160, status: 'ONLINE' },
    { id: 'CAM-06', name: 'Vehicle Inspection Bay', x: 460, y: 210, fov: 55, angle: 220, status: 'ONLINE' },
    { id: 'CAM-07', name: 'Perimeter Zone 03 Breach Cam', x: 260, y: 130, fov: 65, angle: 30, status: 'ALERT' },
    { id: 'CAM-08', name: 'BOP Bravo Perimeter', x: 570, y: 240, fov: 55, angle: 270, status: 'ONLINE' },
    { id: 'CAM-11', name: 'Check Post 04 South', x: 650, y: 310, fov: 45, angle: 315, status: 'ONLINE' },
    { id: 'CAM-12', name: 'Eastern Dune Corridor', x: 690, y: 140, fov: 60, angle: 200, status: 'ONLINE' },
    { id: 'CAM-19', name: 'Sector Night Watch Thermal', x: 380, y: 300, fov: 80, angle: 0, status: 'ONLINE' },
  ];

  const handleAssetClick = (assetId: string, camId?: string) => {
    soundEngine.playRadarPing();
    setSelectedAsset(assetId);
    if (camId && onSelectCamera) {
      onSelectCamera(camId);
    }
  };

  return (
    <div className="relative bg-[#07090d] border border-slate-800 rounded-lg overflow-hidden flex flex-col font-mono text-xs select-none shadow-xl">
      {/* Map Header Toolbar */}
      <div className="bg-[#090c10] border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-display font-bold text-sm tracking-wider text-slate-100">
              LIVE THREAT MAP — SECTOR 07
            </span>
          </div>
          <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">
            SCHEMATIC TOPOGRAPHY • GRID REF: 32.24N / 74.86E
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded">
            <button 
              onClick={() => setZoom(prev => Math.min(prev + 0.15, 1.6))}
              className="p-1 hover:text-emerald-400 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] px-1 text-slate-400">{Math.round(zoom * 100)}%</span>
            <button 
              onClick={() => setZoom(prev => Math.max(prev - 0.15, 0.85))}
              className="p-1 hover:text-emerald-400 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-1 rounded">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>RADAR SYNCHRONIZED</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Stage */}
      <div className="relative w-full h-[400px] sm:h-[480px] bg-[#05070a] overflow-hidden">
        {/* Radar Sweep Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-emerald-500/30 animate-radar">
            <div className="w-1/2 h-1/2 bg-gradient-to-br from-emerald-400/20 to-transparent origin-bottom-right" />
          </div>
        </div>

        {/* Map SVG */}
        <svg 
          className="w-full h-full object-cover transition-transform duration-300"
          viewBox="0 0 800 420"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          <defs>
            {/* Tactical Grid */}
            <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(16, 185, 129, 0.07)" strokeWidth="1" />
            </pattern>
            {/* FOV Cone Gradient */}
            <linearGradient id="fovGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(16, 185, 129, 0.4)" />
              <stop offset="100%" stopColor="rgba(16, 185, 129, 0.0)" />
            </linearGradient>
            <linearGradient id="fovAlertGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(225, 29, 72, 0.5)" />
              <stop offset="100%" stopColor="rgba(225, 29, 72, 0.0)" />
            </linearGradient>
          </defs>

          {/* Background Grid Pattern */}
          <rect width="800" height="420" fill="url(#mapGrid)" />

          {/* Topographic Elevation Contours */}
          <path d="M 50 30 Q 200 80, 420 40 T 780 60" stroke="#16202f" strokeWidth="1.5" fill="none" strokeDasharray="4,4" />
          <path d="M 40 80 Q 240 120, 500 80 T 760 110" stroke="#16202f" strokeWidth="1.5" fill="none" strokeDasharray="4,4" />
          <path d="M 60 220 Q 300 270, 580 230 T 750 280" stroke="#16202f" strokeWidth="1.5" fill="none" strokeDasharray="4,4" />
          <path d="M 30 340 Q 280 390, 540 350 T 760 380" stroke="#16202f" strokeWidth="1.5" fill="none" strokeDasharray="4,4" />

          {/* Drainage Canal / Fictional River Route */}
          <path 
            d="M 20 400 C 180 370, 240 280, 310 240 S 440 210, 520 120 S 680 90, 780 40" 
            stroke="#0284c7" 
            strokeWidth="8" 
            strokeOpacity="0.35" 
            fill="none" 
          />
          <text x="360" y="225" fill="#38bdf8" fontSize="9" opacity="0.6" letterSpacing="2">
            RIVERINE TRANSIT CANAL (SECTOR 07)
          </text>

          {/* Restricted Border Buffer Zone (Shaded) */}
          <polygon 
            points="0,80 800,90 800,150 0,140" 
            fill="rgba(239, 68, 68, 0.05)" 
            stroke="rgba(239, 68, 68, 0.2)" 
            strokeWidth="1" 
            strokeDasharray="6,4" 
          />
          <text x="40" y="105" fill="#f87171" fontSize="9" fontWeight="bold" opacity="0.7">
            RESTRICTED ZERO-LINE BUFFER ZONE
          </text>

          {/* International Border Line (Zero Line) */}
          <line x1="0" y1="110" x2="800" y2="120" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="12,6" />
          <text x="580" y="112" fill="#ef4444" fontSize="10" fontWeight="bold" letterSpacing="1.5">
            INTERNATIONAL BORDER LINE (FICTIONAL SECTOR)
          </text>

          {/* Physical Perimeter Security Fence Wire */}
          <line x1="0" y1="135" x2="800" y2="145" stroke="#10b981" strokeWidth="2" strokeDasharray="8,4" opacity="0.8" />

          {/* Main Patrol Road */}
          <path 
            d="M 40 370 L 190 260 L 420 160 L 650 310 L 760 290" 
            stroke="#475569" 
            strokeWidth="3.5" 
            fill="none" 
            strokeLinecap="round" 
          />
          <text x="210" y="275" fill="#94a3b8" fontSize="9">
            LATERAL PATROL ROAD 07
          </text>

          {/* Virtual Fence Polygon - Zone 03 (Active Breach Zone) */}
          <polygon 
            points="230,115 320,118 310,155 220,150" 
            fill="rgba(225, 29, 72, 0.25)" 
            stroke="#e11d48" 
            strokeWidth="2" 
            strokeDasharray="4,2" 
          />
          <text x="235" y="138" fill="#fda4af" fontSize="9" fontWeight="bold">
            ZONE 03 [BREACH]
          </text>

          {/* Camera Field of View (FOV) Cones */}
          {camerasOnMap.map((cam) => (
            <g key={`fov-${cam.id}`} opacity={selectedAsset === cam.id ? 0.9 : 0.45}>
              <path 
                d={`M ${cam.x} ${cam.y} L ${cam.x + Math.cos((cam.angle - cam.fov/2) * Math.PI / 180) * 55} ${cam.y + Math.sin((cam.angle - cam.fov/2) * Math.PI / 180) * 55} A 55 55 0 0 1 ${cam.x + Math.cos((cam.angle + cam.fov/2) * Math.PI / 180) * 55} ${cam.y + Math.sin((cam.angle + cam.fov/2) * Math.PI / 180) * 55} Z`}
                fill={cam.status === 'ALERT' ? 'url(#fovAlertGradient)' : 'url(#fovGradient)'}
              />
            </g>
          ))}

          {/* Patrol Units Track (Moving) */}
          <g transform="translate(320, 210)">
            <circle cx="0" cy="0" r="14" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth="1" strokeDasharray="3,3" />
            <circle cx="0" cy="0" r="4" fill="#10b981" />
            <text x="8" y="4" fill="#6ee7b7" fontSize="8" fontWeight="bold">PATROL ECHO-2</text>
          </g>

          <g transform="translate(530, 260)">
            <circle cx="0" cy="0" r="14" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth="1" strokeDasharray="3,3" />
            <circle cx="0" cy="0" r="4" fill="#10b981" />
            <text x="8" y="4" fill="#6ee7b7" fontSize="8" fontWeight="bold">PATROL FOXTROT</text>
          </g>

          {/* Border Outposts (BOP Alpha & BOP Bravo) */}
          <g 
            transform="translate(190, 260)" 
            className="cursor-pointer group"
            onClick={() => handleAssetClick('BOP-ALPHA', 'CAM-02')}
          >
            <rect x="-14" y="-14" width="28" height="28" fill="#0f172a" stroke="#10b981" strokeWidth="2" rx="4" />
            <text x="0" y="4" fill="#10b981" fontSize="10" fontWeight="bold" textAnchor="middle">A</text>
            <text x="0" y="24" fill="#cbd5e1" fontSize="9" fontWeight="bold" textAnchor="middle">BOP ALPHA</text>
          </g>

          <g 
            transform="translate(570, 240)" 
            className="cursor-pointer group"
            onClick={() => handleAssetClick('BOP-BRAVO', 'CAM-08')}
          >
            <rect x="-14" y="-14" width="28" height="28" fill="#0f172a" stroke="#10b981" strokeWidth="2" rx="4" />
            <text x="0" y="4" fill="#10b981" fontSize="10" fontWeight="bold" textAnchor="middle">B</text>
            <text x="0" y="24" fill="#cbd5e1" fontSize="9" fontWeight="bold" textAnchor="middle">BOP BRAVO</text>
          </g>

          {/* Check Posts (CP-03, CP-04) */}
          <g 
            transform="translate(420, 160)" 
            className="cursor-pointer group"
            onClick={() => handleAssetClick('CP-03', 'CAM-03')}
          >
            <polygon points="0,-12 12,10 -12,10" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
            <text x="0" y="22" fill="#67e8f9" fontSize="9" fontWeight="bold" textAnchor="middle">CHECK POST 03</text>
          </g>

          <g 
            transform="translate(650, 310)" 
            className="cursor-pointer group"
            onClick={() => handleAssetClick('CP-04', 'CAM-11')}
          >
            <polygon points="0,-12 12,10 -12,10" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
            <text x="0" y="22" fill="#67e8f9" fontSize="9" fontWeight="bold" textAnchor="middle">CHECK POST 04</text>
          </g>

          {/* Detected Objects on Map */}
          {/* Person Intrusion Target P-021 near Zone 03 */}
          <g 
            transform="translate(260, 130)" 
            className="cursor-pointer animate-bounce"
            onClick={() => {
              handleAssetClick('TARGET-P021', 'CAM-07');
              if (onSelectIncident) onSelectIncident();
            }}
          >
            <circle cx="0" cy="0" r="16" fill="rgba(225, 29, 72, 0.3)" />
            <circle cx="0" cy="0" r="8" fill="#e11d48" className="animate-ping" />
            <circle cx="0" cy="0" r="5" fill="#ffffff" />
            <rect x="-35" y="-28" width="70" height="16" rx="2" fill="#881337" stroke="#f43f5e" strokeWidth="1" />
            <text x="0" y="-17" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">⚠ INTRUSION P-021</text>
          </g>

          {/* Suspicious Vehicle V-108 near Eastern Dune */}
          <g 
            transform="translate(690, 140)" 
            className="cursor-pointer"
            onClick={() => handleAssetClick('TARGET-V108', 'CAM-12')}
          >
            <rect x="-8" y="-6" width="16" height="12" rx="2" fill="#f59e0b" stroke="#fff" strokeWidth="1" />
            <text x="0" y="-10" fill="#fcd34d" fontSize="8" fontWeight="bold" textAnchor="middle">VEHICLE V-108</text>
          </g>

          {/* Camera Nodes */}
          {camerasOnMap.map((cam) => {
            const isSelected = selectedAsset === cam.id;
            const isAlert = cam.status === 'ALERT';
            return (
              <g 
                key={cam.id} 
                transform={`translate(${cam.x}, ${cam.y})`}
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={() => handleAssetClick(cam.id, cam.id)}
              >
                {/* Node Ring */}
                <circle 
                  cx="0" 
                  cy="0" 
                  r={isSelected ? "9" : "6"} 
                  fill={isAlert ? "#991b1b" : "#022c22"} 
                  stroke={isAlert ? "#f87171" : isSelected ? "#34d399" : "#10b981"} 
                  strokeWidth={isSelected ? "2.5" : "1.5"} 
                />
                <circle cx="0" cy="0" r="2.5" fill={isAlert ? "#fecaca" : "#a7f3d0"} />
                {/* Label */}
                <text 
                  x="0" 
                  y="-9" 
                  fill={isAlert ? "#fca5a5" : "#6ee7b7"} 
                  fontSize="8" 
                  fontWeight="bold" 
                  textAnchor="middle"
                >
                  {cam.id}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Asset Telemetry Box (Float) */}
        {selectedAsset && (
          <div className="absolute bottom-3 left-3 bg-[#0b0e14]/90 border border-emerald-500/40 rounded p-2.5 max-w-xs shadow-2xl backdrop-blur-sm z-20">
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400 mb-1 border-b border-slate-800 pb-1">
              <span>SELECTED: {selectedAsset}</span>
              <span className="text-[9px] px-1 bg-emerald-950 text-emerald-300 rounded">TELEMETRY</span>
            </div>
            <div className="text-[10px] space-y-0.5 text-slate-300">
              <div>COORDINATES: <span className="text-slate-400">32°14'18.4"N, 74°52'08.1"E</span></div>
              <div>RADAR COVERAGE: <span className="text-emerald-400">ACTIVE & INTERCEPT READY</span></div>
              {selectedAsset === 'CAM-07' || selectedAsset === 'TARGET-P021' ? (
                <div className="text-rose-400 font-bold animate-pulse pt-0.5">
                  STATUS: CRITICAL VIRTUAL FENCE BREACH
                </div>
              ) : (
                <div className="text-emerald-400 font-semibold pt-0.5">STATUS: ALL CLEAR</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Map Legend (Bottom) */}
      <div className="bg-[#090c10] border-t border-slate-800 p-2.5 flex flex-wrap items-center justify-between gap-3 z-20">
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-semibold">
          <span className="text-slate-500 uppercase tracking-widest text-[10px]">LEGEND:</span>
          
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-200" />
            <span>CCTV (24)</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-300">
            <span className="w-3 h-3 rounded-sm bg-slate-900 border border-emerald-400 flex items-center justify-center text-[8px]">A</span>
            <span>BOP (Alpha/Bravo)</span>
          </div>

          <div className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-cyan-400" />
            <span>CHECK POST (03/04)</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-300">
            <span className="w-2.5 h-2.5 rounded-full border border-dashed border-emerald-400" />
            <span>PATROL ZONE</span>
          </div>

          <div className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
            <span>INTRUSION (Zone 03)</span>
          </div>

          <div className="flex items-center gap-1.5 text-amber-400">
            <span className="w-3 h-2 rounded bg-amber-500" />
            <span>VEHICLE</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-slate-200" />
            <span>PERSON</span>
          </div>
        </div>

        <div className="text-[10px] text-slate-500">
          Click any camera or post icon to jump into live feed
        </div>
      </div>
    </div>
  );
};
