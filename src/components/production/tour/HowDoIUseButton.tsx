import React from 'react';
import { AppThemeConfig } from '../../../lib/themePresets';
import { getModalTheme } from '../../../lib/modalTheme';

interface HowDoIUseButtonProps {
  onClick: () => void;
  themeConfig?: AppThemeConfig;
}

export const HowDoIUseButton: React.FC<HowDoIUseButtonProps> = ({ onClick, themeConfig }) => {
  const mt = getModalTheme(themeConfig);

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3 py-1.5 border rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 group font-sans hover:opacity-90"
      style={mt.cardStyle}
      title="How do I use this page? (Interactive Guide)"
    >
      <div
        className="w-5 h-5 rounded-full font-black flex items-center justify-center text-xs shadow-2xs group-hover:scale-105 transition-transform"
        style={mt.primaryBtnStyle}
      >
        ?
      </div>
      <div className="text-left">
        <span className="block text-[11px] font-extrabold leading-tight tracking-tight uppercase" style={mt.accentStyle}>
          How do I
        </span>
        <span className="block text-[10px] font-bold leading-tight" style={mt.mutedStyle}>
          Use this page?
        </span>
      </div>
    </button>
  );
};
