import React, { useState } from 'react';
import { Upload, ChevronDown, Plus, BookOpen, FileCode } from 'lucide-react';
import { AppThemeConfig } from '../../lib/themePresets';
import { getModalTheme } from '../../lib/modalTheme';

interface ImportProjectMenuProps {
  onOpenProject?: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNewScript: () => void;
  onLoadSample: () => void;
  themeConfig?: AppThemeConfig;
}

export const ImportProjectMenu: React.FC<ImportProjectMenuProps> = ({
  onOpenProject, onImport, onNewScript, onLoadSample, themeConfig,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const mt = getModalTheme(themeConfig);

  return (
    <div className="relative">
      <div className="flex items-center border rounded-lg overflow-hidden shrink-0 transition" style={mt.secondaryBtnStyle}>
        <button
          id="header-open-project-btn"
          onClick={onOpenProject}
          className="px-2.5 py-1.5 min-h-[38px] text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer whitespace-nowrap hover:opacity-80"
          title="Open Project or Screenplay File (Ctrl+O)"
        >
          <Upload className="w-4 h-4 shrink-0" style={mt.accentStyle} />
          <span>OPEN</span>
        </button>
        <button
          id="header-open-project-arrow-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="px-1.5 py-2 min-h-[38px] border-l transition cursor-pointer hover:opacity-80"
          style={mt.borderStyle}
          title="More File & Import Options"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute right-0 mt-1.5 w-60 border rounded-xl shadow-2xl py-1.5 z-50 text-xs font-mono animate-in fade-in slide-in-from-top-1"
          style={mt.windowStyle}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border-b" style={{ ...mt.accentStyle, ...mt.borderStyle }}>
            Open & Import
          </div>
          <button
            onClick={() => { if (onOpenProject) onOpenProject(); setIsOpen(false); }}
            className="w-full text-left px-3 py-2 hover:opacity-75 flex items-center gap-2 font-bold cursor-pointer"
          >
            <Upload className="w-4 h-4" style={mt.accentStyle} />
            <span>Open Project / File (Ctrl+O)</span>
          </button>
          <label className="w-full text-left px-3 py-2 hover:opacity-75 flex items-center gap-2 cursor-pointer border-b" style={mt.borderStyle}>
            <FileCode className="w-4 h-4" style={mt.accentStyle} />
            <span>Import (.pdf / .docx / .txt)</span>
            <input
              type="file"
              accept=".pdf,.docx,.fdx,.fountain,.txt,.json,.screenplay"
              onChange={(e) => { onImport(e); setIsOpen(false); }}
              className="hidden"
            />
          </label>
          <button
            onClick={() => { onNewScript(); setIsOpen(false); }}
            className="w-full text-left px-3 py-2 hover:opacity-75 flex items-center gap-2 font-medium cursor-pointer"
          >
            <Plus className="w-4 h-4" style={mt.accentStyle} />
            <span>New Blank Screenplay</span>
          </button>
          <button
            onClick={() => { onLoadSample(); setIsOpen(false); }}
            className="w-full text-left px-3 py-2 hover:opacity-75 flex items-center gap-2 font-medium cursor-pointer"
          >
            <BookOpen className="w-4 h-4" style={mt.accentStyle} />
            <span>Load Sample Script</span>
          </button>
        </div>
      )}
    </div>
  );
};
