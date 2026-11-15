import React from 'react';

interface ItemProps {
  idea: string;
  idx: number;
  isPrimary: boolean;
  isBackup: boolean;
  onSelectPrimary: (idx: number) => void;
  onToggleBackup: (idx: number) => void;
}

export const IdeaSprintSummaryItem: React.FC<ItemProps> = ({
  idea, idx, isPrimary, isBackup, onSelectPrimary, onToggleBackup,
}) => {
  return (
    <div
      className={`p-3 rounded-xl border transition flex items-start justify-between gap-3 ${
        isPrimary
          ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/50'
          : isBackup
          ? 'bg-blue-50 border-blue-300'
          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
      }`}
    >
      <div className="flex-1 text-xs font-medium text-slate-900 leading-relaxed">
        <span className="font-bold text-slate-400 mr-1.5">{idx + 1}.</span>
        {idea}
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => onSelectPrimary(idx)}
          className={`px-2 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
            isPrimary ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-700 hover:bg-amber-200'
          }`}
        >
          {isPrimary ? 'Primary Idea' : 'Make Primary'}
        </button>
        {!isPrimary && (
          <button
            type="button"
            onClick={() => onToggleBackup(idx)}
            className={`px-2 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
              isBackup ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-blue-200'
            }`}
          >
            {isBackup ? 'Backup Choice' : '+ Backup'}
          </button>
        )}
      </div>
    </div>
  );
};
