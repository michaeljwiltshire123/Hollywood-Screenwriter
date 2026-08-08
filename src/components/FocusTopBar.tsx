import React from 'react';
import { Clock, PenTool, EyeOff, Sparkles, Trophy } from 'lucide-react';

interface FocusTopBarProps {
  targetMins: number;
  targetWords: number;
  netWords: number;
  elapsedSeconds: number;
  onExitFocus: () => void;
  onFinishEarly: () => void;
}

export const FocusTopBar: React.FC<FocusTopBarProps> = ({
  targetMins,
  targetWords,
  netWords,
  elapsedSeconds,
  onExitFocus,
  onFinishEarly,
}) => {
  const totalTargetSecs = Math.max(1, targetMins * 60);
  const timePercent = Math.min(100, Math.max(0, (elapsedSeconds / totalTargetSecs) * 100));

  const wordPercent = Math.min(100, Math.max(0, (netWords / targetWords) * 100));
  const isGoalReached = netWords >= targetWords;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const remainingSecs = Math.max(0, totalTargetSecs - elapsedSeconds);

  return (
    <div className="bg-slate-950/95 border-b border-amber-500/30 text-slate-100 py-2.5 px-4 select-none shadow-2xl relative z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 font-mono">
        {/* Left Label */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="p-1.5 bg-amber-500/20 border border-amber-500/40 rounded-lg text-amber-400">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="text-xs font-black text-amber-300 tracking-wider uppercase flex items-center gap-1.5">
              <span>ZONED FOCUS SPRINT</span>
              {isGoalReached && (
                <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[10px] font-black rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse flex items-center gap-1">
                  <Trophy className="w-3 h-3" /> GOAL HIT!
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400 font-sans">
              Distraction-free environment • Keep typing
            </div>
          </div>
        </div>

        {/* Dual Progress Bars Area */}
        <div className="flex-1 max-w-2xl w-full space-y-2 px-2">
          {/* Time Progress Bar */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                TIME ({formatTime(elapsedSeconds)} / {targetMins}:00)
              </span>
              <span className="text-sky-300">
                {formatTime(remainingSecs)} remaining ({Math.round(timePercent)}%)
              </span>
            </div>
            <div className="h-3 w-full bg-slate-900 border border-slate-700/80 rounded-full overflow-hidden p-0.5 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-amber-400 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${timePercent}%` }}
              />
            </div>
          </div>

          {/* Word Count Progress Bar */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-300 flex items-center gap-1.5">
                <PenTool className="w-3.5 h-3.5 text-amber-400" />
                NET WORDS (+{netWords} / {targetWords} words)
              </span>
              <span className={isGoalReached ? 'text-amber-300 font-black animate-pulse' : 'text-amber-400/90'}>
                {Math.round((netWords / targetWords) * 100)}% {isGoalReached ? '🎉' : ''}
              </span>
            </div>
            <div
              className={`h-3 w-full bg-slate-900 border rounded-full overflow-hidden p-0.5 transition-all duration-300 shadow-inner ${
                isGoalReached
                  ? 'border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                  : 'border-slate-700/80'
              }`}
            >
              <div
                className={`h-full rounded-full transition-all duration-300 ease-out ${
                  isGoalReached
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 shadow-[0_0_12px_rgba(250,204,21,0.8)]'
                    : 'bg-gradient-to-r from-amber-600 to-amber-400'
                }`}
                style={{ width: `${wordPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onFinishEarly}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer"
            title="Finish sprint and view results card"
          >
            RESULTS
          </button>
          <button
            type="button"
            onClick={onExitFocus}
            className="px-3.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            title="Exit Focus Mode"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>EXIT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
