import React from 'react';
import { FileText, ArrowUpRight } from 'lucide-react';

interface PreProductionDocButtonProps {
  onOpenProductionSchedule?: () => void;
}

export const PreProductionDocButton: React.FC<PreProductionDocButtonProps> = ({
  onOpenProductionSchedule,
}) => {
  if (!onOpenProductionSchedule) return null;

  return (
    <button
      type="button"
      onClick={onOpenProductionSchedule}
      className="w-full group relative overflow-hidden p-2.5 bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 hover:from-slate-850 hover:via-amber-900/60 hover:to-slate-850 border border-amber-500/40 hover:border-amber-400 rounded-lg text-xs font-bold text-slate-100 flex items-center justify-between transition-all duration-200 cursor-pointer shadow-md hover:shadow-amber-500/15 active:scale-[0.99] mb-3"
      title="Open Production Schedule, Call Sheet & Pre-Production Suite"
    >
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-md bg-amber-500/20 border border-amber-400/40 text-amber-300 group-hover:bg-amber-500/30 group-hover:text-amber-200 transition-colors shrink-0 shadow-xs">
          <FileText className="w-4 h-4" />
        </div>
        <div className="text-left leading-tight">
          <div className="font-bold text-xs tracking-wide text-amber-100 group-hover:text-white flex items-center gap-1.5">
            <span>Pre-Production Docs</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 group-hover:text-slate-300 font-normal mt-0.5">
            Call sheets, risk assessment & schedule
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase bg-amber-500/15 group-hover:bg-amber-400/25 border border-amber-400/30 group-hover:border-amber-400/60 px-2 py-1 rounded text-amber-300 group-hover:text-amber-100 transition shrink-0 ml-2">
        <span>Suite</span>
        <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </button>
  );
};
