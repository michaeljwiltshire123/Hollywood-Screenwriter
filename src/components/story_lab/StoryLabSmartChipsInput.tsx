import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface StoryLabSmartChipsInputProps {
  chips: string[];
  onChangeChips: (chips: string[]) => void;
}

export const StoryLabSmartChipsInput: React.FC<StoryLabSmartChipsInputProps> = ({
  chips,
  onChangeChips,
}) => {
  const [inputValue, setInputValue] = useState('');

  const addWord = (raw: string) => {
    const clean = raw.trim().replace(/^,+|,+$/g, '');
    if (clean && !chips.some((c) => c.toLowerCase() === clean.toLowerCase())) {
      onChangeChips([...chips, clean]);
    }
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addWord(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && chips.length > 0) {
      onChangeChips(chips.slice(0, -1));
    }
  };

  const removeChip = (indexToRemove: number) => {
    onChangeChips(chips.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="bg-slate-50 border border-slate-300 rounded-xl p-3 focus-within:ring-2 focus-within:ring-amber-500 focus-within:bg-white transition-all space-y-2">
      <div className="flex flex-wrap items-center gap-1.5 min-h-[32px]">
        {chips.map((chip, idx) => (
          <span
            key={`${chip}-${idx}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100/90 text-amber-950 font-bold rounded-lg text-xs border border-amber-300 shadow-2xs group animate-in fade-in duration-100"
          >
            <span>{chip}</span>
            <button
              type="button"
              onClick={() => removeChip(idx)}
              className="hover:bg-amber-200 p-0.5 rounded text-amber-800 hover:text-amber-950 transition cursor-pointer"
              title={`Delete "${chip}"`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            const val = e.target.value;
            if (val.includes(',')) {
              addWord(val.replace(',', ''));
            } else {
              setInputValue(val);
            }
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => addWord(inputValue)}
          placeholder={chips.length === 0 ? "Type an emotion (e.g. good, happy, scary) and press Enter..." : "Add another emotion..."}
          className="flex-1 min-w-[160px] bg-transparent text-xs sm:text-sm text-slate-900 focus:outline-none font-medium placeholder:text-slate-400 py-1"
          autoFocus
        />
      </div>

      {inputValue.trim() && (
        <button
          type="button"
          onClick={() => addWord(inputValue)}
          className="text-[11px] text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1 transition cursor-pointer"
        >
          <Plus className="w-3 h-3" />
          <span>Add "{inputValue.trim()}" chip</span>
        </button>
      )}
    </div>
  );
};
