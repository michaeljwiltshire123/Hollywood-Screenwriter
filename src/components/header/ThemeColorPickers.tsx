import React, { useRef } from 'react';
import { AppThemeConfig } from '../../lib/themePresets';

interface ThemeColorPickersProps {
  currentPaperColor: string;
  currentTextColor: string;
  onCustomPaperColor: (color: string) => void;
  onCustomTextColor: (color: string) => void;
  themeConfig?: AppThemeConfig;
}

export const ThemeColorPickers: React.FC<ThemeColorPickersProps> = ({
  currentPaperColor,
  currentTextColor,
  onCustomPaperColor,
  onCustomTextColor,
  themeConfig,
}) => {
  const paperInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  const rowStyle: React.CSSProperties = {
    color: themeConfig?.primaryText || '#433422',
  };

  return (
    <>
      <button
        type="button"
        onClick={() => paperInputRef.current?.click()}
        className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs font-bold transition cursor-pointer hover:opacity-80"
        style={rowStyle}
      >
        <span>Paper</span>
        <span
          className="w-4 h-4 rounded-full border shadow-2xs"
          style={{
            backgroundColor: currentPaperColor,
            borderColor: themeConfig?.borders || '#E4D3B9',
          }}
        />
        <input
          ref={paperInputRef}
          type="color"
          value={currentPaperColor}
          onChange={(e) => onCustomPaperColor(e.target.value)}
          className="sr-only"
        />
      </button>

      <button
        type="button"
        onClick={() => textInputRef.current?.click()}
        className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs font-bold transition cursor-pointer hover:opacity-80"
        style={rowStyle}
      >
        <span>Text</span>
        <span
          className="w-4 h-4 rounded-full border shadow-2xs"
          style={{
            backgroundColor: currentTextColor,
            borderColor: themeConfig?.borders || '#E4D3B9',
          }}
        />
        <input
          ref={textInputRef}
          type="color"
          value={currentTextColor}
          onChange={(e) => onCustomTextColor(e.target.value)}
          className="sr-only"
        />
      </button>
    </>
  );
};
