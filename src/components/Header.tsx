import React from 'react';
import { BookOpen, Calendar } from 'lucide-react';
import { ScreenplayDocument } from '../types';
import { NavigatorToggle } from './header/NavigatorToggle';
import { ScriptTitleEditor } from './header/ScriptTitleEditor';
import { HeaderActionButtons } from './header/HeaderActionButtons';

interface HeaderProps {
  script: ScreenplayDocument;
  onUpdateTitle: (newTitle: string) => void;
  onUpdateDraftStatus?: (status: ScreenplayDocument['draftStatus']) => void;
  isSidePanelOpen: boolean;
  onToggleSidePanel: () => void;
  onOpenTitlePage: () => void;
  onOpenHistoryModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenDebugModal?: () => void;
  onNewScript: () => void;
  onLoadSample: () => void;
  onExport: (format: 'pdf' | 'docx' | 'screenplay' | 'print') => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  latencyMs?: number;
  draftModeActive?: boolean;
  onToggleDraftMode?: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
  pomodoroSeconds: number;
  onOpenBreakModal: () => void;
  gameCooldownSeconds?: number;
  isPomodoroRunning?: boolean;
  onTogglePomodoro?: () => void;
  onSetPomodoroMinutes?: (minutes: number) => void;
  onOpenTableRead?: () => void;
  onOpenProductionSchedule?: () => void;
  linkedFileName?: string | null;
  hasFileHandle?: boolean;
  isDirty?: boolean;
  onSave?: () => void;
  onSaveAs?: () => void;
  onOpenProject?: () => void;
}

export const Header: React.FC<HeaderProps> = (props) => {
  const {
    script,
    onUpdateTitle,
    isSidePanelOpen,
    onToggleSidePanel,
    isFocusMode,
    onOpenTableRead,
    onOpenProductionSchedule,
  } = props;

  return (
    <header className="fixed top-0 left-0 right-0 !z-50 bg-slate-900 border-b border-slate-800 text-slate-100 select-none shadow-2xl">
      <div className="w-full px-2 sm:px-4 h-14 flex items-center justify-between gap-1.5 sm:gap-3 min-w-0">
        {/* Left: Navigator Toggle & Script Title */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          {!isFocusMode && (
            <NavigatorToggle isOpen={isSidePanelOpen} onToggle={onToggleSidePanel} />
          )}
          <ScriptTitleEditor title={script.title} onUpdateTitle={onUpdateTitle} />
        </div>

        {/* Center: Table Read & Production Schedule (Shown on very wide screens, otherwise in Tools) */}
        {!isFocusMode && (
          <div className="hidden 2xl:flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenTableRead}
              className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/40 hover:bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition shadow-xs cursor-pointer shrink-0"
              title="Open Table Read Rehearsal Studio"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>TABLE READ</span>
            </button>
            <button
              onClick={onOpenProductionSchedule}
              className="flex items-center gap-1.5 bg-sky-500/10 border border-sky-500/40 hover:bg-sky-500/20 text-sky-300 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition shadow-xs cursor-pointer shrink-0"
              title="Open Production Schedule"
            >
              <Calendar className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>PRODUCTION SCHEDULE</span>
            </button>
          </div>
        )}

        {/* Right: Adaptive Action Controls */}
        <HeaderActionButtons {...props} isDirty={props.isDirty ?? false} />
      </div>
    </header>
  );
};
