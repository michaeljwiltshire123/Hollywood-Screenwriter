import React from 'react';
import { ScreenplayElement } from '../../types';
import { ModalTheme } from '../../lib/modalTheme';
import { WordBoundary } from '../../lib/tableReadTypes';

interface TableReadElementCardProps {
  elem: ScreenplayElement;
  isActive: boolean;
  isMuted: boolean;
  wordBoundary: WordBoundary | null;
  rehearsalSecondsLeft: number;
  onAdvanceLine: () => void;
  onSelect: () => void;
  cardRef: React.RefObject<HTMLDivElement | null> | null;
  m: ModalTheme;
}

export const TableReadElementCard: React.FC<TableReadElementCardProps> = ({
  elem,
  isActive,
  isMuted,
  wordBoundary,
  rehearsalSecondsLeft,
  onAdvanceLine,
  onSelect,
  cardRef,
  m,
}) => {
  const renderContentWithKaraoke = () => {
    if (!isActive || !wordBoundary || isMuted || !elem.content) {
      return elem.content;
    }
    const { charIndex, charLength } = wordBoundary;
    const start = Math.max(0, Math.min(charIndex, elem.content.length));
    const end = Math.min(elem.content.length, start + Math.max(1, charLength));

    const before = elem.content.substring(0, start);
    const word = elem.content.substring(start, end);
    const after = elem.content.substring(end);

    return (
      <>
        <span>{before}</span>
        <span
          className="rounded px-1 py-0.5 font-bold shadow-2xs border transition-all"
          style={{
            backgroundColor: `${m.theme.accentButtons}25`,
            borderColor: m.theme.accentButtons,
            color: m.theme.accentText || m.theme.accentButtons,
          }}
        >
          {word}
        </span>
        <span>{after}</span>
      </>
    );
  };

  return (
    <div
      ref={cardRef}
      onClick={onSelect}
      className={`p-3 rounded-xl border transition cursor-pointer ${isActive ? 'shadow-lg ring-2' : 'hover:opacity-95'}`}
      style={
        isActive
          ? { ...m.headerStyle, borderColor: isMuted ? '#E11D48' : m.theme.accentButtons, outline: `2px solid ${isMuted ? '#E11D48' : m.theme.accentButtons}` }
          : m.cardStyle
      }
    >
      <div className="flex items-center justify-between text-[10px] font-bold uppercase mb-1">
        <span style={isActive ? m.accentStyle : m.mutedStyle}>{elem.type}</span>
        {isActive && isMuted && (
          <div className="flex items-center gap-2">
            <span className="text-rose-500 font-extrabold animate-pulse">
              YOUR TURN TO READ ALOUD! 🎙️ ({rehearsalSecondsLeft.toFixed(1)}s)
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onAdvanceLine(); }}
              className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[9px] hover:bg-rose-700 transition"
              title="Press spacebar or click to proceed"
            >
              Done (Spacebar)
            </button>
          </div>
        )}
      </div>
      <p className={`font-mono text-sm leading-relaxed whitespace-pre-wrap ${isActive ? 'font-semibold' : ''}`}>
        {renderContentWithKaraoke()}
      </p>
    </div>
  );
};
