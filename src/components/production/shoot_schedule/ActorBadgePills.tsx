import React, { useState } from 'react';

export const ACTOR_COLOR_PALETTE: Record<string, { bg: string; text: string; border: string }> = {
  LEO: { bg: 'bg-amber-200', text: 'text-amber-950', border: 'border-amber-300' },
  MAYA: { bg: 'bg-sky-200', text: 'text-sky-950', border: 'border-sky-300' },
  SAM: { bg: 'bg-purple-200', text: 'text-purple-950', border: 'border-purple-300' },
  NOVA: { bg: 'bg-orange-200', text: 'text-orange-950', border: 'border-orange-300' },
  STUNT: { bg: 'bg-rose-200', text: 'text-rose-950', border: 'border-rose-300' },
  DEFAULT_1: { bg: 'bg-emerald-200', text: 'text-emerald-950', border: 'border-emerald-300' },
  DEFAULT_2: { bg: 'bg-teal-200', text: 'text-teal-950', border: 'border-teal-300' },
  DEFAULT_3: { bg: 'bg-indigo-200', text: 'text-indigo-950', border: 'border-indigo-300' },
};

export function getActorBadgeStyle(name: string) {
  const upper = name.toUpperCase().trim();
  if (ACTOR_COLOR_PALETTE[upper]) return ACTOR_COLOR_PALETTE[upper];
  const keys = ['DEFAULT_1', 'DEFAULT_2', 'DEFAULT_3', 'LEO', 'MAYA', 'SAM', 'NOVA', 'STUNT'];
  const charSum = upper.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return ACTOR_COLOR_PALETTE[keys[charSum % keys.length]];
}

interface ActorPillListProps {
  characters?: string[];
  onChangeCharacters?: (newChars: string[]) => void;
}

export const ActorPillList: React.FC<ActorPillListProps> = ({
  characters = [],
  onChangeCharacters,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [textValue, setTextValue] = useState(characters.join(', '));

  const handleBlur = () => {
    setIsEditing(false);
    if (!onChangeCharacters) return;
    const nextChars = textValue
      .split(',')
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);
    onChangeCharacters(nextChars);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  if (characters.length === 0 || isEditing) {
    return (
      <input
        type="text"
        autoFocus={isEditing}
        value={isEditing ? textValue : characters.join(', ')}
        onFocus={() => setIsEditing(true)}
        onChange={(e) => setTextValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="Cast members..."
        className="bg-transparent hover:bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 rounded px-1.5 py-0.5 w-full text-xs font-semibold uppercase text-slate-800 tracking-wider"
      />
    );
  }

  return (
    <div
      onClick={() => {
        setTextValue(characters.join(', '));
        setIsEditing(true);
      }}
      className="flex flex-wrap gap-1 items-center cursor-pointer hover:bg-slate-100/80 p-0.5 rounded transition"
      title="Click to edit cast members"
    >
      {characters.map((char) => {
        const style = getActorBadgeStyle(char);
        return (
          <span
            key={char}
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border shadow-2xs ${style.bg} ${style.text} ${style.border}`}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};
