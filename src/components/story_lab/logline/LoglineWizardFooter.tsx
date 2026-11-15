import React from 'react';
import { Check } from 'lucide-react';
import { ModalThemeStyles } from '../../../lib/modalTheme';

interface LoglineWizardFooterProps {
  onCancel: () => void;
  onSave: () => void;
  mt: ModalThemeStyles;
}

export const LoglineWizardFooter: React.FC<LoglineWizardFooterProps> = ({
  onCancel, onSave, mt,
}) => {
  return (
    <div className="flex items-center justify-end gap-2.5 pt-3 mt-4 border-t shrink-0" style={mt.borderStyle}>
      <button type="button" onClick={onCancel} className="px-4 py-2 rounded-xl border text-xs font-bold cursor-pointer" style={mt.secondaryBtnStyle}>
        Cancel
      </button>
      <button
        type="button"
        onClick={onSave}
        className="px-4 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition"
      >
        <Check className="w-4 h-4" />
        <span>Save Logline</span>
      </button>
    </div>
  );
};
