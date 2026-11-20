import React from 'react';
import { RefreshCw } from 'lucide-react';
import { ModalThemeStyles } from '../../lib/modalTheme';

interface BreakGameEndOverlayProps {
  title: string;
  subtitle?: string;
  onReplay: () => void;
  onBackToMenu: () => void;
  mt: ModalThemeStyles;
}

export const BreakGameEndOverlay: React.FC<BreakGameEndOverlayProps> = ({
  title, subtitle, onReplay, onBackToMenu, mt,
}) => (
  <div className="absolute inset-0 backdrop-blur-xs flex items-center justify-center p-4 z-20" style={mt.overlayStyle}>
    <div className="p-4 rounded-xl border space-y-3 text-center shadow-lg max-w-xs w-full" style={mt.windowStyle}>
      <div className="font-bold text-sm">{title}</div>
      {subtitle && <div className="text-xs" style={mt.mutedStyle}>{subtitle}</div>}
      <div className="flex flex-wrap gap-2 justify-center">
        <button onClick={(e) => { e.stopPropagation(); onReplay(); }} className="px-4 py-2 rounded-lg font-bold text-xs cursor-pointer flex items-center gap-1" style={mt.primaryBtnStyle}>
          <RefreshCw className="w-3.5 h-3.5" /><span>Play Again</span>
        </button>
        <button onClick={(e) => { e.stopPropagation(); onBackToMenu(); }} className="px-4 py-2 rounded-lg font-bold text-xs cursor-pointer border" style={mt.secondaryBtnStyle}>
          Pick Another Game
        </button>
      </div>
    </div>
  </div>
);
