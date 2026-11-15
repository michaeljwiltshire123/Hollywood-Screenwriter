import React, { useState } from 'react';
import { Upload, ChevronDown, Plus, BookOpen, FileCode } from 'lucide-react';
import { AppThemeConfig } from '../../lib/themePresets';

interface FormatBarOpenMenuProps {
  onOpenProject?: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNewScript: () => void;
  onLoadSample: () => void;
  themeConfig?: AppThemeConfig;
}

export const FormatBarOpenMenu: React.FC<FormatBarOpenMenuProps> = ({
  onOpenProject, onImport, onNewScript, onLoadSample, themeConfig,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div
        className="flex items-center border rounded-md overflow-hidden shrink-0 transition"
        style={{ backgroundColor: themeConfig?.sceneCards || '#F4ECE0', borderColor: themeConfig?.borders || '#E4D3B9', color: themeConfig?.primaryText || '#433422' }}
      >
        <button
          id="formatbar-open-project-btn"
          onClick={onOpenProject}
          className="px-2 py-1 text-xs font-mono font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer whitespace-nowrap hover:opacity-80"
          title="Open Project or Screenplay File (Ctrl+O)"
        >
          <Upload className="w-3.5 h-3.5 shrink-0" style={{ color: themeConfig?.accentText || '#8C6239' }} />
          <span>OPEN</span>
        </button>
        <button
          id="formatbar-open-project-arrow-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="px-1 py-1 border-l transition cursor-pointer hover:opacity-80"
          style={{ borderColor: themeConfig?.borders || '#E4D3B9' }}
          title="More File & Import Options"
        >
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute right-0 mt-1.5 w-56 border rounded-xl shadow-2xl py-1.5 z-50 text-xs font-mono animate-in fade-in slide-in-from-top-1"
          style={{ backgroundColor: themeConfig?.topBottomBars || '#FBF6EF', borderColor: themeConfig?.borders || '#E4D3B9', color: themeConfig?.primaryText || '#433422' }}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div
            className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border-b"
            style={{ color: themeConfig?.accentText || '#8C6239', borderColor: themeConfig?.borders || '#E4D3B9' }}
          >
            Open & Import
          </div>
          <button
            onClick={() => { if (onOpenProject) onOpenProject(); setIsOpen(false); }}
            className="w-full text-left px-3 py-2 hover:opacity-75 flex items-center gap-2 font-bold cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" style={{ color: themeConfig?.accentText || '#8C6239' }} />
            <span>Open Project (Ctrl+O)</span>
          </button>
          <label
            className="w-full text-left px-3 py-2 hover:opacity-75 flex items-center gap-2 cursor-pointer border-b"
            style={{ borderColor: themeConfig?.borders || '#E4D3B9' }}
          >
            <FileCode className="w-3.5 h-3.5" style={{ color: themeConfig?.accentText || '#8C6239' }} />
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
            <Plus className="w-3.5 h-3.5" style={{ color: themeConfig?.accentText || '#8C6239' }} />
            <span>New Blank Screenplay</span>
          </button>
          <button
            onClick={() => { onLoadSample(); setIsOpen(false); }}
            className="w-full text-left px-3 py-2 hover:opacity-75 flex items-center gap-2 font-medium cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" style={{ color: themeConfig?.accentText || '#8C6239' }} />
            <span>Load Sample Script</span>
          </button>
        </div>
      )}
    </div>
  );
};
