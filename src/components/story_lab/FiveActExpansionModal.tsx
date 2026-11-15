import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { FiveActExpansionAnswers } from './storyLabTypes';
import { FiveActExpansionStepView } from './FiveActExpansionStepView';
import { StoryLabGuidedFooterControls } from './StoryLabGuidedFooterControls';
import { IdeaSprintModal } from './idea_sprint/IdeaSprintModal';
import { SprintApplyResult } from './idea_sprint/ideaSprintTypes';

interface FiveActExpansionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (answers: FiveActExpansionAnswers) => void;
  onSaveVaultItem?: (res: SprintApplyResult) => void;
  originalActTwo?: string;
}

export const FiveActExpansionModal: React.FC<FiveActExpansionModalProps> = ({
  isOpen, onClose, onApply, onSaveVaultItem, originalActTwo,
}) => {
  const [step, setStep] = useState(0);
  const [furthestPoint, setFurthestPoint] = useState('');
  const [outsideEvents, setOutsideEvents] = useState('');
  const [preparationObstacle, setPreparationObstacle] = useState('');
  const [sprintQuestion, setSprintQuestion] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setStep(0); setFurthestPoint(''); setOutsideEvents(''); setPreparationObstacle(''); setSprintQuestion(null);
  }, [isOpen]);

  if (!isOpen) return null;
  const getCurrentVal = () => (step === 0 ? furthestPoint : step === 1 ? outsideEvents : preparationObstacle);
  const handleSetCurrentVal = (val: string) => {
    if (step === 0) setFurthestPoint(val);
    else if (step === 1) setOutsideEvents(val);
    else setPreparationObstacle(val);
  };
  const handleNext = () => {
    if (step < 2) setStep((prev) => prev + 1);
    else { onApply({ furthestPointAct3: furthestPoint, outsideEventsAct2: outsideEvents, preparationObstacleAct4: preparationObstacle }); onClose(); }
  };
  const handleSprintResult = (res: SprintApplyResult) => {
    if (res.primaryIdea) handleSetCurrentVal(res.primaryIdea);
    if (onSaveVaultItem) onSaveVaultItem(res);
    setSprintQuestion(null);
    if (step < 2) setStep((prev) => prev + 1);
  };

  return (
    <>
      <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-6 text-[#0F172A] font-sans">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map((s) => (
                <div key={s} className={`h-1.5 rounded-full transition-all ${s === step ? 'w-8 bg-amber-500' : s < step ? 'w-5 bg-emerald-500' : 'w-5 bg-slate-200'}`} />
              ))}
            </div>
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"><X className="w-5 h-5" /></button>
          </div>
          <FiveActExpansionStepView step={step} value={getCurrentVal()} onChangeValue={handleSetCurrentVal} onLaunchSprint={(q) => setSprintQuestion(q)} originalActTwo={originalActTwo} />
          <StoryLabGuidedFooterControls step={step} onBack={step === 0 ? onClose : () => setStep((p) => p - 1)} onNext={handleNext} isFinal={step === 2} nextLabel={step === 2 ? 'Expand to 5 Acts' : 'Next Step'} />
        </div>
      </div>
      <IdeaSprintModal isOpen={Boolean(sprintQuestion)} initialQuestion={sprintQuestion || ''} onApplyResult={handleSprintResult} onClose={() => setSprintQuestion(null)} />
    </>
  );
};
