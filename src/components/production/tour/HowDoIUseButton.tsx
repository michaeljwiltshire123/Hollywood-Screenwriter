import React from 'react';
import { HelpCircle } from 'lucide-react';

interface HowDoIUseButtonProps {
  onClick: () => void;
}

export const HowDoIUseButton: React.FC<HowDoIUseButtonProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 hover:text-amber-200 border border-amber-400/40 hover:border-amber-400/80 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 group font-sans"
      title="How do I use this page? (Interactive Guide)"
    >
      <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-xs shadow-2xs group-hover:scale-105 transition-transform">
        ?
      </div>
      <div className="text-left">
        <span className="block text-[11px] font-extrabold leading-tight tracking-tight uppercase text-amber-300 group-hover:text-amber-100">
          How do I
        </span>
        <span className="block text-[10px] font-bold leading-tight text-amber-200/80 group-hover:text-white">
          Use this page?
        </span>
      </div>
    </button>
  );
};
