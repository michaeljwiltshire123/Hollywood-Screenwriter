import React from 'react';
import { X, BookOpen } from 'lucide-react';
import { ModalThemeStyles } from '../../../lib/modalTheme';

interface SynopsisHeaderProps {
  showTimelineDrawer: boolean;
  onToggleTimelineDrawer: () => void;
  onClose: () => void;
  mt: ModalThemeStyles;
}

export const SynopsisHeader: React.FC<SynopsisHeaderProps> = ({
  showTimelineDrawer, onToggleTimelineDrawer, onClose, mt,
}) => {
  return (
    <div className="flex items-center justify-between pb-3 border-b shrink-0" style={mt.borderStyle}>
      <div>
        <h2 className="text-base font-black">Professional Synopsis &amp; Marketing Pitch</h2>
        <p className="text-xs opacity-70">
          Present tense, third-person perspective, covering all major turning points through to the complete ending.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleTimelineDrawer}
          className="px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:opacity-95"
          style={mt.secondaryBtnStyle}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{showTimelineDrawer ? 'Hide Timeline Notes' : 'View Timeline & Beats'}</span>
        </button>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg border hover:bg-black/5 cursor-pointer"
          style={mt.secondaryBtnStyle}
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
