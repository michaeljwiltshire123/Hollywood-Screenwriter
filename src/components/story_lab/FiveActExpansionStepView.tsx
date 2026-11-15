import React from 'react';
import { Compass, Lightbulb, ShieldAlert } from 'lucide-react';

interface FiveActStepContentProps {
  step: number;
  value: string;
  onChangeValue: (val: string) => void;
  onLaunchSprint?: (question: string) => void;
  originalActTwo?: string;
}

const STEP_DATA = [
  {
    tag: 'Step 1 of 3 • The New Act III (Furthest Point)',
    title: 'What is the furthest away from the finale can your story or character be, and what puts it back on track?',
    desc: 'Think of the apex of the dramatic arc. At this lowest or most detached point, what event, encounter, or realisation forces them to turn back towards their destiny?',
    placeholder: "e.g. Simba pals around with Timon & Pumbaa, living 'Hakuna Matata', until Nala finds him and urges him to return home...",
    sprintQ: 'What is the furthest away from the finale can your story/character be and what puts it back on track?',
  },
  {
    tag: 'Step 2 of 3 • The New Act II (External Disruption)',
    title: 'How does the story go from the beginning to the furthest point? What events have happened outside of any character control?',
    desc: 'What catastrophic outside circumstances, conspiracy, antagonist strike, or tragedy push them out of their old world and into that isolated furthest point?',
    placeholder: 'e.g. Scar kills Mufasa, frames Simba, and takes over the Pride Lands with the hyenas...',
    sprintQ: 'How does the story go from the beginning to the furthest point? What events happened outside character control?',
  },
  {
    tag: 'Step 3 of 3 • The New Act IV (Preparation & Obstacle)',
    title: 'How do the characters learn to pass the obstacle they faced that pushed them so far away? How are they preparing to succeed?',
    desc: 'What training, alliance-building, or psychological reckoning must happen as they march towards the climax? What new trap awaits them?',
    placeholder: 'e.g. Simba returns home, confronts his guilt, but Scar manipulates the pride to turn against him before the final battle...',
    sprintQ: 'How do characters learn to pass the obstacle that pushed them so far away? How are they preparing to succeed?',
  },
];

export const FiveActExpansionStepView: React.FC<FiveActStepContentProps> = ({
  step, value, onChangeValue, onLaunchSprint, originalActTwo,
}) => {
  const current = STEP_DATA[Math.min(2, Math.max(0, step))];

  return (
    <div className="space-y-3 font-sans">
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-amber-700 font-bold text-xs uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5 text-amber-600" />
          <span>{current.tag}</span>
        </div>
        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
          {current.title}
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          {current.desc}
        </p>
      </div>

      {step === 0 && originalActTwo && (
        <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-2.5 text-xs text-amber-950 space-y-1">
          <span className="text-[10px] uppercase font-mono font-bold text-amber-800 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-amber-600" /> Fading 3-Act Middle:
          </span>
          <p className="italic text-slate-700 text-[11px] line-clamp-2">"{originalActTwo}"</p>
        </div>
      )}

      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
        placeholder={current.placeholder}
        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed resize-none"
        autoFocus
      />

      {onLaunchSprint && (
        <div className="flex justify-center pt-0.5">
          <button
            type="button"
            onClick={() => onLaunchSprint(current.sprintQ)}
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
