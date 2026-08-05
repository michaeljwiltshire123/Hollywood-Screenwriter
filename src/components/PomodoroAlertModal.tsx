import React from 'react';
import { X, Coffee, Gamepad2, RotateCcw, Clock } from 'lucide-react';

interface PomodoroAlertModalProps {
  isOpen: boolean;
  onSnooze: () => void;
  onDismiss: () => void;
  onOpenGame: () => void;
}

export const PomodoroAlertModal: React.FC<PomodoroAlertModalProps> = ({
  isOpen,
  onSnooze,
  onDismiss,
  onOpenGame,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono">
      <div className="bg-slate-900 border border-amber-500/50 rounded-2xl shadow-2xl max-w-md w-full text-slate-100 overflow-hidden text-center p-6 space-y-5">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 animate-bounce">
          <Coffee className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-amber-300 uppercase tracking-wide">
            Time for a Break!
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your 25-minute Pomodoro focus session has completed. Step away, stretch your eyes, or jump into a quick break game!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
          <button
            onClick={onSnooze}
            className="px-3 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Clock className="w-4 h-4 text-sky-400" />
            <span>Snooze (5m)</span>
          </button>
          <button
            onClick={onDismiss}
            className="px-3 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Dismiss</span>
          </button>
          <button
            onClick={onOpenGame}
            className="px-3 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg transition"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Break Game</span>
          </button>
        </div>
        <p className="text-[11px] text-amber-400/90 font-mono pt-2">
          Tip: Click EXPORT or Sync to Drive before you step away!
        </p>
      </div>
    </div>
  );
};
