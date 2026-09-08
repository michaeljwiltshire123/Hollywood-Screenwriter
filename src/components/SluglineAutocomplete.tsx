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
      className="absolute left-0 mt-1 z-30 w-72 sm:w-80 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-lg shadow-xl ring-1 ring-black/5 overflow-hidden font-mono text-xs text-slate-800 select-none animate-in fade-in zoom-in-95 duration-100"
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="px-3 py-1.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between text-[9px] uppercase tracking-wider text-slate-500 font-sans font-semibold">
        <div className="flex items-center gap-1.5">
          <Compass className="w-3 h-3 text-amber-600" />
          <span>Scene Suggestions</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400 font-normal">
          <span>↵ or click to insert</span>
        </div>
      </div>

      <div className="max-h-48 overflow-y-auto py-1">
        {suggestions.map((item, idx) => {
          const isHighlighted = idx === selectedIndex;
          let Icon = MapPin;
          let badgeColor = 'bg-sky-50 text-sky-700 border-sky-200/70';

          if (item.category === 'PREFIX') {
            Icon = Compass;
            badgeColor = 'bg-amber-50 text-amber-700 border-amber-200/70';
          } else if (item.category === 'TIME') {
            Icon = Clock;
            badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200/70';
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
                  ? 'bg-amber-50/90 text-amber-950 font-semibold border-l-2 border-amber-500 pl-2.5'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate text-[11px] sm:text-xs">
                  {item.text}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`text-[8px] font-sans font-bold px-1.5 py-0.5 rounded border uppercase ${badgeColor}`}>
                  {item.category}
                </span>
                {isHighlighted && (
                  <CornerDownLeft className="w-3 h-3 text-amber-600 opacity-80" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

