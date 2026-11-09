import React, { useState } from 'react';
import { Clock, X, Check } from 'lucide-react';

interface WorkingHoursPickerModalProps {
  isOpen: boolean;
  currentStart?: string;
  currentWrap?: string;
  onClose: () => void;
  onSave: (startTime: string, wrapTime: string) => void;
}

export const WorkingHoursPickerModal: React.FC<WorkingHoursPickerModalProps> = ({
  isOpen, currentStart = '07:00', currentWrap = '17:00', onClose, onSave,
}) => {
  const [startTime, setStartTime] = useState(currentStart);
  const [wrapTime, setWrapTime] = useState(currentWrap);

  if (!isOpen) return null;

  const presets = [
    { start: '07:00', wrap: '17:00', label: 'Standard (07:00–17:00)' },
    { start: '06:00', wrap: '16:00', label: 'Early Call (06:00–16:00)' },
    { start: '08:00', wrap: '18:00', label: 'Late Call (08:00–18:00)' },
    { start: '14:00', wrap: '23:00', label: 'Night Shoot (14:00–23:00)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs font-sans animate-in fade-in duration-150">
      <div className="bg-white border border-slate-300 rounded-xl max-w-md w-full p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2 text-slate-900">
            <Clock className="w-5 h-5 text-amber-600" />
            <h3 className="font-extrabold text-sm uppercase tracking-wide">Set Working Hours</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition"><X className="w-4 h-4" /></button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">Configure daily filming hours. Activities extending past wrap time will automatically flow into the next production day.</p>

        <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Call / Start Time</label>
            <input type="text" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Target Wrap Time</label>
            <input type="text" value={wrapTime} onChange={(e) => setWrapTime(e.target.value)} className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500" />
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Quick Presets:</span>
          <div className="grid grid-cols-2 gap-1.5">
            {presets.map((p) => (
              <button key={p.label} type="button" onClick={() => { setStartTime(p.start); setWrapTime(p.wrap); }} className="text-left px-2.5 py-1.5 bg-slate-100 hover:bg-amber-50 border border-slate-200 rounded text-[11px] font-medium text-slate-700 hover:text-amber-900 transition cursor-pointer">{p.label}</button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
          <button onClick={onClose} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded transition">Cancel</button>
          <button onClick={() => { onSave(startTime, wrapTime); onClose(); }} className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded transition flex items-center gap-1 cursor-pointer shadow-xs"><Check className="w-3.5 h-3.5" /><span>Apply Hours</span></button>
        </div>
      </div>
    </div>
  );
};
