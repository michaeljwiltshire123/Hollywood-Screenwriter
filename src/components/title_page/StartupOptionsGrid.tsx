import React from 'react';
import { BookOpen } from 'lucide-react';
import { StartupOptionCards } from './StartupOptionCards';
import { AppThemeConfig } from '../../lib/themePresets';
import { getModalTheme } from '../../lib/modalTheme';

interface StartupOptionsGridProps {
  onStartNew: () => void;
  onLoadNativeFile?: () => void;
  onLoadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenSampleScript: () => void;
  onEditCurrent: () => void;
  onClose: () => void;
  themeConfig?: AppThemeConfig;
}

export const StartupOptionsGrid: React.FC<StartupOptionsGridProps> = ({
  onStartNew, onLoadNativeFile, onLoadFile, onOpenSampleScript, onEditCurrent, onClose, themeConfig,
}) => {
  const m = getModalTheme(themeConfig);

  return (
    <div className="space-y-4">
      <p className="text-xs leading-relaxed" style={m.mutedStyle}>
        Choose an option to begin writing, load an existing draft, or explore the interactive sample screenplay:
      </p>

      <StartupOptionCards
        onStartNew={onStartNew}
        onLoadNativeFile={onLoadNativeFile}
        onLoadFile={onLoadFile}
        onOpenSampleScript={onOpenSampleScript}
        onClose={onClose}
        themeConfig={themeConfig}
      />

      <div className="pt-3 border-t flex justify-center" style={m.borderStyle}>
        <button
          id="edit-active-title-metadata-btn"
          type="button"
          onClick={onEditCurrent}
          className="w-full sm:w-auto px-4 py-2.5 border rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition active:scale-95 shadow-sm cursor-pointer hover:opacity-90"
          style={m.secondaryBtnStyle}
          title="Edit active screenplay title, author, date, and draft metadata"
        >
          <BookOpen className="w-4 h-4 shrink-0" style={m.accentStyle} />
          <span>Edit active script's title page metadata</span>
        </button>
      </div>
    </div>
  );
};
