import React, { useState } from 'react';
import { 
  CameraFeedInfo, 
  DetectedEntity 
} from '../types';
import { TacticalCameraFeed } from '../components/TacticalCameraFeed';
import { 
  Video, 
  Grid, 
  Square, 
  Layers, 
  Sliders, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Compass, 
  Maximize2,
  ChevronRight,
  Filter,
  Play,
  RotateCcw
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface LiveSurveillanceViewProps {
  cameras: CameraFeedInfo[];
  selectedCamera: CameraFeedInfo;
  onSelectCamera: (camera: CameraFeedInfo) => void;
}

export const LiveSurveillanceView: React.FC<LiveSurveillanceViewProps> = ({
  cameras = [],
  selectedCamera,
  onSelectCamera,
}) => {
  const [layoutMode, setLayoutMode] = useState<'single' | 'grid-4' | 'grid-6'>('single');
  const [activeFilter, setActiveFilter] = useState<'all' | 'person' | 'vehicle' | 'fence'>('all');
  const [timelineTime, setTimelineTime] = useState('16:21:42');

  const timelineEvents = [
    { time: '16:00:15', label: 'CAM-01: Routine Patrol Pass', type: 'info' },
    { time: '16:05:30', label: 'CAM-03: Unrecognized Face Scan', type: 'warning' },
    { time: '16:12:08', label: 'CAM-19: Night Thermal Motion Anomaly', type: 'warning' },
    { time: '16:18:15', label: 'CAM-12: Unregistered Vehicle Detected', type: 'warning' },
    { time: '16:21:42', label: 'CAM-07: VIRTUAL FENCE BREACH (ZONE 03)', type: 'critical' },
  ];

  const onlineCameras = cameras.filter(c => c.status === 'ONLINE');

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto font-mono text-xs">
      {/* Top Controls Bar */}
      <div className="bg-[#090c10] border border-slate-800 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-display font-bold text-sm text-slate-100 uppercase tracking-wider">
              TACTICAL SURVEILLANCE SUITE
            </span>
          </div>
          <span className="hidden md:inline px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/40 text-[10px]">
            ACTIVE STREAM: {selectedCamera.id} [{selectedCamera.name}]
          </span>
        </div>

        {/* Layout Selectors & Quick Filters */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded p-0.5">
            <button
              onClick={() => {
                soundEngine.playActionConfirm();
                setLayoutMode('single');
              }}
              className={`px-2 py-1 rounded flex items-center gap-1 cursor-pointer transition-colors ${
                layoutMode === 'single' ? 'bg-emerald-600 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Square className="w-3.5 h-3.5" />
              <span>FOCUSED</span>
            </button>
            <button
              onClick={() => {
                soundEngine.playActionConfirm();
                setLayoutMode('grid-4');
              }}
              className={`px-2 py-1 rounded flex items-center gap-1 cursor-pointer transition-colors ${
                layoutMode === 'grid-4' ? 'bg-emerald-600 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>2×2 QUAD</span>
            </button>
            <button
              onClick={() => {
                soundEngine.playActionConfirm();
                setLayoutMode('grid-6');
              }}
              className={`px-2 py-1 rounded flex items-center gap-1 cursor-pointer transition-colors ${
                layoutMode === 'grid-6' ? 'bg-emerald-600 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>3×2 MATRIX</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Center Stage */}
      {layoutMode === 'single' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main Primary Video Viewer (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="h-[480px] sm:h-[540px] w-full">
              <TacticalCameraFeed
                camera={selectedCamera}
                isPrimary={true}
                showControls={true}
                showAiOverlayDefault={true}
                showVirtualFence={selectedCamera.id === 'CAM-07'}
                virtualFenceBreached={selectedCamera.id === 'CAM-07'}
              />
            </div>

            {/* Event Timeline Scrubber beneath Video */}
            <div className="bg-[#080a0e] border border-slate-800 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-bold text-slate-200">REAL-TIME INCIDENT EVENT SCRUBBER</span>
                </div>
                <span className="text-emerald-400 font-bold">CURRENT SYNC: {timelineTime}</span>
              </div>

              {/* Graphical Timeline Bar */}
              <div className="relative w-full h-8 bg-slate-950 rounded border border-slate-800 flex items-center px-4 overflow-hidden">
                {/* Horizontal Guide Line */}
                <div className="w-full h-0.5 bg-slate-800" />

                {/* Event Markers on Timeline */}
                {timelineEvents.map((evt, idx) => {
                  const leftPercent = 15 + idx * 18;
                  const isCritical = evt.type === 'critical';
                  const isWarning = evt.type === 'warning';
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        soundEngine.playRadarPing();
                        setTimelineTime(evt.time);
                      }}
                      className="absolute group cursor-pointer -translate-x-1/2 flex flex-col items-center"
                      style={{ left: `${leftPercent}%` }}
                    >
                      <div className={`w-3 h-3 rounded-full border ${
                        isCritical 
                          ? 'bg-rose-600 border-white animate-ping' 
                          : isWarning 
                          ? 'bg-amber-500 border-amber-200' 
                          : 'bg-emerald-500 border-emerald-200'
                      }`} />
                      <span className="text-[9px] text-slate-400 mt-1 font-mono">
                        {evt.time}
                      </span>

                      {/* Tooltip on hover */}
                      <div className="absolute bottom-6 hidden group-hover:block bg-black/90 border border-slate-700 text-slate-200 p-1.5 rounded whitespace-nowrap text-[10px] z-30 shadow-xl">
                        {evt.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Camera Switcher Selector & Live Telemetry */}
          <div className="space-y-3">
            <div className="bg-[#080a0e] border border-slate-800 rounded-lg p-3 flex flex-col h-full max-h-[640px]">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="font-bold text-slate-200">FIELD SENSORS</span>
                <span className="text-[10px] text-emerald-400 font-semibold">{onlineCameras.length} ONLINE</span>
              </div>

              {/* Camera List */}
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                {cameras.map((cam) => {
                  const isSelected = selectedCamera.id === cam.id;
                  const isOnline = cam.status === 'ONLINE';
                  return (
                    <div
                      key={cam.id}
                      onClick={() => {
                        soundEngine.playActionConfirm();
                        onSelectCamera(cam);
                      }}
                      className={`p-2 rounded border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-emerald-950/80 border-emerald-500/70 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                          : isOnline
                          ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                          : 'bg-rose-950/20 border-rose-900/40 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-emerald-400 text-[11px]">{cam.id}</span>
                        <span className={`text-[9px] px-1 rounded ${
                          isOnline ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                        }`}>
                          {cam.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 font-medium truncate">{cam.name}</div>
                      <div className="text-[10px] text-slate-500 flex justify-between mt-1">
                        <span>{cam.type}</span>
                        <span>{cam.resolution} • {cam.fps} FPS</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick AI Telemetry Box */}
              <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>ByteTrack Latency:</span>
                  <span className="text-emerald-400 font-bold">14.2 ms</span>
                </div>
                <div className="flex justify-between">
                  <span>YOLOv8 Inferencing:</span>
                  <span className="text-emerald-400 font-bold">28.4 ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Frame Dropped:</span>
                  <span className="text-slate-300 font-bold">0.00%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Multi-Camera Grid Mode (Quad / Matrix) */
        <div className={`grid gap-3 ${layoutMode === 'grid-4' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
          {onlineCameras.slice(0, layoutMode === 'grid-4' ? 4 : 6).map((cam) => (
            <div key={cam.id} className="h-72">
              <TacticalCameraFeed
                camera={cam}
                isPrimary={false}
                showControls={true}
                showAiOverlayDefault={true}
                onSelect={() => onSelectCamera(cam)}
                showVirtualFence={cam.id === 'CAM-07'}
                virtualFenceBreached={cam.id === 'CAM-07'}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
