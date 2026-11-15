import React from 'react';
import { StoryArcCard, SubPlotTrack } from '../../types';
import { StoryLabPyramidCard } from './StoryLabPyramidCard';
import { countSubPlotsForAct } from './subPlotOps';
import { SubPlotPocketBridge } from './storyLabTypes';

interface FiveActPyramidBaseRowProps {
  bottomLeftCard: StoryArcCard;
  bottomMiddleCard: StoryArcCard;
  bottomRightCard: StoryArcCard;
  allFiveHaveText: boolean;
  subPlots?: SubPlotTrack[];
  expandedCardId?: string | null;
  plotPointsMap?: Record<string, StoryArcCard[]>;
  cardBackupsMap?: Record<string, string[]>;
  onUpdateCard: (id: string, field: 'actTitle' | 'goal' | 'linkedSceneId', val: string) => void;
  onUpdatePlotPoint?: (cardId: string, index: number, field: 'actTitle' | 'goal', val: string) => void;
  onSetExpandedCardId?: (id: string | null) => void;
  onOpenGuidedSpark: () => void;
  onCardIdeaGeneration?: (card: StoryArcCard) => void;
  pocket?: SubPlotPocketBridge;
}

export const FiveActPyramidBaseRow: React.FC<FiveActPyramidBaseRowProps> = ({
  bottomLeftCard, bottomMiddleCard, bottomRightCard, allFiveHaveText, subPlots = [],
  expandedCardId, plotPointsMap, cardBackupsMap, onUpdateCard, onUpdatePlotPoint, onSetExpandedCardId,
  onOpenGuidedSpark, onCardIdeaGeneration, pocket,
}) => {
  const renderCard = (card: StoryArcCard, label: string, actIdx: number, sublabel?: string, isFaded?: boolean, canCreate?: boolean) => (
    <StoryLabPyramidCard
      card={card} label={label} sublabel={sublabel} actIndex={actIdx} defaultSlideSide={actIdx === 4 ? 'left' : 'right'}
      isFaded={isFaded} isOriginalBottom canCreatePlotpoints={canCreate} isExpanded={expandedCardId === card.id}
      miniBeats={plotPointsMap?.[card.id]} onToggleExpand={(exp) => onSetExpandedCardId?.(exp ? card.id : null)}
      onUpdateMiniBeat={(idx, f, v) => onUpdatePlotPoint?.(card.id, idx, f, v)}
      backups={cardBackupsMap?.[card.id]} onUpdateCard={onUpdateCard} onOpenGuidedSpark={onOpenGuidedSpark}
      onCardIdeaGeneration={onCardIdeaGeneration} pocket={pocket} subPlotCount={countSubPlotsForAct(subPlots, actIdx)}
    />
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
      {renderCard(bottomLeftCard, 'Original Act I (Beginning)', 0, undefined, false, allFiveHaveText)}
      {renderCard(bottomMiddleCard, 'Original Act II (Faded Middle)', 1, 'Replaced by New Acts', true, false)}
      {renderCard(bottomRightCard, 'Original Act III (Ending Climax)', 4, undefined, false, allFiveHaveText)}
    </div>
  );
};
