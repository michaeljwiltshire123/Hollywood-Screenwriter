import React, { useState, useRef } from 'react';
import { calculateSafePacing } from './storyLabOps';
import { CharacterFortuneNode, StoryArcCard, ScreenplayDocument, SceneInfo, SubPlotTrack } from '../../types';
import { SelectedFortuneNode } from './characterFortuneTypes';
import { CharacterFortuneDropdown } from './CharacterFortuneDropdown';
import { StoryLabTimelineTrack } from './StoryLabTimelineTrack';
import { StoryLabGiCurveSvg } from './StoryLabGiCurveSvg';
import { StoryLabGiTagsLayer } from './StoryLabGiTagsLayer';
import { useCharacterFortuneState } from './useCharacterFortuneState';
import { getSubPlotPalette } from './subPlotOps';
import { buildWallStickits } from './storyStickitOps';
import { StoryLabStickitsWall } from './StoryLabStickitsWall';
import { TimelineContextMenu } from './TimelineContextMenu';

interface StoryLabTimelineProps {
  targetMinutes: number; estimatedMinutes: number; cards?: StoryArcCard[]; subPlots?: SubPlotTrack[];
  script?: ScreenplayDocument; scenes?: SceneInfo[]; isHeroJourneyOpen?: boolean;
  onSelectHeroBeat?: (trackId: string, stageIdx: number) => void;
  onAddTimelineBeat?: (percentX: number, trackId: string) => void;
  onUpdateCharacterArcs?: (arcs: Record<string, CharacterFortuneNode[]>) => void;
}

function getCoords(e: React.MouseEvent, el: HTMLDivElement) {
  const r = el.getBoundingClientRect();
  const maxD = Math.max(1, r.height / 2 - 28);
  const percentX = Math.max(3, Math.min(97, ((e.clientX - r.left) / r.width) * 100));
  const fortune = Math.max(-100, Math.min(100, Math.round(((r.height / 2 - (e.clientY - r.top)) / maxD) * 100)));
  return { percentX, fortune };
}

export const StoryLabTimeline: React.FC<StoryLabTimelineProps> = ({
  targetMinutes, estimatedMinutes, cards = [], subPlots = [], script, scenes = [],
  isHeroJourneyOpen = false, onSelectHeroBeat, onAddTimelineBeat, onUpdateCharacterArcs,
}) => {
  const [showAllPlots, setShowAllPlots] = useState(true);
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; percentX: number; fortune: number } | null>(null);
  const [activeDragNode, setActiveDragNode] = useState<SelectedFortuneNode | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const pacing = calculateSafePacing(targetMinutes, estimatedMinutes);
  const actProgressPct = Math.min(100, Math.round((pacing.estimatedMinutes / pacing.targetMinutes) * 100));
  const cf = useCharacterFortuneState(script, scenes, onUpdateCharacterArcs);
  const wallStickits = buildWallStickits(cards, subPlots, script?.storyArc?.heroJourney, isHeroJourneyOpen, showAllPlots, pacing.targetMinutes);

  const endDrag = () => { if (activeDragNode) { setActiveDragNode(null); cf.handleCommitDrag(); } };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    e.preventDefault();
    const { percentX, fortune } = getCoords(e, canvasRef.current);
    setCtxMenu({ x: e.clientX, y: e.clientY, percentX: Math.round(percentX), fortune });
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 shadow-xs font-sans space-y-2.5 select-none overflow-visible" onMouseUp={endDrag} onMouseLeave={endDrag}>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
        <div className="flex items-center gap-2">
          <span className="uppercase tracking-wider text-[11px] text-amber-800 font-black">Narrative Act Milestones</span>
          <span className="text-[10px] text-slate-400 font-semibold hidden sm:inline">• Writers&apos; Wall &amp; Right-Click to Add</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-[11px] font-bold">
            <button type="button" onClick={() => setShowAllPlots(false)} className={`px-2 py-1 rounded-md transition cursor-pointer ${!showAllPlots ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}>Main Only</button>
            <button type="button" onClick={() => setShowAllPlots(true)} className={`px-2 py-1 rounded-md transition cursor-pointer ${showAllPlots ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}>All Plots</button>
          </div>
          <CharacterFortuneDropdown characters={cf.characters} selectedIds={cf.selectedIds} onToggleCharacter={cf.handleToggleCharacter} onSelectAll={cf.handleSelectAll} />
          <span className="font-mono text-slate-500 text-[11px] tabular-nums">Est: <strong className="text-slate-900">{pacing.estimatedMinutes}m</strong> / {pacing.targetMinutes}m ({actProgressPct}%)</span>
        </div>
      </div>

      {showAllPlots && subPlots.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-600 px-1">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-amber-500" /><span>Main Story</span></span>
          {subPlots.map((sp) => (
            <span key={sp.id} className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: getSubPlotPalette(sp.color).border }} /><span>{sp.name}</span></span>
          ))}
        </div>
      )}

      <div ref={canvasRef} onMouseDown={(e) => { if (e.button === 0) cf.setSelectedNode(null); }} onMouseMove={(e) => { if (activeDragNode && canvasRef.current) { const { percentX, fortune } = getCoords(e, canvasRef.current); cf.handleMoveNode(activeDragNode.charId, activeDragNode.nodeId, percentX, fortune); } }} onContextMenu={handleContextMenu} className="relative h-[340px] w-full rounded-xl bg-slate-50/70 border border-slate-200/90 overflow-visible shadow-2xs">
        <StoryLabTimelineTrack pacing={pacing} actProgressPct={actProgressPct} />
        <StoryLabGiCurveSvg characterPointsMap={cf.characterPointsMap} canvasHeight={340} selectedCharId={cf.selectedNode?.charId} />
        {ctxMenu && (
          <>
            <div style={{ left: `${ctxMenu.percentX}%` }} className="absolute inset-y-4 w-px border-l-2 border-dashed border-amber-500 z-30 pointer-events-none" />
            <span style={{ left: `${ctxMenu.percentX}%`, top: `${((170 - (ctxMenu.fortune / 100) * 142) / 340) * 100}%` }} className="absolute w-3 h-3 rounded-full bg-amber-500/80 ring-2 ring-white -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none" />
          </>
        )}
        <StoryLabStickitsWall items={wallStickits} isHeroJourneyOpen={isHeroJourneyOpen} onSelectStickit={onSelectHeroBeat} />
        <StoryLabGiTagsLayer points={cf.allTagPoints} canvasHeight={340} targetMinutes={pacing.targetMinutes} activeDragNode={activeDragNode} selectedNode={cf.selectedNode} onStartDrag={(n) => { cf.setSelectedNode(n); cf.setActiveCharId(n.charId); setActiveDragNode(n); }} onDeleteNode={cf.handleDeleteNode} />
      </div>

      {ctxMenu && onAddTimelineBeat && (
        <TimelineContextMenu x={ctxMenu.x} y={ctxMenu.y} percentX={ctxMenu.percentX} fortuneY={ctxMenu.fortune} approxMinutes={Math.round((ctxMenu.percentX / 100) * pacing.targetMinutes)} subPlots={subPlots} selectedCharacters={cf.characters.filter((c) => cf.selectedIds.includes(c.id))} fallbackCharacter={cf.characters[0]} activeCharId={cf.activeCharId || cf.selectedIds[0]} onSelectTrack={(trackId) => onAddTimelineBeat(ctxMenu.percentX, trackId)} onAddFortuneNode={(charId) => cf.handleAddFortuneNode(charId, ctxMenu.percentX, ctxMenu.fortune)} onClose={() => setCtxMenu(null)} />
      )}
    </div>
  );
};
