import React from 'react';

export const FiveActPyramidArcSvg: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 400">
        <defs>
          <linearGradient id="pyrArcStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#0284c7" stopOpacity="1" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <path d="M 60 380 Q 500 5 940 380" fill="none" stroke="url(#pyrArcStroke)" strokeWidth="5" strokeLinecap="round" />
        <line x1="500" y1="110" x2="500" y2="280" stroke="#0284c7" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="330" y1="180" x2="500" y2="280" stroke="#0284c7" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="670" y1="180" x2="500" y2="280" stroke="#0284c7" strokeWidth="2" strokeDasharray="4 4" />
        <text x="500" y="35" textAnchor="middle" className="text-[18px] font-serif italic fill-slate-900 font-black">Arc</text>
      </svg>
    </div>
  );
};
