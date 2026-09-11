import React, { useState } from 'react';
import { CameraFeedInfo } from '../types';
import { TacticalCameraFeed } from '../components/TacticalCameraFeed';
import { 
  Users, 
  Crosshair, 
  Compass, 
  Activity, 
  BarChart3, 
  Clock, 
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { HOURLY_DETECTION_STATS } from '../data/mockData';

interface HumanDetectionViewProps {
  cameras: CameraFeedInfo[];
}

export const HumanDetectionView: React.FC<HumanDetectionViewProps> = ({ cameras }) => {
  const targetCam = cameras.find(c => c.id === 'CAM-01') || cameras[0];

  const detectedPersons = [
    {
      id: 'P-001',
      type: 'PERSON',
      confidence: 97,
      direction: 'MOVING EAST',
      velocity: '1.4 m/s',
      status: 'MOBILE',
      posture: 'Walking',
      timeInZone: '04m 12s',
      color: 'border-emerald-500 text-emerald-400',
    },
    {
      id: 'P-002',
      type: 'PERSON',
      confidence: 94,
      direction: 'STATIONARY',
      velocity: '0.0 m/s',
      status: 'OBSERVING',
      posture: 'Standing',
      timeInZone: '11m 45s',
      color: 'border-amber-500 text-amber-400',
    },
    {
      id: 'P-024',
      type: 'PERSON',
      confidence: 98,
      direction: 'MOVING NORTH-WEST',
      velocity: '2.1 m/s',
      status: 'PATROL PASS',
      posture: 'Brisk March',
      timeInZone: '01m 50s',
      color: 'border-emerald-500 text-emerald-400',
    },
    {
      id: 'P-038',
      type: 'PERSON',
      confidence: 91,
      direction: 'MOVING SOUTH',
      velocity: '0.8 m/s',
      status: 'LOW PROFILE',
      posture: 'Crouched',
      timeInZone: '06m 22s',
      color: 'border-rose-500 text-rose-400',
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-mono text-xs">
      {/* Top Banner */}
      <div className="bg-[#090c10] border border-slate-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base text-slate-100 uppercase tracking-wider">
              HUMAN DETECTION & MULTI-TARGET TRACKING (BYTETRACK)
            </h2>
            <p className="text-slate-400 text-[11px]">
              Continuous trajectory estimation, velocity metrics, posture recognition, and occlusion management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <div className="text-right">
            <div className="text-slate-400">ACTIVE TRACKS</div>
            <div className="text-emerald-400 font-bold text-sm">4 PERSONNEL</div>
          </div>
          <div className="text-right">
            <div className="text-slate-400">AVERAGE CONFIDENCE</div>
            <div className="text-emerald-400 font-bold text-sm">95.0%</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Video Feed + Target Telemetry Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Feed (2 Columns) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="h-[460px] w-full">
            <TacticalCameraFeed
              camera={targetCam}
              isPrimary={true}
              showAiOverlayDefault={true}
            />
          </div>
          <div className="text-slate-400 text-[11px] flex justify-between px-1">
            <span>FEED: {targetCam.id} • {targetCam.name}</span>
            <span className="text-emerald-400">NEURAL RECOGNITION: PARALLEL YOLOV8-X</span>
          </div>
        </div>

        {/* Real-time Target Trackers List (1 Column) */}
        <div className="space-y-3">
          <div className="bg-[#080a0e] border border-slate-800 rounded-lg p-3 flex flex-col h-full max-h-[500px]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <span className="font-bold text-slate-200">IDENTIFIED TARGET OBJECTS</span>
              <span className="text-emerald-400 text-[10px]">LIVE VECTOR MATRIX</span>
            </div>

            <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
              {detectedPersons.map((p) => (
                <div 
                  key={p.id}
                  className="bg-slate-900/70 border border-slate-800 p-3 rounded hover:border-emerald-500/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-emerald-400 text-sm">{p.id}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-slate-300 font-semibold text-[10px]">
                      CONF: {p.confidence}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                    <div>
                      <span className="text-slate-500 block text-[10px]">MOTION:</span>
                      <strong className="text-slate-200">{p.direction}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">VELOCITY:</span>
                      <strong className="text-emerald-400">{p.velocity}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">POSTURE:</span>
                      <span>{p.posture}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">TIME IN ZONE:</span>
                      <span>{p.timeInZone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* People Detection Statistics Chart (Detections Per Hour) */}
      <div className="bg-[#090c10] border border-slate-800 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <h3 className="font-display font-bold text-sm text-slate-100 uppercase tracking-wider">
              PEOPLE DETECTIONS PER HOUR (TODAY'S HOURLY PROFILE)
            </h3>
          </div>
          <span className="text-slate-400 text-[11px]">PEAK: 14:00 (27 Detections)</span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={HOURLY_DETECTION_STATS}>
              <defs>
                <linearGradient id="colorPeople" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0b0e14', borderColor: '#10b981', fontSize: 11 }} 
                itemStyle={{ color: '#6ee7b7' }}
              />
              <Area 
                type="monotone" 
                dataKey="people" 
                stroke="#10b981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorPeople)" 
                name="Personnel Detections"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
