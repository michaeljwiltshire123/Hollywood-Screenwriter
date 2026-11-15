import React from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { ModalThemeStyles } from '../../../lib/modalTheme';

interface SynopsisHowToGuideProps {
  isOpen: boolean;
  onToggle: () => void;
  mt: ModalThemeStyles;
}

export const SynopsisHowToGuide: React.FC<SynopsisHowToGuideProps> = ({
  isOpen, onToggle, mt,
}) => {
  return (
    <div className="rounded-xl border border-amber-200/90 bg-amber-50/70 dark:bg-amber-950/20 shrink-0 text-xs shadow-2xs transition" style={mt.borderStyle}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-2.5 font-bold text-amber-950 dark:text-amber-200 cursor-pointer hover:bg-amber-100/50 transition rounded-xl"
      >
        <span className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="text-xs font-black tracking-tight">How to Guide</span>
        </span>
        <div className="flex items-center gap-1 text-xs font-bold text-amber-800 dark:text-amber-300">
          <span>{isOpen ? 'Close' : 'View Guide'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-3 pt-1 border-t border-amber-200/60 dark:border-amber-800/40 space-y-2 text-slate-800 dark:text-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] leading-snug">
            <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-amber-200/60">
              <span className="font-extrabold text-amber-900 dark:text-amber-300">What: </span>
              The Synopsis is a clear, objective narrative summary of your entire story from start to finish, including the climax and final resolution.
              In 350–500 words, You should summarise every main event. 
              The Synopsis is not a teaser. Do not try to hide the conclusion to create curiosity.
            </div>
            <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-amber-200/60">
              <span className="font-extrabold text-amber-900 dark:text-amber-300">Why: </span>
              Agents, producers, and script competitions read your synopsis to verify your story has solid structure, strong momentum, and a satisfying payoff before requesting your full script.
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-amber-200/60 space-y-1">
            <div className="font-extrabold text-amber-900 dark:text-amber-300 text-xs">The 4-Paragraph Blueprint: Suggested guide</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 text-[11px] leading-snug">
              <div><strong>1. Setup:</strong> Protagonist, ordinary world, inciting incident.</div>
              <div><strong>2. Rising Action:</strong> New goal, obstacles, escalating stakes.</div>
              <div><strong>3. Crisis:</strong> Midpoint shift, lowest point / all-is-lost.</div>
              <div><strong>4. Climax &amp; Ending:</strong> Final showdown &amp; resolution. <em>(No cliffhangers!)</em></div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-amber-200/60 space-y-1 text-[11px] leading-snug">
            <div className="font-extrabold text-amber-900 dark:text-amber-300 text-xs">Rules:</div>
            <ul className="space-y-1 text-slate-700 dark:text-slate-300 pl-0.5">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">·</span>
                <span>Always use present tense and third person (&ldquo;Elena discovers...&rdquo;, &ldquo;They escape...&rdquo;).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">·</span>
                <span>Focus on cause and effect: Show how character decisions drive the plot (&ldquo;Because Sam hides the map, the bandits track them to the canyon...&rdquo;).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">·</span>
                <span>Never use a cliffhanger: Agents and buyers need to see how the story resolves to judge your storytelling craft.</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
