import React, { useEffect, useRef } from 'react';
import { PASTEL_PALETTE } from '../../lib/actorHighlighting';
import { Check, Pipette } from 'lucide-react';

interface ColorPalettePopoverProps {
  selectedColor?: string;
  onSelectColor: (hex: string) => void;
  onClose: () => void;
}

export const ColorPalettePopover: React.FC<ColorPalettePopoverProps> = ({
  selectedColor,
  onSelectColor,
  onClose,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
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
      className="absolute left-0 top-7 z-50 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 font-mono text-xs text-slate-100 animate-in fade-in zoom-in-95 duration-100"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
          Highlight Colour
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-500 hover:text-slate-200 text-xs px-1"
        >
          ✕
        </button>
      </div>

      {/* 12 Pastel Grid */}
      <div className="grid grid-cols-6 gap-2 mb-3">
        {PASTEL_PALETTE.map((color) => {
          const isSelected = selectedColor?.toUpperCase() === color.hex.toUpperCase();
          return (
            <button
              key={color.hex}
              type="button"
              onClick={() => {
                onSelectColor(color.hex);
                onClose();
              }}
              title={`${color.name} (${color.hex})`}
              className={`w-6 h-6 rounded-full transition-all cursor-pointer relative shadow-xs flex items-center justify-center ${
                isSelected
                  ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900 scale-110'
                  : 'hover:scale-115 border border-slate-700/80 hover:border-slate-400'
              }`}
              style={{ backgroundColor: color.hex }}
            >
              {isSelected && <Check className="w-3 h-3 text-slate-950 font-bold" />}
            </button>
          );
        })}
      </div>

      {/* Custom Colour Picker */}
      <label className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] text-slate-300 hover:text-white cursor-pointer">
        <span className="flex items-center gap-1.5 font-bold">
          <Pipette className="w-3 h-3 text-amber-400" />
          <span>Custom Colour</span>
        </span>
        <input
          type="color"
          value={selectedColor || '#FEF9C3'}
          onChange={(e) => {
            onSelectColor(e.target.value);
          }}
          className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
        />
      </label>
    </div>
  );
};
