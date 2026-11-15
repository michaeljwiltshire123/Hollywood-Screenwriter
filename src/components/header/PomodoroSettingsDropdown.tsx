import React from 'react';
import { AppThemeConfig } from '../../lib/themePresets';
import { getModalTheme } from '../../lib/modalTheme';

interface PomodoroSettingsDropdownProps {
  mins: number;
  isRunning?: boolean;
  onTogglePomodoro?: () => void;
  onSetPomodoroMinutes?: (minutes: number) => void;
  onClose: () => void;
  themeConfig?: AppThemeConfig;
}

export const PomodoroSettingsDropdown: React.FC<PomodoroSettingsDropdownProps> = ({
  mins,
  isRunning = true,
  onTogglePomodoro,
  onSetPomodoroMinutes,
  onClose,
  themeConfig,
}) => {
  const m = getModalTheme(themeConfig);

  return (
    <div
      className="absolute right-0 top-full mt-2 z-50 w-52 border rounded-xl shadow-2xl p-3 text-xs font-mono"
      style={m.windowStyle}
      onMouseLeave={onClose}
    >
      <div className="font-bold mb-2" style={m.accentStyle}>Pomodoro Settings</div>
      <button
        onClick={() => {
          onTogglePomodoro?.();
          onClose();
        }}
        className="w-full text-left px-2.5 py-1.5 mb-2 rounded border font-bold cursor-pointer hover:opacity-85 transition"
        style={m.secondaryBtnStyle}
      >
        {isRunning ? '⏸ Pause Timer' : '▶ Resume Timer'}
      </button>
      <div>
        <label className="text-[10px] block mb-1" style={m.mutedStyle}>Set Minutes:</label>
        <div className="flex gap-1">
          <input
            type="number"
            defaultValue={mins}
            id="header-pomodoro-input"
            className="w-full border rounded px-2 py-1 font-bold focus:outline-none"
            style={m.inputStyle}
          />
          <button
            onClick={() => {
              const input = document.getElementById('header-pomodoro-input') as HTMLInputElement;
              if (input && input.value) {
                onSetPomodoroMinutes?.(parseInt(input.value) || 25);
              }
              onClose();
            }}
            className="px-3 font-bold rounded cursor-pointer hover:opacity-90 transition"
            style={m.primaryBtnStyle}
          >
            Set
          </button>
        </div>
      </div>
    </div>
  );
};
