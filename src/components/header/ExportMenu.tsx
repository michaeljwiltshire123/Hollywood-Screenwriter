import React, { useState } from 'react';
import { Download, ChevronDown, Save, Printer, FileText, FileDown } from 'lucide-react';
import { AppThemeConfig } from '../../lib/themePresets';
import { getModalTheme } from '../../lib/modalTheme';

interface ExportMenuProps {
  onExport: (format: 'pdf' | 'docx' | 'screenplay' | 'print' | 'actor-pdf') => void;
  onSaveAs?: () => void;
  themeConfig?: AppThemeConfig;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({ onExport, onSaveAs, themeConfig }) => {
  const [isOpen, setIsOpen] = useState(false);
  const mt = getModalTheme(themeConfig);

  const handleAction = (action: () => void) => {
    setIsOpen(false);
    setTimeout(() => { action(); }, 10);
  };

  return (
    <div className="relative">
      <button
        id="header-export-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 min-h-[38px] font-bold rounded-lg text-xs flex items-center gap-1.5 transition shadow-sm active:scale-95 cursor-pointer whitespace-nowrap hover:opacity-90"
        style={mt.primaryBtnStyle}
        title="Export Screenplay to PDF, Word, File, or Printer"
      >
        <Download className="w-4 h-4 shrink-0" />
        <span className="tracking-wide">EXPORT</span>
        <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-80" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-1.5 w-60 border rounded-xl shadow-2xl py-1.5 z-50 text-xs font-mono animate-in fade-in slide-in-from-top-1"
          style={mt.windowStyle}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border-b" style={{ ...mt.accentStyle, ...mt.borderStyle }}>
            Export Screenplay
          </div>
          <button onClick={() => handleAction(() => (onSaveAs ? onSaveAs() : onExport('screenplay')))} className="w-full text-left px-3 py-2 hover:opacity-75 flex items-center gap-2.5 font-bold cursor-pointer">
            <Save className="w-4 h-4" style={mt.accentStyle} />
            <span>Save As Project (.screenplay)</span>
          </button>
          <button onClick={() => handleAction(() => onExport('pdf'))} className="w-full text-left px-3 py-2 hover:opacity-75 flex items-center gap-2.5 font-medium cursor-pointer">
            <FileDown className="w-4 h-4" style={mt.accentStyle} />
            <span>PDF Screenplay (.pdf)</span>
          </button>
          <button onClick={() => handleAction(() => onExport('actor-pdf'))} className="w-full text-left px-3 py-2 hover:opacity-75 flex items-center gap-2.5 font-medium cursor-pointer">
            <span className="w-4 h-4 flex items-center justify-center text-sm">🎨</span>
            <span>PDF for Actors (.pdf)</span>
          </button>
          <button onClick={() => handleAction(() => onExport('docx'))} className="w-full text-left px-3 py-2 hover:opacity-75 flex items-center gap-2.5 font-medium cursor-pointer">
            <FileText className="w-4 h-4" style={mt.accentStyle} />
            <span>Word Document (.docx)</span>
          </button>
          <div className="my-1 border-t" style={mt.borderStyle} />
          <button onClick={() => handleAction(() => onExport('print'))} className="w-full text-left px-3 py-2 hover:opacity-75 flex items-center gap-2.5 font-medium cursor-pointer">
            <Printer className="w-4 h-4" style={mt.accentStyle} />
            <span>Print Script</span>
          </button>
        </div>
      )}
    </div>
  );
};
