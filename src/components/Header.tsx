import React, { useState } from 'react';
import {
  FileText,
  Save,
  Download,
  Upload,
  Sparkles,
  PanelLeft,
  BookOpen,
  History,
  Plus,
  ShieldCheck,
  Check,
  FileCode,
  Printer,
  ChevronDown,
  Settings,
  Database,
  Undo2,
  Redo2,
  Focus,
  Eye,
  EyeOff,
  Cloud,
  Coffee,
  MoreVertical,
} from 'lucide-react';
import { ScreenplayDocument } from '../types';

interface HeaderProps {
  script: ScreenplayDocument;
  onUpdateTitle: (newTitle: string) => void;
  onUpdateDraftStatus: (status: ScreenplayDocument['draftStatus']) => void;
  isSidePanelOpen: boolean;
  onToggleSidePanel: () => void;
  onOpenTitlePage: () => void;
  onOpenHistoryModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenDebugModal: () => void;
  onNewScript: () => void;
  onLoadSample: () => void;
  onExport: (format: 'pdf' | 'docx' | 'drive') => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  latencyMs: number;
  draftModeActive: boolean;
  onToggleDraftMode: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
  pomodoroSeconds: number;
  onOpenBreakModal: () => void;
  isPomodoroRunning?: boolean;
  onTogglePomodoro?: () => void;
  onSetPomodoroMinutes?: (minutes: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  script,
  onUpdateTitle,
  onUpdateDraftStatus,
  isSidePanelOpen,
  onToggleSidePanel,
  onOpenTitlePage,
  onOpenHistoryModal,
  onOpenSettingsModal,
  onOpenDebugModal,
  onNewScript,
  onLoadSample,
  onExport,
  onImport,
  latencyMs,
  draftModeActive,
  onToggleDraftMode,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isFocusMode,
  onToggleFocusMode,
  pomodoroSeconds,
  onOpenBreakModal,
  isPomodoroRunning = true,
  onTogglePomodoro,
  onSetPomodoroMinutes,
}) => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isScriptMenuOpen, setIsScriptMenuOpen] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const [isPomodoroSettingsOpen, setIsPomodoroSettingsOpen] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(script.title);

  const handleTitleSubmit = () => {
    setEditingTitle(false);
    if (titleText.trim()) {
      onUpdateTitle(titleText.trim().toUpperCase());
    } else {
      setTitleText(script.title);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 !z-50 bg-slate-900 border-b border-slate-800 text-slate-100 select-none pointer-events-auto shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
        {/* Left Section: Branding, Navigator Toggle, Script Title */}
        <div className="flex items-center gap-3 min-w-0 pointer-events-auto">
          {!isFocusMode && (
            <button
              onClick={onToggleSidePanel}
              className={`p-2 rounded-lg border transition ${
                isSidePanelOpen
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title="Toggle Navigator Side Panel"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-2 min-w-0">
            <span className="font-extrabold text-sm tracking-wider uppercase text-amber-400 hidden sm:inline">
              SCREENWRITER PRO
            </span>
            <div className="h-4 w-px bg-slate-700 hidden sm:block" />

            {editingTitle ? (
              <input
                type="text"
                value={titleText}
                onChange={(e) => setTitleText(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTitleSubmit();
                }}
                autoFocus
                className="bg-slate-950 border border-amber-400 rounded px-2 py-0.5 text-xs font-mono text-amber-300 focus:outline-none"
              />
            ) : (
              <button
                onClick={() => setEditingTitle(true)}
                className="font-mono text-xs font-semibold text-slate-200 hover:text-amber-300 truncate max-w-[150px] sm:max-w-[220px] transition text-left"
                title="Click to rename screenplay title"
              >
                {script.title || 'UNTITLED SCREENPLAY'}
              </button>
            )}
          </div>
        </div>

        {/* Center: Saved Status */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-full text-xs font-mono text-slate-300">
          <Save className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400 font-semibold">IndexedDB Local-First</span>
        </div>

        {/* Right Section: Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          {/* Atomic Undo / Redo */}
          <div className="hidden sm:flex items-center bg-slate-800 border border-slate-700 rounded overflow-hidden">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent transition"
              title="Undo last change"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <div className="w-px bg-slate-700 h-4" />
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent transition"
              title="Redo change"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Focus Mode Toggle & Pomodoro Break Button */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleFocusMode}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 border rounded text-xs font-medium flex items-center gap-1.5 transition ${
                isFocusMode
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
              }`}
              title="Toggle Zen Focus Mode"
            >
              {isFocusMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="hidden lg:inline">FOCUS</span>
            </button>

            {/* Pomodoro Timer with Settings Gear */}
            <div className="relative flex items-center bg-slate-800 border border-slate-700 hover:border-amber-400 rounded transition">
              <button
                onClick={onOpenBreakModal}
                className="px-2 py-1.5 text-amber-300 text-xs font-bold flex items-center gap-1 transition"
                title="Pomodoro Break & Game Box"
              >
                <Coffee className="w-3.5 h-3.5 text-amber-400" />
                <span>{Math.floor(pomodoroSeconds / 60)}:{String(pomodoroSeconds % 60).padStart(2, '0')}</span>
              </button>
              <button
                onClick={() => setIsPomodoroSettingsOpen(!isPomodoroSettingsOpen)}
                className="p-1.5 text-slate-400 hover:text-white border-l border-slate-700 transition"
                title="Pomodoro Settings"
              >
                <Settings className="w-3 h-3" />
              </button>

              {isPomodoroSettingsOpen && (
                <div
                  className="absolute right-0 mt-8 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-xl p-3 z-50 text-xs font-mono"
                  onMouseLeave={() => setIsPomodoroSettingsOpen(false)}
                >
                  <div className="font-bold text-amber-300 mb-2">Pomodoro Settings</div>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        onTogglePomodoro?.();
                        setIsPomodoroSettingsOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold"
                    >
                      {isPomodoroRunning ? '⏸ Pause Timer' : '▶ Resume Timer'}
                    </button>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Set Minutes:</label>
                      <div className="flex gap-1">
                        <input
                          type="number"
                          defaultValue={Math.floor(pomodoroSeconds / 60)}
                          id="custom-pomodoro-mins"
                          className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-100 font-bold"
                        />
                        <button
                          onClick={() => {
                            const input = document.getElementById('custom-pomodoro-mins') as HTMLInputElement;
                            if (input && input.value) {
                              onSetPomodoroMinutes?.(parseInt(input.value) || 25);
                            }
                            setIsPomodoroSettingsOpen(false);
                          }}
                          className="px-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded"
                        >
                          Set
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Actions (Hidden on mobile < 768px) */}
          <div className="hidden md:flex items-center gap-1.5">
            {/* History / Revisions */}
            <button
              onClick={onOpenHistoryModal}
              className="p-1.5 sm:px-2.5 sm:py-1.5 bg-slate-800 border border-slate-700 rounded text-slate-200 hover:bg-slate-750 text-xs font-medium flex items-center gap-1.5 transition"
              title="Open Revision History"
            >
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xl:inline">REVISIONS</span>
            </button>

            {/* Title Page Modal */}
            <button
              onClick={onOpenTitlePage}
              className="p-1.5 sm:px-2.5 sm:py-1.5 bg-slate-800 border border-slate-700 rounded text-slate-200 hover:bg-slate-750 text-xs font-medium flex items-center gap-1.5 transition"
              title="Edit Title Page details"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden lg:inline">TITLE PAGE</span>
            </button>

            {/* Connect to Drive Modal */}
            <button
              onClick={onOpenSettingsModal}
              className="p-1.5 sm:px-2.5 sm:py-1.5 bg-slate-800 border border-slate-700 rounded text-slate-300 hover:bg-slate-750 text-xs font-medium flex items-center gap-1.5 transition"
              title="Connect to Google Drive & Font Settings"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden lg:inline">CONNECT TO DRIVE</span>
            </button>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded text-xs flex items-center gap-1 transition shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>EXPORT</span>
                <ChevronDown className="w-3 h-3 ml-0.5" />
              </button>

              {isExportOpen && (
                <div
                  className="absolute right-0 mt-1 w-52 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-50 text-xs font-mono"
                  onMouseLeave={() => setIsExportOpen(false)}
                >
                  <div className="px-3 py-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-700">
                    Export Options
                  </div>
                  <button
                    onClick={() => {
                      onExport('pdf');
                      setIsExportOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-700 flex items-center gap-2"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-400" />
                    PDF Screenplay (.pdf)
                  </button>
                  <button
                    onClick={() => {
                      onExport('docx');
                      setIsExportOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-700 flex items-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    Word Document (.docx)
                  </button>
                  <button
                    onClick={() => {
                      onExport('drive');
                      setIsExportOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-700 flex items-center gap-2 border-t border-slate-700"
                  >
                    <Cloud className="w-3.5 h-3.5 text-sky-400" />
                    Sync to Google Drive
                  </button>
                </div>
              )}
            </div>

            {/* Import / Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsScriptMenuOpen(!isScriptMenuOpen)}
                className="p-1.5 bg-slate-800 border border-slate-700 rounded text-slate-300 hover:bg-slate-700 text-xs font-medium"
                title="Script Actions & Import"
              >
                <Upload className="w-4 h-4" />
              </button>

              {isScriptMenuOpen && (
                <div
                  className="absolute right-0 mt-1 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-50 text-xs"
                  onMouseLeave={() => setIsScriptMenuOpen(false)}
                >
                  <label className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-700 flex items-center gap-2 cursor-pointer border-b border-slate-700">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Load .pdf / .docx / .txt</span>
                    <input type="file" accept=".pdf,.docx,.fdx,.fountain,.txt,.json" onChange={onImport} className="hidden" />
                  </label>
                  <button
                    onClick={() => {
                      onNewScript();
                      setIsScriptMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-700 flex items-center gap-2"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    New Blank Screenplay
                  </button>
                  <button
                    onClick={() => {
                      onLoadSample();
                      setIsScriptMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-700 flex items-center gap-2"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                    Load Sample Script
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile "More Actions" Dropdown (< 768px) */}
          <div className="relative md:hidden">
            <button
              onClick={() => setIsMobileMoreOpen(!isMobileMoreOpen)}
              className="p-1.5 bg-slate-800 border border-slate-700 rounded text-slate-300 hover:bg-slate-700 text-xs font-bold flex items-center gap-1"
              title="More Actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMobileMoreOpen && (
              <div
                className="absolute right-0 mt-1 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-50 text-xs font-mono"
                onMouseLeave={() => setIsMobileMoreOpen(false)}
              >
                <div className="px-3 py-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                  Script Actions
                </div>
                <button
                  onClick={() => {
                    onOpenHistoryModal();
                    setIsMobileMoreOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                >
                  <History className="w-3.5 h-3.5 text-amber-400" />
                  Revision History
                </button>
                <button
                  onClick={() => {
                    onOpenTitlePage();
                    setIsMobileMoreOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-300" />
                  Title Page
                </button>
                <button
                  onClick={() => {
                    onOpenSettingsModal();
                    setIsMobileMoreOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  Connect to Drive
                </button>
                <div className="border-t border-slate-800 my-1" />
                <button
                  onClick={() => {
                    onExport('pdf');
                    setIsMobileMoreOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  Export PDF
                </button>
                <button
                  onClick={() => {
                    onExport('docx');
                    setIsMobileMoreOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  Export Word (.docx)
                </button>
                <div className="border-t border-slate-800 my-1" />
                <label className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 flex items-center gap-2 cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Import Script (.pdf/.docx/.txt)</span>
                  <input type="file" accept=".pdf,.docx,.fdx,.fountain,.txt,.json" onChange={onImport} className="hidden" />
                </label>
                <button
                  onClick={() => {
                    onNewScript();
                    setIsMobileMoreOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  New Blank Screenplay
                </button>
                <button
                  onClick={() => {
                    onLoadSample();
                    setIsMobileMoreOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                >
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  Load Sample Script
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
