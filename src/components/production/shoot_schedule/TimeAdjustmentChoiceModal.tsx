import React from 'react';
import { ArrowRight, Clock, Shuffle } from 'lucide-react';

interface TimeAdjustmentChoiceModalProps {
  isOpen: boolean;
  rowDescription: string;
  oldTime: string;
  newTime: string;
  onClose: () => void;
  onCascadeShift: () => void;
  onReorderSlot: () => void;
}

export const TimeAdjustmentChoiceModal: React.FC<TimeAdjustmentChoiceModalProps> = ({
  isOpen,
  rowDescription,
  oldTime,
  newTime,
  onClose,
  onCascadeShift,
  onReorderSlot,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl w-full max-w-md p-5 space-y-4 font-sans text-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-600" />
            <span>Time Adjustment Confirmation</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            You updated <span className="font-semibold text-slate-800">"{rowDescription}"</span> from{' '}
            <span className="font-mono line-through text-slate-400">{oldTime}</span> to{' '}
            <span className="font-mono font-bold text-sky-600">{newTime}</span>.
          </p>
        </div>

        <div className="space-y-2 text-xs">
          <button
            onClick={onCascadeShift}
            className="w-full p-3 text-left rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 transition cursor-pointer flex items-start gap-3 group"
          >
            <div className="p-2 bg-sky-100 text-sky-700 rounded-lg shrink-0 mt-0.5 group-hover:bg-sky-200">
              <ArrowRight className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900">Shift All Subsequent Times Forward</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Keep the current sequence and push later scenes to fit the new start time.
              </div>
            </div>
          </button>

          <button
            onClick={onReorderSlot}
            className="w-full p-3 text-left rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition cursor-pointer flex items-start gap-3 group"
          >
            <div className="p-2 bg-amber-100 text-amber-700 rounded-lg shrink-0 mt-0.5 group-hover:bg-amber-200">
              <Shuffle className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900">Move Order & Reposition Shot</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Automatically place this shot into its new chronological slot in the schedule.
              </div>
            </div>
          </button>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
