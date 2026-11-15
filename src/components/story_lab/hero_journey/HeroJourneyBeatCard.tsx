import React from 'react';
import { HeroJourneyBeat } from '../../../types';
import { ModalThemeStyles } from '../../../lib/modalTheme';
import { PACING_BADGE_MAP } from './heroJourneyConstants';

interface HeroJourneyBeatCardProps {
  beat: HeroJourneyBeat;
  accentColor: string;
  isSelected: boolean;
  mt: ModalThemeStyles;
  onSelect: () => void;
}

export const HeroJourneyBeatCard: React.FC<HeroJourneyBeatCardProps> = ({
  beat, accentColor, isSelected, mt, onSelect,
}) => {
  const pacing = PACING_BADGE_MAP[beat.pacingSpeed] || PACING_BADGE_MAP.Moderate;

  const isPlaceholder = Boolean(beat.isEmptyPlaceholder && !beat.title.trim() && !beat.summary.trim());

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full h-full text-left rounded-lg border p-2.5 flex flex-col justify-between gap-2 transition cursor-pointer hover:shadow-sm ${isPlaceholder ? 'border-dashed opacity-75 hover:opacity-100' : ''}`}
      style={{
        ...mt.cardStyle,
        borderColor: isSelected ? accentColor : mt.theme.borders,
        borderLeftWidth: 4,
        borderLeftColor: accentColor,
        boxShadow: isSelected ? `0 0 0 1px ${accentColor}` : undefined,
      }}
    >
      <div className="space-y-1 min-w-0">
        <div className="font-extrabold text-xs truncate">{beat.title || (isPlaceholder ? 'Optional Beat' : 'Untitled Beat')}</div>
        <p className="text-[11px] leading-snug line-clamp-2 opacity-75">
          {beat.summary ? beat.summary : isPlaceholder ? 'Click to add notes for this storyline...' : 'Click to write this beat in the drafting panel...'}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2 pt-1 text-[11px] font-bold">
        <span className="font-mono tabular-nums opacity-80">{beat.pageCount} {beat.pageCount === 1 ? 'page' : 'pages'}</span>
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-extrabold border shrink-0"
          style={{ backgroundColor: pacing.bg, color: pacing.text, borderColor: pacing.border }}
        >
          {beat.pacingSpeed}
        </span>
      </div>
    </button>
  );
};
