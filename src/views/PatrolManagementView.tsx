import React, { useState } from 'react';
import { 
  Users, 
  Send, 
  CheckCircle, 
  Clock, 
  Radio, 
  AlertTriangle, 
  Car, 
  ShieldCheck,
  Compass,
  ArrowRight
} from 'lucide-react';
import { MOCK_PATROLS, MOCK_ALERTS } from '../data/mockData';
import { soundEngine } from '../utils/audio';

export const PatrolManagementView: React.FC = () => {
  const [patrols, setPatrols] = useState(MOCK_PATROLS);
  const [selectedAlertId, setSelectedAlertId] = useState(MOCK_ALERTS[0].id);
  const [selectedPatrolId, setSelectedPatrolId] = useState(MOCK_PATROLS[0].id);
  const [dispatchMessage, setDispatchMessage] = useState<string | null>(null);

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playActionConfirm();

    const targetAlert = MOCK_ALERTS.find(a => a.id === selectedAlertId);
    setPatrols(prev => prev.map(p => {
      if (p.id === selectedPatrolId) {
        return {
          ...p,
          status: 'DISPATCHED',
          assignedIncident: targetAlert ? `${targetAlert.title} (${targetAlert.location})` : 'Perimeter Incident',
        };
      }
      return p;
    }));

    setDispatchMessage(`ORDER TRANSMITTED: ${selectedPatrolId} dispatched to ${targetAlert?.location}`);
    setTimeout(() => setDispatchMessage(null), 6000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-mono text-xs">
      {/* Top Banner */}
      <div className="bg-[#090c10] border border-slate-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base text-slate-100 uppercase tracking-wider">
              TACTICAL PATROL COORDINATION & QRT VECTORING
            </h2>
            <p className="text-slate-400 text-[11px]">
              Active mobile units, rapid intervention teams, VHF encrypted frequency telemetry, and automated tasking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 font-bold">4 UNITS ENGAGED ON CHANNEL 7</span>
        </div>
      </div>

      {dispatchMessage && (
        <div className="bg-emerald-950/80 border border-emerald-500 rounded p-3 text-emerald-300 font-bold flex items-center justify-between">
          <span>{dispatchMessage}</span>
          <span className="text-xs">ACKNOWLEDGED OVER RADIO</span>
        </div>
      )}

      {/* Main Grid: Patrol Units List + Dispatch Form Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 Cols): Patrol Units Status Cards */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="font-display font-bold text-sm text-slate-200 uppercase tracking-wider">
            FRONTIER PATROL SQUADRONS
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {patrols.map((unit) => {
              const isDispatched = unit.status === 'DISPATCHED' || unit.status === 'EN ROUTE';
              const isAvailable = unit.status === 'AVAILABLE';

              return (
                <div
                  key={unit.id}
                  className={`p-4 rounded-lg border transition-all ${
                    isDispatched
                      ? 'bg-rose-950/30 border-rose-600/60'
                      : 'bg-slate-900/70 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-100 text-sm">{unit.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isDispatched
                        ? 'bg-rose-900 text-rose-200 border border-rose-600'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                    }`}>
                      {unit.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Sector Base:</span>
                      <span>{unit.sector}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Personnel Strength:</span>
                      <span>{unit.personnelCount} Armed Officers</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tactical Vehicle:</span>
                      <span className="text-cyan-400 font-bold">{unit.vehicleId}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-800 text-[10px]">
                      <span className="text-slate-500">Assigned Incident:</span>
                      <span className="text-amber-400 truncate max-w-[170px]">{unit.assignedIncident || 'Standing Patrol'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right (1 Col): Incident Dispatch Workflow as requested */}
        <div className="space-y-3">
          <div className="bg-[#080a0e] border border-slate-800 rounded-lg p-4 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Send className="w-4 h-4 text-emerald-400" />
              <h3 className="font-display font-bold text-sm text-slate-100 uppercase tracking-wider">
                DISPATCH COORDINATION WORKFLOW
              </h3>
            </div>

            <form onSubmit={handleDispatch} className="space-y-3">
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">SELECT TARGET INCIDENT</label>
                <select
                  value={selectedAlertId}
                  onChange={(e) => setSelectedAlertId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded px-2.5 py-2 text-slate-200 outline-none text-xs"
                >
                  {MOCK_ALERTS.map((al) => (
                    <option key={al.id} value={al.id}>
                      [{al.severity}] {al.title} ({al.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1">ASSIGN PATROL SQUADRON</label>
                <select
                  value={selectedPatrolId}
                  onChange={(e) => setSelectedPatrolId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded px-2.5 py-2 text-slate-200 outline-none text-xs"
                >
                  {patrols.map((pt) => (
                    <option key={pt.id} value={pt.id}>
                      {pt.name} ({pt.status}) • {pt.vehicleId}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800 text-[10px] text-slate-400 space-y-1">
                <div>RADIO PROTOCOL: Encrypted Frequency 148.250 MHz</div>
                <div>ESTIMATED INTERCEPT TIME: &lt; 3.5 minutes</div>
                <div>QRT WEAPONS CLEARANCE: LEVEL 3 AUTHORIZED</div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
              >
                <Send className="w-4 h-4" />
                <span>AUTHORIZE & TRANSMIT DISPATCH</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
