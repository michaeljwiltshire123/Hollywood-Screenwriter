import React from 'react';
import { Moon } from 'lucide-react';
import { ShootScheduleDaySheet } from '../../../types';

interface ShootScheduleDayTabsProps {
  days: ShootScheduleDaySheet[];
  activeDayNumber: number;
  onSelectDay: (dayNum: number) => void;
  onToggleRestDay: (dayNum: number) => void;
}

export const ShootScheduleDayTabs: React.FC<ShootScheduleDayTabsProps> = ({
  days,
  activeDayNumber,
  onSelectDay,
  onToggleRestDay,
}) => {
  if (days.length <= 1) return null;

  return (
    <div className="border-t border-slate-200 pt-2.5 mt-2 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide shrink-0">
        Filming Days:
      </span>
      {days.map((day) => {
        const isActive = day.dayNumber === activeDayNumber;
        const isRest = day.isRestDay;

        return (
          <div
            key={day.dayNumber}
            className={`flex items-center rounded border transition text-xs shrink-0 ${
              isRest
                ? 'bg-slate-100 border-slate-300 opacity-60 text-slate-500 line-through decoration-slate-400'
                : isActive
                ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold shadow-xs'
                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
            }`}
          >
            <button
              onClick={() => onSelectDay(day.dayNumber)}
              className="px-2.5 py-1 cursor-pointer text-left flex items-center gap-1.5"
            >
              <span>Day {day.dayNumber}: {day.dateStr}</span>
              {isRest && <span className="text-[10px] font-mono no-underline italic">(Rest Day)</span>}
            </button>

            <button
              onClick={() => onToggleRestDay(day.dayNumber)}
              className={`px-1.5 py-1 border-l text-[10px] cursor-pointer hover:bg-black/5 transition ${
                isActive ? 'border-amber-600 text-slate-950' : 'border-slate-200 text-slate-400'
              }`}
              title={isRest ? 'Mark as active shooting day' : 'Mark as non-shooting rest day'}
            >
              <Moon className="w-3 h-3 inline" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
