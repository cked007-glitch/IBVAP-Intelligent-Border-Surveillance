import React, { useState } from 'react';
import { CameraFeedInfo } from '../types';
import { TacticalCameraFeed } from '../components/TacticalCameraFeed';
import { 
  CreditCard, 
  Search, 
  Car, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  BarChart3,
  Filter
} from 'lucide-react';
import { MOCK_ANPR_DATA } from '../data/mockData';
import { soundEngine } from '../utils/audio';

interface AnprViewProps {
  cameras: CameraFeedInfo[];
}

export const AnprView: React.FC<AnprViewProps> = ({ cameras }) => {
  const anprCam = cameras.find(c => c.id === 'CAM-03') || cameras[0];
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AUTHORIZED' | 'FLAGGED' | 'SUSPICIOUS'>('ALL');

  const filteredPlates = MOCK_ANPR_DATA.filter((item) => {
    const matchSearch = 
      item.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
      item.vehicleType.toLowerCase().includes(search.toLowerCase()) ||
      (item.ownerNote && item.ownerNote.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-mono text-xs">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#090c10] border border-slate-800 p-3 rounded-lg">
          <div className="text-slate-400 text-[10px] uppercase">ANPR EVENTS TODAY</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">47</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Dual High-Speed Lanes</div>
        </div>

        <div className="bg-[#090c10] border border-slate-800 p-3 rounded-lg">
          <div className="text-slate-400 text-[10px] uppercase">MEAN OCR ACCURACY</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">98.2%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">High-Speed Shutter Feed</div>
        </div>

        <div className="bg-[#090c10] border border-slate-800 p-3 rounded-lg">
          <div className="text-slate-400 text-[10px] uppercase">FLAGGED WATCHLIST PLATES</div>
          <div className="text-2xl font-bold text-rose-400 mt-1">01</div>
          <div className="text-[10px] text-rose-400/80 mt-0.5">DL-04-XY-2198 (Alerted)</div>
        </div>

        <div className="bg-[#090c10] border border-slate-800 p-3 rounded-lg">
          <div className="text-slate-400 text-[10px] uppercase">OCR LATENCY</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">32 ms</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Instant Checkpoint Gate Pass</div>
        </div>
      </div>

      {/* Main Grid: Live ANPR Camera + Plate Scanner Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Feed with ANPR Bounding Box */}
        <div className="lg:col-span-2 space-y-3">
          <div className="h-[460px] w-full">
            <TacticalCameraFeed
              camera={anprCam}
              isPrimary={true}
              showAiOverlayDefault={true}
            />
          </div>
          <div className="flex justify-between text-slate-400 text-[11px] px-1">
            <span>LIVE ANPR DEDICATED SENSOR: {anprCam.name}</span>
            <span className="text-emerald-400">OCR ENGINE: MULTI-REGION LICENSE PARSER</span>
          </div>
        </div>

        {/* Right: Last Scanned Plate Showcase */}
        <div className="space-y-3">
          <div className="bg-[#080a0e] border border-slate-800 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-slate-200">ACTIVE PLATE CAPTURE</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/50 text-[10px]">
                READING AT SPEED
              </span>
            </div>

            {/* High-Tech License Plate Graphic */}
            <div className="bg-slate-900 border-2 border-slate-700 rounded-md p-4 text-center space-y-2 shadow-inner">
              <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-slate-800 pb-1">
                <span>SECTOR 07 CHECKPOINT</span>
                <span className="text-emerald-400 font-bold">OCR: 98.4%</span>
              </div>
              <div className="text-3xl font-mono font-bold tracking-widest text-slate-100 bg-black/60 py-2 rounded border border-slate-800">
                TS-09-AB-4721
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold">
                VEHICLE: TRUCK • AUTHORIZED SUPPLY CONVOY
              </div>
            </div>

            <div className="space-y-2 text-[11px] text-slate-300 bg-slate-950 p-3 rounded border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-500">Capture Camera:</span>
                <span className="text-slate-200 font-semibold">CAM-03 (CP-03 North)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Capture Timestamp:</span>
                <span className="text-slate-200">16:20:12 UTC+05:30</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pass Clearance:</span>
                <span className="text-emerald-400 font-bold">AUTOMATED BARRIER RAISE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plate Search & Detections Table as requested */}
      <div className="bg-[#080a0e] border border-slate-800 rounded-lg p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <h3 className="font-display font-bold text-sm text-slate-100 uppercase tracking-wider">
              RECENT ANPR VEHICLE DETECTIONS TABLE
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search plate or vehicle..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded pl-8 pr-3 py-1 text-xs text-slate-200 outline-none"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded p-0.5">
              {(['ALL', 'AUTHORIZED', 'FLAGGED', 'SUSPICIOUS'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    soundEngine.playActionConfirm();
                    setStatusFilter(st);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                    statusFilter === st ? 'bg-emerald-600 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0a0d13] border-b border-slate-800 text-[11px] text-slate-400 uppercase">
                <th className="py-2.5 px-4">Plate Number</th>
                <th className="py-2.5 px-4">Vehicle Type</th>
                <th className="py-2.5 px-4">Confidence</th>
                <th className="py-2.5 px-4">Camera Source</th>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Registry Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPlates.map((row) => {
                const isFlagged = row.status === 'FLAGGED';
                const isAuth = row.status === 'AUTHORIZED';
                return (
                  <tr key={row.id} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-4 font-bold text-slate-100 text-xs">
                      {row.plateNumber}
                    </td>
                    <td className="py-2.5 px-4 text-slate-300">
                      {row.vehicleType}
                    </td>
                    <td className="py-2.5 px-4 text-emerald-400 font-bold">
                      {row.confidence}%
                    </td>
                    <td className="py-2.5 px-4 text-slate-400">
                      {row.camera} ({row.location})
                    </td>
                    <td className="py-2.5 px-4 text-slate-300">
                      {row.timestamp}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        isFlagged 
                          ? 'bg-rose-950 text-rose-300 border border-rose-700/60' 
                          : isAuth 
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                          : 'bg-amber-950 text-amber-300 border border-amber-700/60'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-[11px] text-slate-400">
                      {row.ownerNote || '--'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
