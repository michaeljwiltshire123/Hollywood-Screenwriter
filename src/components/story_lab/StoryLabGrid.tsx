import React from 'react';
import { StoryArcCard, SubPlotTrack } from '../../types';
import { StoryLabActCard } from './StoryLabActCard';
import { FiveActPyramidView } from './FiveActPyramidView';
import { SubPlotLaneRow } from './SubPlotLaneRow';
import { countSubPlotsForAct } from './subPlotOps';
import { SubPlotPocketBridge } from './storyLabTypes';

interface StoryLabGridProps {
  cards: StoryArcCard[];
  subPlots?: SubPlotTrack[];
  activeSubPlot?: SubPlotTrack | null;
  pocket?: SubPlotPocketBridge;
  cardBackupsMap?: Record<string, string[]>;
  expandedCardId?: string | null;
  plotPointsMap?: Record<string, StoryArcCard[]>;
  onUpdateCard: (id: string, field: 'actTitle' | 'goal' | 'linkedSceneId', val: string) => void;
  onUpdatePlotPoint?: (cardId: string, index: number, field: 'actTitle' | 'goal', val: string) => void;
  onSetExpandedCardId?: (id: string | null) => void;
  onOpenGuidedSpark: () => void;
  onCardIdeaGeneration?: (card: StoryArcCard) => void;
  onRenameSubPlot?: (id: string, name: string) => void;
  onChangeSubPlotColor?: (id: string, color: string) => void;
  onChangeSubPlotEmotion?: (id: string, emotion: string) => void;
  onUpdateSubPlotCard?: (subPlotId: string, cardIdx: number, field: 'actTitle' | 'goal', val: string) => void;
  onDeleteSubPlot?: (id: string) => void;
  onSubPlotIdeaGen?: (card: StoryArcCard, subPlotName: string) => void;
}

export const StoryLabGrid: React.FC<StoryLabGridProps> = ({
  cards, subPlots = [], activeSubPlot, pocket, cardBackupsMap, expandedCardId, plotPointsMap,
  onUpdateCard, onUpdatePlotPoint, onSetExpandedCardId, onOpenGuidedSpark, onCardIdeaGeneration,
  onRenameSubPlot, onChangeSubPlotColor, onChangeSubPlotEmotion, onUpdateSubPlotCard, onDeleteSubPlot, onSubPlotIdeaGen,
}) => {
  const isFiveAct = cards.length > 3;
  const visibleSubPlots = activeSubPlot ? [activeSubPlot] : subPlots;
  const canRenderSubRow = Boolean(onRenameSubPlot && onChangeSubPlotColor && onChangeSubPlotEmotion && onUpdateSubPlotCard && onDeleteSubPlot && onSubPlotIdeaGen);

  return (
    <div className="space-y-4">
      {!activeSubPlot && (
        isFiveAct ? (
          <FiveActPyramidView
            cards={cards} subPlots={subPlots} cardBackupsMap={cardBackupsMap} expandedCardId={expandedCardId}
            plotPointsMap={plotPointsMap} onUpdateCard={onUpdateCard} onUpdatePlotPoint={onUpdatePlotPoint}
            onSetExpandedCardId={onSetExpandedCardId} onOpenGuidedSpark={onOpenGuidedSpark}
            onCardIdeaGeneration={onCardIdeaGeneration} pocket={pocket}
          />
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            {cards.map((card, idx) => (
              <StoryLabActCard
                key={card.id} card={card} index={idx} backups={cardBackupsMap?.[card.id]}
                subPlotCount={countSubPlotsForAct(subPlots, idx)} pocket={pocket}
                onUpdateCard={onUpdateCard} onOpenGuidedSpark={onOpenGuidedSpark}
                onCardIdeaGeneration={onCardIdeaGeneration}
              />
            ))}
          </div>
        )
      )}

      {canRenderSubRow && visibleSubPlots.map((sp) => (
        <SubPlotLaneRow
          key={sp.id} subPlot={sp} isFiveAct={isFiveAct}
          onRename={onRenameSubPlot!} onChangeColor={onChangeSubPlotColor!} onChangeEmotion={onChangeSubPlotEmotion!}
          onUpdateCard={onUpdateSubPlotCard!} onDelete={onDeleteSubPlot!} onCardIdeaGen={onSubPlotIdeaGen!}
        />
      ))}
    </div>
  );
};
