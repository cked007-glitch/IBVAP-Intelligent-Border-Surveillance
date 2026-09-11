import React, { useState } from 'react';
import { CameraFeedInfo } from '../types';
import { 
  Camera, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Radio, 
  Cpu, 
  Eye, 
  RefreshCw,
  X,
  Server
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface CameraNetworkViewProps {
  cameras: CameraFeedInfo[];
  onSelectCamera: (cam: CameraFeedInfo) => void;
  onAddCamera: (newCam: CameraFeedInfo) => void;
}

export const CameraNetworkView: React.FC<CameraNetworkViewProps> = ({
  cameras = [],
  onSelectCamera,
  onAddCamera,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ONLINE' | 'OFFLINE' | 'DEGRADED'>('ALL');
  const [locationFilter, setLocationFilter] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Camera Modal State
  const [newCamId, setNewCamId] = useState(`CAM-${cameras.length + 1}`);
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newType, setNewType] = useState<'PTZ' | 'Fixed' | 'Thermal' | 'ANPR Dedicated'>('Fixed');
  const [newRtsp, setNewRtsp] = useState('rtsp://10.14.7.150:554/live/ch0');

  const filteredCameras = cameras.filter((cam) => {
    const matchesSearch = 
      cam.id.toLowerCase().includes(search.toLowerCase()) ||
      cam.name.toLowerCase().includes(search.toLowerCase()) ||
      cam.location.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || cam.status === statusFilter;
    const matchesLocation = locationFilter === 'ALL' || cam.location.includes(locationFilter);

    return matchesSearch && matchesStatus && matchesLocation;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playActionConfirm();

    const createdCam: CameraFeedInfo = {
      id: newCamId,
      name: newName || 'NEW FRONTIER CAMERA',
      sector: 'Sector 07',
      location: newLocation || 'Perimeter Outpost',
      type: newType,
      status: 'ONLINE',
      fps: 25,
      resolution: '1080p',
      aiProcessing: true,
      latencyMs: 34,
      lastEvent: 'Stream initialized',
      sceneType: 'road',
      detectionsCount: 0,
      ipAddress: '10.14.7.' + (130 + Math.floor(Math.random() * 50)),
    };

    onAddCamera(createdCam);
    setShowAddModal(false);
    setNewName('');
    setNewLocation('');
  };

  const onlineCount = cameras.filter(c => c.status === 'ONLINE').length;
  const offlineCount = cameras.filter(c => c.status === 'OFFLINE').length;
  const degradedCount = cameras.filter(c => c.status === 'DEGRADED').length;

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto font-mono text-xs">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#090c10] border border-slate-800 p-3 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-[11px]">TOTAL SENSORS</div>
            <div className="text-xl font-bold text-slate-100">{cameras.length}</div>
          </div>
          <Camera className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="bg-[#090c10] border border-slate-800 p-3 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-[11px]">ONLINE & ACTIVE</div>
            <div className="text-xl font-bold text-emerald-400">{onlineCount}</div>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="bg-[#090c10] border border-slate-800 p-3 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-[11px]">OFFLINE / DROPPED</div>
            <div className="text-xl font-bold text-rose-400">{offlineCount}</div>
          </div>
          <XCircle className="w-5 h-5 text-rose-400" />
        </div>

        <div className="bg-[#090c10] border border-slate-800 p-3 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-[11px]">AI ACCELERATED</div>
            <div className="text-xl font-bold text-cyan-400">
              {cameras.filter(c => c.aiProcessing).length}
            </div>
          </div>
          <Cpu className="w-5 h-5 text-cyan-400" />
        </div>
      </div>

      {/* Control Bar: Search, Filters, Add Camera */}
      <div className="bg-[#090c10] border border-slate-800 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1 max-w-2xl">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search camera ID, name, or location..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded pl-8 pr-3 py-1.5 text-xs text-slate-200 outline-none transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded p-0.5">
            {(['ALL', 'ONLINE', 'OFFLINE', 'DEGRADED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => {
                  soundEngine.playActionConfirm();
                  setStatusFilter(st);
                }}
                className={`px-2 py-1 rounded text-[10px] cursor-pointer transition-colors ${
                  statusFilter === st ? 'bg-emerald-600 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Add Camera Button */}
        <button
          onClick={() => {
            soundEngine.playActionConfirm();
            setShowAddModal(true);
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold transition-all shadow-[0_0_10px_rgba(16,185,129,0.25)] cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>REGISTER RTSP CAMERA</span>
        </button>
      </div>

      {/* Main Cameras Table */}
      <div className="bg-[#080a0e] border border-slate-800 rounded-lg overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0a0d13] border-b border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-4">Camera ID</th>
                <th className="py-2.5 px-4">Location / Sector</th>
                <th className="py-2.5 px-4">Optics Type</th>
                <th className="py-2.5 px-4">Resolution</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">FPS</th>
                <th className="py-2.5 px-4">AI Processing</th>
                <th className="py-2.5 px-4">Last Event Telemetry</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCameras.map((cam) => {
                const isOnline = cam.status === 'ONLINE';
                const isOffline = cam.status === 'OFFLINE';
                return (
                  <tr 
                    key={cam.id} 
                    className="hover:bg-slate-900/50 transition-colors group"
                  >
                    <td className="py-3 px-4 font-bold text-emerald-400 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        isOnline ? 'bg-emerald-400 animate-pulse' : isOffline ? 'bg-rose-500' : 'bg-amber-400'
                      }`} />
                      <span>{cam.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-200">{cam.name}</div>
                      <div className="text-[10px] text-slate-500">{cam.location}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[10px]">
                        {cam.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {cam.resolution}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        isOnline 
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60' 
                          : isOffline
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                      }`}>
                        {cam.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono">
                      {isOffline ? '--' : `${cam.fps} FPS`}
                    </td>
                    <td className="py-3 px-4">
                      {cam.aiProcessing ? (
                        <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                          <Cpu className="w-3 h-3" />
                          <span>ACTIVE</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">INACTIVE</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {cam.lastEvent}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          soundEngine.playRadarPing();
                          onSelectCamera(cam);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-900 hover:bg-emerald-950/80 border border-slate-700 hover:border-emerald-500/60 text-slate-200 hover:text-emerald-300 transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>VIEW FEED</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Camera Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0b0e14] border border-emerald-500/40 rounded-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-emerald-400" />
                <h3 className="font-display font-bold text-base text-slate-100">
                  CONNECT FIELD CCTV STREAM
                </h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">CAMERA IDENTIFIER</label>
                <input
                  type="text"
                  value={newCamId}
                  onChange={(e) => setNewCamId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded px-3 py-2 text-slate-200 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1">CAMERA NAME / DESIGNATION</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. WATCHTOWER NORTH OUTPOST"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded px-3 py-2 text-slate-200 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1">LOCATION DESCRIPTION</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Sector 07 Marker 44"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded px-3 py-2 text-slate-200 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">OPTICS TYPE</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded px-3 py-2 text-slate-200 outline-none"
                  >
                    <option value="Fixed">Fixed Camera</option>
                    <option value="PTZ">PTZ Motorized</option>
                    <option value="Thermal">Thermal IR Long-Range</option>
                    <option value="ANPR Dedicated">ANPR Dedicated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">RESOLUTION</label>
                  <select className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded px-3 py-2 text-slate-200 outline-none">
                    <option value="1080p">1080p FHD (25 FPS)</option>
                    <option value="4K">4K UHD (30 FPS)</option>
                    <option value="720p">720p HD Low Bandwidth</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1">RTSP / ONVIF STREAM URI</label>
                <input
                  type="text"
                  value={newRtsp}
                  onChange={(e) => setNewRtsp(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded px-3 py-2 text-slate-200 outline-none"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold cursor-pointer"
                >
                  INITIALIZE CAMERA & LINK AI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
