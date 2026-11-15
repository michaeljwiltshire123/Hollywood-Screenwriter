import React from 'react';
import { BookOpen } from 'lucide-react';
import { CLASSIC_LOGLINE_EXAMPLES } from './loglineConstants';
import { ModalThemeStyles } from '../../../lib/modalTheme';

interface ClassicExamplesBannerProps {
  showExamples: boolean;
  onToggle: () => void;
  mt: ModalThemeStyles;
}

export const ClassicExamplesBanner: React.FC<ClassicExamplesBannerProps> = ({
  showExamples, onToggle, mt,
}) => {
  return (
    <div className="space-y-3 shrink-0">
      <div className="flex items-center justify-between pb-3 border-b" style={mt.borderStyle}>
        <div>
          <h2 className="text-base font-black">Create Your Logline</h2>
          <p className="text-xs opacity-70">Answer five easy questions to craft a punchy, professional hook for agents and festivals.</p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition"
          style={mt.secondaryBtnStyle}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{showExamples ? 'Hide Film Examples' : 'See Film Examples'}</span>
        </button>
      </div>

      {showExamples && (
        <div className="rounded-xl border p-3.5 space-y-2.5 bg-amber-50/70 dark:bg-amber-950/20 animate-in fade-in duration-150 relative">
          <div className="flex items-center justify-between pb-1">
            <div className="text-xs font-extrabold text-amber-900 dark:text-amber-200">Classic Movie Loglines Broken Down:</div>
            <button
              type="button"
              onClick={onToggle}
              className="text-[11px] font-bold text-amber-900 dark:text-amber-200 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>[× Hide Examples]</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {CLASSIC_LOGLINE_EXAMPLES.map((ex) => (
              <div key={ex.title} className="rounded-lg border bg-white dark:bg-slate-900 p-2.5 space-y-1 text-[11px]" style={mt.borderStyle}>
                <div className="font-black text-amber-800 dark:text-amber-300">{ex.title}</div>
                <p className="leading-snug opacity-80">{ex.logline}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
