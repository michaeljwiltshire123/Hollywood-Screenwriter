import React from 'react';
import { Save } from 'lucide-react';

interface QuickSaveButtonProps {
  onSave?: () => void;
  isDirty: boolean;
}

export const QuickSaveButton: React.FC<QuickSaveButtonProps> = ({
  onSave,
  isDirty,
}) => {
  return (
    <button
      id="header-save-btn"
      onClick={onSave}
      className={`px-2.5 sm:px-3 py-1.5 min-h-[38px] rounded-lg text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer whitespace-nowrap ${
        isDirty
          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.35)] animate-pulse'
          : 'bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-750 hover:text-white'
      }`}
      title="Save Screenplay (Ctrl+S)"
    >
      <Save className={`w-4 h-4 ${isDirty ? 'text-slate-950' : 'text-amber-400'}`} />
      <span>SAVE</span>
    </button>
  );
};
