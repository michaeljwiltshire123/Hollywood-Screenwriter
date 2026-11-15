import React, { useState } from 'react';
import { Download, ChevronDown, Save, Printer, FileText, FileDown } from 'lucide-react';
import { AppThemeConfig } from '../../lib/themePresets';

interface FormatBarExportMenuProps {
  onExport: (format: 'pdf' | 'docx' | 'screenplay' | 'print' | 'actor-pdf') => void;
  onSaveAs?: () => void;
  themeConfig?: AppThemeConfig;
}

export const FormatBarExportMenu: React.FC<FormatBarExportMenuProps> = ({
  onExport,
  onSaveAs,
  themeConfig,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (action: () => void) => {
    setIsOpen(false);
    setTimeout(() => { action(); }, 10);
  };

  return (
    <div className="relative">
      <button
        id="formatbar-export-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="px-2.5 py-1 font-mono font-bold rounded-md text-xs flex items-center gap-1 transition shadow-xs active:scale-95 cursor-pointer whitespace-nowrap hover:opacity-90"
        style={{
          backgroundColor: themeConfig?.accentButtons || '#8C6239',
          color: '#FFFFFF',
        }}
        title="Export Screenplay to PDF, Word, File, or Printer"
      >
        <Download className="w-3.5 h-3.5 shrink-0 text-white" />
        <span className="tracking-wide">EXPORT</span>
        <ChevronDown className="w-3 h-3 ml-0.5 opacity-85" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-1.5 w-56 border rounded-xl shadow-2xl py-1.5 z-50 text-xs font-mono animate-in fade-in slide-in-from-top-1"
          style={{
            backgroundColor: themeConfig?.topBottomBars || '#FBF6EF',
            borderColor: themeConfig?.borders || '#E4D3B9',
            color: themeConfig?.primaryText || '#433422',
          }}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div
            className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border-b"
            style={{ color: themeConfig?.accentText || '#8C6239', borderColor: themeConfig?.borders || '#E4D3B9' }}
          >
            Export Screenplay
          </div>
          <button
            onClick={() => handleAction(() => (onSaveAs ? onSaveAs() : onExport('screenplay')))}
            className="w-full text-left px-3 py-2 hover:opacity-75 flex items-center gap-2 font-bold cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" style={{ color: themeConfig?.accentText || '#8C6239' }} />
            <span>Save As (.screenplay)</span>
          </button>
          <button
            onClick={() => handleAction(() => onExport('pdf'))}
            className="w-full text-left px-3 py-2 hover:opacity-75 flex items-center gap-2 font-medium cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" style={{ color: themeConfig?.accentText || '#8C6239' }} />
            <span>PDF Screenplay (.pdf)</span>
          </button>
          <button
            onClick={() => handleAction(() => onExport('actor-pdf'))}
            className="w-full text-left px-3 py-2 hover:opacity-75 flex items-center gap-2 font-medium cursor-pointer"
          >
            <span className="w-3.5 h-3.5 flex items-center justify-center text-xs">🎨</span>
            <span>PDF for Actors (.pdf)</span>
          </button>
          <button
            onClick={() => handleAction(() => onExport('docx'))}
            className="w-full text-left px-3 py-2 hover:opacity-75 flex items-center gap-2 font-medium cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" style={{ color: themeConfig?.accentText || '#8C6239' }} />
            <span>Word Document (.docx)</span>
          </button>
          <div className="my-1 border-t" style={{ borderColor: themeConfig?.borders || '#E4D3B9' }} />
          <button
            onClick={() => handleAction(() => onExport('print'))}
            className="w-full text-left px-3 py-2 hover:opacity-75 flex items-center gap-2 font-medium cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" style={{ color: themeConfig?.accentText || '#8C6239' }} />
            <span>Print Script</span>
          </button>
        </div>
      )}
    </div>
  );
};
