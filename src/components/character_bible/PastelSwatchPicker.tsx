import React, { useState } from 'react';
import { ColorPalettePopover } from './ColorPalettePopover';

interface PastelSwatchPickerProps {
  selectedColor?: string;
  onSelectColor: (hex: string) => void;
  className?: string;
}

export const PastelSwatchPicker: React.FC<PastelSwatchPickerProps> = ({
  selectedColor = '#FEF9C3',
  onSelectColor,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`relative inline-flex items-center gap-2 pt-1 select-none ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <span className="text-[10px] font-semibold text-slate-400 tracking-wide">
        Highlight:
      </span>

      {/* Single Swatch Circle that pops up colour palette */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        title={`Assigned highlight colour: ${selectedColor}. Click to choose colour.`}
        className="w-5 h-5 rounded-full border-2 border-slate-600 hover:border-amber-400 transition-all cursor-pointer relative shadow-xs hover:scale-110 flex items-center justify-center shrink-0"
        style={{ backgroundColor: selectedColor }}
        aria-label="Change character highlight colour"
      />

      {isOpen && (
        <ColorPalettePopover
          selectedColor={selectedColor}
          onSelectColor={onSelectColor}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
