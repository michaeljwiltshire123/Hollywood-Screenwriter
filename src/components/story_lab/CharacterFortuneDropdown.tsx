import React, { useState, useRef, useEffect } from 'react';
import { Users, ChevronDown, Check } from 'lucide-react';
import { CharacterFortuneOption } from './characterFortuneTypes';

interface CharacterFortuneDropdownProps {
  characters: CharacterFortuneOption[];
  selectedIds: string[];
  onToggleCharacter: (id: string) => void;
  onSelectAll: () => void;
}

export const CharacterFortuneDropdown: React.FC<CharacterFortuneDropdownProps> = ({
  characters, selectedIds, onToggleCharacter, onSelectAll,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCount = selectedIds.length;

  return (
    <div className="relative font-sans text-xs" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs font-bold text-slate-800 transition cursor-pointer"
        title="Select characters to compare their G-I Fortune Arcs"
      >
        <Users className="w-3.5 h-3.5 text-slate-600" />
        <span>G-I Characters</span>
        <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 text-[10px] font-mono font-bold">
          {selectedCount}
        </span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 space-y-1.5 animate-in fade-in duration-100">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-500">
            <span>Kurt Vonnegut G-I Axis</span>
            <button
              type="button"
              onClick={onSelectAll}
              className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
            >
              Toggle All
            </button>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1 pr-0.5">
            {characters.map((char) => {
              const isSelected = selectedIds.includes(char.id);
              return (
                <button
                  key={char.id}
                  type="button"
                  onClick={() => onToggleCharacter(char.id)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left text-xs font-semibold transition cursor-pointer ${
                    isSelected ? 'bg-slate-50 text-slate-900 font-bold' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 border border-black/10 shadow-2xs"
                      style={{ backgroundColor: char.color }}
                    />
                    <span className="truncate">{char.name}</span>
                  </div>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="pt-1 text-[10px] text-slate-400 text-center border-t border-slate-100">
            Compare Good Fortune (+) vs Ill Fortune (-)
          </div>
        </div>
      )}
    </div>
  );
};
