import React from 'react';
import { Layers, TrendingUp } from 'lucide-react';

interface StoryArcTabContentProps {
  onOpenStoryArc: () => void;
}

export const StoryArcTabContent: React.FC<StoryArcTabContentProps> = ({ onOpenStoryArc }) => {
  return (
    <div className="space-y-4 p-1 font-sans">
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 shadow-md">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wide">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Story Arc Area</span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed font-mono">
          Visualise your narrative structure, key milestones, and act pacing on the dedicated story arc whiteboard.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={onOpenStoryArc}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-slate-950 font-black rounded-xl shadow-md flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all cursor-pointer font-sans"
            title="Open Story Arc Area"
          >
            <Layers className="w-4 h-4 text-slate-950" />
            <span>Open Story Arc Area</span>
          </button>
        </div>
      </div>
    </div>
  );
};
