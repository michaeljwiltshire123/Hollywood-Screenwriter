import React from 'react';
import { AppThemeConfig } from '../../../lib/themePresets';

interface HowDoIUseButtonProps {
  onClick: () => void;
  themeConfig?: AppThemeConfig;
}

export const HowDoIUseButton: React.FC<HowDoIUseButtonProps> = ({ onClick, themeConfig }) => {
  const isDark = Boolean(themeConfig?.isDark);
  const borderCol = isDark ? '#F59E0B' : '#D97706';

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2.5 px-3.5 py-2 border-2 rounded-xl transition-all duration-150 cursor-pointer shadow-md hover:-translate-y-0.5 hover:shadow-lg active:scale-95 group font-sans"
      style={{
        backgroundColor: isDark ? '#181A20' : '#FFFBEB',
        borderColor: borderCol,
        color: isDark ? '#F8FAFC' : '#1C1917',
        boxShadow: '0 4px 12px -2px rgba(217, 119, 6, 0.25)',
      }}
      title="How do I use this page? (Interactive Guide)"
    >
      <div
        className="w-6 h-6 rounded-full font-black flex items-center justify-center text-xs text-white shadow-xs group-hover:scale-105 transition-transform shrink-0"
        style={{ backgroundColor: '#D97706' }}
      >
        ?
      </div>
      <div className="text-left leading-tight">
        <span className="block text-xs font-extrabold tracking-tight">
          How do I
        </span>
        <span
          className="block text-[10px] font-semibold"
          style={{ color: isDark ? '#FCD34D' : '#B45309' }}
        >
          Use this page?
        </span>
      </div>
    </button>
  );
};
