import React from 'react';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Server, 
  ShieldCheck, 
  Thermometer, 
  Zap,
  Clock,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

export const SystemHealthView: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-mono text-xs">
      {/* Top Banner */}
      <div className="bg-[#090c10] border border-slate-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-400">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base text-slate-100 uppercase tracking-wider">
              SYSTEM HEALTH, HARDWARE & EDGE ACCELERATION TELEMETRY
            </h2>
            <p className="text-slate-400 text-[11px]">
              Rack-mounted GPU inference clusters, SAN NVMe storage arrays, and redundant fiber uplinks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => soundEngine.playActionConfirm()}
            className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 flex items-center gap-1.5 cursor-pointer text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>FORCE SYSTEM DIAGNOSTIC</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Infrastructure Status Metrics as requested */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GPU Cluster */}
        <div className="bg-[#080a0e] border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-bold text-slate-200">GPU INFERENCE ENGINE</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">67% UTILIZATION</div>
          <div className="space-y-1.5 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <div className="flex justify-between">
              <span>Hardware:</span>
              <span className="text-slate-200 font-bold">NVIDIA RTX 6000 Ada</span>
            </div>
            <div className="flex justify-between">
              <span>VRAM Used:</span>
              <span className="text-slate-200 font-bold">32.4 GB / 48 GB</span>
            </div>
            <div className="flex justify-between">
              <span>Core Temp:</span>
              <span className="text-emerald-400 font-bold">54°C (Nominal)</span>
            </div>
          </div>
        </div>

        {/* SAN Storage Details as requested */}
        <div className="bg-[#080a0e] border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-bold text-slate-200">NVMe STORAGE ARRAY</span>
            <HardDrive className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">14.8 TB / 20 TB</div>
          <div className="space-y-1.5 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <div className="flex justify-between">
              <span>Video Retention:</span>
              <span className="text-slate-200 font-bold">30 Days Ring Buffer</span>
            </div>
            <div className="flex justify-between">
              <span>Remaining Capacity:</span>
              <span className="text-cyan-400 font-bold">5.2 TB (26% Free)</span>
            </div>
            <div className="flex justify-between">
              <span>Filesystem Health:</span>
              <span className="text-emerald-400 font-bold">RAID-6 Optimal</span>
            </div>
          </div>
        </div>

        {/* Network Bandwidth as requested */}
        <div className="bg-[#080a0e] border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-bold text-slate-200">NETWORK INGRESS</span>
            <Wifi className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">184 Mbps</div>
          <div className="space-y-1.5 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <div className="flex justify-between">
              <span>RTSP Streams:</span>
              <span className="text-slate-200 font-bold">24 Ingest Streams</span>
            </div>
            <div className="flex justify-between">
              <span>Uplink Carrier:</span>
              <span className="text-slate-200 font-bold">Dual Tactical Fiber</span>
            </div>
            <div className="flex justify-between">
              <span>Packet Loss:</span>
              <span className="text-emerald-400 font-bold">0.002%</span>
            </div>
          </div>
        </div>

        {/* Camera Uptime & Latency */}
        <div className="bg-[#080a0e] border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-bold text-slate-200">RELIABILITY & LATENCY</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">99.82%</div>
          <div className="space-y-1.5 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <div className="flex justify-between">
              <span>AI Pipeline Latency:</span>
              <span className="text-emerald-400 font-bold">42 ms (Real-time)</span>
            </div>
            <div className="flex justify-between">
              <span>Failover Node:</span>
              <span className="text-slate-200 font-bold">HOT-STANDBY READY</span>
            </div>
            <div className="flex justify-between">
              <span>System Uptime:</span>
              <span className="text-slate-200 font-bold">142 Days, 06 Hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edge Micro-Servers Telemetry Table */}
      <div className="bg-[#080a0e] border border-slate-800 rounded-lg p-4 space-y-3 shadow-xl">
        <h3 className="font-display font-bold text-sm text-slate-100 uppercase tracking-wider">
          FRONTIER EDGE COMPUTE NODES INVENTORY
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0a0d13] border-b border-slate-800 text-[11px] text-slate-400 uppercase">
                <th className="py-2.5 px-4">Node Designation</th>
                <th className="py-2.5 px-4">Physical Location</th>
                <th className="py-2.5 px-4">Process Load</th>
                <th className="py-2.5 px-4">Temperature</th>
                <th className="py-2.5 px-4">Inference Streams</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr className="hover:bg-slate-900/40">
                <td className="py-2.5 px-4 font-bold text-emerald-400">EDGE-NODE-ALPHA</td>
                <td className="py-2.5 px-4 text-slate-300">BOP Alpha Hardened Server Room</td>
                <td className="py-2.5 px-4 text-slate-300">48% CPU / 62% GPU</td>
                <td className="py-2.5 px-4 text-emerald-400">48°C</td>
                <td className="py-2.5 px-4 text-slate-200 font-mono">8 Streams (CAM 01-08)</td>
                <td className="py-2.5 px-4 font-bold text-emerald-400">OPTIMAL</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-2.5 px-4 font-bold text-emerald-400">EDGE-NODE-BRAVO</td>
                <td className="py-2.5 px-4 text-slate-300">BOP Bravo Vault Unit</td>
                <td className="py-2.5 px-4 text-slate-300">54% CPU / 71% GPU</td>
                <td className="py-2.5 px-4 text-emerald-400">51°C</td>
                <td className="py-2.5 px-4 text-slate-200 font-mono">9 Streams (CAM 09-17)</td>
                <td className="py-2.5 px-4 font-bold text-emerald-400">OPTIMAL</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-2.5 px-4 font-bold text-emerald-400">EDGE-NODE-CHARLIE</td>
                <td className="py-2.5 px-4 text-slate-300">CP-03 High-Speed Shelter</td>
                <td className="py-2.5 px-4 text-slate-300">62% CPU / 69% GPU</td>
                <td className="py-2.5 px-4 text-emerald-400">53°C</td>
                <td className="py-2.5 px-4 text-slate-200 font-mono">7 Streams (CAM 18-24)</td>
                <td className="py-2.5 px-4 font-bold text-emerald-400">OPTIMAL</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-2.5 px-4 font-bold text-cyan-400">EDGE-NODE-REDUNDANT</td>
                <td className="py-2.5 px-4 text-slate-300">Central Tactical Command Bunker</td>
                <td className="py-2.5 px-4 text-slate-300">12% CPU / 08% GPU</td>
                <td className="py-2.5 px-4 text-cyan-400">42°C</td>
                <td className="py-2.5 px-4 text-slate-200 font-mono">Failover Mirroring Sync</td>
                <td className="py-2.5 px-4 font-bold text-cyan-400">STANDBY HOT</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
