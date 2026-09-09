import React, { useState } from 'react';
import { Coffee, Lock, Settings } from 'lucide-react';
import { PomodoroSettingsDropdown } from './PomodoroSettingsDropdown';

interface PomodoroWidgetProps {
  seconds: number;
  onOpenBreakModal: () => void;
  gameCooldownSeconds?: number;
  isRunning?: boolean;
  onTogglePomodoro?: () => void;
  onSetPomodoroMinutes?: (minutes: number) => void;
}

export const PomodoroWidget: React.FC<PomodoroWidgetProps> = ({
  seconds,
  onOpenBreakModal,
  gameCooldownSeconds = 0,
  isRunning = true,
  onTogglePomodoro,
  onSetPomodoroMinutes,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const mins = Math.floor(seconds / 60);
  const secs = String(seconds % 60).padStart(2, '0');

  return (
    <div
      id="header-pomodoro-widget"
      className={`relative flex items-center bg-slate-800 border rounded-lg transition shrink-0 ${
        gameCooldownSeconds > 0
          ? 'border-amber-500/40 hover:border-amber-400'
          : 'border-slate-700 hover:border-amber-400'
      }`}
    >
      <button
        onClick={onOpenBreakModal}
        className="px-2.5 py-1.5 min-h-[38px] text-amber-300 text-xs font-bold flex items-center gap-1.5 transition shrink-0 whitespace-nowrap cursor-pointer hover:text-white"
        title={
          gameCooldownSeconds > 0
            ? `Focus Sprint Active: Break games locked for another ${Math.floor(
                gameCooldownSeconds / 60
              )}m ${gameCooldownSeconds % 60}s.`
            : 'Pomodoro Break & Game Suite'
        }
      >
        {gameCooldownSeconds > 0 ? (
          <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        ) : (
          <Coffee className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        )}
        <span>{mins}:{secs}</span>
      </button>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 min-h-[38px] text-slate-400 hover:text-white border-l border-slate-700 transition cursor-pointer"
        title="Pomodoro Settings"
      >
        <Settings className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <PomodoroSettingsDropdown
          mins={mins}
          isRunning={isRunning}
          onTogglePomodoro={onTogglePomodoro}
          onSetPomodoroMinutes={onSetPomodoroMinutes}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
