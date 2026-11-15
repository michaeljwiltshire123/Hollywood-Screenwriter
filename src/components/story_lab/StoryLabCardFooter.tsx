import React from 'react';
import { Lightbulb, PlusCircle, GitBranch } from 'lucide-react';

interface StoryLabCardFooterProps {
  onIdeaGeneration: () => void;
  onCreatePlotpoints?: () => void;
  onOpenSubPlot?: () => void;
  subPlotCount?: number;
  isPocketOpen?: boolean;
}

export const StoryLabCardFooter: React.FC<StoryLabCardFooterProps> = ({
  onIdeaGeneration, onCreatePlotpoints, onOpenSubPlot, subPlotCount = 0, isPocketOpen = false,
}) => {
  return (
    <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-100 font-sans">
      <button
        type="button" onClick={onIdeaGeneration}
        className="flex-1 py-1 px-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold rounded-lg text-[11px] flex items-center justify-center gap-1 transition cursor-pointer active:scale-95"
        title="Open guided creative prompts and idea generation"
      >
        <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>Idea Gen</span>
      </button>

      {onOpenSubPlot && (
        <button
          type="button" onClick={onOpenSubPlot}
          className={`flex-1 py-1 px-2 font-bold rounded-lg text-[11px] flex items-center justify-center gap-1 transition cursor-pointer active:scale-95 border ${
            isPocketOpen ? 'bg-teal-600 text-white border-teal-700 shadow-xs' : 'bg-teal-50 hover:bg-teal-100 text-teal-900 border-teal-300'
          }`}
          title="Slide open Sub-Plot pocket beside this act"
        >
          <GitBranch className={`w-3.5 h-3.5 shrink-0 ${isPocketOpen ? 'text-white' : 'text-teal-600'}`} />
          <span>Sub-Plot{subPlotCount > 0 ? ` (${subPlotCount})` : ''}</span>
        </button>
      )}

      {onCreatePlotpoints && (
        <button
          type="button" onClick={onCreatePlotpoints}
          className="flex-1 py-1 px-2 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 font-bold rounded-lg text-[11px] flex items-center justify-center gap-1 transition cursor-pointer active:scale-95"
          title="Add three internal plot point cards to develop this act"
        >
          <PlusCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Plotpoints</span>
        </button>
      )}
    </div>
  );
};
