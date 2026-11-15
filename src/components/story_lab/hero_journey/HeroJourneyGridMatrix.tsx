import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, Pencil, X } from 'lucide-react';
import { HeroJourneyData, HeroJourneyStageRow, SubPlotTrack } from '../../../types';
import { ModalThemeStyles } from '../../../lib/modalTheme';
import { getSubPlotPalette } from '../subPlotOps';
import { SelectedHeroBeatRef } from './useHeroJourneyState';
import { HeroJourneyBeatCard } from './HeroJourneyBeatCard';
import { HeroJourneyRowGapButton } from './HeroJourneyRowGapButton';
import { HeroJourneyStageTooltip } from './HeroJourneyStageTooltip';

interface HeroJourneyGridMatrixProps {
  heroData: HeroJourneyData; stages: HeroJourneyStageRow[]; subPlots: SubPlotTrack[];
  filterTrackId: 'all' | 'main' | string; selectedRef: SelectedHeroBeatRef; mainColor: string; mt: ModalThemeStyles;
  onSelectBeat: (ref: SelectedHeroBeatRef) => void; onReimportFromActs: () => void;
  onRenameSubPlot: (id: string, name: string) => void; onInsertRow: (insertIdx: number) => void;
  onDeleteCustomRow: (rowIdx: number) => void; onRenameStage: (rowIdx: number, title: string) => void;
}

export const HeroJourneyGridMatrix: React.FC<HeroJourneyGridMatrixProps> = ({
  heroData, stages, subPlots, filterTrackId, selectedRef, mainColor, mt,
  onSelectBeat, onReimportFromActs, onRenameSubPlot, onInsertRow, onDeleteCustomRow, onRenameStage,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const showMain = filterTrackId === 'all' || filterTrackId === 'main';
  const visibleSubs = filterTrackId === 'all' ? subPlots : subPlots.filter((sp) => sp.id === filterTrackId);
  const freezeMain = showMain && visibleSubs.length > 0;
  const colClass = visibleSubs.length >= 2 && showMain ? 'w-[225px] shrink-0' : 'flex-1 min-w-[215px]';

  return (
    <div className="rounded-xl border p-3 space-y-3 shadow-xs font-sans" style={mt.subCardStyle}>
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b" style={mt.borderStyle}>
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs font-extrabold uppercase tracking-wide">Synchronised Hero&apos;s Journey Grid</span>
          {visibleSubs.length > 1 && (
            <div className="flex items-center gap-1 ml-2">
              <button type="button" onClick={() => scrollRef.current?.scrollBy({ left: -240, behavior: 'smooth' })} className="p-1 rounded border hover:opacity-80 cursor-pointer" style={mt.secondaryBtnStyle} title="Scroll sub-plot columns left"><ChevronLeft className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => scrollRef.current?.scrollBy({ left: 240, behavior: 'smooth' })} className="p-1 rounded border hover:opacity-80 cursor-pointer" style={mt.secondaryBtnStyle} title="Scroll sub-plot columns right"><ChevronRight className="w-3.5 h-3.5" /></button>
            </div>
          )}
        </div>
        <button type="button" onClick={onReimportFromActs} className="px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 hover:opacity-90 cursor-pointer whitespace-nowrap" style={mt.secondaryBtnStyle} title="Re-distribute text from your Act cards into the Hero's Journey rows">
          <RefreshCw className="w-3 h-3" /><span>Re-import from Acts</span>
        </button>
      </div>

      <div ref={scrollRef} className="overflow-x-auto pb-1">
        <div className="flex items-center gap-2.5 min-w-max sm:min-w-full mb-2">
          {showMain && (
            <div className={`${colClass} ${freezeMain ? 'sticky left-0 z-20 pr-1 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.12)]' : ''}`} style={{ backgroundColor: mt.theme.sidebarPanel }}>
              <div className="px-2.5 py-1.5 rounded-lg border text-xs font-extrabold flex items-center gap-2" style={{ ...mt.cardStyle, borderLeftWidth: 4, borderLeftColor: mainColor }}>
                <span className="truncate">Main Plot</span>{freezeMain && <span className="text-[10px] opacity-60 font-semibold ml-auto">Pinned</span>}
              </div>
            </div>
          )}
          {visibleSubs.map((sp) => (
            <div key={sp.id} className={colClass}>
              <div className="px-2 py-1 rounded-lg border flex items-center gap-1.5" style={{ ...mt.cardStyle, borderLeftWidth: 4, borderLeftColor: getSubPlotPalette(sp.color).border }}>
                <input type="text" value={sp.name} aria-label={`Rename ${sp.name}`} placeholder="Name sub-plot..." onChange={(e) => onRenameSubPlot(sp.id, e.target.value)} onBlur={() => { if (!sp.name.trim()) onRenameSubPlot(sp.id, 'Sub-Plot'); }} className="w-full min-w-0 bg-transparent text-xs font-extrabold focus:outline-none rounded px-1 py-0.5" />
                <Pencil className="w-3 h-3 opacity-45 shrink-0 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>

        {stages.map((stage, idx) => (
          <React.Fragment key={stage.id}>
            <div className="rounded-xl border p-2.5 space-y-2 min-w-max sm:min-w-full" style={mt.cardStyle}>
              <div className="flex items-center justify-between gap-2 pb-1 border-b" style={mt.borderStyle}>
                <div className="flex items-center gap-1.5 sticky left-0 min-w-0">
                  <span className="text-xs font-extrabold shrink-0">Row {idx + 1}:</span>
                  {stage.isCustom ? (
                    <input type="text" value={stage.title} onChange={(e) => onRenameStage(idx, e.target.value)} onBlur={() => { if (!stage.title.trim()) onRenameStage(idx, 'Custom Beat'); }} aria-label="Custom row title" className="bg-transparent text-xs font-extrabold focus:outline-none rounded px-1 hover:bg-black/5 w-48" />
                  ) : <span className="text-xs font-extrabold truncate">{stage.title}</span>}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <HeroJourneyStageTooltip title={stage.title} stageIndex={idx} isCustom={stage.isCustom} timelinePercent={stage.timelinePercent} />
                  {stage.isCustom && <button type="button" onClick={() => onDeleteCustomRow(idx)} className="p-0.5 rounded hover:bg-rose-500/15 text-rose-600 cursor-pointer" title="Remove custom row"><X className="w-3 h-3" /></button>}
                </div>
              </div>
              <div className="flex items-stretch gap-2.5">
                {showMain && heroData.mainBeats[idx] && (
                  <div className={`${colClass} ${freezeMain ? 'sticky left-0 z-10 pr-1 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.12)]' : ''}`} style={{ backgroundColor: mt.theme.sceneCards }}>
                    <HeroJourneyBeatCard beat={heroData.mainBeats[idx]} accentColor={mainColor} mt={mt} isSelected={selectedRef.trackId === 'main' && selectedRef.stageIdx === idx} onSelect={() => onSelectBeat({ trackId: 'main', stageIdx: idx })} />
                  </div>
                )}
                {visibleSubs.map((sp) => {
                  const beat = heroData.subPlotBeats[sp.id]?.[idx];
                  if (!beat) return null;
                  return <div key={sp.id} className={colClass}><HeroJourneyBeatCard beat={beat} accentColor={getSubPlotPalette(sp.color).border} mt={mt} isSelected={selectedRef.trackId === sp.id && selectedRef.stageIdx === idx} onSelect={() => onSelectBeat({ trackId: sp.id, stageIdx: idx })} /></div>;
                })}
              </div>
            </div>
            <HeroJourneyRowGapButton mt={mt} onAddRow={() => onInsertRow(idx + 1)} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
