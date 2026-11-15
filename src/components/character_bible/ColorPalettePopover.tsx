import React, { useEffect, useRef } from 'react';
import { PASTEL_PALETTE } from '../../lib/actorHighlighting';
import { AppThemeConfig } from '../../lib/themePresets';
import { getModalTheme } from '../../lib/modalTheme';
import { Check, Pipette } from 'lucide-react';

interface ColorPalettePopoverProps {
  selectedColor?: string;
  onSelectColor: (hex: string) => void;
  onClose: () => void;
  themeConfig?: AppThemeConfig;
}

export const ColorPalettePopover: React.FC<ColorPalettePopoverProps> = ({
  selectedColor, onSelectColor, onClose, themeConfig,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const mt = getModalTheme(themeConfig);

  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) onClose();
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      ref={popoverRef}
      className="absolute left-0 top-7 z-50 w-52 border rounded-xl shadow-2xl p-3 font-mono text-xs animate-in fade-in zoom-in-95 duration-100"
      style={mt.windowStyle}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between pb-2 mb-2 border-b" style={mt.borderStyle}>
        <span className="text-[10px] font-bold uppercase tracking-wider" style={mt.accentStyle}>
          Highlight Colour
        </span>
        <button type="button" onClick={onClose} className="opacity-70 hover:opacity-100 text-xs px-1 cursor-pointer">
          ✕
        </button>
      </div>

      <div className="grid grid-cols-6 gap-2 mb-3">
        {PASTEL_PALETTE.map((color) => {
          const isSelected = selectedColor?.toUpperCase() === color.hex.toUpperCase();
          return (
            <button
              key={color.hex}
              type="button"
              onClick={() => { onSelectColor(color.hex); onClose(); }}
              title={`${color.name} (${color.hex})`}
              className={`w-6 h-6 rounded-full transition-all cursor-pointer relative shadow-xs flex items-center justify-center ${
                isSelected ? 'scale-110 ring-2' : 'hover:scale-110 border'
              }`}
              style={{
                backgroundColor: color.hex,
                borderColor: mt.theme.borders,
                boxShadow: isSelected ? `0 0 0 2px ${mt.theme.accentButtons}` : undefined,
              }}
            >
              {isSelected && <Check className="w-3 h-3 text-slate-950 font-bold" />}
            </button>
          );
        })}
      </div>

      <label className="flex items-center justify-between pt-2 border-t text-[10px] cursor-pointer hover:opacity-85" style={mt.borderStyle}>
        <span className="flex items-center gap-1.5 font-bold">
          <Pipette className="w-3 h-3" style={mt.accentStyle} />
          <span>Custom Colour</span>
        </span>
        <input
          type="color"
          value={selectedColor || '#FEF9C3'}
          onChange={(e) => onSelectColor(e.target.value)}
          className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
        />
      </label>
    </div>
  );
};
