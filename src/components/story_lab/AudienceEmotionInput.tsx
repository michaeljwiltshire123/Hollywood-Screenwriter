import React from 'react';
import { Heart } from 'lucide-react';

interface AudienceEmotionInputProps {
  value: string;
  onChange: (val: string) => void;
}

export const AudienceEmotionInput: React.FC<AudienceEmotionInputProps> = ({ value, onChange }) => {
  return (
    <label
      className="w-full flex items-center gap-2.5 bg-amber-50/70 border border-amber-300/80 rounded-lg px-3 py-1.5 shadow-2xs focus-within:ring-2 focus-within:ring-amber-400 focus-within:border-amber-500 transition cursor-text"
      title="Reminder of how you want the audience to feel after viewing your work (editable)"
    >
      <Heart className="w-3.5 h-3.5 text-amber-600 shrink-0" />
      <span className="text-[11px] font-black uppercase tracking-wide text-amber-900 whitespace-nowrap shrink-0">
        Audience Feeling:
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="How do you want the audience to feel after viewing your work? (e.g. Hopeful, thrilled, deeply moved...)"
        className="flex-1 min-w-0 bg-transparent text-xs font-semibold text-slate-900 placeholder:text-slate-400 placeholder:italic focus:outline-none"
        aria-label="Target audience emotion after viewing your work"
      />
    </label>
  );
};
