import React from 'react';
import { Play, Flame, X, Clock, HelpCircle } from 'lucide-react';

interface LauncherProps {
  isOpen: boolean;
  question: string;
  onChangeQuestion: (val: string) => void;
  durationMins: number;
  onChangeDuration: (mins: number) => void;
  onStart: () => void;
  onClose: () => void;
}

export const IdeaSprintLauncherModal: React.FC<LauncherProps> = ({
  isOpen, question, onChangeQuestion, durationMins, onChangeDuration, onStart, onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-70 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-slate-900 font-sans">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-amber-700 font-extrabold text-base">
            <Flame className="w-5 h-5 text-amber-500 animate-bounce" />
            <span>Speed Brainstorming Sprint</span>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-3.5 space-y-1.5 text-xs text-amber-950 leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>How the Speed Sprint Works:</span>
          </div>
          <p>
            You will now be given <strong>{durationMins} minutes</strong> to write as many potential ideas as you can. You are encouraged to list as many ideas as possible. These ideas are not part of your story, but give you a chance to dump all your bad ideas or rework them into something usable. Please aim for as many bad ideas as you can as well as good ideas!
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">Sprint Question / Focus Prompt:</label>
          <input
            type="text"
            value={question}
            onChange={(e) => onChangeQuestion(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
            placeholder="Type your brainstorming question..."
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Select Sprint Duration:</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 5].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onChangeDuration(m)}
                className={`py-2 text-xs font-bold rounded-lg border transition ${
                  durationMins === m
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {m} {m === 1 ? 'Minute' : 'Minutes'}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onStart}
            className="px-5 py-2.5 text-xs font-black text-slate-950 bg-amber-500 hover:bg-amber-400 active:scale-95 rounded-lg flex items-center gap-1.5 transition shadow-md cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>START SPRINT NOW</span>
          </button>
        </div>
      </div>
    </div>
  );
};
