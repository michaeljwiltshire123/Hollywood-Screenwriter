import React, { useState } from 'react';
import { AppThemeConfig } from '../../lib/themePresets';
import { ColorPalettePopover } from './ColorPalettePopover';

interface PastelSwatchPickerProps {
  selectedColor?: string;
  onSelectColor: (hex: string) => void;
  className?: string;
  themeConfig?: AppThemeConfig;
}

export const PastelSwatchPicker: React.FC<PastelSwatchPickerProps> = ({
  selectedColor = '#FEF9C3',
  onSelectColor,
  className = '',
  themeConfig,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`relative inline-flex items-center gap-2 pt-1 select-none ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <span className="text-[10px] font-semibold opacity-75 tracking-wide">
        Highlight:
      </span>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        title={`Assigned highlight colour: ${selectedColor}. Click to choose colour.`}
        className="w-5 h-5 rounded-full border-2 hover:scale-110 transition-all cursor-pointer relative shadow-xs flex items-center justify-center shrink-0"
        style={{ backgroundColor: selectedColor, borderColor: themeConfig?.borders || '#475569' }}
        aria-label="Change character highlight colour"
      />

      {isOpen && (
        <ColorPalettePopover
          selectedColor={selectedColor}
          onSelectColor={onSelectColor}
          onClose={() => setIsOpen(false)}
          themeConfig={themeConfig}
        />
      )}
    </div>
  );
};
