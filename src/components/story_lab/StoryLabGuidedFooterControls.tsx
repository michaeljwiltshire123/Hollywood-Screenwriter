import React from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface ControlsProps {
  step: number;
  onBack: () => void;
  onNext: () => void;
  backLabel?: string;
  nextLabel?: string;
  isFinal?: boolean;
}

export const StoryLabGuidedFooterControls: React.FC<ControlsProps> = ({
  step, onBack, onNext, backLabel, nextLabel, isFinal,
}) => {
  const finalStep = isFinal ?? step === 3;
  const resolvedBack = backLabel ?? (step === 0 ? 'Skip for Now' : 'Back');
  const resolvedNext = nextLabel ?? (finalStep ? 'Apply to 3-Act Canvas' : 'Next Step');

  return (
    <div className="flex items-center justify-between pt-2 border-t border-slate-100 font-sans">
      <button
        type="button"
        onClick={onBack}
        className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg transition flex items-center gap-1 cursor-pointer"
      >
        {step > 0 && !backLabel && <ArrowLeft className="w-3.5 h-3.5" />}
        <span>{resolvedBack}</span>
      </button>

      <button
        type="button"
        onClick={onNext}
        className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 active:scale-95 rounded-lg flex items-center gap-1.5 transition shadow-sm cursor-pointer"
      >
        <span>{resolvedNext}</span>
        {finalStep ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
      </button>
    </div>
  );
};
