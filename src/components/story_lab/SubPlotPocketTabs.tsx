import React from 'react';
import { Plus } from 'lucide-react';
import { SubPlotTrack } from '../../types';
import { getSubPlotPalette, hasActWriting } from './subPlotOps';

interface SubPlotPocketTabsProps {
  actIndex: number;
  subPlots: SubPlotTrack[];
  isCardPocketOpen: boolean;
  activePocketSubPlotId?: string | null;
  onTogglePocket: (actIndex: number, subPlotId?: string) => void;
  onCreateForPocket: (actIndex: number) => void;
}

export const SubPlotPocketTabs: React.FC<SubPlotPocketTabsProps> = ({
  actIndex, subPlots, isCardPocketOpen, activePocketSubPlotId, onTogglePocket, onCreateForPocket,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100 font-sans">
      {subPlots.map((sp) => {
        const pal = getSubPlotPalette(sp.color);
        const written = hasActWriting(sp, actIndex);
        const isOpenTab = isCardPocketOpen && activePocketSubPlotId === sp.id;
        return (
          <button
            key={sp.id}
            type="button"
            onClick={() => onTogglePocket(actIndex, sp.id)}
            className={`px-2.5 py-1 min-h-[28px] rounded-md text-[11px] font-bold border transition cursor-pointer flex items-center gap-1 whitespace-nowrap ${
              isOpenTab ? 'shadow-xs ring-1 ring-offset-0' : 'hover:opacity-90'
            }`}
            style={{
              backgroundColor: isOpenTab ? pal.border : written ? pal.bgTint : '#FFFFFF',
              borderColor: isOpenTab || written ? pal.border : '#CBD5E1',
              color: isOpenTab ? '#FFFFFF' : written ? pal.badgeText : '#64748B',
            }}
            title={written ? `Open ${sp.name} (has notes for Act ${actIndex + 1})` : `Open empty ${sp.name} pocket for Act ${actIndex + 1}`}
          >
            <span className="truncate max-w-[110px]">{sp.name}</span>
          </button>
        );
      })}
      <button
        type="button"
        onClick={() => onCreateForPocket(actIndex)}
        className="px-2 py-1 min-h-[28px] rounded-md text-[11px] font-bold border border-dashed border-slate-300 text-slate-600 hover:border-amber-500 hover:text-amber-900 hover:bg-amber-50/50 transition cursor-pointer flex items-center gap-1 whitespace-nowrap"
        title="Add a new Sub-Plot pocket beside this act"
      >
        <Plus className="w-3 h-3" />
        <span>{subPlots.length === 0 ? 'Add Sub-Plot' : 'New'}</span>
      </button>
    </div>
  );
};
