import React, { useState, useRef, useEffect } from 'react';
import { Palette, ChevronDown, Check } from 'lucide-react';
import { AppThemeConfig } from '../../lib/themePresets';
import { ThemeColorPickers } from './ThemeColorPickers';

interface ThemeDropdownButtonProps {
  currentPreset: 'Vintage' | 'Charcoal' | 'Eucalyptus' | 'Custom';
  onSelectPreset: (preset: 'Vintage' | 'Charcoal' | 'Eucalyptus') => void;
  onCustomPaperColor: (color: string) => void;
  onCustomTextColor: (color: string) => void;
  currentPaperColor: string;
  currentTextColor: string;
  themeConfig?: AppThemeConfig;
}

export const ThemeDropdownButton: React.FC<ThemeDropdownButtonProps> = ({
  currentPreset, onSelectPreset, onCustomPaperColor, onCustomTextColor, currentPaperColor, currentTextColor, themeConfig,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const presets = ['Vintage', 'Charcoal', 'Eucalyptus'] as const;
  const activePreset = currentPreset === 'Custom' ? themeConfig?.basePreset || 'Vintage' : currentPreset;

  return (
    <div className="relative font-sans text-xs" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="px-2.5 py-2 min-h-[38px] border rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs hover:opacity-90"
        style={{ backgroundColor: themeConfig?.sceneCards || '#F4ECE0', borderColor: themeConfig?.borders || '#E4D3B9', color: themeConfig?.primaryText || '#433422' }}
        title="Select App Colour Theme"
      >
        <Palette className="w-4 h-4 shrink-0" style={{ color: themeConfig?.accentText || '#8C6239' }} />
        <span className="hidden sm:inline">Theme</span>
        <ChevronDown className="w-3 h-3 opacity-70" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-1.5 w-48 border rounded-xl shadow-xl z-50 p-1.5 space-y-1 animate-in fade-in duration-100"
          style={{ backgroundColor: themeConfig?.topBottomBars || '#FBF6EF', borderColor: themeConfig?.borders || '#E4D3B9', color: themeConfig?.primaryText || '#433422' }}
        >
          {presets.map((preset) => {
            const isSelected = activePreset === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => { onSelectPreset(preset); setIsOpen(false); }}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs font-bold transition cursor-pointer hover:opacity-90"
                style={{ backgroundColor: isSelected ? themeConfig?.accentButtons || '#8C6239' : 'transparent', color: isSelected ? '#FFFFFF' : themeConfig?.primaryText || '#433422' }}
              >
                <span>{preset}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
          <div className="h-px my-1" style={{ backgroundColor: themeConfig?.borders || '#E4D3B9' }} />
          <ThemeColorPickers
            currentPaperColor={currentPaperColor}
            currentTextColor={currentTextColor}
            onCustomPaperColor={onCustomPaperColor}
            onCustomTextColor={onCustomTextColor}
            themeConfig={themeConfig}
          />
        </div>
      )}
    </div>
  );
};
