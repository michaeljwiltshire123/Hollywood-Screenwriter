import React from 'react';
import { WallStickitItem } from './storyStickitOps';
import { PACING_BADGE_MAP } from './hero_journey/heroJourneyConstants';

interface StoryLabStickitsWallProps {
  items: WallStickitItem[];
  isHeroJourneyOpen: boolean;
  onSelectStickit?: (trackId: string, stageIdx: number) => void;
}

export const StoryLabStickitsWall: React.FC<StoryLabStickitsWallProps> = ({
  items, isHeroJourneyOpen, onSelectStickit,
}) => {
  if (items.length === 0) return null;
  const widthClass = items.length <= 6 ? 'w-[104px]' : items.length <= 12 ? 'w-[80px]' : 'w-[62px]';

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-visible z-20 font-sans">
      {items.map((item) => {
        const isTop = item.side === 'top';
        const alignClass = item.displayX < 18 ? 'left-0' : item.displayX > 82 ? 'right-0' : 'left-1/2 -translate-x-1/2';
        const stemTop = isTop ? `${item.topPct + 6}%` : '48%';
        const stemHeight = isTop ? `${48 - (item.topPct + 6)}%` : `${item.topPct + 2 - 48}%`;
        const pacingStyle = item.pacingSpeed ? PACING_BADGE_MAP[item.pacingSpeed] : null;

        return (
          <React.Fragment key={item.id}>
            <div
              style={{ left: `${item.displayX}%`, top: stemTop, height: stemHeight, backgroundColor: item.borderColor }}
              className="absolute w-[1.5px] -translate-x-1/2 opacity-55 pointer-events-none z-10"
            />
            <span
              style={{ left: `${item.displayX}%`, top: '48%', backgroundColor: item.borderColor }}
              className="absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2 ring-2 ring-white shadow-2xs z-15 pointer-events-none"
            />

            <div
              style={{ left: `${item.displayX}%`, top: `${item.topPct}%` }}
              className="absolute -translate-x-1/2 group pointer-events-auto z-20 hover:z-50"
            >
              <button
                type="button"
                onClick={() => isHeroJourneyOpen && onSelectStickit?.(item.trackId, item.stageIdx)}
                style={{
                  backgroundColor: item.hasContent ? item.bgTint : '#FFFFFF',
                  borderColor: item.borderColor,
                  color: item.textColor,
                  transform: `rotate(${item.tiltDeg}deg)`,
                  opacity: item.hasContent ? 1 : 0.72,
                }}
                className={`${widthClass} px-1.5 py-1 rounded-[4px] border text-left shadow-sm transition-all duration-150 group-hover:rotate-0! group-hover:scale-110 group-hover:shadow-md relative block ${isHeroJourneyOpen ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <span className="absolute top-0 right-0 w-2 h-2 opacity-45" style={{ background: `linear-gradient(225deg, transparent 50%, ${item.borderColor} 50%)` }} />
                <div className="flex items-center justify-between gap-1 text-[8.5px] font-black leading-none mb-0.5 pr-1">
                  <span className="truncate">{item.shortLabel}</span>
                  <span className="font-mono opacity-75 shrink-0">{item.pacingLabel.split(' ')[0]}</span>
                </div>
                <div className="text-[9.5px] font-bold leading-[1.15] text-slate-900 line-clamp-2 break-words">
                  {item.title}
                </div>
              </button>

              <div className={`absolute ${isTop ? 'top-full mt-2' : 'bottom-full mb-2'} ${alignClass} hidden group-hover:block w-64 pointer-events-none z-50 animate-in fade-in duration-100`}>
                <div className="rounded-xl border-2 p-2.5 shadow-2xl space-y-1.5" style={{ backgroundColor: item.bgTint, borderColor: item.borderColor, color: '#0F172A' }}>
                  <div className="flex items-center justify-between gap-2 text-[10px] font-extrabold border-b pb-1" style={{ borderColor: `${item.borderColor}44`, color: item.textColor }}>
                    <span className="truncate">{item.trackName} · {item.stageLabel}</span>
                    <span className="font-mono shrink-0">{item.pacingLabel}</span>
                  </div>
                  <div className="text-xs font-extrabold leading-snug text-slate-900">{item.title}</div>
                  <p className="text-[11px] leading-snug text-slate-700 line-clamp-5 whitespace-pre-line">{item.summary || 'No notes written for this beat yet.'}</p>
                  {pacingStyle && item.pacingSpeed && (
                    <div className="pt-0.5 flex justify-end">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold border" style={{ backgroundColor: pacingStyle.bg, color: pacingStyle.text, borderColor: pacingStyle.border }}>{item.pacingSpeed} Pacing</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
