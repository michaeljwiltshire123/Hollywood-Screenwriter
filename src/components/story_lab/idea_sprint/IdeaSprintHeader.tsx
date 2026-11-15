import React from 'react';
import { Timer, Heart, CheckCircle2, Flame } from 'lucide-react';
import { AppThemeConfig } from '../../../lib/themePresets';
import { getModalTheme } from '../../../lib/modalTheme';

interface HeaderProps {
  remainingSeconds: number;
  livesRemaining: number;
  onUseLife: () => void;
  flowMode?: boolean;
  onToggleFlowMode?: () => void;
  onFinishEarly: () => void;
  themeConfig?: AppThemeConfig;
}

export const IdeaSprintHeader: React.FC<HeaderProps> = ({
  remainingSeconds, livesRemaining, onUseLife, onFinishEarly, themeConfig,
}) => {
  const mt = getModalTheme(themeConfig);
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const timeStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  const isUrgent = remainingSeconds <= 45;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border shadow-xl font-sans" style={mt.cardStyle}>
      <div className="flex items-center gap-4">
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black font-mono text-xl sm:text-2xl tracking-widest transition-all border-2 ${
            isUrgent ? 'bg-rose-600 text-white border-rose-400 animate-pulse' : ''
          }`}
          style={isUrgent ? undefined : { ...mt.subCardStyle, borderColor: mt.theme.accentButtons, color: mt.theme.accentText }}
        >
          <Timer className={`w-6 h-6 ${isUrgent ? 'animate-spin' : ''}`} />
          <span>{timeStr}</span>
          {isUrgent && <span className="text-[10px] font-bold uppercase tracking-wider ml-1">FINAL SECONDS!</span>}
        </div>

        <div className="flex items-center gap-2 pl-3 border-l" style={mt.borderStyle}>
          <span className="text-xs font-bold flex items-center gap-1" style={mt.mutedStyle}>
            <Flame className="w-3.5 h-3.5" style={mt.accentStyle} />
            3 Twist Lives:
          </span>
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((idx) => {
              const isAvailable = idx < livesRemaining;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={isAvailable ? onUseLife : undefined}
                  disabled={!isAvailable}
                  className={`p-1.5 rounded-md transition ${
                    isAvailable ? 'text-rose-500 hover:scale-125 cursor-pointer active:scale-90' : 'opacity-30 cursor-not-allowed'
                  }`}
                  title={isAvailable ? 'Use 1 Twist Life for a wild narrative curveball' : 'Twist Life used'}
                >
                  <Heart className={`w-4 h-4 ${isAvailable ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onFinishEarly}
          className="px-4 py-2 rounded-lg text-xs font-black transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md hover:opacity-90"
          style={mt.primaryBtnStyle}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Finish Sprint</span>
        </button>
      </div>
    </div>
  );
};
