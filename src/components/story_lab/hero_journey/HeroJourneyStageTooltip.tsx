import React from 'react';
import { Info } from 'lucide-react';
import { getStageWritingTip } from './heroJourneyConstants';

interface HeroJourneyStageTooltipProps {
  title: string;
  stageIndex: number;
  isCustom?: boolean;
  timelinePercent?: number;
}

export const HeroJourneyStageTooltip: React.FC<HeroJourneyStageTooltipProps> = ({
  title, stageIndex, isCustom, timelinePercent,
}) => {
  const tip = getStageWritingTip(stageIndex, isCustom);

  return (
    <div className="relative group inline-flex items-center">
      <button
        type="button"
        aria-label={`Writing guide: ${title}`}
        className="p-1 rounded-full text-amber-700/80 dark:text-amber-400/80 hover:text-amber-900 hover:bg-amber-100/60 dark:hover:bg-amber-950/40 cursor-help transition focus:outline-none"
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      <div className="pointer-events-none absolute right-0 top-full mt-1.5 hidden group-hover:block group-focus-within:block z-50 w-64 p-2.5 rounded-xl border border-amber-200/90 bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 text-[11px] leading-relaxed shadow-xl backdrop-blur-xs font-normal whitespace-normal animate-in fade-in duration-100">
        <div className="flex items-center justify-between font-extrabold text-amber-900 dark:text-amber-200 text-xs mb-1">
          <span className="truncate">{title}</span>
          {isCustom && timelinePercent !== undefined && (
            <span className="text-[10px] font-semibold opacity-70 ml-1">({timelinePercent}%)</span>
          )}
        </div>
        <p className="text-slate-700 dark:text-slate-300">{tip}</p>
      </div>
    </div>
  );
};
