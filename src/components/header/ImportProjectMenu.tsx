import React, { useState } from 'react';
import { Upload, ChevronDown, Plus, BookOpen, FileCode } from 'lucide-react';

interface ImportProjectMenuProps {
  onOpenProject?: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNewScript: () => void;
  onLoadSample: () => void;
}

export const ImportProjectMenu: React.FC<ImportProjectMenuProps> = ({
  onOpenProject,
  onImport,
  onNewScript,
  onLoadSample,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shrink-0 hover:border-sky-400 transition">
        <button
          id="header-open-project-btn"
          onClick={onOpenProject}
          className="px-2.5 py-1.5 min-h-[38px] text-slate-100 hover:text-sky-300 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer whitespace-nowrap"
          title="Open Project or Screenplay File (Ctrl+O)"
        >
          <Upload className="w-4 h-4 text-sky-400 shrink-0" />
          <span>OPEN</span>
        </button>
        <button
          id="header-open-project-arrow-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="px-1.5 py-2 min-h-[38px] border-l border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          title="More File & Import Options"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute right-0 mt-1.5 w-60 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-50 text-xs font-mono animate-in fade-in slide-in-from-top-1"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="px-3 py-1.5 text-[10px] text-sky-400 font-bold uppercase tracking-wider border-b border-slate-800">
            Open & Import
          </div>
          <button
            onClick={() => {
              if (onOpenProject) onOpenProject();
              setIsOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 hover:text-sky-300 flex items-center gap-2 font-bold"
          >
            <Upload className="w-4 h-4 text-sky-400" />
            <span>Open Project / File (Ctrl+O)</span>
          </button>
          <label className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 hover:text-amber-300 flex items-center gap-2 cursor-pointer border-b border-slate-800">
            <FileCode className="w-4 h-4 text-amber-400" />
            <span>Import (.pdf / .docx / .txt)</span>
            <input
              type="file"
              accept=".pdf,.docx,.fdx,.fountain,.txt,.json,.screenplay"
              onChange={(e) => {
                onImport(e);
                setIsOpen(false);
              }}
              className="hidden"
            />
          </label>
          <button
            onClick={() => {
              onNewScript();
              setIsOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 hover:text-emerald-300 flex items-center gap-2 font-medium"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>New Blank Screenplay</span>
          </button>
          <button
            onClick={() => {
              onLoadSample();
              setIsOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 hover:text-blue-300 flex items-center gap-2 font-medium"
          >
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>Load Sample Script</span>
          </button>
        </div>
      )}
    </div>
  );
};
