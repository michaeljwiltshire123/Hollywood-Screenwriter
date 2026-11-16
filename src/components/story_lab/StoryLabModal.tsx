import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ScreenplayDocument, SceneInfo } from '../../types';
import { AppThemeConfig } from '../../lib/themePresets';
import { getModalTheme } from '../../lib/modalTheme';
import { StoryLabWorkspaceBody } from './StoryLabWorkspaceBody';
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

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-[#FDFBF7] dark:bg-slate-950 overflow-y-auto p-4 sm:p-6 font-sans animate-in fade-in duration-150" style={mt.windowStyle}>
      <StoryLabWorkspaceBody
        script={script} scenes={scenes} estimatedMinutes={estimatedMinutes} themeConfig={themeConfig}
        isHeroJourneyOpen={isHeroJourneyOpen} jumpHeroBeat={jumpHeroBeat} s={s} sp={sp} onClose={onClose}
        onChangeScript={onChangeScript} onSelectHeroBeat={(trackId, stageIdx) => setJumpHeroBeat({ trackId, stageIdx, seq: Date.now() })}
        onAddTimelineBeat={handleAddTimelineBeat} onToggleHeroJourney={() => setIsHeroJourneyOpen((v) => !v)}
        onOpenSynopsis={handleOpenSynopsisClick} onOpenLogline={() => setIsLoglineOpen(true)}
      />
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
        isLoglineOpen={isLoglineOpen} onCloseLogline={() => setIsLoglineOpen(false)}
        isSynopsisOpen={isSynopsisOpen} onCloseSynopsis={() => setIsSynopsisOpen(false)}
        isLoglineGuardOpen={isLoglineGuardOpen} onCloseLoglineGuard={() => setIsLoglineGuardOpen(false)}
        onOpenLoglineFromGuard={() => setIsLoglineOpen(true)} script={script} cards={s.cards}
        subPlots={sp.subPlots} heroJourney={script.storyArc?.heroJourney} themeConfig={themeConfig}
        onChangeScript={onChangeScript} onSaveVaultItem={(item) => s.setVaultItems((prev) => [item, ...prev])}
      />
    </div>,
    document.body
  );
};
