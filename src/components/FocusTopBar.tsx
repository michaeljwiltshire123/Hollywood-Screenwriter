import React from 'react';
import { Clock, PenTool, EyeOff, Sparkles, Trophy } from 'lucide-react';
import { AppThemeConfig } from '../lib/themePresets';
import { getModalTheme } from '../lib/modalTheme';

interface FocusTopBarProps {
  targetMins: number;
  targetWords: number;
  netWords: number;
  elapsedSeconds: number;
  onExitFocus: () => void;
  onFinishEarly: () => void;
  themeConfig?: AppThemeConfig;
}

export const FocusTopBar: React.FC<FocusTopBarProps> = ({
  targetMins, targetWords, netWords, elapsedSeconds, onExitFocus, onFinishEarly, themeConfig,
}) => {
  const m = getModalTheme(themeConfig);
  const totalTargetSecs = Math.max(1, targetMins * 60);
  const timePercent = Math.min(100, Math.max(0, (elapsedSeconds / totalTargetSecs) * 100));
  const wordPercent = Math.min(100, Math.max(0, (netWords / targetWords) * 100));
  const isGoalReached = netWords >= targetWords;
  const formatTime = (secs: number) => `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
  const remainingSecs = Math.max(0, totalTargetSecs - elapsedSeconds);

  return (
    <div className="border-b py-2.5 px-4 select-none shadow-md relative z-40" style={m.headerStyle}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 font-mono">
        <div className="flex items-center gap-2 shrink-0">
          <div className="p-1.5 border rounded-lg" style={{ ...m.cardStyle, ...m.accentStyle }}>
            <Sparkles className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="text-xs font-black tracking-wider uppercase flex items-center gap-1.5" style={m.accentStyle}>
              <span>ZONED FOCUS SPRINT</span>
              {isGoalReached && (
                <span className="px-2 py-0.5 text-[10px] font-black rounded-full animate-pulse flex items-center gap-1" style={m.primaryBtnStyle}>
                  <Trophy className="w-3 h-3" /> GOAL HIT!
                </span>
              )}
            </div>
            <div className="text-[10px] font-sans" style={m.mutedStyle}>Distraction-free environment • Keep typing</div>
          </div>
        </div>

        <div className="flex-1 max-w-2xl w-full space-y-2 px-2">
          <div className="space-y-0.5">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" style={m.accentStyle} />TIME ({formatTime(elapsedSeconds)} / {targetMins}:00)</span>
              <span style={m.accentStyle}>{formatTime(remainingSecs)} remaining ({Math.round(timePercent)}%)</span>
            </div>
            <div className="h-3 w-full border rounded-full overflow-hidden p-0.5 shadow-inner" style={m.cardStyle}>
              <div className="h-full rounded-full transition-all duration-300 ease-out" style={{ width: `${timePercent}%`, backgroundColor: m.theme.accentButtons }} />
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="flex items-center gap-1.5"><PenTool className="w-3.5 h-3.5" style={m.accentStyle} />NET WORDS (+{netWords} / {targetWords} words)</span>
              <span className={isGoalReached ? 'font-black animate-pulse' : ''} style={m.accentStyle}>{Math.round((netWords / targetWords) * 100)}% {isGoalReached ? '🎉' : ''}</span>
            </div>
            <div className="h-3 w-full border rounded-full overflow-hidden p-0.5 shadow-inner" style={m.cardStyle}>
              <div className="h-full rounded-full transition-all duration-300 ease-out" style={{ width: `${wordPercent}%`, backgroundColor: m.theme.accentButtons }} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button type="button" onClick={onFinishEarly} className="px-3 py-1.5 border rounded-xl text-xs font-bold transition cursor-pointer hover:opacity-85" style={m.secondaryBtnStyle} title="Finish sprint and view results card">
            RESULTS
          </button>
          <button type="button" onClick={onExitFocus} className="px-3.5 py-1.5 border rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer hover:opacity-90" style={m.primaryBtnStyle} title="Exit Focus Mode">
            <EyeOff className="w-3.5 h-3.5" /><span>EXIT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
