import React, { useState, useEffect, useRef } from 'react';
import { CameraFeedInfo } from '../types';
import { 
  ScanFace, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Info,
  Search,
  UserCheck,
  UserX,
  Eye,
  Crosshair,
  Layers,
  Upload,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Cpu,
  Target,
  Bell,
  Sliders,
  Maximize2
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface FaceDetectionViewProps {
  cameras?: CameraFeedInfo[];
}

interface FaceTrackingTarget {
  id: string;
  trackingCode: string;
  name: string;
  confidence: number;
  status: 'KNOWN MATCH' | 'UNKNOWN' | 'WATCHLIST' | 'ACQUIRING';
  clearance: string;
  boxX: number; // percentage
  boxY: number; // percentage
  boxW: number; // percentage
  boxH: number; // percentage
  embeddingDist: number;
  irisGaze: string;
  timestamp: string;
}

export const FaceDetectionView: React.FC<FaceDetectionViewProps> = ({ cameras = [] }) => {
  const [videoSrc, setVideoSrc] = useState<string>('/videos/cctv-base-perimeter.mp4');
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showAiBoxes, setShowAiBoxes] = useState(true);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [activeNotification, setActiveNotification] = useState<{
    id: string;
    trackingId: string;
    confidence: number;
    timestamp: string;
    status: string;
  } | null>(null);

  const [notificationCount, setNotificationCount] = useState(1);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [liveTimestamp, setLiveTimestamp] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const notificationTimeoutRef = useRef<number | null>(null);

  // Live real-time CCTV clock update
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10);
      const timeStr = now.toTimeString().slice(0, 8);
      const ms = Math.floor(now.getMilliseconds() / 10).toString().padStart(2, '0');
      setLiveTimestamp(`${dateStr} ${timeStr}.${ms} IST REC`);
    };
    updateClock();
    const interval = setInterval(updateClock, 40);
    return () => clearInterval(interval);
  }, []);

  // Primary detected face simulation synchronized with video time
  // Target walking across: starts left, looks at camera at 2.4s - 3.8s, exits right
  const [primaryTarget, setPrimaryTarget] = useState<FaceTrackingTarget>({
    id: 'TGT-001',
    trackingCode: 'FACE-001',
    name: 'UNREGISTERED VISITOR',
    confidence: 96.8,
    status: 'UNKNOWN',
    clearance: 'LEVEL 0 (CIVILIAN - NO PASS)',
    boxX: 52,
    boxY: 48,
    boxW: 8.5,
    boxH: 12.5,
    embeddingDist: 0.942,
    irisGaze: 'DIRECT OPTICAL ENGAGEMENT',
    timestamp: '19:02:22'
  });

  // Secondary historic/distant target
  const secondaryTarget: FaceTrackingTarget = {
    id: 'TGT-002',
    trackingCode: 'FACE-002',
    name: 'HAVILDAR R. PRAKASH',
    confidence: 94.2,
    status: 'KNOWN MATCH',
    clearance: 'LEVEL 3 (PERIMETER PATROL BATTALION)',
    boxX: 18,
    boxY: 36,
    boxW: 4.5,
    boxH: 6.5,
    embeddingDist: 0.284,
    irisGaze: 'PERIPHERAL DEFLECTION',
    timestamp: '19:01:45'
  };

  // Video timeupdate handler to dynamically track bounding box positions & fire notifications
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    setCurrentTimeMs(time);

    // Assuming a ~4.0 second loop
    const duration = videoRef.current.duration || 4.0;
    const norm = (time % duration) / duration; // 0.0 to 1.0

    // Compute bounding box coordinates based on subject's path along sidewalk
    // Head position interpolates from left (x: 12%) to right (x: 84%)
    const posX = 8 + norm * 76;
    const posY = 46 + Math.sin(norm * Math.PI * 4) * 2; // subtle bobbing

    // Look at camera occurs between norm 0.45 and 0.75
    const isEngagingCamera = norm >= 0.40 && norm <= 0.72;
    const currentConf = isEngagingCamera ? +(96.0 + Math.sin(norm * 20) * 2.8).toFixed(1) : +(91.5 + Math.random() * 1.5).toFixed(1);

    setPrimaryTarget(prev => ({
      ...prev,
      boxX: posX,
      boxY: posY,
      confidence: currentConf,
      status: 'UNKNOWN',
      irisGaze: isEngagingCamera ? 'DIRECT OPTICAL ENGAGEMENT' : 'TRAVEL VECTOR FORWARD'
    }));

    // Trigger notification when person faces camera
    if (isEngagingCamera && (!activeNotification || activeNotification.trackingId !== 'FACE-001')) {
      const newNotif = {
        id: `NOTIF-${Date.now()}`,
        trackingId: 'FACE-001',
        confidence: currentConf,
        timestamp: new Date().toLocaleTimeString(),
        status: 'UNREGISTERED VISITOR DETECTED'
      };
      setActiveNotification(newNotif);
      setNotificationCount(c => c + 1);
      soundEngine.playAlertSound('MEDIUM');

      // Auto dismiss notification after 4 seconds
      if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
      notificationTimeoutRef.current = window.setTimeout(() => {
        setActiveNotification(null);
      }, 4000);
    }
  };

  // Fallback animation canvas if video fails or is loading
  useEffect(() => {
    if (!videoError && videoLoaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const render = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;
      const t = (frame % 180) / 180;

      // Background
      ctx.fillStyle = '#1c241e';
      ctx.fillRect(0, 0, w, h);

      // Distant perimeter wall
      ctx.fillStyle = '#6e7066';
      ctx.fillRect(0, h * 0.22, w, h * 0.20);

      // Military transport truck
      ctx.fillStyle = '#3a4435';
      ctx.fillRect(w * 0.1, h * 0.16, w * 0.24, h * 0.22);
      ctx.fillStyle = '#485642';
      ctx.fillRect(w * 0.58, h * 0.14, w * 0.26, h * 0.24);

      // Concrete jersey barriers
      ctx.fillStyle = '#8f9187';
      ctx.fillRect(0, h * 0.48, w * 0.46, h * 0.16);
      ctx.fillRect(w * 0.50, h * 0.48, w * 0.50, h * 0.16);

      // Sidewalk
      ctx.fillStyle = '#383a35';
      ctx.fillRect(0, h * 0.64, w, h * 0.36);

      // Walking subject
      const subX = w * (0.1 + t * 0.78);
      const subY = h * 0.58;

      // Torso
      ctx.fillStyle = '#18191c';
      ctx.fillRect(subX - 18, subY + 20, 36, 60);

      // Head
      ctx.fillStyle = '#ba8b67';
      ctx.beginPath();
      ctx.ellipse(subX, subY, 14, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      // Hair
      ctx.fillStyle = '#151412';
      ctx.beginPath();
      ctx.arc(subX, subY - 4, 15, Math.PI, 0);
      ctx.fill();

      // Scanlines & noise
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 1;
      for (let y = 0; y < h; y += 8) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [videoError, videoLoaded]);

  // Handle local user-uploaded video
  const handleCustomVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      soundEngine.playActionConfirm();
      const objectUrl = URL.createObjectURL(file);
      setVideoSrc(objectUrl);
      setVideoError(false);
      setVideoLoaded(false);
      if (videoRef.current) {
        videoRef.current.load();
        videoRef.current.play().catch(() => {});
      }
    }
  };

  const togglePlayback = () => {
    soundEngine.playBeep(800, 'sine', 0.05, 0.04);
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const restartPlayback = () => {
    soundEngine.playActionConfirm();
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().catch(() => {});
    setIsPlaying(true);
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-7xl mx-auto font-mono text-xs text-slate-100">
      {/* Top Protocol / Disclaimer Banner */}
      <div className="bg-cyan-950/40 border border-cyan-500/40 rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-3 text-cyan-300">
        <div className="flex items-center gap-2.5">
          <Info className="w-5 h-5 shrink-0 text-cyan-400" />
          <div className="text-[11px] leading-relaxed">
            <span className="font-bold text-cyan-200">MILITARY BIOMETRIC PROTOCOL ACTIVE:</span> Real-time AI Face Detection & Recognition core running on ONVIF CCTV stream. All identities, biometric hashes, and clearance tiers are strictly fictional simulation assets.
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            AI INFERENCE: 30 FPS
          </span>
        </div>
      </div>

      {/* Main 2-Column Command Layout: Video Surveillance Feed + Face Detection Analysis Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left / Center: Primary Video Surveillance Screen (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          {/* Tactical Video Player Container */}
          <div className="relative w-full aspect-video sm:h-[480px] bg-[#05070a] rounded-lg border border-emerald-950/80 shadow-2xl overflow-hidden group select-none">
            {/* Real Video Element */}
            {!videoError && (
              <video
                ref={videoRef}
                src={videoSrc}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                onTimeUpdate={handleTimeUpdate}
                onError={() => {
                  console.warn('Video failed to load, activating fallback canvas');
                  setVideoError(true);
                }}
                onLoadedData={() => setVideoLoaded(true)}
              />
            )}

            {/* Fallback Canvas if video error occurs */}
            {videoError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#070a0e]">
                <canvas 
                  ref={canvasRef} 
                  width={1280} 
                  height={720} 
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute top-3 left-3 bg-amber-950/90 border border-amber-600/80 px-2.5 py-1 rounded text-amber-300 text-[10px] font-bold">
                  FALLBACK TACTICAL SIMULATION STREAM ACTIVE
                </div>
              </div>
            )}

            {/* Tactical Grid / Reticle Layer */}
            <div className="absolute inset-0 tactical-grid opacity-20 pointer-events-none" />

            {/* Corner HUD Bracket Accents */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-500/80 pointer-events-none" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-500/80 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-500/80 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-500/80 pointer-events-none" />

            {/* Top Bar CCTV Overlay */}
            <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/85 via-black/40 to-transparent p-3 flex items-start justify-between text-[11px] font-mono pointer-events-none">
              <div className="flex items-center gap-2 text-slate-200">
                <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 font-bold">
                  CAM-05
                </span>
                <span className="font-semibold tracking-wider text-slate-300">
                  BASE PERIMETER GATE
                </span>
                <span className="text-slate-500 hidden sm:inline">|</span>
                <span className="text-slate-400 hidden sm:inline">SECTOR 07 NORTH PERIMETER</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-950/80 border border-rose-600/60 text-rose-300 font-bold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  REC
                </span>
                <span className="bg-slate-900/90 border border-slate-700 px-2 py-0.5 rounded text-cyan-400 font-bold hidden sm:inline">
                  AI: ACTIVE
                </span>
              </div>
            </div>

            {/* Real-Time Face Detection Event Toast Notification (Requested) */}
            {activeNotification && (
              <div className="absolute top-12 right-3 z-30 max-w-xs bg-slate-950/90 border border-amber-500/80 text-amber-300 p-2.5 rounded shadow-2xl animate-bounce pointer-events-auto backdrop-blur-md">
                <div className="flex items-center justify-between gap-2 border-b border-amber-800/60 pb-1 mb-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-[11px]">
                    <Bell className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                    <span>FACE DETECTED — {activeNotification.trackingId}</span>
                  </div>
                  <span className="text-[9px] bg-amber-900/80 px-1 py-0.2 rounded text-amber-100 font-bold">
                    ALERT #{notificationCount}
                  </span>
                </div>
                <div className="text-[10px] space-y-0.5 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Confidence:</span>
                    <span className="font-bold text-emerald-400">{activeNotification.confidence}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="text-slate-200">CAM-05 BASE GATE</span>
                  </div>
                  <div className="text-amber-400 font-semibold text-[10px] mt-1 pt-1 border-t border-slate-800">
                    STATUS: {activeNotification.status}
                  </div>
                </div>
              </div>
            )}

            {/* Animated Face-Detection Bounding Box: Primary Target (FACE-001) */}
            {showAiBoxes && (
              <div
                className="absolute border-2 border-emerald-400 rounded-sm shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-200 pointer-events-none"
                style={{
                  left: `${primaryTarget.boxX}%`,
                  top: `${primaryTarget.boxY}%`,
                  width: `${primaryTarget.boxW}%`,
                  height: `${primaryTarget.boxH}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Tactical Reticle Corners */}
                <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-white" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-white" />
                <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-white" />
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-white" />

                {/* Center Crosshair */}
                <div className="absolute inset-0 flex items-center justify-center opacity-70">
                  <Crosshair className="w-4 h-4 text-emerald-300 stroke-[1.5]" />
                </div>

                {/* Simulated 5-point facial landmark grid */}
                {showLandmarks && (
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Left Eye */}
                    <span className="absolute top-[35%] left-[30%] w-1 h-1 rounded-full bg-cyan-300 shadow-[0_0_4px_cyan]" />
                    {/* Right Eye */}
                    <span className="absolute top-[35%] right-[30%] w-1 h-1 rounded-full bg-cyan-300 shadow-[0_0_4px_cyan]" />
                    {/* Nose Tip */}
                    <span className="absolute top-[52%] left-[50%] -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-300" />
                    {/* Mouth Left */}
                    <span className="absolute top-[72%] left-[36%] w-1 h-1 rounded-full bg-amber-300" />
                    {/* Mouth Right */}
                    <span className="absolute top-[72%] right-[36%] w-1 h-1 rounded-full bg-amber-300" />
                  </div>
                )}

                {/* Scanning sweep beam effect */}
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-300 to-transparent animate-pulse top-1/2" />

                {/* Floating HUD Tag with Tracking ID and Confidence */}
                <div className="absolute -top-7 left-0 bg-[#090e14]/95 border border-emerald-500/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-emerald-300 whitespace-nowrap shadow-lg flex items-center gap-1.5">
                  <span className="font-bold text-white">{primaryTarget.trackingCode}</span>
                  <span className="text-emerald-400 font-semibold">{primaryTarget.confidence}%</span>
                  <span className="px-1 py-0.1 bg-amber-950/80 border border-amber-600/60 text-amber-300 text-[8px] font-bold rounded">
                    UNKNOWN
                  </span>
                </div>

                {/* Bottom detail pill */}
                <div className="absolute -bottom-5 left-0 text-[8px] font-mono text-slate-400 whitespace-nowrap bg-black/80 px-1 rounded border border-slate-800">
                  DIST: {primaryTarget.embeddingDist} • GAZE: ENGAGED
                </div>
              </div>
            )}

            {/* Bottom Realistic CCTV Timestamp & Camera ID Overlay (Burn-in Style) */}
            <div className="absolute bottom-2 right-3 font-mono text-[11px] sm:text-xs text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-right pointer-events-none font-bold tracking-wider">
              <div>CAM-05 | BASE_PERIMETER_GATE</div>
              <div className="text-emerald-300">{liveTimestamp || '2026-09-11 19:02:19.42 IST REC'}</div>
            </div>

            {/* Bottom Left Stream Metadata */}
            <div className="absolute bottom-2 left-3 font-mono text-[10px] text-slate-300/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] pointer-events-none hidden sm:block">
              <div>H.264 • 1920x1080@30FPS • BITRATE: 4.2 MBPS</div>
              <div className="text-emerald-400">FPS: 30.0 • LATENCY: 38ms • LOSS: 0.0%</div>
            </div>
          </div>

          {/* Video Control Bar & Custom Video File Loader */}
          <div className="bg-[#090c10] border border-slate-800 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Playback Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlayback}
                className="flex items-center gap-1 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-colors cursor-pointer"
                title={isPlaying ? 'Pause Feed' : 'Resume Playback'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                <span className="font-semibold">{isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>

              <button
                onClick={restartPlayback}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
                title="Restart Video Loop"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">RESTART</span>
              </button>

              {/* Toggle Overlays */}
              <button
                onClick={() => {
                  soundEngine.playActionConfirm();
                  setShowAiBoxes(!showAiBoxes);
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded border transition-colors cursor-pointer ${
                  showAiBoxes 
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' 
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
                title="Toggle AI Bounding Box Overlays"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-semibold">BOUNDING BOXES</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playActionConfirm();
                  setShowLandmarks(!showLandmarks);
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded border transition-colors cursor-pointer ${
                  showLandmarks 
                    ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300' 
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
                title="Toggle 68-Point Facial Landmarks"
              >
                <ScanFace className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-semibold">LANDMARKS</span>
              </button>
            </div>

            {/* Custom Video Upload / Selector */}
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleCustomVideoUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 hover:bg-emerald-950/60 border border-slate-700 hover:border-emerald-500/50 text-slate-200 hover:text-emerald-300 transition-colors cursor-pointer"
                title="Select a custom CCTV video file (.mp4, .webm) from your device"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold">LOAD CUSTOM CCTV VIDEO</span>
              </button>

              {videoSrc !== '/videos/cctv-base-perimeter.mp4' && (
                <button
                  onClick={() => {
                    soundEngine.playActionConfirm();
                    setVideoSrc('/videos/cctv-base-perimeter.mp4');
                    setVideoError(false);
                    setVideoLoaded(false);
                  }}
                  className="px-2 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] text-slate-400 hover:text-white"
                  title="Reset to default Base Perimeter Gate CCTV video"
                >
                  RESET
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar directly underneath video feed */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#090c10] border border-slate-800 p-3 rounded-lg">
              <div className="text-slate-400 text-[10px] uppercase">FACES DETECTED</div>
              <div className="text-xl font-bold text-slate-100 mt-1 flex items-baseline gap-1.5">
                <span>01</span>
                <span className="text-[10px] text-emerald-400 font-normal">Active (34 Today)</span>
              </div>
            </div>

            <div className="bg-[#090c10] border border-slate-800 p-3 rounded-lg">
              <div className="text-slate-400 text-[10px] uppercase">KNOWN MATCHES</div>
              <div className="text-xl font-bold text-emerald-400 mt-1 flex items-baseline gap-1.5">
                <span>29</span>
                <span className="text-[10px] text-slate-500 font-normal">Verified 85.3%</span>
              </div>
            </div>

            <div className="bg-[#090c10] border border-slate-800 p-3 rounded-lg">
              <div className="text-slate-400 text-[10px] uppercase">UNKNOWN FACES</div>
              <div className="text-xl font-bold text-amber-400 mt-1 flex items-baseline gap-1.5">
                <span>05</span>
                <span className="text-[10px] text-amber-400/80 font-normal">Manual Review</span>
              </div>
            </div>

            <div className="bg-[#090c10] border border-slate-800 p-3 rounded-lg">
              <div className="text-slate-400 text-[10px] uppercase">HIGHEST CONFIDENCE</div>
              <div className="text-xl font-bold text-cyan-400 mt-1 flex items-baseline gap-1.5">
                <span>98.4%</span>
                <span className="text-[10px] text-cyan-300/80 font-normal">FACE-001</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Face Detection Analysis Panel (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {/* Main Analysis Card */}
          <div className="bg-[#080a0e] border border-slate-800 rounded-lg p-4 flex flex-col space-y-4 shadow-xl">
            {/* Panel Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ScanFace className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-slate-100 tracking-wider">
                  FACE DETECTION ANALYSIS
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700/60 text-emerald-400 text-[10px] font-bold">
                LIVE TELEMETRY
              </span>
            </div>

            {/* Active Target Deep Dive Card (FACE-001) */}
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-lg p-3 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-600/80 text-emerald-300 font-bold text-xs">
                      {primaryTarget.trackingCode}
                    </span>
                    <span className="text-slate-400 text-[10px]">CURRENT TRACKING ID</span>
                  </div>
                  <div className="font-bold text-slate-100 text-sm mt-1">
                    {primaryTarget.name}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-emerald-400 font-bold text-base">
                    {primaryTarget.confidence}%
                  </div>
                  <div className="text-[9px] text-slate-400">CONFIDENCE</div>
                </div>
              </div>

              {/* Status Pill & Clearance */}
              <div className="space-y-1.5 bg-black/40 p-2.5 rounded border border-slate-800">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Identity Status:</span>
                  <span className="px-2 py-0.5 rounded bg-amber-950/90 border border-amber-600/80 text-amber-300 font-bold text-[10px]">
                    UNKNOWN SUBJECT (NO EMBEDDING MATCH)
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Clearance Tier:</span>
                  <span className="text-slate-300 font-medium">{primaryTarget.clearance}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Gaze Orientation:</span>
                  <span className="text-cyan-400 font-semibold">{primaryTarget.irisGaze}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Sensor / Camera:</span>
                  <span className="text-slate-200">CAM-05 (BASE PERIMETER GATE)</span>
                </div>
              </div>

              {/* Biometric Vector Matrix */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Cosine Similarity Distance:</span>
                  <span className="text-amber-400 font-bold">{primaryTarget.embeddingDist} (Threshold &lt; 0.60)</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, primaryTarget.embeddingDist * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-slate-500 pt-0.5">
                  <span>0.00 (Exact Match)</span>
                  <span>0.60 (Cutoff)</span>
                  <span>1.00 (Alien)</span>
                </div>
              </div>

              {/* Action Buttons for the Active Target */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    soundEngine.playActionConfirm();
                    alert(`[SIMULATED DISPATCH] Security Guard Dispatched to CAM-05 Perimeter Gate for Subject ${primaryTarget.trackingCode}.`);
                  }}
                  className="px-2.5 py-1.5 rounded bg-amber-950/80 hover:bg-amber-900 border border-amber-600/70 text-amber-200 font-bold text-[10px] transition-colors cursor-pointer text-center"
                >
                  DISPATCH SENTRY
                </button>

                <button
                  onClick={() => {
                    soundEngine.playActionConfirm();
                    alert(`[SIMULATED BIOMETRIC CAPTURE] Embedding vector for ${primaryTarget.trackingCode} logged to Sector 07 Forensic Registry.`);
                  }}
                  className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold text-[10px] transition-colors cursor-pointer text-center"
                >
                  LOG BIOMETRIC
                </button>
              </div>
            </div>

            {/* Current Tracking IDs List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-300 font-bold border-b border-slate-800 pb-1">
                <span>ACTIVE & RECENT TRACKING IDs</span>
                <span className="text-[10px] text-slate-500">REAL-TIME MULTI-TARGET</span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                {/* Target 1 */}
                <div className="p-2.5 rounded bg-slate-900/60 border border-emerald-900/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400">{primaryTarget.trackingCode}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-700 font-bold">
                      ACTIVE • UNKNOWN
                    </span>
                  </div>
                  <div className="text-slate-300 text-[11px] font-semibold">{primaryTarget.name}</div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>CAM-05 Gate</span>
                    <span className="text-emerald-400 font-bold">{primaryTarget.confidence}% Conf</span>
                  </div>
                </div>

                {/* Target 2 */}
                <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-300">{secondaryTarget.trackingCode}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold">
                      KNOWN MATCH
                    </span>
                  </div>
                  <div className="text-slate-300 text-[11px] font-semibold">{secondaryTarget.name}</div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>CAM-02 BOP Entrance</span>
                    <span className="text-emerald-400 font-bold">{secondaryTarget.confidence}% Conf</span>
                  </div>
                </div>

                {/* Target 3 */}
                <div className="p-2.5 rounded bg-slate-900/40 border border-slate-800/80 space-y-1 opacity-80">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-400">FACE-003</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 font-bold">
                      HISTORIC LOG
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px]">CIVILIAN LOGISTICS OPERATOR</div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>CAM-06 Checkpoint</span>
                    <span>91.8% Conf</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
