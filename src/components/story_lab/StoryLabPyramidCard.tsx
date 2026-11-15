import React, { useState } from 'react';
import { StoryArcCard } from '../../types';
import { StoryLabCardFooter } from './StoryLabCardFooter';
import { StoryLabCardBackups } from './StoryLabCardBackups';
import { StoryLabPlotpointsDeck } from './StoryLabPlotpointsDeck';
import { SubPlotPocketBridge } from './storyLabTypes';
import { getSubPlotPalette } from './subPlotOps';
import { SubPlotPocketTabs } from './SubPlotPocketTabs';
import { SideSlideSubPlotCard } from './SideSlideSubPlotCard';

interface StoryLabPyramidCardProps {
  card: StoryArcCard; label: string; sublabel?: string; actIndex?: number; defaultSlideSide?: 'left' | 'right';
  isFaded?: boolean; isOriginalBottom?: boolean; backups?: string[]; canCreatePlotpoints?: boolean;
  isExpanded?: boolean; onToggleExpand?: (expand: boolean) => void;
  onUpdateCard: (id: string, field: 'actTitle' | 'goal' | 'linkedSceneId', val: string) => void;
  onOpenGuidedSpark: () => void; onCardIdeaGeneration?: (card: StoryArcCard) => void;
  subPlotCount?: number; pocket?: SubPlotPocketBridge;
  miniBeats?: StoryArcCard[]; onUpdateMiniBeat?: (beatIndex: number, field: 'actTitle' | 'goal', val: string) => void;
}

export const StoryLabPyramidCard: React.FC<StoryLabPyramidCardProps> = ({
  card, label, sublabel, actIndex = 0, defaultSlideSide = 'right', isFaded, isOriginalBottom, backups, canCreatePlotpoints,
  isExpanded, onToggleExpand, onUpdateCard, onOpenGuidedSpark, onCardIdeaGeneration, subPlotCount = 0, pocket, miniBeats = [], onUpdateMiniBeat,
}) => {
  const [localExpanded, setLocalExpanded] = useState(false);
  const expanded = isExpanded !== undefined ? isExpanded : localExpanded;
  const [plotPoints, setPlotPoints] = useState<StoryArcCard[]>(() => (
    miniBeats.length === 3 ? miniBeats : [1, 2, 3].map((i) => ({ id: `${card.id}-p${i}`, actTitle: '', goal: '' }))
  ));

  const handleToggle = (val: boolean) => (onToggleExpand ? onToggleExpand(val) : setLocalExpanded(val));
  const handleUpdateMiniCard = (idx: number, field: 'actTitle' | 'goal', val: string) => {
    setPlotPoints((prev) => { const next = [...prev]; next[idx] = { ...next[idx], [field]: val }; return next; });
    onUpdateMiniBeat?.(idx, field, val);
  };
  const triggerIdeaGen = (targetCard: StoryArcCard) => (onCardIdeaGeneration ? onCardIdeaGeneration(targetCard) : onOpenGuidedSpark());

  if (expanded) {
    return (
      <StoryLabPlotpointsDeck
        card={card} parentLabel={label} miniCards={miniBeats.length === 3 ? miniBeats : plotPoints}
        onUpdateMiniCard={handleUpdateMiniCard} onCollapse={() => handleToggle(false)} onOpenGuidedSpark={triggerIdeaGen}
      />
    );
  }

  const hasBackups = backups && backups.length > 0;
  const isPocketOpen = Boolean(!isFaded && pocket && pocket.openActIndex === actIndex && pocket.pocketSubPlot);
  const pal = isPocketOpen && pocket?.pocketSubPlot ? getSubPlotPalette(pocket.pocketSubPlot.color) : null;

  return (
    <div className={`relative group my-1 font-sans transition-all duration-300 ${isFaded ? 'opacity-40 grayscale-30 hover:opacity-80' : 'opacity-100'} ${isPocketOpen ? 'z-30' : 'z-10'}`}>
      {hasBackups && <div className="absolute -bottom-1.5 -right-1 left-1 top-1.5 bg-amber-50 border border-amber-200 rounded-xl z-0 pointer-events-none transform -rotate-1" />}
      <div
        className={`bg-white border-2 rounded-xl p-2 shadow-md flex flex-col justify-between space-y-1.5 text-[#0F172A] relative z-10 ${isOriginalBottom ? 'border-blue-600 bg-blue-50/20' : 'border-blue-500 bg-white'}`}
        style={pal ? { borderColor: pal.border, boxShadow: `0 0 0 2px ${pal.border}44` } : undefined}
      >
        <div className="space-y-1 flex-1 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1 gap-2">
            <span className={`px-2 py-0.5 rounded text-[11px] font-black ${isFaded ? 'bg-slate-200 text-slate-700' : 'bg-blue-600 text-white'}`}>{label}</span>
            {sublabel && <span className="text-[10px] font-mono text-slate-500 font-bold truncate">{sublabel}</span>}
          </div>
          <input type="text" value={card.actTitle || ''} onChange={(e) => onUpdateCard(card.id, 'actTitle', e.target.value)} className="font-extrabold text-xs text-slate-900 bg-transparent rounded px-1.5 py-0.5 w-full truncate focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Beat title..." />
          <textarea value={card.goal || ''} onChange={(e) => onUpdateCard(card.id, 'goal', e.target.value)} rows={6} className="w-full flex-1 min-h-[165px] rounded-lg p-2.5 text-xs text-slate-900 leading-relaxed resize-none bg-white border border-slate-200 focus:border-blue-500 focus:outline-none" placeholder="Describe story event / beat notes..." />
          {hasBackups && <StoryLabCardBackups backups={backups} onPromote={(text) => onUpdateCard(card.id, 'goal', text)} />}
        </div>
        <StoryLabCardFooter
          onIdeaGeneration={() => triggerIdeaGen(card)}
          onOpenSubPlot={!isFaded && pocket ? () => pocket.onTogglePocket(actIndex) : undefined}
          subPlotCount={subPlotCount} isPocketOpen={isPocketOpen}
          onCreatePlotpoints={canCreatePlotpoints ? () => handleToggle(true) : undefined}
        />
        {!isFaded && pocket && (
          <SubPlotPocketTabs
            actIndex={actIndex} subPlots={pocket.subPlots} isCardPocketOpen={isPocketOpen}
            activePocketSubPlotId={pocket.pocketSubPlot?.id}
            onTogglePocket={pocket.onTogglePocket} onCreateForPocket={pocket.onCreateForPocket}
          />
        )}
      </div>
      {isPocketOpen && pocket && <SideSlideSubPlotCard actIndex={actIndex} defaultSide={defaultSlideSide} pocket={pocket} />}
    </div>
  );
};
