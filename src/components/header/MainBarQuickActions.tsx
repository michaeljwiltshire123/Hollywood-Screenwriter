import React from 'react';
import { History, BookOpen, Volume2 } from 'lucide-react';

interface MainBarQuickActionsProps {
  onOpenTableRead?: () => void;
  onOpenHistoryModal: () => void;
  onOpenTitlePage: () => void;
}

export const MainBarQuickActions: React.FC<MainBarQuickActionsProps> = ({
  onOpenTableRead,
  onOpenHistoryModal,
  onOpenTitlePage,
}) => {
  return (
    <>
      {onOpenTableRead && (
        <button
          id="header-table-read-btn"
          onClick={onOpenTableRead}
          className="px-2.5 sm:px-3 py-1.5 min-h-[38px] bg-amber-500/15 border border-amber-500/50 hover:bg-amber-500/25 text-amber-300 hover:text-amber-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95 whitespace-nowrap shadow-xs"
          title="Open Table Read Rehearsal Studio"
        >
          <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="hidden sm:inline">TABLE READ</span>
        </button>
      )}
      <button
        id="header-revisions-btn"
        onClick={onOpenHistoryModal}
        className="px-2.5 sm:px-3 py-1.5 min-h-[38px] bg-slate-800 border border-slate-700 hover:border-amber-400/60 rounded-lg text-slate-200 hover:text-amber-300 hover:bg-slate-750 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95 whitespace-nowrap"
        title="Open Revision History"
      >
        <History className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="hidden md:inline">REVISIONS</span>
      </button>
      <button
        id="header-title-page-btn"
        onClick={onOpenTitlePage}
        className="px-2.5 sm:px-3 py-1.5 min-h-[38px] bg-slate-800 border border-slate-700 hover:border-slate-500 rounded-lg text-slate-200 hover:text-white hover:bg-slate-750 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95 whitespace-nowrap"
        title="Edit Title Page details"
      >
        <BookOpen className="w-4 h-4 text-slate-300 shrink-0" />
        <span className="hidden lg:inline">TITLE PAGE</span>
      </button>
    </>
  );
};
