import React from 'react';
import { StoryLabPacingMetrics } from './storyLabTypes';

interface StoryLabTimelineTrackProps {
  pacing: StoryLabPacingMetrics;
  actProgressPct: number;
}

export const StoryLabTimelineTrack: React.FC<StoryLabTimelineTrackProps> = ({
  pacing, actProgressPct,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between font-sans select-none p-3">
      {/* Top: Peak Good Fortune (+G) */}
      <div className="w-full flex items-center justify-between text-[11px] font-extrabold text-emerald-800 border-b border-emerald-400/40 pb-1">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-600 shadow-xs" />
          +100% Good Fortune (G-Axis)
        </span>
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Triumph / Joy / Success</span>
      </div>

      {/* Subtle +50% Upper Guideline */}
      <div className="w-full border-b border-dashed border-slate-300/60 flex justify-end pr-2">
        <span className="text-[9px] font-mono text-slate-400 font-bold">+50%</span>
      </div>

      {/* Middle Neutral Axis Timeline Bar & Milestones */}
      <div className="relative w-full my-auto py-2">
        <div className="flex items-center justify-between text-[10px] font-black text-slate-500 mb-1 px-1">
          <span className="tracking-widest uppercase text-slate-400">Neutral Baseline (0)</span>
          <span className="text-slate-400 font-mono text-[9px]">Average Fortune / Everyday World</span>
        </div>

        <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden border border-slate-300 shadow-inner">
          <div
            className="h-full bg-linear-to-r from-amber-500 to-amber-600 transition-all duration-300 rounded-full"
            style={{ width: `${actProgressPct}%` }}
          />
        </div>

        {/* Milestone Tick Labels along Baseline */}
        <div className="relative w-full flex justify-between text-[11px] font-black text-slate-800 mt-2">
          <div className="text-left">
            <span className="block text-slate-900 font-black">Act I</span>
            <span className="text-[9px] text-slate-500 font-mono">0m</span>
          </div>

          <div className="text-center relative -left-3">
            <div className="w-0.5 h-2 bg-amber-600 mx-auto -mt-2.5 mb-1" />
            <span className="block text-slate-900 font-black">Act II</span>
            <span className="text-[9px] text-slate-500 font-mono">~{pacing.actOneMins}m</span>
          </div>

          <div className="text-center">
            <div className="w-0.5 h-2 bg-amber-500 mx-auto -mt-2.5 mb-1" />
            <span className="block text-amber-700 font-black">Midpoint</span>
            <span className="text-[9px] text-slate-500 font-mono">~{Math.round(pacing.targetMinutes * 0.5)}m</span>
          </div>

          <div className="text-center relative -right-3">
            <div className="w-0.5 h-2 bg-amber-600 mx-auto -mt-2.5 mb-1" />
            <span className="block text-slate-900 font-black">Act III</span>
            <span className="text-[9px] text-slate-500 font-mono">~{pacing.actOneMins + pacing.actTwoMins}m</span>
          </div>

          <div className="text-right">
            <span className="block text-slate-900 font-black">Climax</span>
            <span className="text-[9px] text-slate-500 font-mono">{pacing.targetMinutes}m</span>
          </div>
        </div>
      </div>

      {/* Subtle -50% Lower Guideline */}
      <div className="w-full border-t border-dashed border-slate-300/60 flex justify-end pr-2">
        <span className="text-[9px] font-mono text-slate-400 font-bold">-50%</span>
      </div>

      {/* Bottom: Rock Bottom Ill Fortune (-I) */}
      <div className="w-full flex items-center justify-between text-[11px] font-extrabold text-rose-800 border-t border-rose-400/40 pt-1">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-600 shadow-xs" />
          -100% Ill Fortune (I-Axis)
        </span>
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Crisis / Tragedy / Downfall</span>
      </div>
    </div>
  );
};
