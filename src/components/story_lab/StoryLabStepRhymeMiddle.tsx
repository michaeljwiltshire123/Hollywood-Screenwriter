import React from 'react';
import { Compass, Lightbulb } from 'lucide-react';

interface StepProps {
  step: number;
  value: string;
  onChangeValue: (val: string) => void;
  onLaunchSprint?: (question: string) => void;
}

export const StoryLabStepRhymeMiddle: React.FC<StepProps> = ({
  step, value, onChangeValue, onLaunchSprint,
}) => {
  if (step === 2) {
    return (
      <div className="space-y-3 font-sans">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-amber-700 font-bold text-xs uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-amber-600" />
            <span>Step 3 • Act I The Rhyming Beginning</span>
          </div>
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
            In the beginning, What is the opposite of your ending?
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            They might not repeat, but they rhyme. How is your begining opposite to your ending? What is the ordinary world like before the changes of your story take place? What is your characters usual habits before they are changed by the events? (Socially, mentally, physically)
          </p>
        </div>
        <textarea
          rows={4}
          value={value}
          onChange={(e) => onChangeValue(e.target.value)}
          placeholder="Where is your character in Scene 1? What flaw or trap holds them back before the inciting incident strikes?"
          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed resize-none"
          autoFocus
        />
        {onLaunchSprint && (
          <div className="flex justify-center pt-0.5">
            <button
              type="button"
              onClick={() => onLaunchSprint('In the beginning, what is the opposite of your ending? What is the ordinary world like?')}
              className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
            >
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>Idea Generation (Speed Sprint)</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3 font-sans">
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-amber-700 font-bold text-xs uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5 text-amber-600" />
          <span>Step 4 • Act II The Crucible Middle</span>
        </div>
        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
          Now for the middle. What is the greatest crisis or turning point?
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          What obstacle, crisis, or revelation forces your charactor or world to transform from what they were at the beginning into what they become at the end?
        </p>
      </div>
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
        placeholder="What is the midpoint twist or darkest hour that pushes them to take charge?"
        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed resize-none"
        autoFocus
      />
      {onLaunchSprint && (
        <div className="flex justify-center pt-0.5">
          <button
            type="button"
            onClick={() => onLaunchSprint('What obstacle, crisis, or revelation forces your character or world to transform?')}
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

