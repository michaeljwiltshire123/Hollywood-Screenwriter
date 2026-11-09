import React from 'react';
import { SpotlightRect } from './useElementTracker';
import { TourStep } from './tourTypes';
import { X, ChevronRight, ChevronLeft, Check, Compass } from 'lucide-react';

interface TourTooltipCardProps {
  step: TourStep;
  rect: SpotlightRect | null;
  currentIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

export const TourTooltipCard: React.FC<TourTooltipCardProps> = ({
  step, rect, currentIndex, totalSteps, onNext, onPrev, onClose,
}) => {
  const isLast = currentIndex === totalSteps - 1;
  const progressPct = ((currentIndex + 1) / totalSteps) * 100;

  let style: React.CSSProperties = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  if (rect) {
    const cardWidth = 360;
    const cardHeight = 240;
    const targetCenterX = rect.left + rect.width / 2;
    const isTargetOnLeft = targetCenterX < window.innerWidth / 2;

    if (rect.width > 600) {
      const left = Math.max(24, Math.min(window.innerWidth - cardWidth - 24, (window.innerWidth - cardWidth) / 2));
      let top = rect.top - cardHeight - 16;
      if (top < 120) top = rect.top + rect.height + 16;
      top = Math.max(120, Math.min(window.innerHeight - cardHeight - 30, top));
      style = { top: `${top}px`, left: `${left}px` };
    } else {
      let left = isTargetOnLeft ? rect.left + rect.width + 20 : rect.left - cardWidth - 20;
      left = Math.max(20, Math.min(window.innerWidth - cardWidth - 20, left));
      const top = Math.max(120, Math.min(window.innerHeight - cardHeight - 40, rect.top - 10));
      style = { top: `${top}px`, left: `${left}px` };
    }
  }

  return (
    <div
      style={style}
      onClick={(e) => e.stopPropagation()}
      className="fixed z-[101] w-[360px] bg-white border border-slate-300 rounded-xl p-4 shadow-2xl text-slate-900 pointer-events-auto transition-all duration-200 animate-in fade-in"
    >
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase rounded tracking-wider">
          Step {currentIndex + 1} of {totalSteps}
        </span>
        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-800 transition cursor-pointer" title="Exit Tour (Esc)">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="w-full bg-slate-100 h-1 rounded-full mb-3 overflow-hidden">
        <div className="bg-amber-500 h-full transition-all duration-300 rounded-full" style={{ width: `${progressPct}%` }} />
      </div>

      <h3 className="font-extrabold text-sm text-slate-900 mb-1.5 flex items-center gap-1.5">
        <Compass className="w-4 h-4 text-amber-600 shrink-0" />
        <span>{step.title}</span>
      </h3>

      <p className="text-xs font-medium text-slate-800 leading-relaxed mb-2">
        {step.whatItIs || step.description}
      </p>

      {step.howToUseIt && (
        <div className="text-xs text-amber-950 bg-amber-50/90 border border-amber-200/90 rounded-lg p-2.5 leading-relaxed flex items-start gap-2 mb-3">
          <span className="text-amber-600 font-bold text-sm shrink-0 leading-none">👉</span>
          <span>{step.howToUseIt}</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <button onClick={onClose} className="text-[11px] font-bold text-slate-400 hover:text-slate-700 cursor-pointer">
          Exit Tour
        </button>

        <div className="flex items-center gap-2">
          {currentIndex > 0 && (
            <button onClick={onPrev} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded transition flex items-center gap-1 cursor-pointer">
              <ChevronLeft className="w-3.5 h-3.5" /> Back
            </button>
          )}

          <button onClick={onNext} className="px-3.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded transition flex items-center gap-1 shadow-xs cursor-pointer active:scale-95">
            {isLast ? (<><Check className="w-3.5 h-3.5" /> Done</>) : (<>Next <ChevronRight className="w-3.5 h-3.5" /></>)}
          </button>
        </div>
      </div>
    </div>
  );
};
