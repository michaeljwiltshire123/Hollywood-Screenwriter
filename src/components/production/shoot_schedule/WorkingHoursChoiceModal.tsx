import React from 'react';
import { Calendar, Layers, Globe, X } from 'lucide-react';

interface WorkingHoursChoiceModalProps {
  isOpen: boolean;
  startTime: string;
  wrapTime: string;
  onClose: () => void;
  onApplyCurrentDayOnly: () => void;
  onApplyUniversally: () => void;
}

export const WorkingHoursChoiceModal: React.FC<WorkingHoursChoiceModalProps> = ({
  isOpen,
  startTime,
  wrapTime,
  onClose,
  onApplyCurrentDayOnly,
  onApplyUniversally,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans animate-in fade-in duration-150">
      <div className="bg-white border border-slate-300 rounded-xl max-w-md w-full p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2 text-slate-900">
            <Calendar className="w-5 h-5 text-amber-600" />
            <h3 className="font-black text-sm uppercase tracking-wide">Working Hours Scope</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
          <span className="font-bold">New Hours Selected:</span> {startTime} – {wrapTime}
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Would you like to apply these new working hours to the current active shoot day only, or universally across all production days?
        </p>

        <div className="grid grid-cols-1 gap-2 pt-1">
          <button
            type="button"
            onClick={() => { onApplyCurrentDayOnly(); onClose(); }}
            className="w-full p-3 bg-slate-100 hover:bg-amber-100/60 border border-slate-300 hover:border-amber-400 rounded-lg text-left transition cursor-pointer group flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-600" />
                <span>Current Day Only</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Apply hours strictly to the selected active shoot day</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => { onApplyUniversally(); onClose(); }}
            className="w-full p-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-left transition cursor-pointer group flex items-center justify-between shadow-xs"
          >
            <div>
              <div className="font-bold text-xs text-slate-950 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-slate-950" />
                <span>Universally Across All Days</span>
              </div>
              <div className="text-[10px] text-slate-900/80 mt-0.5 font-semibold">Update working hours for every day in the production schedule</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
