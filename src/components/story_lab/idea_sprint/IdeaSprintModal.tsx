import React from 'react';
import { AppThemeConfig } from '../../../lib/themePresets';
import { getModalTheme } from '../../../lib/modalTheme';
import { SprintApplyResult } from './ideaSprintTypes';
import { IdeaSprintLauncherModal } from './IdeaSprintLauncherModal';
import { IdeaSprintHeader } from './IdeaSprintHeader';
import { IdeaSprintMotivationBar } from './IdeaSprintMotivationBar';
import { IdeaSprintPaperCanvas } from './IdeaSprintPaperCanvas';
import { IdeaSprintSummaryModal } from './IdeaSprintSummaryModal';
import { useIdeaSprintActiveState } from './useIdeaSprintActiveState';

interface ModalProps {
  isOpen: boolean;
  initialQuestion: string;
  onApplyResult: (res: SprintApplyResult) => void;
  onClose: () => void;
  themeConfig?: AppThemeConfig;
}

export const IdeaSprintModal: React.FC<ModalProps> = ({
  isOpen, initialQuestion, onApplyResult, onClose, themeConfig,
}) => {
  const {
    phase, setPhase, question, setQuestion, durationMins, setDurationMins,
    remainingSecs, elapsedSecs, livesRemaining, flowMode,
    rawText, surgeMultiplier, isBurnRateActive, handleStart, handleUseLife, handleTextChange,
  } = useIdeaSprintActiveState(isOpen, initialQuestion);

  if (!isOpen) return null;
  const mt = getModalTheme(themeConfig);

  if (phase === 'LAUNCHER') {
    return (
      <IdeaSprintLauncherModal
        isOpen={isOpen}
        question={question}
        onChangeQuestion={setQuestion}
        durationMins={durationMins}
        onChangeDuration={setDurationMins}
        onStart={handleStart}
        onClose={onClose}
      />
    );
  }

  if (phase === 'ACTIVE') {
    return (
      <div className="fixed inset-0 z-70 backdrop-blur-xs flex items-center justify-center p-4 font-sans animate-in fade-in duration-150" style={mt.overlayStyle}>
        <div className="border rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4" style={mt.windowStyle}>
          <IdeaSprintHeader
            remainingSeconds={remainingSecs}
            livesRemaining={livesRemaining}
            onUseLife={handleUseLife}
            onFinishEarly={() => setPhase('SUMMARY')}
            themeConfig={themeConfig}
          />
          <IdeaSprintMotivationBar
            ideaCount={rawText.split('\n').filter((s) => s.trim()).length}
            elapsedSeconds={elapsedSecs}
            surgeMultiplier={surgeMultiplier}
            isBurnRateActive={isBurnRateActive}
            themeConfig={themeConfig}
          />
          <IdeaSprintPaperCanvas
            value={rawText}
            onChangeValue={handleTextChange}
            flowMode={flowMode}
            question={question}
          />
        </div>
      </div>
    );
  }

  return (
    <IdeaSprintSummaryModal
      isOpen={phase === 'SUMMARY'}
      question={question}
      durationMins={durationMins}
      rawLines={rawText.split('\n')}
      onApply={(res) => { onApplyResult(res); onClose(); }}
      onCancel={onClose}
    />
  );
};
