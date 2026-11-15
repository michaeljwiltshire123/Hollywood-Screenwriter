import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { StoryArcCard } from '../../types';
import { GuidedStorySparkAnswers } from './storyLabTypes';
import { StoryLabGuidedStepView } from './StoryLabGuidedStepView';
import { StoryLabGuidedFooterControls } from './StoryLabGuidedFooterControls';
import { IdeaSprintModal } from './idea_sprint/IdeaSprintModal';
import { SprintApplyResult } from './idea_sprint/ideaSprintTypes';

interface StoryLabGuidedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (answers: GuidedStorySparkAnswers) => void;
  onApplySingleCard?: (cardIndex: number, text: string) => void;
  singleCardIndex?: number | null;
  initialEmotion?: string;
  initialCards?: StoryArcCard[];
  onSaveVaultItem?: (res: SprintApplyResult) => void;
}

const CARD_TO_STEP: Record<number, number> = { 0: 2, 1: 3, 2: 1 };

export const StoryLabGuidedModal: React.FC<StoryLabGuidedModalProps> = ({
  isOpen, onClose, onApply, onApplySingleCard, singleCardIndex = null, initialEmotion = '', initialCards = [], onSaveVaultItem,
}) => {
  const [step, setStep] = useState(0);
  const [emotion, setEmotion] = useState('');
  const [climax, setClimax] = useState('');
  const [rhyme, setRhyme] = useState('');
  const [middle, setMiddle] = useState('');
  const [sprintQuestion, setSprintQuestion] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setStep(singleCardIndex != null ? (CARD_TO_STEP[singleCardIndex] ?? 1) : 0);
    setEmotion(initialEmotion || '');
    setRhyme(initialCards[0]?.goal || initialCards[0]?.actTitle || '');
    setMiddle(initialCards[1]?.goal || initialCards[1]?.actTitle || '');
    setClimax(initialCards[2]?.goal || initialCards[2]?.actTitle || '');
    setSprintQuestion(null);
  }, [isOpen, singleCardIndex]);

  if (!isOpen) return null;
  const isSingle = singleCardIndex != null;
  const getCurrentVal = () => (step === 0 ? emotion : step === 1 ? climax : step === 2 ? rhyme : middle);
  const handleSetCurrentVal = (val: string) => {
    if (step === 0) setEmotion(val); else if (step === 1) setClimax(val); else if (step === 2) setRhyme(val); else setMiddle(val);
  };
  const handleNext = () => {
    if (isSingle && singleCardIndex != null) { onApplySingleCard?.(singleCardIndex, getCurrentVal()); onClose(); }
    else if (step < 3) setStep((prev) => prev + 1);
    else { onApply({ endingEmotion: emotion, actThreeClimax: climax, actOneRhyme: rhyme, actTwoMiddle: middle }); onClose(); }
  };
  const handleSprintResult = (res: SprintApplyResult) => {
    if (res.primaryIdea) handleSetCurrentVal(res.primaryIdea);
    if (onSaveVaultItem) onSaveVaultItem(res);
    setSprintQuestion(null);
    if (!isSingle && step < 3) setStep((prev) => prev + 1);
  };

  return (
    <>
      <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-6 text-[#0F172A] font-sans">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            {isSingle && singleCardIndex != null ? (
              <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                Act {singleCardIndex + 1} • Remaining Empty Card
              </span>
            ) : (
              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3].map((s) => (
                  <div key={s} className={`h-1.5 rounded-full transition-all ${s === step ? 'w-8 bg-amber-500' : s < step ? 'w-5 bg-emerald-500' : 'w-5 bg-slate-200'}`} />
                ))}
              </div>
            )}
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"><X className="w-5 h-5" /></button>
          </div>
          <StoryLabGuidedStepView step={step} emotion={emotion} value={getCurrentVal()} onChangeValue={handleSetCurrentVal} onLaunchSprint={(q) => setSprintQuestion(q)} />
          <StoryLabGuidedFooterControls step={step} onBack={isSingle || step === 0 ? onClose : () => setStep((p) => p - 1)} onNext={handleNext} backLabel={isSingle ? 'Cancel' : undefined} nextLabel={isSingle && singleCardIndex != null ? `Apply to Act ${singleCardIndex + 1}` : undefined} isFinal={isSingle || step === 3} />
        </div>
      </div>
      <IdeaSprintModal isOpen={Boolean(sprintQuestion)} initialQuestion={sprintQuestion || ''} onApplyResult={handleSprintResult} onClose={() => setSprintQuestion(null)} />
    </>
  );
};
