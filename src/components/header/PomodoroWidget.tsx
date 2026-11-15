import React, { useState } from 'react';
import { Coffee, Lock, Settings } from 'lucide-react';
import { AppThemeConfig } from '../../lib/themePresets';
import { PomodoroSettingsDropdown } from './PomodoroSettingsDropdown';

interface PomodoroWidgetProps {
  seconds: number;
  onOpenBreakModal: () => void;
  gameCooldownSeconds?: number;
  isRunning?: boolean;
  onTogglePomodoro?: () => void;
  onSetPomodoroMinutes?: (minutes: number) => void;
  themeConfig?: AppThemeConfig;
}

export const PomodoroWidget: React.FC<PomodoroWidgetProps> = ({
  seconds,
  onOpenBreakModal,
  gameCooldownSeconds = 0,
  isRunning = true,
  onTogglePomodoro,
  onSetPomodoroMinutes,
  themeConfig,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const mins = Math.floor(seconds / 60);
  const secs = String(seconds % 60).padStart(2, '0');

  return (
    <div
      id="header-pomodoro-widget"
      className="relative flex items-center border rounded-lg transition shrink-0"
      style={{
        backgroundColor: themeConfig?.sceneCards || '#F4ECE0',
        borderColor: gameCooldownSeconds > 0 ? (themeConfig?.accentButtons || '#8C6239') : (themeConfig?.borders || '#E4D3B9'),
      }}
    >
      <button
        onClick={onOpenBreakModal}
        className="px-2.5 py-1.5 min-h-[38px] text-xs font-bold flex items-center gap-1.5 transition shrink-0 whitespace-nowrap cursor-pointer hover:opacity-80"
        style={{ color: themeConfig?.primaryText || '#433422' }}
        title={
          gameCooldownSeconds > 0
            ? `Focus Sprint Active: Break games locked for another ${Math.floor(
                gameCooldownSeconds / 60
              )}m ${gameCooldownSeconds % 60}s.`
            : 'Pomodoro Break & Game Suite'
        }
      >
        {gameCooldownSeconds > 0 ? (
          <Lock className="w-3.5 h-3.5 shrink-0" style={{ color: themeConfig?.accentText || '#8C6239' }} />
        ) : (
          <Coffee className="w-3.5 h-3.5 shrink-0" style={{ color: themeConfig?.accentText || '#8C6239' }} />
        )}
        <span>{mins}:{secs}</span>
      </button>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 min-h-[38px] border-l transition cursor-pointer hover:opacity-80"
        style={{
          color: themeConfig?.primaryText || '#433422',
          borderColor: themeConfig?.borders || '#E4D3B9',
        }}
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
          themeConfig={themeConfig}
        />
      )}
    </div>
  );
};
