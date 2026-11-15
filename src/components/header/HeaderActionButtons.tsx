import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { HeaderProps } from './types';
import { PomodoroWidget } from './PomodoroWidget';
import { UndoRedoGroup } from './UndoRedoGroup';
import { ThemeDropdownButton } from './ThemeDropdownButton';
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
  currentThemePreset,
  onSelectThemePreset,
  onCustomPaperColor,
  onCustomTextColor,
  currentPaperColor,
  currentTextColor,
  themeConfig,
}) => {
  const accent = themeConfig?.accentButtons || '#8C6239';

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
      {!isFocusMode && (
        <div className="flex items-center gap-1.5">
          <UndoRedoGroup
            onUndo={onUndo}
            onRedo={onRedo}
            canUndo={canUndo}
            canRedo={canRedo}
            themeConfig={themeConfig}
          />
          <ThemeDropdownButton
            currentPreset={currentThemePreset || 'Vintage'}
            onSelectPreset={onSelectThemePreset || (() => {})}
            onCustomPaperColor={onCustomPaperColor || (() => {})}
            onCustomTextColor={onCustomTextColor || (() => {})}
            currentPaperColor={currentPaperColor || '#FFFFFF'}
            currentTextColor={currentTextColor || '#433422'}
            themeConfig={themeConfig}
          />
        </div>
      )}
      <button
        id="header-focus-btn"
        onClick={onToggleFocusMode}
        className="px-2.5 py-1.5 min-h-[38px] border rounded-lg text-xs font-bold flex items-center gap-1.5 transition shrink-0 whitespace-nowrap cursor-pointer hover:opacity-90"
        style={{
          backgroundColor: isFocusMode ? accent : (themeConfig?.sceneCards || '#F4ECE0'),
          borderColor: isFocusMode ? accent : (themeConfig?.borders || '#E4D3B9'),
          color: isFocusMode ? '#FFFFFF' : (themeConfig?.primaryText || '#433422'),
        }}
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
        themeConfig={themeConfig}
      />
      {!isFocusMode && (
        <>
          <QuickSaveButton onSave={onSave} isDirty={isDirty} themeConfig={themeConfig} />
          <MainBarQuickActions
            onOpenTableRead={onOpenTableRead}
            onOpenHistoryModal={onOpenHistoryModal}
            themeConfig={themeConfig}
          />
        </>
      )}
    </div>
  );
};
