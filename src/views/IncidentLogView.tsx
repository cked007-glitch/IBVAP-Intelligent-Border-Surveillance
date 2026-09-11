import React, { useState } from 'react';
import { IncidentLogItem } from '../types';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  Eye, 
  X, 
  CheckCircle, 
  ShieldAlert, 
  Clock 
} from 'lucide-react';
import { MOCK_INCIDENT_LOGS } from '../data/mockData';
import { soundEngine } from '../utils/audio';

export const IncidentLogView: React.FC = () => {
  const [logs, setLogs] = useState<IncidentLogItem[]>(MOCK_INCIDENT_LOGS);
  const [search, setSearch] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<IncidentLogItem | null>(null);

  const filteredLogs = logs.filter(item => 
    item.id.toLowerCase().includes(search.toLowerCase()) ||
    item.eventType.toLowerCase().includes(search.toLowerCase()) ||
    item.sectorCamera.toLowerCase().includes(search.toLowerCase()) ||
    item.objectsDetected.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    soundEngine.playActionConfirm();
    const headers = ['Incident ID', 'Date/Time', 'Sector/Camera', 'Event Type', 'Objects', 'Confidence', 'Action Taken', 'Status'];
    const rows = filteredLogs.map(l => [
      l.id,
      `"${l.dateTime}"`,
      `"${l.sectorCamera}"`,
      `"${l.eventType}"`,
      `"${l.objectsDetected}"`,
      `${l.confidence}%`,
      `"${l.actionTaken}"`,
      l.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `IBVAP_INCIDENT_AUDIT_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-mono text-xs">
      {/* Control Bar: Export & Search */}
      <div className="bg-[#090c10] border border-slate-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-slate-900 border border-slate-700 text-emerald-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base text-slate-100 uppercase tracking-wider">
              MILITARY AUDIT TRAIL & INCIDENT LOG ARCHIVE
            </h2>
            <p className="text-slate-400 text-[11px]">
              Tamper-evident cryptographically signed operational event logs for military inquiry and border review
            </p>
          </div>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)] cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>EXPORT CSV AUDIT LOG</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#080a0e] border border-slate-800 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search incident ID, sector, object or event type..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded pl-8 pr-3 py-1.5 text-xs text-slate-200 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
          <span>SHOWING {filteredLogs.length} OF {logs.length} RECORDED INCIDENTS</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#080a0e] border border-slate-800 rounded-lg overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0a0d13] border-b border-slate-800 text-[11px] text-slate-400 uppercase">
                <th className="py-3 px-4">Incident ID</th>
                <th className="py-3 px-4">Date / Time</th>
                <th className="py-3 px-4">Sector / Camera</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Objects Detected</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Action Taken</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map((log) => {
                const isCritical = log.eventType.includes('Breach') || log.status === 'UNDER REVIEW';
                return (
                  <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-emerald-400">
                      {log.id}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {log.dateTime}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {log.sectorCamera}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-100">
                      {log.eventType}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {log.objectsDetected}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-400">
                      {log.confidence}%
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {log.actionTaken}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        isCritical
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          soundEngine.playRadarPing();
                          setSelectedIncident(log);
                        }}
                        className="p-1 px-2 rounded bg-slate-900 hover:bg-emerald-950 border border-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-300 cursor-pointer text-[10px]"
                      >
                        DETAILS
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal Drawer */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#0b0e14] border border-emerald-500/50 rounded-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-emerald-400" />
                <h3 className="font-display font-bold text-base text-slate-100">
                  INCIDENT TELEMETRY: {selectedIncident.id}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedIncident(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-slate-300 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-500">EVENT TYPE:</span>
                <span className="font-bold text-slate-100">{selectedIncident.eventType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-500">TIMESTAMP:</span>
                <span>{selectedIncident.dateTime}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-500">SECTOR / CAMERA:</span>
                <span className="text-emerald-400 font-bold">{selectedIncident.sectorCamera}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-500">DETECTED OBJECTS:</span>
                <span>{selectedIncident.objectsDetected}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-500">CONFIDENCE:</span>
                <span className="text-emerald-400 font-bold">{selectedIncident.confidence}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-500">ACTION DISPATCHED:</span>
                <span>{selectedIncident.actionTaken}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">AUDIT HASH:</span>
                <span className="text-slate-400 font-mono text-[10px]">0x8F92E4A7102B5910</span>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                onClick={() => setSelectedIncident(null)}
                className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold cursor-pointer"
              >
                CLOSE INSPECTION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
