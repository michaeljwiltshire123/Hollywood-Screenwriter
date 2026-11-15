import React from 'react';
import { BookOpen, Calendar } from 'lucide-react';
import { NavigatorToggle } from './header/NavigatorToggle';
import { HeaderActionButtons } from './header/HeaderActionButtons';
import { HeaderProps } from './header/types';

export const Header: React.FC<HeaderProps> = (props) => {
  const {
    isSidePanelOpen,
    onToggleSidePanel,
    isFocusMode,
    onOpenTableRead,
    onOpenProductionSchedule,
    onOpenTitlePage,
    themeConfig,
  } = props;

  const centerBtnStyle: React.CSSProperties = {
    backgroundColor: themeConfig?.sceneCards || '#F4ECE0',
    borderColor: themeConfig?.borders || '#E4D3B9',
    color: themeConfig?.primaryText || '#433422',
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 !z-50 border-b select-none shadow-sm transition-colors"
      style={{
        backgroundColor: themeConfig?.topBottomBars,
        borderColor: themeConfig?.borders,
        color: themeConfig?.primaryText,
      }}
    >
      <div className="w-full px-2 sm:px-4 h-14 flex items-center justify-between gap-1.5 sm:gap-3 min-w-0">
        {/* Left: Navigator Toggle & Title Page */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 min-w-0">
          {!isFocusMode && (
            <>
              <NavigatorToggle
                isOpen={isSidePanelOpen}
                onToggle={onToggleSidePanel}
                themeConfig={themeConfig}
              />
              <button
                id="header-title-page-btn"
                onClick={onOpenTitlePage}
                className="px-2 py-1 min-h-[38px] border rounded-lg flex items-center gap-1.5 transition cursor-pointer active:scale-95 whitespace-nowrap shadow-xs hover:opacity-90"
                style={centerBtnStyle}
                title="Edit Title Page details"
              >
                <BookOpen className="w-4 h-4 shrink-0" style={{ color: themeConfig?.accentText || '#8C6239' }} />
                <span className="flex flex-col text-[11px] font-bold leading-[1.05] text-left">
                  <span>Title</span>
                  <span>Page</span>
                </span>
              </button>
            </>
          )}
        </div>

        {/* Center: Table Read & Production Schedule */}
        {!isFocusMode && (
          <div className="hidden 2xl:flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenTableRead}
              className="flex items-center gap-1.5 border px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition shadow-xs cursor-pointer shrink-0 hover:opacity-90"
              style={centerBtnStyle}
              title="Open Table Read Rehearsal Studio"
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" style={{ color: themeConfig?.accentText || '#8C6239' }} />
              <span>TABLE READ</span>
            </button>
            <button
              onClick={onOpenProductionSchedule}
              className="flex items-center gap-1.5 border px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition shadow-xs cursor-pointer shrink-0 hover:opacity-90"
              style={centerBtnStyle}
              title="Open Production Schedule"
            >
              <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: themeConfig?.accentText || '#8C6239' }} />
              <span>PRODUCTION SCHEDULE</span>
            </button>
          </div>
        )}

        {/* Right: Adaptive Action Controls */}
        <HeaderActionButtons {...props} isDirty={props.isDirty ?? false} />
      </div>
    </header>
  );
};
