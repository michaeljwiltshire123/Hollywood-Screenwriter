import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { HeaderProps } from './types';
import { PomodoroWidget } from './PomodoroWidget';
import { UndoRedoGroup } from './UndoRedoGroup';
import { QuickSaveButton } from './QuickSaveButton';
import { MainBarQuickActions } from './MainBarQuickActions';

export const HeaderActionButtons: React.FC<HeaderProps> = ({
  isFocusMode,
  onToggleFocusMode,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onSave,
  isDirty = false,
  pomodoroSeconds,
  onOpenBreakModal,
  gameCooldownSeconds,
  isPomodoroRunning,
  onTogglePomodoro,
  onSetPomodoroMinutes,
  onOpenTableRead,
  onOpenHistoryModal,
  onOpenTitlePage,
}) => {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
      {!isFocusMode && (
        <UndoRedoGroup onUndo={onUndo} onRedo={onRedo} canUndo={canUndo} canRedo={canRedo} />
      )}
      <button
        id="header-focus-btn"
        onClick={onToggleFocusMode}
        className={`px-2.5 py-1.5 min-h-[38px] border rounded-lg text-xs font-bold flex items-center gap-1.5 transition shrink-0 whitespace-nowrap cursor-pointer ${
          isFocusMode
            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
            : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750 hover:text-white'
        }`}
        title="Toggle Zen Focus Mode"
      >
        {isFocusMode ? <EyeOff className="w-4 h-4 shrink-0" /> : <Eye className="w-4 h-4 shrink-0" />}
        <span className="hidden sm:inline">FOCUS</span>
      </button>
      <PomodoroWidget
        seconds={pomodoroSeconds}
        onOpenBreakModal={onOpenBreakModal}
        gameCooldownSeconds={gameCooldownSeconds}
        isRunning={isPomodoroRunning}
        onTogglePomodoro={onTogglePomodoro}
        onSetPomodoroMinutes={onSetPomodoroMinutes}
      />
      {!isFocusMode && (
        <>
          <QuickSaveButton onSave={onSave} isDirty={isDirty} />
          <MainBarQuickActions
            onOpenTableRead={onOpenTableRead}
            onOpenHistoryModal={onOpenHistoryModal}
            onOpenTitlePage={onOpenTitlePage}
          />
        </>
      )}
    </div>
  );
};
