import React, { useState } from 'react';
import { Download, ChevronDown, Save, Printer, FileText, FileDown } from 'lucide-react';

interface FormatBarExportMenuProps {
  onExport: (format: 'pdf' | 'docx' | 'screenplay' | 'print') => void;
  onSaveAs?: () => void;
}

export const FormatBarExportMenu: React.FC<FormatBarExportMenuProps> = ({ onExport, onSaveAs }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (action: () => void) => {
    setIsOpen(false);
    setTimeout(() => {
      action();
    }, 10);
  };

  return (
    <div className="relative">
      <button
        id="formatbar-export-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold rounded-md text-xs flex items-center gap-1 transition shadow-xs active:scale-95 cursor-pointer whitespace-nowrap"
        title="Export Screenplay to PDF, Word, File, or Printer"
      >
        <Download className="w-3.5 h-3.5 shrink-0 text-slate-950" />
        <span className="tracking-wide">EXPORT</span>
        <ChevronDown className="w-3 h-3 ml-0.5 opacity-80" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-1.5 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-50 text-xs font-mono animate-in fade-in slide-in-from-top-1"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="px-3 py-1.5 text-[10px] text-amber-400 font-bold uppercase tracking-wider border-b border-slate-800">
            Export Screenplay
          </div>
          <button
            onClick={() => handleAction(() => (onSaveAs ? onSaveAs() : onExport('screenplay')))}
            className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 hover:text-amber-300 flex items-center gap-2 font-bold cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-amber-400" />
            <span>Save As (.screenplay)</span>
          </button>
          <button
            onClick={() => handleAction(() => onExport('pdf'))}
            className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 hover:text-amber-300 flex items-center gap-2 font-medium cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5 text-emerald-400" />
            <span>PDF Screenplay (.pdf)</span>
          </button>
          <button
            onClick={() => handleAction(() => onExport('docx'))}
            className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 hover:text-blue-300 flex items-center gap-2 font-medium cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Word Document (.docx)</span>
          </button>
          <div className="my-1 border-t border-slate-800" />
          <button
            onClick={() => handleAction(() => onExport('print'))}
            className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 hover:text-amber-300 flex items-center gap-2 font-medium cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>Print Script</span>
          </button>
        </div>
      )}
    </div>
  );
};
