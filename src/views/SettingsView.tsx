import React, { useState } from 'react';
import { 
  Sliders, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Moon, 
  HardDrive, 
  Save, 
  RotateCcw,
  CheckCircle,
  Clock,
  Radio
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

export const SettingsView: React.FC = () => {
  const [personConfidence, setPersonConfidence] = useState(80);
  const [vehicleConfidence, setVehicleConfidence] = useState(85);
  const [faceConfidence, setFaceConfidence] = useState(90);
  const [anprConfidence, setAnprConfidence] = useState(92);
  const [retentionDays, setRetentionDays] = useState(30);
  const [resolution, setResolution] = useState('1080p');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [nightStart, setNightStart] = useState('19:30');
  const [nightEnd, setNightEnd] = useState('05:30');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playActionConfirm();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-mono text-xs">
      {/* Top Banner */}
      <div className="bg-[#090c10] border border-slate-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-slate-900 border border-slate-700 text-emerald-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base text-slate-100 uppercase tracking-wider">
              PLATFORM CONFIGURATION & CALIBRATION MATRIX
            </h2>
            <p className="text-slate-400 text-[11px]">
              Tuning neural detection thresholds, optical FLIR switching schedules, and video retention policies
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1 rounded bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold flex items-center gap-1.5 animate-fadeIn">
            <CheckCircle className="w-4 h-4" />
            <span>CONFIGURATION COMMITTED TO CLUSTER</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Detection Threshold Sliders as requested */}
        <div className="bg-[#080a0e] border border-slate-800 rounded-lg p-4 space-y-4">
          <h3 className="font-display font-bold text-sm text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-2">
            1. NEURAL INFERENCE DETECTION THRESHOLDS
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2 bg-slate-950 p-3 rounded border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-300 font-semibold">HUMAN DETECTION CUTOFF:</span>
                <span className="text-emerald-400 font-bold">{personConfidence}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={personConfidence}
                onChange={(e) => setPersonConfidence(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">
                Balances distant silhouette sensitivity against background foliage false positives.
              </span>
            </div>

            <div className="space-y-2 bg-slate-950 p-3 rounded border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-300 font-semibold">VEHICLE CLASSIFIER CUTOFF:</span>
                <span className="text-emerald-400 font-bold">{vehicleConfidence}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={vehicleConfidence}
                onChange={(e) => setVehicleConfidence(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">
                Higher threshold prevents tractor/heavy machinery misclassification as tactical vehicles.
              </span>
            </div>

            <div className="space-y-2 bg-slate-950 p-3 rounded border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-300 font-semibold">BIOMETRIC FACE MATCH:</span>
                <span className="text-emerald-400 font-bold">{faceConfidence}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="99"
                value={faceConfidence}
                onChange={(e) => setFaceConfidence(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">
                Threshold for positive match identification against military personnel roster.
              </span>
            </div>

            <div className="space-y-2 bg-slate-950 p-3 rounded border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-300 font-semibold">ANPR OCR CONFIDENCE:</span>
                <span className="text-emerald-400 font-bold">{anprConfidence}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="99"
                value={anprConfidence}
                onChange={(e) => setAnprConfidence(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">
                Rejects degraded or mud-splattered license plates for manual operator verification.
              </span>
            </div>
          </div>
        </div>

        {/* Video Retention & Recording as requested */}
        <div className="bg-[#080a0e] border border-slate-800 rounded-lg p-4 space-y-4">
          <h3 className="font-display font-bold text-sm text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-2">
            2. STORAGE RETENTION & RECORDING RESOLUTION
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">VIDEO RETENTION PERIOD (DAYS)</label>
              <select
                value={retentionDays}
                onChange={(e) => setRetentionDays(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded px-3 py-2 text-slate-200 outline-none text-xs"
              >
                <option value={15}>15 Days (High Bandwidth / Lower SAN Storage)</option>
                <option value={30}>30 Days (Standard Military Compliance Directive)</option>
                <option value={60}>60 Days (Extended Frontier Archive)</option>
                <option value={90}>90 Days (Requires SAN Expansion)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1">RECORDING STREAM RESOLUTION</label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded px-3 py-2 text-slate-200 outline-none text-xs"
              >
                <option value="1080p">1080p Full HD (25 FPS, H.265+ Compression)</option>
                <option value="4K">4K Ultra HD (30 FPS, Heavy Storage Allocation)</option>
                <option value="720p">720p HD (Low Bandwidth Satellite Links)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Night Vision Schedule & Alert Audio Toggles as requested */}
        <div className="bg-[#080a0e] border border-slate-800 rounded-lg p-4 space-y-4">
          <h3 className="font-display font-bold text-sm text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-2">
            3. NIGHT SURVEILLANCE SCHEDULE & AUDITORY ALERTS
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="text-slate-300 font-semibold">NIGHT VISION AUTO-SWITCH SCHEDULE:</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 text-[10px] mb-0.5">DUSK / NIGHT START</label>
                  <input
                    type="time"
                    value={nightStart}
                    onChange={(e) => setNightStart(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[10px] mb-0.5">DAWN / DAY RESTORE</label>
                  <input
                    type="time"
                    value={nightEnd}
                    onChange={(e) => setNightEnd(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-slate-300 font-semibold">TACTICAL AUDITORY ALERT FEEDBACK:</div>
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
                <div>
                  <div className="text-slate-200 font-bold">OPERATIONAL SIREN & RADAR PINGS</div>
                  <div className="text-[10px] text-slate-500">Play web-synthesized acoustic alerts on critical events</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !soundEnabled;
                    setSoundEnabled(next);
                    if (next) soundEngine.playActionConfirm();
                  }}
                  className={`w-10 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                    soundEnabled ? 'bg-emerald-600' : 'bg-slate-800'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    soundEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-display font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>SAVE TACTICAL CONFIGURATION</span>
          </button>
        </div>
      </form>
    </div>
  );
};
