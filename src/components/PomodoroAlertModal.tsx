import React from 'react';
import { Coffee, Gamepad2, RotateCcw, Clock, Lock } from 'lucide-react';
import { AppThemeConfig } from '../lib/themePresets';
import { getModalTheme } from '../lib/modalTheme';

interface PomodoroAlertModalProps {
  isOpen: boolean;
  onSnooze: () => void;
  onDismiss: () => void;
  onOpenGame: () => void;
  gameCooldownSeconds?: number;
  themeConfig?: AppThemeConfig;
}

export const PomodoroAlertModal: React.FC<PomodoroAlertModalProps> = ({
  isOpen,
  onSnooze,
  onDismiss,
  onOpenGame,
  gameCooldownSeconds = 0,
  themeConfig,
}) => {
  if (!isOpen) return null;

  const isLocked = gameCooldownSeconds > 0;
  const m = getModalTheme(themeConfig);

  return (
    <div className="fixed inset-x-0 top-28 bottom-0 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono select-none" style={m.overlayStyle}>
      <div className="border rounded-2xl shadow-2xl max-w-md w-full overflow-hidden text-center p-6 space-y-5" style={m.windowStyle}>
        <div className="w-14 h-14 mx-auto rounded-2xl border flex items-center justify-center animate-bounce" style={{ ...m.cardStyle, ...m.accentStyle }}>
          <Coffee className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold uppercase tracking-wide" style={m.accentStyle}>
            Time for a Break!
          </h2>
          <p className="text-xs leading-relaxed font-sans" style={m.mutedStyle}>
            {isLocked
              ? `Your Pomodoro sprint is complete. Games are on a 10-minute focus block (${Math.ceil(gameCooldownSeconds / 60)}m remaining). Please stretch or rest your eyes!`
              : 'Your Pomodoro focus session has completed. Step away, stretch your eyes, or jump into a quick break game!'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
          <button
            onClick={onSnooze}
            className="px-3 py-2.5 border font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer hover:opacity-85"
            style={m.secondaryBtnStyle}
          >
            <Clock className="w-4 h-4" style={m.accentStyle} />
            <span>Snooze (5m)</span>
          </button>
          <button
            onClick={onDismiss}
            className="px-3 py-2.5 border font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer hover:opacity-85"
            style={m.secondaryBtnStyle}
          >
            <RotateCcw className="w-4 h-4 opacity-75" />
            <span>Dismiss</span>
          </button>
          <button
            onClick={onOpenGame}
            className="px-3 py-2.5 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg transition border cursor-pointer hover:opacity-90"
            style={isLocked ? m.secondaryBtnStyle : m.primaryBtnStyle}
          >
            {isLocked ? <Lock className="w-4 h-4" /> : <Gamepad2 className="w-4 h-4" />}
            <span>{isLocked ? `Locked (${Math.ceil(gameCooldownSeconds / 60)}m)` : 'Break Game'}</span>
          </button>
        </div>
        <p className="text-[11px] font-mono pt-2" style={m.accentStyle}>
          Tip: Click EXPORT or Sync to Drive before you step away!
        </p>
      </div>
    </div>
  );
};
