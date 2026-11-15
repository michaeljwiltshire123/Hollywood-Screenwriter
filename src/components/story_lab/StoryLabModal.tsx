import React, { useState } from 'react';
import { ScreenplayDocument, SceneInfo } from '../../types';
import { AppThemeConfig } from '../../lib/themePresets';
import { getModalTheme } from '../../lib/modalTheme';
import { StoryLabHeader } from './StoryLabHeader';
import { StoryLabTimeline } from './StoryLabTimeline';
import { StoryLabActionBar } from './StoryLabActionBar';
import { StoryLabGrid } from './StoryLabGrid';
import { HeroJourneyWorkspace } from './hero_journey/HeroJourneyWorkspace';
import { insertBeatAtTimelinePercent } from './hero_journey/heroJourneyRowOps';
import { StoryLabModalsLayer } from './StoryLabModalsLayer';
import { StoryLabPitchModals } from './StoryLabPitchModals';
import { useStoryLabState } from './useStoryLabState';
import { useSubPlotState } from './useSubPlotState';

interface StoryLabModalProps {
  isOpen: boolean; onClose: () => void; script: ScreenplayDocument; scenes: SceneInfo[];
  estimatedMinutes: number; onChangeScript: (updated: ScreenplayDocument) => void;
  onJumpToScene: (sceneId: string) => void; themeConfig?: AppThemeConfig;
}

export const StoryLabModal: React.FC<StoryLabModalProps> = ({
  isOpen, onClose, script, scenes, estimatedMinutes, onChangeScript, themeConfig,
}) => {
  const s = useStoryLabState(script, scenes, onChangeScript);
  const sp = useSubPlotState(script, s.isFiveAct, s.cards, s.audienceEmotion, onChangeScript, s.handleSubPlotIdeaGen);
  const [isSynopsisOpen, setIsSynopsisOpen] = useState(false);
  const [isLoglineOpen, setIsLoglineOpen] = useState(false);
  const [isLoglineGuardOpen, setIsLoglineGuardOpen] = useState(false);
  const [isHeroJourneyOpen, setIsHeroJourneyOpen] = useState(false);
  const [jumpHeroBeat, setJumpHeroBeat] = useState<{ trackId: string; stageIdx: number; seq: number } | null>(null);

  if (!isOpen) return null;
  const mt = getModalTheme(themeConfig);

  const handleAddTimelineBeat = (percentX: number, trackId: string) => {
    const { updatedScript, insertedIdx } = insertBeatAtTimelinePercent(script, s.cards, sp.subPlots, s.isFiveAct, s.audienceEmotion, percentX, trackId);
    onChangeScript(updatedScript);
    setIsHeroJourneyOpen(true);
    setJumpHeroBeat({ trackId, stageIdx: insertedIdx, seq: Date.now() });
  };

  const handleOpenSynopsisClick = () => {
    if (!script.storyArc?.logline?.text) {
      setIsLoglineGuardOpen(true);
      return;
    }
    setIsSynopsisOpen(true);
  };

  return (
    <div className="fixed inset-0 z-60 bg-[#FDFBF7] dark:bg-slate-950 overflow-y-auto p-4 sm:p-6 font-sans animate-in fade-in duration-150" style={mt.windowStyle}>
      <div className="max-w-7xl mx-auto w-full space-y-3.5">
        <StoryLabHeader title={script.title} targetLength={script.targetLength || 90} estimatedMinutes={estimatedMinutes} onChangeTargetLength={(val) => onChangeScript({ ...script, targetLength: val })} onClose={onClose} themeConfig={themeConfig} />
        <StoryLabTimeline targetMinutes={script.targetLength || 90} estimatedMinutes={estimatedMinutes} cards={s.cards} subPlots={sp.subPlots} script={script} scenes={scenes} isHeroJourneyOpen={isHeroJourneyOpen} onSelectHeroBeat={(trackId, stageIdx) => setJumpHeroBeat({ trackId, stageIdx, seq: Date.now() })} onAddTimelineBeat={handleAddTimelineBeat} onUpdateCharacterArcs={(characterArcs) => onChangeScript({ ...script, storyArc: { preset: s.isFiveAct ? '5-Act' : '3-Act', ...script.storyArc, cards: s.cards, audienceEmotion: s.audienceEmotion, subPlots: sp.subPlots, characterArcs } })} />
        <StoryLabActionBar
          isFiveAct={s.isFiveAct} hasWritingOnAllThreeActs={s.filledFirstThreeCount >= 3} filledFirstThreeCount={s.filledFirstThreeCount}
          audienceEmotion={s.audienceEmotion} onChangeAudienceEmotion={s.handleUpdateAudienceEmotion}
          subPlots={sp.subPlots} activeSubPlotId={sp.activeSubPlotId} onSelectSubPlot={sp.setActiveSubPlotId} onCreateSubPlot={sp.handleCreateSubPlot}
          vaultItems={s.vaultItems} isHeroJourneyOpen={isHeroJourneyOpen} onToggleHeroJourney={() => setIsHeroJourneyOpen((v) => !v)}
          onStartNew={s.handleStartNewRequest} onOpenFiveActExpansion={() => s.setIsFiveActExpansionOpen(true)}
          onOpenGuidedSpark={s.handleOpenGuidedAction} onOpenSynopsis={handleOpenSynopsisClick} onOpenLogline={() => setIsLoglineOpen(true)}
          hasLogline={Boolean(script.storyArc?.logline?.text?.trim())}
          hasSynopsis={Boolean(script.storyArc?.synopsis?.text?.trim())}
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
      <StoryLabModalsLayer
        isResetConfirmOpen={s.isResetConfirmOpen} onCancelReset={() => s.setIsResetConfirmOpen(false)} onConfirmReset={s.executeStartNew}
        isGuidedSparkOpen={s.isGuidedSparkOpen} onCloseGuidedSpark={() => s.setIsGuidedSparkOpen(false)}
        onApplyGuidedSpark={s.handleApplyGuidedSpark} onApplySingleCard={s.handleApplySingleCard}
        guidedTargetCardIndex={s.guidedTargetCardIndex} audienceEmotion={s.audienceEmotion}
        isFiveActExpansionOpen={s.isFiveActExpansionOpen} onCloseFiveActExpansion={() => s.setIsFiveActExpansionOpen(false)} onApplyFiveActExpansion={s.handleApplyFiveActExpansion}
        onSaveVaultItem={(res) => s.handleRecordSprintResult(res)} isSynopsisOpen={false} onCloseSynopsis={() => {}}
        cards={s.cards} subPlots={sp.subPlots} scriptTitle={script.title} sprintQuestion={s.sprintQuestion}
        onCloseSprint={() => s.setSprintQuestion(null)} onApplySprint={s.handleRecordSprintResult} themeConfig={themeConfig}
      />
      <StoryLabPitchModals
        isLoglineOpen={isLoglineOpen}
        onCloseLogline={() => setIsLoglineOpen(false)}
        isSynopsisOpen={isSynopsisOpen}
        onCloseSynopsis={() => setIsSynopsisOpen(false)}
        isLoglineGuardOpen={isLoglineGuardOpen}
        onCloseLoglineGuard={() => setIsLoglineGuardOpen(false)}
        onOpenLoglineFromGuard={() => setIsLoglineOpen(true)}
        script={script}
        cards={s.cards}
        subPlots={sp.subPlots}
        heroJourney={script.storyArc?.heroJourney}
        themeConfig={themeConfig}
        onChangeScript={onChangeScript}
        onSaveVaultItem={(item) => s.setVaultItems((prev) => [item, ...prev])}
      />
    </div>
  );
};
