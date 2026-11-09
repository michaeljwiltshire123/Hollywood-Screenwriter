import React from 'react';

export const LOCATION_PALETTES = [
  { bg: 'bg-teal-100', text: 'text-teal-900', border: 'border-teal-300' },
  { bg: 'bg-emerald-100', text: 'text-emerald-900', border: 'border-emerald-300' },
  { bg: 'bg-amber-100', text: 'text-amber-900', border: 'border-amber-300' },
  { bg: 'bg-rose-100', text: 'text-rose-900', border: 'border-rose-300' },
  { bg: 'bg-cyan-100', text: 'text-cyan-900', border: 'border-cyan-300' },
  { bg: 'bg-violet-100', text: 'text-violet-900', border: 'border-violet-300' },
  { bg: 'bg-sky-100', text: 'text-sky-900', border: 'border-sky-300' },
  { bg: 'bg-orange-100', text: 'text-orange-900', border: 'border-orange-300' },
];

export function getLocationBadgeStyle(locationName: string) {
  if (!locationName) return LOCATION_PALETTES[0];
  const clean = locationName.trim().toUpperCase();
  const sum = clean.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return LOCATION_PALETTES[sum % LOCATION_PALETTES.length];
}

interface LocationBadgeProps {
  location?: string;
  isHighlighted?: boolean;
}

export const LocationBadge: React.FC<LocationBadgeProps> = ({ location, isHighlighted }) => {
  if (!location) {
    return <span className="text-slate-300 font-mono text-xs">—</span>;
  }

  const style = getLocationBadgeStyle(location);

  return (
    <span
      className={`inline-block max-w-[150px] truncate px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border shadow-2xs transition-all ${
        style.bg
      } ${style.text} ${style.border} ${
        isHighlighted ? 'ring-2 ring-emerald-500 scale-105 shadow-sm' : ''
      }`}
      title={location}
    >
      {location}
    </span>
  );
};
