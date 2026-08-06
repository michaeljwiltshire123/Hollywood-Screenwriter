import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ScreenplayDocument,
  ScreenplayElement,
  ElementType,
  CursorPosition,
  RevisionHistoryItem,
  TitlePage,
} from './types';
import { INITIAL_SAMPLE_SCRIPT } from './lib/sampleScript';
import {
  generateDocxExport,
  parseUploadedFile,
} from './lib/screenplayUtils';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FormattingToolbar } from './components/FormattingToolbar';
import { NavigatorSidePanel } from './components/NavigatorSidePanel';
import { ScreenplayEditor } from './components/ScreenplayEditor';
import { TitlePageModal } from './components/TitlePageModal';
import { RevisionHistoryModal } from './components/RevisionHistoryModal';
import { SettingsModal } from './components/SettingsModal';
import { DebugDashboardModal } from './components/DebugDashboardModal';
import { PomodoroAlertModal } from './components/PomodoroAlertModal';
import { BreakGameModal } from './components/BreakGameModal';

export default function App() {
  const [script, setScript] = useState<ScreenplayDocument>(INITIAL_SAMPLE_SCRIPT);
  const [activeElementId, setActiveElementId] = useState<string | null>(
    INITIAL_SAMPLE_SCRIPT.elements[0]?.id || null
  );
  const [activeType, setActiveType] = useState<ElementType>(
    INITIAL_SAMPLE_SCRIPT.elements[0]?.type || 'SCENE HEADING'
  );
  const [cursorPos, setCursorPos] = useState<CursorPosition | null>(null);

  const [importBannerMessage, setImportBannerMessage] = useState<string | null>(null);

  // App states
  const [latencyMs, setLatencyMs] = useState<number>(1);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(new Date());

  // RAM-Only History (Max 20 items)
  const [history, setHistory] = useState<ScreenplayDocument[]>([INITIAL_SAMPLE_SCRIPT]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [editorFont, setEditorFont] = useState<'Courier Prime' | 'Courier New'>('Courier Prime');

  // File System Access API handles
  const [fileHandle, setFileHandle] = useState<any>(null);
  const [linkedFileName, setLinkedFileName] = useState<string | null>(() => {
    try {
      return localStorage.getItem('screenwriter_linked_filename');
    } catch {
      return null;
    }
  });

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      const prevDoc = history[newIdx];
      setHistoryIndex(newIdx);
      setScript(prevDoc);
      setIsDirty(true);
      if (prevDoc.elements[0]) {
        setActiveElementId(prevDoc.elements[0].id);
        setActiveType(prevDoc.elements[0].type);
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIdx = historyIndex + 1;
      const nextDoc = history[newIdx];
      setHistoryIndex(newIdx);
      setScript(nextDoc);
      setIsDirty(true);
      if (nextDoc.elements[0]) {
        setActiveElementId(nextDoc.elements[0].id);
        setActiveType(nextDoc.elements[0].type);
      }
    }
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Side Panel & Modals State
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(true);
  const [isTitlePageOpen, setIsTitlePageOpen] = useState<boolean>(true); // Fresh load opens Title Page modal automatically
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isDebugOpen, setIsDebugOpen] = useState<boolean>(false);

  // Pomodoro & Break Suite state
  const [pomodoroSeconds, setPomodoroSeconds] = useState<number>(2700); // 45 minutes
  const [isPomodoroRunning, setIsPomodoroRunning] = useState<boolean>(true);
  const [isPomodoroAlertOpen, setIsPomodoroAlertOpen] = useState<boolean>(false);
  const [isBreakGameOpen, setIsBreakGameOpen] = useState<boolean>(false);
  const [playedGames, setPlayedGames] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('screenwriter_played_games');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Revisions in RAM
  const [revisions, setRevisions] = useState<RevisionHistoryItem[]>([]);

  // Jump function ref for scene navigation
  const jumpFnRef = useRef<((idx: number) => void) | null>(null);

  // Script Ref for background tasks without causing re-renders
  const scriptRef = useRef(script);
  useEffect(() => {
    scriptRef.current = script;
  }, [script]);

  // Pomodoro timer effect
  useEffect(() => {
    if (!isPomodoroRunning) return;
    const timer = setInterval(() => {
      setPomodoroSeconds((prev) => {
        if (prev <= 1) {
          setIsPomodoroRunning(false);
          setIsPomodoroAlertOpen(true);
          playDingSound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPomodoroRunning]);

  function playDingSound() {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playTone = (freq: number, delay: number) => {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.8);
        }, delay);
      };
      playTone(523.25, 0);
      playTone(659.25, 200);
      playTone(783.99, 400);
      playTone(1046.50, 600);
    } catch (e) {
      console.error('AudioContext error', e);
    }
  }

  // --- FILE SYSTEM ACCESS API & OVERWRITE SOVEREIGNTY ---
  const saveScriptToFileHandle = async (targetHandle: any, doc: ScreenplayDocument) => {
    try {
      const writable = await targetHandle.createWritable();
      await writable.write(JSON.stringify(doc, null, 2));
      await writable.close();
      setIsDirty(false);
      setLastSavedAt(new Date());
      setFileHandle(targetHandle);
      setLinkedFileName(targetHandle.name);
      try {
        localStorage.setItem('screenwriter_linked_filename', targetHandle.name);
      } catch (e) {}
      return true;
    } catch (err: any) {
      console.error('File system write error:', err);
      return false;
    }
  };

  const triggerFallbackDownload = (doc: ScreenplayDocument = script) => {
    const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(doc.title || 'screenplay').toLowerCase().replace(/[^a-z0-9]/g, '_')}.screenplay`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsDirty(false);
    setLastSavedAt(new Date());
  };

  const saveFileWithPicker = async (doc: ScreenplayDocument = script) => {
    if ('showSaveFilePicker' in window) {
      try {
        const options = {
          suggestedName: `${(doc.title || 'screenplay').toLowerCase().replace(/[^a-z0-9]/g, '_')}.screenplay`,
          types: [
            {
              description: 'Screenplay File (*.screenplay)',
              accept: { 'application/json': ['.screenplay', '.json'] },
            },
          ],
        };
        const handle = await (window as any).showSaveFilePicker(options);
        await saveScriptToFileHandle(handle, doc);
        return true;
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Save file picker error:', err);
          triggerFallbackDownload(doc);
        }
        return false;
      }
    } else {
      triggerFallbackDownload(doc);
      return true;
    }
  };

  const loadNativeFile = async () => {
    if ('showOpenFilePicker' in window) {
      try {
        const options = {
          types: [
            {
              description: 'Screenplay Files (*.screenplay, *.json, *.txt, *.fountain)',
              accept: {
                'application/json': ['.screenplay', '.json'],
                'text/plain': ['.txt', '.fountain'],
              },
            },
          ],
          multiple: false,
        };
        const [handle] = await (window as any).showOpenFilePicker(options);
        const file = await handle.getFile();
        const text = await file.text();
        let loadedDoc: ScreenplayDocument;

        if (file.name.endsWith('.screenplay') || file.name.endsWith('.json')) {
          try {
            loadedDoc = JSON.parse(text);
          } catch {
            const parsedElems = await parseUploadedFile(file);
            loadedDoc = { ...script, id: `script-${Date.now()}`, title: file.name.replace(/\.[^/.]+$/, '').toUpperCase(), elements: parsedElems };
          }
        } else {
          const parsedElems = await parseUploadedFile(file);
          loadedDoc = { ...script, id: `script-${Date.now()}`, title: file.name.replace(/\.[^/.]+$/, '').toUpperCase(), elements: parsedElems };
        }

        setScript(loadedDoc);
        if (loadedDoc.elements && loadedDoc.elements[0]) {
          setActiveElementId(loadedDoc.elements[0].id);
          setActiveType(loadedDoc.elements[0].type);
        }
        setHistory([loadedDoc]);
        setHistoryIndex(0);
        setFileHandle(handle);
        setLinkedFileName(handle.name);
        try {
          localStorage.setItem('screenwriter_linked_filename', handle.name);
        } catch (e) {}
        setIsDirty(false);
        setLastSavedAt(new Date());
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Open file error:', err);
        }
      }
    }
  };

  // Keyboard shortcut Ctrl + S / Cmd + S for Overwrite Sovereignty
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        const currentDoc = scriptRef.current;
        if (fileHandle) {
          saveScriptToFileHandle(fileHandle, currentDoc);
        } else {
          saveFileWithPicker(currentDoc);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fileHandle]);

  // Exit Leash: beforeunload warning if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes! Save to Drive or Export before leaving.';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // RAM-Only Keystroke Handler with History Cap (Max 20) & Dirty State
  const handleScriptChange = useCallback((updated: ScreenplayDocument) => {
    setHistory((prev) => {
      const newStack = prev.slice(0, historyIndex + 1);
      const updatedStack = [...newStack, updated];
      if (updatedStack.length > 20) {
        return updatedStack.slice(updatedStack.length - 20);
      }
      return updatedStack;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 19));
    setScript(updated);
    setIsDirty(true);
  }, [historyIndex]);

  // Revision Snapshot (RAM only)
  const saveSnapshot = useCallback(() => {
    const rev: RevisionHistoryItem = {
      id: `rev-${Date.now()}`,
      scriptId: script.id,
      timestamp: new Date().toISOString(),
      label: `Snapshot - ${script.elements.length} elements`,
      elementCount: script.elements.length,
      elements: [...script.elements],
    };
    setRevisions((prev) => [rev, ...prev].slice(0, 20));
  }, [script]);

  // Rollback Revision
  const handleRollback = (rev: RevisionHistoryItem) => {
    const updated: ScreenplayDocument = {
      ...script,
      elements: [...rev.elements],
      updatedAt: new Date().toISOString(),
    };
    handleScriptChange(updated);
    if (updated.elements[0]) {
      setActiveElementId(updated.elements[0].id);
      setActiveType(updated.elements[0].type);
    }
  };

  // Title update
  const handleUpdateTitle = (newTitle: string) => {
    handleScriptChange({
      ...script,
      title: newTitle,
      titlePage: { ...script.titlePage, title: newTitle },
      updatedAt: new Date().toISOString(),
    });
  };

  // Draft status update
  const handleUpdateDraftStatus = (status: ScreenplayDocument['draftStatus']) => {
    handleScriptChange({
      ...script,
      draftStatus: status,
      updatedAt: new Date().toISOString(),
    });
  };

  // Start New Script
  const handleStartNewScript = async () => {
    const newDoc: ScreenplayDocument = {
      id: `script-${Date.now()}`,
      title: 'UNTITLED SCREENPLAY',
      author: 'Author Name',
      description: 'A new screenplay.',
      draftStatus: 'DRAFT',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      titlePage: {
        title: 'UNTITLED SCREENPLAY',
        credit: 'Written by',
        author: 'Author Name',
        source: 'Original',
        contact: '',
        date: new Date().toLocaleDateString(),
        draftColor: 'White Draft',
      },
      elements: [
        {
          id: `elem-${Date.now()}-1`,
          type: 'SCENE HEADING',
          content: 'INT. LOCATION - DAY',
          sceneNumber: '1',
        },
        {
          id: `elem-${Date.now()}-2`,
          type: 'ACTION',
          content: 'Write your action description here...',
        },
      ],
    };
    setScript(newDoc);
    setActiveElementId(newDoc.elements[0].id);
    setActiveType(newDoc.elements[0].type);
    setHistory([newDoc]);
    setHistoryIndex(0);
    setFileHandle(null);
    setIsDirty(true);
  };

  // Load Sample Script
  const handleOpenSampleScript = async () => {
    setScript(INITIAL_SAMPLE_SCRIPT);
    setActiveElementId(INITIAL_SAMPLE_SCRIPT.elements[0].id);
    setActiveType(INITIAL_SAMPLE_SCRIPT.elements[0].type);
    setHistory([INITIAL_SAMPLE_SCRIPT]);
    setHistoryIndex(0);
    setFileHandle(null);
    setIsDirty(true);
  };

  // Title Page Save
  const handleSaveTitlePage = async (updatedTitlePage: TitlePage) => {
    const updatedDoc: ScreenplayDocument = {
      ...script,
      titlePage: updatedTitlePage,
      title: updatedTitlePage.title || script.title,
      author: updatedTitlePage.author || script.author,
      updatedAt: new Date().toISOString(),
    };
    handleScriptChange(updatedDoc);
    if (fileHandle) {
      await saveScriptToFileHandle(fileHandle, updatedDoc);
    } else {
      await saveFileWithPicker(updatedDoc);
    }
  };

  // Export handlers
  const handleExport = async (format: 'pdf' | 'docx' | 'screenplay') => {
    saveSnapshot();

    if (format === 'pdf') {
      setIsDirty(false);
      window.print();
      return;
    }

    if (format === 'screenplay') {
      if (fileHandle) {
        await saveScriptToFileHandle(fileHandle, script);
      } else {
        await saveFileWithPicker(script);
      }
      return;
    }

    if (format === 'docx') {
      try {
        const blob = await generateDocxExport(script);
        const url = URL.createObjectURL(blob);
        const filename = `${script.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.docx`;
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsDirty(false);
      } catch (err: any) {
        alert(`Word export failed: ${err.message}`);
      }
    }
  };

  // Fallback Input File Import Handler
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const elements = await parseUploadedFile(file);
      const titleClean = file.name.replace(/\.[^/.]+$/, '').toUpperCase();

      const newDoc: ScreenplayDocument = {
        ...script,
        id: `script-${Date.now()}`,
        title: titleClean,
        elements,
        updatedAt: new Date().toISOString(),
      };

      setScript(newDoc);
      if (elements[0]) {
        setActiveElementId(elements[0].id);
        setActiveType(elements[0].type);
      }
      setHistory([newDoc]);
      setHistoryIndex(0);
      setIsDirty(true);
      setImportBannerMessage('Heuristic import complete. Use TAB or Alt+1-8 to verify your formatting.');
    } catch (err: any) {
      alert(`Import failed: ${err.message}`);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col pt-14 font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Header */}
      <Header
        script={script}
        onUpdateTitle={handleUpdateTitle}
        onUpdateDraftStatus={handleUpdateDraftStatus}
        isSidePanelOpen={isSidePanelOpen}
        onToggleSidePanel={() => setIsSidePanelOpen(!isSidePanelOpen)}
        onOpenTitlePage={() => setIsTitlePageOpen(true)}
        onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsOpen(true)}
        onOpenDebugModal={() => setIsDebugOpen(true)}
        onNewScript={handleStartNewScript}
        onLoadSample={handleOpenSampleScript}
        onExport={handleExport}
        onImport={handleImport}
        latencyMs={latencyMs}
        draftModeActive={false}
        onToggleDraftMode={() => {}}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        isFocusMode={isFocusMode}
        onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
        pomodoroSeconds={pomodoroSeconds}
        onOpenBreakModal={() => setIsBreakGameOpen(true)}
        isPomodoroRunning={isPomodoroRunning}
        onTogglePomodoro={() => setIsPomodoroRunning(!isPomodoroRunning)}
        onSetPomodoroMinutes={(mins) => setPomodoroSeconds(mins * 60)}
      />

      {/* Main Container below Header with Independent Scrolling */}
      <div className="h-[calc(100vh-3.5rem)] overflow-hidden flex flex-row w-full relative z-0">
        {isSidePanelOpen && !isFocusMode && (
          <div className="h-full overflow-y-auto w-80 shrink-0 border-r border-slate-800 bg-slate-900 z-30">
            <NavigatorSidePanel
              script={script}
              isOpen={isSidePanelOpen && !isFocusMode}
              onClose={() => setIsSidePanelOpen(false)}
              onJumpToElementIndex={(idx) => {
                if (jumpFnRef.current) jumpFnRef.current(idx);
              }}
              onChangeScript={handleScriptChange}
              revisions={revisions}
              onRollbackRevision={handleRollback}
            />
          </div>
        )}

        <div className="h-full flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-950">
          {importBannerMessage && (
            <div className="bg-amber-950/90 border-b border-amber-500/60 text-amber-200 px-4 py-2 text-xs font-mono flex items-center justify-between z-20 shrink-0">
              <span className="truncate">{importBannerMessage}</span>
              <button
                onClick={() => setImportBannerMessage(null)}
                className="text-amber-400 hover:text-white font-bold ml-3 text-sm shrink-0 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          <div className="shrink-0 z-10">
            <FormattingToolbar
              activeType={activeType}
              onChangeType={(newType) => {
                if (activeElementId) {
                  const updated = {
                    ...script,
                    elements: (script?.elements || []).map((e) => (e.id === activeElementId ? { ...e, type: newType } : e)),
                  };
                  handleScriptChange(updated);
                  setActiveType(newType);
                }
              }}
              onAddElement={(type) => {
                const newId = `elem-${Date.now()}`;
                const newElem: ScreenplayElement = { id: newId, type, content: '' };
                const updated = { ...script, elements: [...(script?.elements || []), newElem] };
                handleScriptChange(updated);
                setActiveElementId(newId);
                setActiveType(type);
              }}
              activeElementIndex={(script?.elements || []).findIndex((e) => e.id === activeElementId)}
              totalElements={(script?.elements || []).length}
            />
          </div>

          <div className="h-full flex-1 overflow-y-auto relative min-h-0">
            <ScreenplayEditor
              script={script}
              onChangeScript={handleScriptChange}
              activeElementId={activeElementId}
              setActiveElementId={setActiveElementId}
              activeType={activeType}
              setActiveType={setActiveType}
              cursorPos={cursorPos}
              setCursorPos={setCursorPos}
              onJumpRef={(fn) => {
                jumpFnRef.current = fn;
              }}
            />
          </div>

          {/* Footer Status Bar (Hidden in Focus Mode) */}
          {!isFocusMode && (
            <div className="shrink-0 z-10 border-t border-slate-800 bg-slate-950">
              <Footer
                script={script}
                latencyMs={latencyMs}
                lastSavedAt={lastSavedAt}
                onEmergencyExport={() => handleExport('docx')}
                isDirty={isDirty}
                linkedFileName={linkedFileName}
                hasFileHandle={!!fileHandle}
                onRelinkFile={loadNativeFile}
              />
            </div>
          )}
        </div>
      </div>

      {/* Physical Modals */}
      <TitlePageModal
        isOpen={isTitlePageOpen}
        onClose={() => setIsTitlePageOpen(false)}
        titlePage={script.titlePage}
        onSave={handleSaveTitlePage}
        onStartNewScript={handleStartNewScript}
        onLoadFile={handleImport}
        onOpenSampleScript={handleOpenSampleScript}
        onLoadNativeFile={'showOpenFilePicker' in window ? loadNativeFile : undefined}
      />

      <RevisionHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        revisions={revisions}
        onRollback={handleRollback}
        onCreateSnapshot={saveSnapshot}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        editorFont={editorFont}
        onUpdateFont={setEditorFont}
      />

      <DebugDashboardModal
        isOpen={isDebugOpen}
        onClose={() => setIsDebugOpen(false)}
        script={script}
        latencyMs={latencyMs}
      />

      <PomodoroAlertModal
        isOpen={isPomodoroAlertOpen}
        onSnooze={() => setIsPomodoroAlertOpen(false)}
        onDismiss={() => setIsPomodoroAlertOpen(false)}
        onOpenGame={() => {
          setIsPomodoroAlertOpen(false);
          setIsBreakGameOpen(true);
        }}
      />

      <BreakGameModal
        isOpen={isBreakGameOpen}
        onClose={() => setIsBreakGameOpen(false)}
        onGetBackToWork={() => {
          setIsBreakGameOpen(false);
          setIsPomodoroRunning(true);
        }}
        playedGames={playedGames}
        onGameCompleted={(gameId) => {
          if (!playedGames.includes(gameId)) {
            const updated = [...playedGames, gameId];
            setPlayedGames(updated);
            try {
              localStorage.setItem('screenwriter_played_games', JSON.stringify(updated));
            } catch (e) {
              console.error('Local storage save error', e);
            }
          }
        }}
      />
    </div>
  );
}
