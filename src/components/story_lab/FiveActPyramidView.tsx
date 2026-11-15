import React from 'react';
import { StoryArcCard, SubPlotTrack } from '../../types';
import { extractFiveActPyramid } from './fiveActPyramidHelper';
import { StoryLabPyramidCard } from './StoryLabPyramidCard';
import { FiveActPyramidArcSvg } from './FiveActPyramidArcSvg';
import { FiveActPyramidBaseRow } from './FiveActPyramidBaseRow';
import { countSubPlotsForAct } from './subPlotOps';
import { SubPlotPocketBridge } from './storyLabTypes';

interface FiveActPyramidViewProps {
  cards: StoryArcCard[];
  subPlots?: SubPlotTrack[];
  cardBackupsMap?: Record<string, string[]>;
  expandedCardId?: string | null;
  plotPointsMap?: Record<string, StoryArcCard[]>;
  onUpdateCard: (id: string, field: 'actTitle' | 'goal' | 'linkedSceneId', val: string) => void;
  onUpdatePlotPoint?: (cardId: string, index: number, field: 'actTitle' | 'goal', val: string) => void;
  onSetExpandedCardId?: (id: string | null) => void;
  onOpenGuidedSpark: () => void;
  onCardIdeaGeneration?: (card: StoryArcCard) => void;
  pocket?: SubPlotPocketBridge;
}

export const FiveActPyramidView: React.FC<FiveActPyramidViewProps> = ({
  cards, subPlots = [], cardBackupsMap, expandedCardId, plotPointsMap, onUpdateCard, onUpdatePlotPoint,
  onSetExpandedCardId, onOpenGuidedSpark, onCardIdeaGeneration, pocket,
}) => {
  const p = extractFiveActPyramid(cards);
  const allFiveHaveText = [p.apexCard, p.leftShoulderCard, p.rightShoulderCard, p.bottomLeftCard, p.bottomRightCard]
    .every((c) => Boolean(c.goal && c.goal.trim().length > 0));

  const renderCard = (card: StoryArcCard, label: string, actIdx: number, sublabel?: string, isFaded?: boolean, canCreate?: boolean) => (
    <StoryLabPyramidCard
      card={card} label={label} sublabel={sublabel} actIndex={actIdx} defaultSlideSide={actIdx === 3 ? 'left' : 'right'}
      isFaded={isFaded} isOriginalBottom={false} canCreatePlotpoints={canCreate} isExpanded={expandedCardId === card.id}
      miniBeats={plotPointsMap?.[card.id]} onToggleExpand={(exp) => onSetExpandedCardId?.(exp ? card.id : null)}
      onUpdateMiniBeat={(idx, f, v) => onUpdatePlotPoint?.(card.id, idx, f, v)}
      backups={cardBackupsMap?.[card.id]} onUpdateCard={onUpdateCard} onOpenGuidedSpark={onOpenGuidedSpark}
      onCardIdeaGeneration={onCardIdeaGeneration} pocket={pocket} subPlotCount={countSubPlotsForAct(subPlots, actIdx)}
    />
  );

  return (
    <div className="relative w-full rounded-2xl bg-linear-to-b from-[#EAE6F8]/70 via-[#F3EFFC]/60 to-[#EAE6F8]/80 border-2 border-[#D8D0F0] p-4 sm:p-5 shadow-xl space-y-4 overflow-visible font-sans">
      <div className="flex items-center justify-between text-xs font-bold text-slate-700 border-b border-purple-200/60 pb-2">
        <span className="text-sm font-extrabold text-slate-900 tracking-tight">Turning 3 act structure into 5 acts</span>
        <span className="text-[11px] font-mono text-slate-500">5-Act Dramatic Arc Pyramid</span>
      </div>
      <div className="relative">
        <FiveActPyramidArcSvg />
        <div className="relative z-10 space-y-4 pt-3 pb-1">
          <div className="flex justify-center">
            <div className="w-full max-w-sm">{renderCard(p.apexCard, 'New Act III (Apex)', 2, 'Furthest from Finale', false, allFiveHaveText)}</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {renderCard(p.leftShoulderCard, 'New Act II', 1, 'Outside Disruption', false, allFiveHaveText)}
            {renderCard(p.rightShoulderCard, 'New Act IV', 3, 'Preparation & Obstacle', false, allFiveHaveText)}
          </div>
          <FiveActPyramidBaseRow
            bottomLeftCard={p.bottomLeftCard} bottomMiddleCard={p.bottomMiddleCard} bottomRightCard={p.bottomRightCard}
            allFiveHaveText={allFiveHaveText} subPlots={subPlots} expandedCardId={expandedCardId} plotPointsMap={plotPointsMap}
            onSetExpandedCardId={onSetExpandedCardId} onUpdatePlotPoint={onUpdatePlotPoint}
            cardBackupsMap={cardBackupsMap} onUpdateCard={onUpdateCard} onOpenGuidedSpark={onOpenGuidedSpark}
            onCardIdeaGeneration={onCardIdeaGeneration} pocket={pocket}
          />
        </div>
      </div>
    </div>
  );
};
