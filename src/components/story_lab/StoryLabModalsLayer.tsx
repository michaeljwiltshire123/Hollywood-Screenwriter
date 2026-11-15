import React from 'react';
import { GuidedStorySparkAnswers, FiveActExpansionAnswers } from './storyLabTypes';
import { AppThemeConfig } from '../../lib/themePresets';
import { StoryLabConfirmResetModal } from './StoryLabConfirmResetModal';
import { StoryLabGuidedModal } from './StoryLabGuidedModal';
import { FiveActExpansionModal } from './FiveActExpansionModal';
import { StoryLabSynopsisModal } from './StoryLabSynopsisModal';
import { SprintApplyResult } from './idea_sprint/ideaSprintTypes';
import { IdeaSprintModal } from './idea_sprint/IdeaSprintModal';
import { StoryArcCard, SubPlotTrack } from '../../types';

interface StoryLabModalsLayerProps {
  isResetConfirmOpen: boolean; onCancelReset: () => void; onConfirmReset: () => void;
  isGuidedSparkOpen: boolean; onCloseGuidedSpark: () => void; onApplyGuidedSpark: (answers: GuidedStorySparkAnswers) => void;
  onApplySingleCard?: (cardIndex: number, text: string) => void; guidedTargetCardIndex?: number | null; audienceEmotion?: string;
  isFiveActExpansionOpen: boolean; onCloseFiveActExpansion: () => void; onApplyFiveActExpansion: (answers: FiveActExpansionAnswers) => void;
  onSaveVaultItem?: (res: SprintApplyResult) => void; isSynopsisOpen: boolean; onCloseSynopsis: () => void;
  cards: StoryArcCard[]; subPlots?: SubPlotTrack[];
  scriptTitle?: string; sprintQuestion?: string | null; onCloseSprint?: () => void; onApplySprint?: (res: SprintApplyResult) => void;
  themeConfig?: AppThemeConfig;
}

export const StoryLabModalsLayer: React.FC<StoryLabModalsLayerProps> = ({
  isResetConfirmOpen, onCancelReset, onConfirmReset, isGuidedSparkOpen, onCloseGuidedSpark, onApplyGuidedSpark,
  onApplySingleCard, guidedTargetCardIndex, audienceEmotion, isFiveActExpansionOpen, onCloseFiveActExpansion, onApplyFiveActExpansion,
  onSaveVaultItem, isSynopsisOpen, onCloseSynopsis, cards, subPlots = [],
  scriptTitle, sprintQuestion, onCloseSprint, onApplySprint, themeConfig,
}) => {
  return (
    <>
      <StoryLabConfirmResetModal isOpen={isResetConfirmOpen} onCancel={onCancelReset} onConfirm={onConfirmReset} />
      <StoryLabGuidedModal isOpen={isGuidedSparkOpen} onClose={onCloseGuidedSpark} onApply={onApplyGuidedSpark} onApplySingleCard={onApplySingleCard} singleCardIndex={guidedTargetCardIndex} initialEmotion={audienceEmotion} initialCards={cards} onSaveVaultItem={onSaveVaultItem} />
      <FiveActExpansionModal isOpen={isFiveActExpansionOpen} onClose={onCloseFiveActExpansion} onApply={onApplyFiveActExpansion} onSaveVaultItem={onSaveVaultItem} originalActTwo={cards[1]?.goal} />
      <StoryLabSynopsisModal isOpen={isSynopsisOpen} onClose={onCloseSynopsis} cards={cards} subPlots={subPlots} audienceEmotion={audienceEmotion} title={scriptTitle} />
      {sprintQuestion && (
        <IdeaSprintModal isOpen={Boolean(sprintQuestion)} initialQuestion={sprintQuestion} onApplyResult={(res) => { onApplySprint?.(res); onCloseSprint?.(); }} onClose={() => onCloseSprint?.()} themeConfig={themeConfig} />
      )}
    </>
  );
};
