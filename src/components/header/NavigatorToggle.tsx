import React from 'react';
import { PanelLeft } from 'lucide-react';

interface NavigatorToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const NavigatorToggle: React.FC<NavigatorToggleProps> = ({
  isOpen,
  onToggle,
}) => {
  return (
    <button
      id="navigator-toggle-btn"
      onClick={onToggle}
      className={`flex items-center justify-center gap-2 px-3 py-1 min-h-[44px] rounded-xl border font-mono transition-all duration-150 shrink-0 shadow-sm cursor-pointer active:scale-95 group text-center ${
        isOpen
          ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
          : 'bg-slate-800 hover:bg-slate-750 border-slate-600 hover:border-amber-400 text-slate-100 hover:text-amber-300 hover:shadow-md'
      }`}
      title={
        isOpen
          ? 'Close Navigator & Production Tools Drawer'
          : 'Open Navigator & Production Tools Drawer'
      }
      aria-label="Toggle Navigator and Production Tools"
    >
      <PanelLeft
        className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
          isOpen ? 'text-amber-300' : 'text-amber-400'
        }`}
      />
      <div className="flex flex-col items-center justify-center text-center leading-snug">
        <span className="tracking-wider uppercase text-xs sm:text-[13px] font-black text-amber-300">
          Navigator
        </span>
        <span className="tracking-tight text-[11px] font-bold text-slate-200 group-hover:text-amber-200 whitespace-nowrap">
          Production Tools
        </span>
      </div>
    </button>
  );
};
