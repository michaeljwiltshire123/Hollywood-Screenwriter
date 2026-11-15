import React from 'react';
import { History, BookOpen } from 'lucide-react';
import { AppThemeConfig } from '../../lib/themePresets';

interface MainBarQuickActionsProps {
  onOpenTableRead?: () => void;
  onOpenHistoryModal: () => void;
  themeConfig?: AppThemeConfig;
}

export const MainBarQuickActions: React.FC<MainBarQuickActionsProps> = ({
  onOpenTableRead,
  onOpenHistoryModal,
  themeConfig,
}) => {
  const btnStyle: React.CSSProperties = {
    backgroundColor: themeConfig?.sceneCards || '#F4ECE0',
    borderColor: themeConfig?.borders || '#E4D3B9',
    color: themeConfig?.primaryText || '#433422',
  };

  return (
    <>
      {onOpenTableRead && (
        <button
          id="header-table-read-btn"
          onClick={onOpenTableRead}
          className="px-2.5 sm:px-3 py-1.5 min-h-[38px] border rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95 whitespace-nowrap shadow-xs hover:opacity-90"
          style={btnStyle}
          title="Open Table Read Rehearsal Studio"
        >
          <BookOpen className="w-4 h-4 shrink-0" style={{ color: themeConfig?.accentText || '#8C6239' }} />
          <span className="hidden sm:inline">TABLE READ</span>
        </button>
      )}
      <button
        id="header-revisions-btn"
        onClick={onOpenHistoryModal}
        className="px-2.5 sm:px-3 py-1.5 min-h-[38px] border rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95 whitespace-nowrap hover:opacity-90"
        style={btnStyle}
        title="Open Revision History"
      >
        <History className="w-4 h-4 shrink-0" style={{ color: themeConfig?.accentText || '#8C6239' }} />
        <span className="hidden md:inline">REVISIONS</span>
      </button>
    </>
  );
};
