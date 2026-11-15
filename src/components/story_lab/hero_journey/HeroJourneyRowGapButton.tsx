import React from 'react';
import { Plus } from 'lucide-react';
import { ModalThemeStyles } from '../../../lib/modalTheme';

interface HeroJourneyRowGapButtonProps {
  mt: ModalThemeStyles;
  onAddRow: () => void;
  label?: string;
}

export const HeroJourneyRowGapButton: React.FC<HeroJourneyRowGapButtonProps> = ({
  mt, onAddRow, label = 'Add row',
}) => {
  return (
    <div className="group/gap relative h-3.5 flex items-center justify-center my-0.5 select-none">
      <div
        className="absolute inset-x-2 top-1/2 -translate-y-1/2 border-t border-dashed opacity-0 group-hover/gap:opacity-45 group-focus-within/gap:opacity-45 transition-opacity duration-150 pointer-events-none"
        style={{ borderColor: mt.theme.accentText }}
      />
      <button
        type="button"
        onClick={onAddRow}
        className="relative z-10 inline-flex items-center gap-1 px-2 py-0.2 rounded-full border text-[10px] font-bold opacity-0 group-hover/gap:opacity-100 focus-visible:opacity-100 transition-opacity duration-150 cursor-pointer shadow-2xs"
        style={mt.secondaryBtnStyle}
        title="Insert a new synchronised beat row here"
      >
        <Plus className="w-2.5 h-2.5" style={{ color: mt.theme.accentText }} />
        <span>{label}</span>
      </button>
    </div>
  );
};
