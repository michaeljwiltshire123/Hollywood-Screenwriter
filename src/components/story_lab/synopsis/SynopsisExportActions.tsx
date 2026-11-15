import React from 'react';
import { Copy, Printer, Mail, Download, Check } from 'lucide-react';
import { ModalThemeStyles } from '../../../lib/modalTheme';

interface SynopsisExportActionsProps {
  copied: boolean;
  onCopy: () => void;
  onPrint: () => void;
  onEmail: () => void;
  onDownloadWord: () => void;
  onCancel: () => void;
  onSave: () => void;
  mt: ModalThemeStyles;
}

export const SynopsisExportActions: React.FC<SynopsisExportActionsProps> = ({
  copied, onCopy, onPrint, onEmail, onDownloadWord, onCancel, onSave, mt,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t shrink-0" style={mt.borderStyle}>
      <div className="flex items-center gap-1.5 flex-wrap">
        <button type="button" onClick={onCopy} className="px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:opacity-95" style={mt.secondaryBtnStyle}>
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied Pitch!' : 'Copy Pitch'}</span>
        </button>
        <button type="button" onClick={onPrint} className="px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:opacity-95" style={mt.secondaryBtnStyle}>
          <Printer className="w-3.5 h-3.5" /><span>Print / PDF</span>
        </button>
        <button type="button" onClick={onEmail} className="px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:opacity-95" style={mt.secondaryBtnStyle}>
          <Mail className="w-3.5 h-3.5" /><span>Email Draft</span>
        </button>
        <button type="button" onClick={onDownloadWord} className="px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:opacity-95" style={mt.secondaryBtnStyle}>
          <Download className="w-3.5 h-3.5" /><span>Download Word</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-xl border text-xs font-bold cursor-pointer" style={mt.secondaryBtnStyle}>Cancel</button>
        <button type="button" onClick={onSave} className="px-4 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition">
          <Check className="w-4 h-4" /><span>Save Synopsis</span>
        </button>
      </div>
    </div>
  );
};
