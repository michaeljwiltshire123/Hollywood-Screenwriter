import React from 'react';
import { StoryArcCard } from '../../types';
import { STORY_LAB_3_ACT_DEFS } from './storyLabOps';
import { StoryLabCardFooter } from './StoryLabCardFooter';
import { StoryLabCardBackups } from './StoryLabCardBackups';
import { SubPlotPocketBridge } from './storyLabTypes';
import { getSubPlotPalette } from './subPlotOps';
import { SubPlotPocketTabs } from './SubPlotPocketTabs';
import { SideSlideSubPlotCard } from './SideSlideSubPlotCard';

interface StoryLabActCardProps {
  card: StoryArcCard;
  index: number;
  backups?: string[];
  subPlotCount?: number;
  pocket?: SubPlotPocketBridge;
  onUpdateCard: (id: string, field: 'actTitle' | 'goal' | 'linkedSceneId', val: string) => void;
  onOpenGuidedSpark: () => void;
  onCardIdeaGeneration?: (card: StoryArcCard) => void;
}

export const StoryLabActCard: React.FC<StoryLabActCardProps> = ({
  card, index, backups, subPlotCount = 0, pocket, onUpdateCard, onOpenGuidedSpark, onCardIdeaGeneration,
}) => {
  const def = STORY_LAB_3_ACT_DEFS[index % STORY_LAB_3_ACT_DEFS.length];
  const hasBackups = backups && backups.length > 0;
  const isPocketOpen = Boolean(pocket && pocket.openActIndex === index && pocket.pocketSubPlot);
  const pal = isPocketOpen && pocket?.pocketSubPlot ? getSubPlotPalette(pocket.pocketSubPlot.color) : null;

  return (
    <div className={`relative group my-0.5 font-sans ${isPocketOpen ? 'z-30' : 'z-10'}`}>
      {hasBackups && backups.length >= 2 && (
        <div className="absolute -bottom-2.5 -right-2 left-2 top-2.5 bg-amber-100/90 border border-amber-300 rounded-xl shadow-2xs z-0 pointer-events-none transform rotate-1" />
      )}
      {hasBackups && (
        <div className="absolute -bottom-1.5 -right-1 left-1 top-1.5 bg-amber-50 border border-amber-200 rounded-xl shadow-xs z-0 pointer-events-none transform -rotate-1" />
      )}

      <div
        className="bg-[#FFFFFF] border rounded-xl p-2 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-1.5 font-sans text-[#0F172A] relative z-10"
        style={pal ? { borderColor: pal.border, boxShadow: `0 0 0 2px ${pal.border}44` } : { borderColor: '#E2E8F0' }}
      >
        <div className="space-y-1.5 flex-1 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1 gap-1.5">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-amber-50 text-amber-900 border border-amber-200 shrink-0">Act {index + 1}</span>
              <input
                type="text" value={card.actTitle || ''} onChange={(e) => onUpdateCard(card.id, 'actTitle', e.target.value)}
                className="font-extrabold text-xs text-slate-900 bg-transparent rounded px-1.5 py-0.5 w-full truncate focus:outline-none focus:ring-1 focus:ring-amber-500 hover:bg-slate-50 focus:bg-amber-50/50 transition-colors placeholder:font-normal placeholder:text-slate-400"
                placeholder="Title (or first line auto-fills)..."
              />
            </div>
            <span className="text-[10px] font-mono text-slate-400 font-bold shrink-0">{def?.targetRange}</span>
          </div>

          <textarea
            value={card.goal || ''} onChange={(e) => onUpdateCard(card.id, 'goal', e.target.value)}
            className="w-full flex-1 min-h-[300px] sm:min-h-[340px] rounded-lg p-3 text-[13px] text-slate-900 leading-relaxed resize-none transition-all bg-white border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none hover:border-slate-300 placeholder:italic placeholder:text-slate-400"
            placeholder="Write your notes here... (the first line will automatically set the title)"
          />

          {hasBackups && <StoryLabCardBackups backups={backups} onPromote={(text) => onUpdateCard(card.id, 'goal', text)} />}
        </div>

        <StoryLabCardFooter
          onIdeaGeneration={() => (onCardIdeaGeneration ? onCardIdeaGeneration(card) : onOpenGuidedSpark())}
          onOpenSubPlot={pocket ? () => pocket.onTogglePocket(index) : undefined}
          subPlotCount={subPlotCount} isPocketOpen={isPocketOpen}
        />

        {pocket && (
          <SubPlotPocketTabs
            actIndex={index} subPlots={pocket.subPlots} isCardPocketOpen={isPocketOpen}
            activePocketSubPlotId={pocket.pocketSubPlot?.id}
            onTogglePocket={pocket.onTogglePocket} onCreateForPocket={pocket.onCreateForPocket}
          />
        )}
      </div>

      {isPocketOpen && pocket && (
        <SideSlideSubPlotCard actIndex={index} defaultSide={index === 2 ? 'left' : 'right'} pocket={pocket} />
      )}
    </div>
  );
};
