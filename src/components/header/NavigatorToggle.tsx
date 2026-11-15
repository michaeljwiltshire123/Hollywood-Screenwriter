import React from 'react';
import { PanelLeft } from 'lucide-react';
import { AppThemeConfig } from '../../lib/themePresets';

interface NavigatorToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  themeConfig?: AppThemeConfig;
}

export const NavigatorToggle: React.FC<NavigatorToggleProps> = ({
  isOpen,
  onToggle,
  themeConfig,
}) => {
  const accent = themeConfig?.accentButtons || '#8C6239';
  const textCol = isOpen ? '#FFFFFF' : themeConfig?.primaryText || '#433422';

  return (
    <button
      id="navigator-toggle-btn"
      onClick={onToggle}
      className="flex items-center justify-center gap-2 px-3 py-1 min-h-[44px] rounded-xl border font-mono transition-all duration-150 shrink-0 shadow-sm cursor-pointer active:scale-95 group text-center hover:opacity-90"
      style={{
        backgroundColor: isOpen ? accent : themeConfig?.sceneCards || '#F4ECE0',
        borderColor: isOpen ? accent : themeConfig?.borders || '#E4D3B9',
        color: textCol,
      }}
      title={
        isOpen
          ? 'Close Navigator & Production Tools Drawer'
          : 'Open Navigator & Production Tools Drawer'
      }
      aria-label="Toggle Navigator and Production Tools"
    >
      <PanelLeft
        className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110"
        style={{ color: isOpen ? '#FFFFFF' : themeConfig?.accentText || '#8C6239' }}
      />
      <div className="flex flex-col items-center justify-center text-center leading-snug">
        <span
          className="tracking-wider uppercase text-xs sm:text-[13px] font-black"
          style={{ color: isOpen ? '#FFFFFF' : themeConfig?.accentText || '#8C6239' }}
        >
          Navigator
        </span>
        <span
          className="tracking-tight text-[11px] font-bold whitespace-nowrap opacity-85"
          style={{ color: textCol }}
        >
          Production Tools
        </span>
      </div>
    </button>
  );
};
