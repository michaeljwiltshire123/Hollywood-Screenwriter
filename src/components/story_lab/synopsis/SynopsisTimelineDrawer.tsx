import React from 'react';
import { ArrowRight } from 'lucide-react';
import { StoryArcCard, HeroJourneyData } from '../../../types';
import { ModalThemeStyles } from '../../../lib/modalTheme';

interface SynopsisTimelineDrawerProps {
  cards: StoryArcCard[];
  heroJourney?: HeroJourneyData;
  onInsertBeat: (title: string, summary: string) => void;
  mt: ModalThemeStyles;
}

export const SynopsisTimelineDrawer: React.FC<SynopsisTimelineDrawerProps> = ({
  cards, heroJourney, onInsertBeat, mt,
}) => {
  return (
    <div className="lg:col-span-4 rounded-xl border p-3.5 space-y-3 max-h-[520px] overflow-y-auto" style={mt.cardStyle}>
      <div className="text-xs font-extrabold uppercase tracking-wide border-b pb-2" style={mt.borderStyle}>
        Timeline &amp; Act Beats Reference
      </div>
      <div className="space-y-2.5">
        {cards.map((c, i) => (
          <div key={c.id} className="p-2.5 rounded-lg border space-y-1 bg-white dark:bg-slate-900 shadow-xs" style={mt.borderStyle}>
            <div className="flex items-center justify-between text-[11px] font-black">
              <span>{c.actTitle || `Act ${i + 1}`}</span>
              <button
                type="button"
                onClick={() => onInsertBeat(c.actTitle || `Act ${i + 1}`, c.goal)}
                className="text-[10px] text-amber-600 hover:underline flex items-center gap-1 cursor-pointer font-bold"
              >
                <span>Insert</span><ArrowRight className="w-2.5 h-2.5" />
              </button>
            </div>
            <p className="text-[11px] opacity-75 line-clamp-3">{c.goal || 'No goal written yet.'}</p>
          </div>
        ))}

        {heroJourney?.mainBeats?.map((b, i) => b.title ? (
          <div key={b.id} className="p-2.5 rounded-lg border space-y-1 bg-white dark:bg-slate-900 shadow-xs" style={mt.borderStyle}>
            <div className="flex items-center justify-between text-[11px] font-black">
              <span className="truncate">Stage {i + 1}: {b.title}</span>
              <button
                type="button"
                onClick={() => onInsertBeat(`Stage ${i + 1}: {b.title}`, b.summary)}
                className="text-[10px] text-amber-600 hover:underline flex items-center gap-1 cursor-pointer font-bold shrink-0"
              >
                <span>Insert</span><ArrowRight className="w-2.5 h-2.5" />
              </button>
            </div>
            <p className="text-[11px] opacity-75 line-clamp-3">{b.summary || 'No summary written yet.'}</p>
          </div>
        ) : null)}
      </div>
    </div>
  );
};
