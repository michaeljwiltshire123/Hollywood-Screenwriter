import React from 'react';
import { Plus } from 'lucide-react';
import { SubPlotTrack } from '../../../types';
import { ModalThemeStyles } from '../../../lib/modalTheme';
import { getSubPlotPalette } from '../subPlotOps';

interface HeroJourneyFilterStatsProps {
  subPlots: SubPlotTrack[];
  filterTrackId: 'all' | 'main' | string;
  mainColor: string;
  totalPages: number;
  activeBeatTitle: string;
  mt: ModalThemeStyles;
  onSelectFilter: (id: 'all' | 'main' | string) => void;
  onCreateSubPlot: () => void;
}

export const HeroJourneyFilterStats: React.FC<HeroJourneyFilterStatsProps> = ({
  subPlots, filterTrackId, mainColor, totalPages, activeBeatTitle, mt, onSelectFilter, onCreateSubPlot,
}) => {
  return (
    <div className="rounded-xl border p-4 space-y-3 shadow-xs font-sans" style={mt.cardStyle}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button" onClick={() => onSelectFilter('all')}
          className="px-3.5 py-1.5 rounded-full text-xs font-extrabold border transition cursor-pointer whitespace-nowrap"
          style={filterTrackId === 'all' ? mt.primaryBtnStyle : mt.secondaryBtnStyle}
        >
          All Plot Lines
        </button>
        <button
          type="button" onClick={onCreateSubPlot}
          className="px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer flex items-center gap-1 whitespace-nowrap hover:opacity-90"
          style={mt.secondaryBtnStyle}
          title="Add a new Sub-Plot column"
        >
          <Plus className="w-3.5 h-3.5" style={{ color: mt.theme.accentText }} />
          <span>New Sub-Plot</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 justify-between pt-1">
        <div className="space-y-1.5 min-w-0 flex-1">
          <button
            type="button" onClick={() => onSelectFilter('main')}
            className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border text-left transition cursor-pointer ${filterTrackId === 'main' ? 'ring-2 ring-offset-1' : 'hover:opacity-90'}`}
            style={{ ...mt.subCardStyle, borderColor: filterTrackId === 'main' ? mainColor : mt.theme.borders }}
          >
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: mainColor }} />
            <span className="truncate">Main Plot</span>
          </button>

          {subPlots.map((sp) => {
            const pal = getSubPlotPalette(sp.color);
            const active = filterTrackId === sp.id;
            return (
              <button
                key={sp.id} type="button" onClick={() => onSelectFilter(sp.id)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border text-left transition cursor-pointer ${active ? 'ring-2 ring-offset-1' : 'hover:opacity-90'}`}
                style={{ ...mt.subCardStyle, borderColor: active ? pal.border : mt.theme.borders }}
              >
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: pal.border }} />
                <span className="truncate">{sp.name}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-1 gap-2 shrink-0 text-[11px] border-t xl:border-t-0 xl:border-l pt-2 xl:pt-0 xl:pl-3" style={mt.borderStyle}>
          <div>
            <div className="opacity-65 font-semibold">Total Stages</div>
            <div className="font-extrabold text-xs tabular-nums">12 Stages</div>
          </div>
          <div>
            <div className="opacity-65 font-semibold">Project Count</div>
            <div className="font-extrabold text-xs tabular-nums">{totalPages} pages</div>
          </div>
          <div className="min-w-0">
            <div className="opacity-65 font-semibold">Active Beat</div>
            <div className="font-extrabold text-xs truncate max-w-[130px]" style={{ color: mt.theme.accentText }} title={activeBeatTitle}>
              {activeBeatTitle || 'Untitled Beat'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
