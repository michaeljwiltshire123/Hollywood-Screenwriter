import React from 'react';
import { Video } from 'lucide-react';

interface AdminActionsColProps {
  activeActorCount: number;
  isAllShotsExpanded?: boolean;
  onAutoSortExtFirst: () => void;
  onToggleAllShotsExpanded?: () => void;
}

export const AdminActionsCol: React.FC<AdminActionsColProps> = ({
  activeActorCount,
  isAllShotsExpanded,
  onAutoSortExtFirst,
  onToggleAllShotsExpanded,
}) => {
  return (
    <div className="space-y-1.5 flex flex-col justify-between font-sans">
      <div className="flex items-center justify-between">
        <span className="font-bold text-slate-900">ACTIVE ACTORS: {activeActorCount}</span>
      </div>
      <div className="flex items-center justify-end gap-1.5">
        {onToggleAllShotsExpanded && (
          <button
            onClick={onToggleAllShotsExpanded}
            className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-[11px] font-bold flex items-center gap-1 transition cursor-pointer shadow-xs"
            title="Expand or collapse all camera shot lists for this day"
          >
            <Video className="w-3 h-3" />
            <span>{isAllShotsExpanded ? 'Hide Shot List' : 'Show Shot List'}</span>
          </button>
        )}
        <button
          onClick={onAutoSortExtFirst}
          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded text-[11px] font-bold flex items-center gap-1 transition cursor-pointer shadow-xs"
          title="Automatically arrange exterior daylight scenes first"
        >
          <span>⚡ Auto-Sort</span>
        </button>
      </div>
    </div>
  );
};
