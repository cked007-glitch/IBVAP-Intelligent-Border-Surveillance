import React from 'react';
import { CameraFeedInfo } from '../types';
import { TacticalCameraFeed } from '../components/TacticalCameraFeed';
import { 
  Car, 
  Truck, 
  Bus, 
  HelpCircle, 
  Activity, 
  BarChart3, 
  Gauge, 
  ShieldCheck 
} from 'lucide-react';
import { VEHICLE_CLASSIFICATION_STATS } from '../data/mockData';

interface VehicleDetectionViewProps {
  cameras: CameraFeedInfo[];
}

export const VehicleDetectionView: React.FC<VehicleDetectionViewProps> = ({ cameras }) => {
  const vehicleCam = cameras.find(c => c.id === 'CAM-06') || cameras[0];

  const recentVehicleDetections = [
    {
      id: 'V-108',
      type: 'Unknown (4x4 Pickup)',
      category: 'Unknown',
      confidence: 94.2,
      camera: 'CAM-12',
      speed: '28 km/h',
      status: 'SUSPICIOUS - STATIONARY',
      plate: 'UNREGISTERED',
      timeAgo: '5 min ago',
      color: 'border-rose-500 text-rose-400',
    },
    {
      id: 'V-031',
      type: 'Heavy Cargo Truck',
      category: 'Truck',
      confidence: 98.1,
      camera: 'CAM-06',
      speed: '12 km/h',
      status: 'INSPECTION COMPLETE',
      plate: 'TS-09-AB-4721',
      timeAgo: '14 min ago',
      color: 'border-emerald-500 text-emerald-400',
    },
    {
      id: 'V-044',
      type: 'Military Patrol SUV',
      category: 'SUV',
      confidence: 96.5,
      camera: 'CAM-02',
      speed: '35 km/h',
      status: 'AUTHORIZED CLEARANCE',
      plate: 'AP-28-CD-8134',
      timeAgo: '22 min ago',
      color: 'border-emerald-500 text-emerald-400',
    },
    {
      id: 'V-089',
      type: 'Civilian Motorcycle',
      category: 'Motorcycle',
      confidence: 89.4,
      camera: 'CAM-11',
      speed: '44 km/h',
      status: 'REGISTERED LOCALS',
      plate: 'RJ-14-GH-9902',
      timeAgo: '38 min ago',
      color: 'border-cyan-500 text-cyan-400',
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-mono text-xs">
      {/* Top Banner Stats as requested */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#090c10] border border-slate-800 p-3 rounded-lg">
          <div className="text-slate-400 text-[10px] uppercase">VEHICLES TODAY</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">352</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">100% Classified</div>
        </div>

        <div className="bg-[#090c10] border border-slate-800 p-3 rounded-lg">
          <div className="text-slate-400 text-[10px] uppercase">CARS</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">148</div>
          <div className="text-[10px] text-slate-500 mt-0.5">42% of Volume</div>
        </div>

        <div className="bg-[#090c10] border border-slate-800 p-3 rounded-lg">
          <div className="text-slate-400 text-[10px] uppercase">SUVS</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">85</div>
          <div className="text-[10px] text-slate-500 mt-0.5">24% of Volume</div>
        </div>

        <div className="bg-[#090c10] border border-slate-800 p-3 rounded-lg">
          <div className="text-slate-400 text-[10px] uppercase">TRUCKS & HEAVY</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">62</div>
          <div className="text-[10px] text-slate-500 mt-0.5">18% of Volume</div>
        </div>

        <div className="bg-[#090c10] border border-slate-800 p-3 rounded-lg">
          <div className="text-slate-400 text-[10px] uppercase">MOTORCYCLES</div>
          <div className="text-2xl font-bold text-teal-400 mt-1">32</div>
          <div className="text-[10px] text-slate-500 mt-0.5">9% of Volume</div>
        </div>

        <div className="bg-[#090c10] border border-slate-800 p-3 rounded-lg">
          <div className="text-slate-400 text-[10px] uppercase">UNKNOWN VEHICLES</div>
          <div className="text-2xl font-bold text-rose-400 mt-1">07</div>
          <div className="text-[10px] text-rose-400/80 mt-0.5">Flagged for Check</div>
        </div>
      </div>

      {/* Main Grid: Live Inspection Camera + Classified Vehicle Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Camera Feed */}
        <div className="lg:col-span-2 space-y-3">
          <div className="h-[460px] w-full">
            <TacticalCameraFeed
              camera={vehicleCam}
              isPrimary={true}
              showAiOverlayDefault={true}
            />
          </div>
          <div className="flex justify-between text-slate-400 text-[11px] px-1">
            <span>LOCATION: {vehicleCam.name}</span>
            <span className="text-emerald-400">ANPR + VEHICLE CLASSIFIER MATRIX ACTIVE</span>
          </div>
        </div>

        {/* Right: Real-time Vehicle Tracking Stream */}
        <div className="space-y-3">
          <div className="bg-[#080a0e] border border-slate-800 rounded-lg p-3 flex flex-col h-full max-h-[500px]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <span className="font-bold text-slate-200">RECENT DETECTIONS</span>
              <span className="text-[10px] text-emerald-400">REAL-TIME TELEMETRY</span>
            </div>

            <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
              {recentVehicleDetections.map((v) => (
                <div
                  key={v.id}
                  className="bg-slate-900/70 border border-slate-800 p-3 rounded hover:border-emerald-500/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-cyan-400 text-sm">{v.id}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-slate-300 text-[10px]">
                      CONF: {v.confidence}%
                    </span>
                  </div>

                  <div className="text-slate-200 font-semibold text-[11px]">{v.type}</div>
                  
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 mt-2">
                    <div>SPEED: <strong className="text-emerald-400">{v.speed}</strong></div>
                    <div>PLATE: <strong className="text-slate-200">{v.plate}</strong></div>
                    <div>CAMERA: <strong className="text-slate-300">{v.camera}</strong></div>
                    <div>TIME: <span>{v.timeAgo}</span></div>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-slate-800 text-[10px]">
                    STATUS: <span className="font-bold text-emerald-400">{v.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Classification Breakdown Distribution */}
      <div className="bg-[#090c10] border border-slate-800 rounded-lg p-4 space-y-3">
        <h3 className="font-display font-bold text-sm text-slate-100 uppercase tracking-wider">
          VEHICLE FLEET CLASSIFICATION DISTRIBUTION
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-1">
          {VEHICLE_CLASSIFICATION_STATS.map((item) => (
            <div key={item.name} className="bg-slate-950 p-2.5 rounded border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400">{item.name}</div>
              <div className="text-lg font-bold text-slate-100 mt-0.5">{item.count}</div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div 
                  className="bg-emerald-500 h-full rounded-full" 
                  style={{ width: `${item.percent}%` }}
                />
              </div>
              <div className="text-[9px] text-slate-500 mt-1">{item.percent}% share</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
