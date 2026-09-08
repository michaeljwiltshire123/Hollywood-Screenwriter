import React from 'react';
import { User, CornerDownLeft } from 'lucide-react';

interface CharacterAutocompleteProps {
  characters: string[];
  selectedIndex?: number;
  onSelect: (name: string) => void;
}

export const CharacterAutocomplete: React.FC<CharacterAutocompleteProps> = ({
  characters,
  selectedIndex = 0,
  onSelect,
}) => {
  if (!characters || characters.length === 0) return null;

  return (
    <div
      className="absolute left-0 sm:left-[37%] mt-1 z-30 w-64 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-lg shadow-xl ring-1 ring-black/5 py-1 text-slate-800 font-mono text-xs select-none animate-in fade-in zoom-in-95 duration-100"
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="px-3 py-1.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between text-[9px] uppercase tracking-wider text-slate-500 font-sans font-semibold">
        <div className="flex items-center gap-1.5">
          <User className="w-3 h-3 text-amber-600" />
          <span>Character Suggestions</span>
        </div>
        <span className="text-[9px] text-slate-400 font-normal">Click to insert</span>
      </div>
      <div className="max-h-40 overflow-y-auto py-1">
        {characters.slice(0, 6).map((cName, idx) => {
          const isHighlighted = idx === selectedIndex;
          return (
            <div
              key={cName}
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(cName);
              }}
              className={`px-3 py-1.5 flex items-center justify-between cursor-pointer transition ${
                isHighlighted
                  ? 'bg-amber-50/90 text-amber-950 font-semibold border-l-2 border-amber-500 pl-2.5'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span className="font-bold">{cName}</span>
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-sans font-medium text-slate-400">Select</span>
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
