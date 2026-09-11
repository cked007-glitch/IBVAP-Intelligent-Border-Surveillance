import React, { useState } from 'react';
import { AlertItem } from '../types';
import { 
  Bell, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Radio, 
  Clock, 
  Eye, 
  Trash2, 
  Volume2, 
  VolumeX, 
  Filter,
  Send
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface AlertsViewProps {
  alerts: AlertItem[];
  onAcknowledgeAlert: (id: string) => void;
  onDismissAlert: (id: string) => void;
  onDispatchPatrol: (alert: AlertItem) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts = [],
  onAcknowledgeAlert,
  onDismissAlert,
  onDispatchPatrol,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED'>('ALL');

  const filteredAlerts = alerts.filter(a => {
    const matchSev = filterSeverity === 'ALL' || a.severity === filterSeverity;
    const matchStat = filterStatus === 'ALL' || a.status === filterStatus;
    return matchSev && matchStat;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-mono text-xs">
      {/* Top Controls Bar */}
      <div className="bg-[#090c10] border border-slate-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-rose-950/70 border border-rose-500/40 text-rose-400">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base text-slate-100 uppercase tracking-wider">
              TACTICAL ALERT COMMAND & INCIDENT DISPATCH
            </h2>
            <p className="text-slate-400 text-[11px]">
              Multi-tier severity triaging, automated audio alarms, and Quick Reaction Team (QRT) vectoring
            </p>
          </div>
        </div>

        {/* Action / Siren Test */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => soundEngine.playAlert()}
            className="px-3 py-1.5 rounded bg-rose-950 hover:bg-rose-900 border border-rose-700/60 text-rose-300 font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>TEST CRITICAL ALARM</span>
          </button>
        </div>
      </div>

      {/* Severity Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#080a0e] border border-slate-800 p-2.5 rounded-lg">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-500 text-[10px] mr-2">SEVERITY:</span>
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(s => (
            <button
              key={s}
              onClick={() => {
                soundEngine.playActionConfirm();
                setFilterSeverity(s);
              }}
              className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                filterSeverity === s
                  ? s === 'CRITICAL'
                    ? 'bg-rose-600 text-white'
                    : s === 'HIGH'
                    ? 'bg-amber-600 text-slate-950'
                    : 'bg-emerald-600 text-slate-950'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 text-[10px] mr-1">STATUS:</span>
          {(['ALL', 'ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'] as const).map(st => (
            <button
              key={st}
              onClick={() => {
                soundEngine.playActionConfirm();
                setFilterStatus(st);
              }}
              className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                filterStatus === st ? 'bg-slate-700 text-white font-bold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Cards Stream */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-[#090c10] border border-slate-800 rounded-lg p-12 text-center text-slate-500">
            NO ALERTS CURRENTLY MATCH FILTER CRITERIA
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCrit = alert.severity === 'CRITICAL';
            const isHigh = alert.severity === 'HIGH';
            const isMed = alert.severity === 'MEDIUM';

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border transition-all ${
                  isCrit
                    ? 'bg-rose-950/40 border-rose-600/70 shadow-[0_0_15px_rgba(225,29,72,0.15)]'
                    : isHigh
                    ? 'bg-amber-950/30 border-amber-600/50'
                    : isMed
                    ? 'bg-yellow-950/20 border-yellow-600/40'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isCrit
                          ? 'bg-rose-900 text-rose-100 border border-rose-500 animate-pulse'
                          : isHigh
                          ? 'bg-amber-900 text-amber-100 border border-amber-500'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="font-bold text-slate-100 text-sm">
                        {alert.title}
                      </span>
                      <span className="text-[10px] text-slate-500">ID: {alert.id}</span>
                    </div>

                    <p className="text-slate-300 text-xs leading-relaxed pt-1">
                      {alert.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-400 pt-1.5">
                      <span>CAMERA: <strong className="text-emerald-400">{alert.camera}</strong></span>
                      <span>SECTOR: <strong>{alert.location}</strong></span>
                      <span>TIME: <strong>{alert.timestamp} ({alert.timeAgo})</strong></span>
                      <span>CONFIDENCE: <strong className="text-cyan-400">{alert.confidence}%</strong></span>
                    </div>
                  </div>

                  {/* Operational Action Buttons as requested */}
                  <div className="flex flex-wrap items-center gap-2 self-center">
                    {alert.status === 'ACTIVE' && (
                      <button
                        onClick={() => {
                          soundEngine.playActionConfirm();
                          onAcknowledgeAlert(alert.id);
                        }}
                        className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                      >
                        Acknowledge
                      </button>
                    )}

                    <button
                      onClick={() => {
                        soundEngine.playActionConfirm();
                        onDispatchPatrol(alert);
                      }}
                      className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch Patrol</span>
                    </button>

                    <button
                      onClick={() => {
                        soundEngine.playActionConfirm();
                        onDismissAlert(alert.id);
                      }}
                      className="p-1.5 rounded bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-800 cursor-pointer"
                      title="Dismiss Alert"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
