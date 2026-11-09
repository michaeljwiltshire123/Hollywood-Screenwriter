import React from 'react';
import { Clock } from 'lucide-react';

interface ShotDurationChipsProps {
  minutes: number;
  onChangeMinutes: (mins: number) => void;
}

export const ShotDurationChips: React.FC<ShotDurationChipsProps> = ({
  minutes,
  onChangeMinutes,
}) => {
  const presets = [
    { label: '15m', val: 15 },
    { label: '30m', val: 30 },
    { label: '45m', val: 45 },
    { label: '1h', val: 60 },
  ];

  return (
    <div className="flex items-center gap-1.5 font-sans">
      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <div className="flex items-center gap-1">
        {presets.map((p) => {
          const isActive = minutes === p.val;
          return (
            <button
              key={p.label}
              type="button"
              onClick={() => onChangeMinutes(p.val)}
              className={`px-2 py-0.5 rounded text-[11px] font-bold border transition cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-1 bg-white border border-slate-300 rounded px-1.5 py-0.5 text-xs">
        <input
          type="number"
          min={5}
          max={480}
          value={minutes}
          onChange={(e) => onChangeMinutes(Math.max(5, parseInt(e.target.value, 10) || 15))}
          className="w-10 text-center font-bold text-slate-900 focus:outline-none"
        />
        <span className="text-[10px] text-slate-500 font-bold">m</span>
      </div>
    </div>
  );
};
