import React from 'react';
import { ScreenplayDocument, SceneInfo } from '../../types';
import { AppThemeConfig } from '../../lib/themePresets';
import { StoryLabHeader } from './StoryLabHeader';
import { StoryLabTimeline } from './StoryLabTimeline';
import { StoryLabActionBar } from './StoryLabActionBar';
import { StoryLabGrid } from './StoryLabGrid';
import { HeroJourneyWorkspace } from './hero_journey/HeroJourneyWorkspace';
import { useStoryLabState } from './useStoryLabState';
import { useSubPlotState } from './useSubPlotState';

interface StoryLabWorkspaceBodyProps {
  script: ScreenplayDocument; scenes: SceneInfo[]; estimatedMinutes: number;
  themeConfig?: AppThemeConfig; isHeroJourneyOpen: boolean;
  jumpHeroBeat: { trackId: string; stageIdx: number; seq: number } | null;
  s: ReturnType<typeof useStoryLabState>; sp: ReturnType<typeof useSubPlotState>;
  onClose: () => void; onChangeScript: (updated: ScreenplayDocument) => void;
  onSelectHeroBeat: (trackId: string, stageIdx: number) => void;
  onAddTimelineBeat: (percentX: number, trackId: string) => void;
  onToggleHeroJourney: () => void; onOpenSynopsis: () => void; onOpenLogline: () => void;
}

export const StoryLabWorkspaceBody: React.FC<StoryLabWorkspaceBodyProps> = ({
  script, scenes, estimatedMinutes, themeConfig, isHeroJourneyOpen, jumpHeroBeat,
  s, sp, onClose, onChangeScript, onSelectHeroBeat, onAddTimelineBeat,
  onToggleHeroJourney, onOpenSynopsis, onOpenLogline,
}) => {
  return (
    <div className="max-w-7xl mx-auto w-full space-y-3.5">
      <StoryLabHeader
        title={script.title} targetLength={script.targetLength || 90} estimatedMinutes={estimatedMinutes}
        onChangeTargetLength={(val) => onChangeScript({ ...script, targetLength: val })} onClose={onClose} themeConfig={themeConfig}
      />
      <StoryLabTimeline
        targetMinutes={script.targetLength || 90} estimatedMinutes={estimatedMinutes} cards={s.cards} subPlots={sp.subPlots}
        script={script} scenes={scenes} isHeroJourneyOpen={isHeroJourneyOpen} onSelectHeroBeat={onSelectHeroBeat}
        onAddTimelineBeat={onAddTimelineBeat}
        onUpdateCharacterArcs={(characterArcs) => onChangeScript({
          ...script, storyArc: { preset: s.isFiveAct ? '5-Act' : '3-Act', ...script.storyArc, cards: s.cards, audienceEmotion: s.audienceEmotion, subPlots: sp.subPlots, characterArcs },
        })}
      />
      <StoryLabActionBar
        isFiveAct={s.isFiveAct} hasWritingOnAllThreeActs={s.filledFirstThreeCount >= 3} filledFirstThreeCount={s.filledFirstThreeCount}
        audienceEmotion={s.audienceEmotion} onChangeAudienceEmotion={s.handleUpdateAudienceEmotion}
        subPlots={sp.subPlots} activeSubPlotId={sp.activeSubPlotId} onSelectSubPlot={sp.setActiveSubPlotId} onCreateSubPlot={sp.handleCreateSubPlot}
        vaultItems={s.vaultItems} isHeroJourneyOpen={isHeroJourneyOpen} onToggleHeroJourney={onToggleHeroJourney}
        onStartNew={s.handleStartNewRequest} onOpenFiveActExpansion={() => s.setIsFiveActExpansionOpen(true)}
        onOpenGuidedSpark={s.handleOpenGuidedAction} onOpenSynopsis={onOpenSynopsis} onOpenLogline={onOpenLogline}
        hasLogline={Boolean(script.storyArc?.logline?.text?.trim())} hasSynopsis={Boolean(script.storyArc?.synopsis?.text?.trim())}
        onClearVault={() => s.setVaultItems([])}
      />
      {isHeroJourneyOpen ? (
        <HeroJourneyWorkspace
          script={script} mainCards={s.cards} subPlots={sp.subPlots} isFiveAct={s.isFiveAct}
          audienceEmotion={s.audienceEmotion} themeConfig={themeConfig} onChangeScript={onChangeScript}
          onCreateSubPlot={sp.handleCreateSubPlot} onRenameSubPlot={sp.handleRenameSubPlot} externalSelectRef={jumpHeroBeat}
        />
      ) : (
        <StoryLabGrid
          cards={s.cards} subPlots={sp.subPlots} activeSubPlot={sp.activeSubPlot} pocket={sp.pocketBridge}
          cardBackupsMap={s.cardBackupsMap} expandedCardId={s.expandedCardId} plotPointsMap={s.plotPointsMap}
          onUpdateCard={s.handleUpdateCard} onUpdatePlotPoint={s.handleUpdatePlotPoint} onSetExpandedCardId={s.setExpandedCardId}
          onOpenGuidedSpark={s.handleOpenGuidedAction} onCardIdeaGeneration={s.handleCardIdeaGeneration}
          onRenameSubPlot={sp.handleRenameSubPlot} onChangeSubPlotColor={sp.handleChangeSubPlotColor}
          onChangeSubPlotEmotion={sp.handleChangeSubPlotEmotion} onUpdateSubPlotCard={sp.handleUpdateSubPlotCard}
          onDeleteSubPlot={sp.handleDeleteSubPlot} onSubPlotIdeaGen={s.handleSubPlotIdeaGen}
        />
      )}
    </div>
  );
};
