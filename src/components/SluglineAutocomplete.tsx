import React from 'react';
import { SluglineSuggestion } from '../lib/sluglinePredictor';
import { Compass, MapPin, Clock, CornerDownLeft } from 'lucide-react';

interface SluglineAutocompleteProps {
  suggestions: SluglineSuggestion[];
  selectedIndex: number;
  onSelect: (suggestion: SluglineSuggestion) => void;
}

export const SluglineAutocomplete: React.FC<SluglineAutocompleteProps> = ({
  suggestions,
  selectedIndex,
  onSelect,
}) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div
      className="absolute left-0 mt-1 z-30 w-72 sm:w-80 bg-slate-900/95 backdrop-blur-md border border-amber-500/50 rounded-lg shadow-2xl overflow-hidden font-mono text-xs text-slate-100 select-none animate-in fade-in zoom-in-95 duration-100"
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="px-3 py-1.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-[9px] uppercase tracking-wider text-amber-400 font-bold">
        <div className="flex items-center gap-1.5">
          <Compass className="w-3 h-3 text-amber-400" />
          <span>Slugline Assist</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400 text-[9px]">
          <span className="bg-slate-800 px-1 py-0.5 rounded text-slate-300">Tab</span>
          <span>or</span>
          <span className="bg-slate-800 px-1 py-0.5 rounded text-slate-300">↵</span>
        </div>
      </div>

      <div className="max-h-48 overflow-y-auto py-1">
        {suggestions.map((item, idx) => {
          const isHighlighted = idx === selectedIndex;
          let Icon = MapPin;
          let badgeColor = 'bg-sky-500/20 text-sky-300 border-sky-500/30';

          if (item.category === 'PREFIX') {
            Icon = Compass;
            badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
          } else if (item.category === 'TIME') {
            Icon = Clock;
            badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
          }

          return (
            <div
              key={`${item.category}-${item.text}-${idx}`}
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(item);
              }}
              className={`px-3 py-1.5 flex items-center justify-between cursor-pointer transition ${
                isHighlighted
                  ? 'bg-amber-500/25 text-amber-200 border-l-2 border-amber-400 pl-2.5'
                  : 'hover:bg-slate-800/80 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-bold truncate text-[11px] sm:text-xs">
                  {item.text}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase ${badgeColor}`}>
                  {item.category}
                </span>
                {isHighlighted && (
                  <CornerDownLeft className="w-3 h-3 text-amber-400 opacity-80" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
