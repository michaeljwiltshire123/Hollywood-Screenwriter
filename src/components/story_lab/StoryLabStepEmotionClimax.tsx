import React from 'react';
import { Compass, Sparkles, Lightbulb } from 'lucide-react';
import { StoryLabSmartChipsInput } from './StoryLabSmartChipsInput';
import { StoryLabEmotionRefiner } from './StoryLabEmotionRefiner';

interface StepProps {
  step: number;
  emotion: string;
  value: string;
  onChangeValue: (val: string) => void;
  onLaunchSprint?: (question: string) => void;
}

export const StoryLabStepEmotionClimax: React.FC<StepProps> = ({
  step, emotion, value, onChangeValue, onLaunchSprint,
}) => {
  const chips = value
    ? value.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const handleUpdateChips = (newChips: string[]) => {
    onChangeValue(newChips.join(', '));
  };

  const handleAddRefinedWord = (word: string) => {
    if (!chips.some((c) => c.toLowerCase() === word.toLowerCase())) {
      handleUpdateChips([...chips, word]);
    }
  };

  if (step === 0) {
    return (
      <div className="space-y-3.5 font-sans">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-amber-700 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Step 1 • The Emotional Destination</span>
          </div>
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
            How do you want the audience to feel at the end of your script?
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Type any core feeling (e.g. good, happy, scary) or pick connected emotion chips below.
          </p>
        </div>

        <StoryLabSmartChipsInput chips={chips} onChangeChips={handleUpdateChips} />
        <StoryLabEmotionRefiner selectedWords={chips} onSelectRefined={handleAddRefinedWord} />
      </div>
    );
  }

  return (
    <div className="space-y-3 font-sans">
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-amber-700 font-bold text-xs uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5 text-amber-600" />
          <span>Step 2 • Act III Climax</span>
        </div>
        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
          Let's create your end climax. What will leave the audience feeling {emotion ? `"${emotion}"` : 'this way'}?
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          What is the end scene? How does the hero triumph or what do they sacrifice?
        </p>
      </div>
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
        placeholder="Describe your final confrontation, the climax, and the closing image..."
        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed resize-none"
        autoFocus
      />
      {onLaunchSprint && (
        <div className="flex justify-center pt-0.5">
          <button
            type="button"
            onClick={() => onLaunchSprint(`What is the end climax that leaves the audience feeling ${emotion ? `"${emotion}"` : 'this way'}?`)}
            className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
          >
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>Idea Generation (Speed Sprint)</span>
          </button>
        </div>
      )}
    </div>
  );
};

