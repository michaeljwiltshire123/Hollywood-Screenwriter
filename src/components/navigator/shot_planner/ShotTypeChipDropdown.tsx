import React from 'react';
import { ChevronDown } from 'lucide-react';

export const SHOT_TYPES = [
  'Wide Shot',
  'Medium Shot',
  'Close-Up',
  'Extreme Close-Up',
  'Stunt / Action',
  'Insert',
  'Drone / Aerial',
  'Cutaway',
  'Tracking / Steadicam',
] as const;

export type ShotTypeOption = (typeof SHOT_TYPES)[number];

const SHOT_TYPE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  'Wide Shot': { bg: 'bg-sky-100', text: 'text-sky-900', border: 'border-sky-300' },
  'Medium Shot': { bg: 'bg-purple-100', text: 'text-purple-900', border: 'border-purple-300' },
  'Close-Up': { bg: 'bg-emerald-100', text: 'text-emerald-900', border: 'border-emerald-300' },
  'Extreme Close-Up': { bg: 'bg-amber-100', text: 'text-amber-950', border: 'border-amber-300' },
  'Stunt / Action': { bg: 'bg-rose-100', text: 'text-rose-900', border: 'border-rose-300' },
  Insert: { bg: 'bg-teal-100', text: 'text-teal-900', border: 'border-teal-300' },
  'Drone / Aerial': { bg: 'bg-indigo-100', text: 'text-indigo-950', border: 'border-indigo-300' },
  Cutaway: { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300' },
  'Tracking / Steadicam': { bg: 'bg-violet-100', text: 'text-violet-900', border: 'border-violet-300' },
};

interface ShotTypeChipDropdownProps {
  value?: string;
  onChange: (newType: string) => void;
}

export const ShotTypeChipDropdown: React.FC<ShotTypeChipDropdownProps> = ({
  value = 'Wide Shot',
  onChange,
}) => {
  const style = SHOT_TYPE_STYLES[value] || { bg: 'bg-sky-100', text: 'text-sky-900', border: 'border-sky-300' };

  return (
    <div className="relative inline-block text-xs font-sans">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none font-bold py-1 px-2.5 pr-6 rounded-md border text-xs cursor-pointer focus:outline-none transition-colors shadow-2xs ${style.bg} ${style.text} ${style.border}`}
      >
        {SHOT_TYPES.map((st) => (
          <option key={st} value={st}>
            {st}
          </option>
        ))}
      </select>
      <ChevronDown className="w-3 h-3 absolute right-1.5 top-2 pointer-events-none opacity-60" />
    </div>
  );
};
