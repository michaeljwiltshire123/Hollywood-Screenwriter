import React from 'react';
import { BookOpen } from 'lucide-react';
import { StartupOptionCards } from './StartupOptionCards';

interface StartupOptionsGridProps {
  onStartNew: () => void;
  onLoadNativeFile?: () => void;
  onLoadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenSampleScript: () => void;
  onEditCurrent: () => void;
  onClose: () => void;
}

export const StartupOptionsGrid: React.FC<StartupOptionsGridProps> = ({
  onStartNew,
  onLoadNativeFile,
  onLoadFile,
  onOpenSampleScript,
  onEditCurrent,
  onClose,
}) => {
  return (
    <div className="space-y-4">
      <p className="text-slate-300 text-xs leading-relaxed">
        Choose an option to begin writing, load an existing draft, or explore the interactive sample screenplay:
      </p>

      <StartupOptionCards
        onStartNew={onStartNew}
        onLoadNativeFile={onLoadNativeFile}
        onLoadFile={onLoadFile}
        onOpenSampleScript={onOpenSampleScript}
        onClose={onClose}
      />

      {/* Primary button with real border, shadow, and full styling like every button */}
      <div className="pt-3 border-t border-slate-800 flex justify-center">
        <button
          id="edit-active-title-metadata-btn"
          type="button"
          onClick={onEditCurrent}
          className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-amber-400/80 rounded-xl text-slate-200 hover:text-amber-300 text-xs font-mono font-bold flex items-center justify-center gap-2 transition active:scale-95 shadow-sm cursor-pointer"
          title="Edit active screenplay title, author, date, and draft metadata"
        >
          <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Edit active script's title page metadata</span>
        </button>
      </div>
    </div>
  );
};
