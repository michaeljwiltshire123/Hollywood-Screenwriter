import React from 'react';

interface PomodoroSettingsDropdownProps {
  mins: number;
  isRunning?: boolean;
  onTogglePomodoro?: () => void;
  onSetPomodoroMinutes?: (minutes: number) => void;
  onClose: () => void;
}

export const PomodoroSettingsDropdown: React.FC<PomodoroSettingsDropdownProps> = ({
  mins,
  isRunning = true,
  onTogglePomodoro,
  onSetPomodoroMinutes,
  onClose,
}) => {
  return (
    <div
      className="absolute right-0 top-full mt-2 z-50 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 text-xs font-mono"
      onMouseLeave={onClose}
    >
      <div className="font-bold text-amber-300 mb-2">Pomodoro Settings</div>
      <button
        onClick={() => {
          onTogglePomodoro?.();
          onClose();
        }}
        className="w-full text-left px-2.5 py-1.5 mb-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold"
      >
        {isRunning ? '⏸ Pause Timer' : '▶ Resume Timer'}
      </button>
      <div>
        <label className="text-[10px] text-slate-400 block mb-1">Set Minutes:</label>
        <div className="flex gap-1">
          <input
            type="number"
            defaultValue={mins}
            id="header-pomodoro-input"
            className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-100 font-bold"
          />
          <button
            onClick={() => {
              const input = document.getElementById('header-pomodoro-input') as HTMLInputElement;
              if (input && input.value) {
                onSetPomodoroMinutes?.(parseInt(input.value) || 25);
              }
              onClose();
            }}
            className="px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded cursor-pointer"
          >
            Set
          </button>
        </div>
      </div>
    </div>
  );
};
