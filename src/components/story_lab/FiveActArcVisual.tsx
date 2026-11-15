import React from 'react';

export const FiveActArcVisual: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden select-none mb-3 px-2">
      <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 mb-1">
        <span className="uppercase tracking-wider font-mono text-[10px]">Dramatic Arc Elevation</span>
        <span className="text-slate-500 font-mono text-[10px]">Act I ➔ Act II ➔ Act III (Apex) ➔ Act IV ➔ Act V</span>
      </div>

      <div className="relative h-14 w-full">
        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 60">
          <defs>
            <linearGradient id="arcStroke" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#0284c7" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="arcFill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area fill under curve */}
          <path
            d="M 50 55 Q 500 -10 950 55 L 950 60 L 50 60 Z"
            fill="url(#arcFill)"
          />

          {/* Majestic Arch Curve */}
          <path
            d="M 50 55 Q 500 -10 950 55"
            fill="none"
            stroke="url(#arcStroke)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Connecting Pillar lines */}
          <line x1="500" y1="20" x2="500" y2="55" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="275" y1="36" x2="500" y2="55" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="725" y1="36" x2="500" y2="55" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />

          {/* Center Arc Label */}
          <text x="500" y="16" textAnchor="middle" className="text-[12px] font-serif italic fill-slate-800 font-bold">
            Arc
          </text>
        </svg>
      </div>
    </div>
  );
};
