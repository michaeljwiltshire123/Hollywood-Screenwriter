import React from 'react';
import { X, Lock, PenTool, Clock } from 'lucide-react';
import { formatCooldownDisplay } from '../lib/gameCooldownManager';

interface GameLockoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  remainingSeconds: number;
}

export const GameLockoutModal: React.FC<GameLockoutModalProps> = ({
  isOpen,
  onClose,
  remainingSeconds,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 top-28 bottom-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono select-none">
      <div className="bg-slate-900 border-2 border-amber-400/80 rounded-2xl shadow-2xl max-w-md w-full text-slate-100 overflow-hidden text-center p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/20 border-2 border-amber-400/60 flex items-center justify-center text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)]">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black text-amber-300 uppercase tracking-wide">
            Focus Sprint In Progress
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Splendid effort returning to your draft! To prioritise your writing momentum and maintain productivity, break games are paused during this 10-minute focus session.
          </p>
        </div>

        {/* Live Countdown Display */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-slate-400">Next break available in:</span>
          <span className="text-sm font-bold text-amber-300">
            {formatCooldownDisplay(remainingSeconds)}
          </span>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full font-mono uppercase font-bold tracking-wider bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3 rounded-xl border border-amber-300 shadow-lg text-xs flex items-center justify-center gap-2 transition hover:scale-[1.02] cursor-pointer"
          >
            <PenTool className="w-4 h-4" />
            <span>Return to Writing</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-sans">
          <span>Tip: Complete your current scene to earn additional writing streaks.</span>
        </div>
      </div>
    </div>
  );
};
