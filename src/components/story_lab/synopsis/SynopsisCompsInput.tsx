import React from 'react';
import { Film } from 'lucide-react';
import { ModalThemeStyles } from '../../../lib/modalTheme';

interface SynopsisCompsInputProps {
  comps: string;
  onChangeComps: (val: string) => void;
  mt: ModalThemeStyles;
}

export const SynopsisCompsInput: React.FC<SynopsisCompsInputProps> = ({
  comps, onChangeComps, mt,
}) => {
  return (
    <div className="rounded-xl border p-2.5 space-y-1.5 bg-slate-50/70 dark:bg-slate-900/40 shrink-0 text-xs" style={mt.borderStyle}>
      <div className="flex items-center justify-between">
        <label htmlFor="synopsis-comps-input" className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Film className="w-3.5 h-3.5 text-amber-600" />
          <span>Comparable Titles / Comps <span className="text-[10px] font-normal opacity-60">(Optional)</span></span>
        </label>
      </div>
      <input
        id="synopsis-comps-input"
        type="text"
        value={comps}
        onChange={(e) => onChangeComps(e.target.value)}
        placeholder="e.g. In the vein of Knives Out meets Jurassic Park..."
        className="w-full rounded-lg border px-2.5 py-1 text-xs focus:outline-none transition"
        style={mt.inputStyle}
      />
    </div>
  );
};
