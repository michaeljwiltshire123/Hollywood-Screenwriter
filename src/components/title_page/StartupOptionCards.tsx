import React from 'react';
import { FilePlus, Upload, Sparkles } from 'lucide-react';
import { AppThemeConfig } from '../../lib/themePresets';
import { getModalTheme } from '../../lib/modalTheme';

interface StartupOptionCardsProps {
  onStartNew: () => void;
  onLoadNativeFile?: () => void;
  onLoadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenSampleScript: () => void;
  onClose: () => void;
  themeConfig?: AppThemeConfig;
}

export const StartupOptionCards: React.FC<StartupOptionCardsProps> = ({
  onStartNew, onLoadNativeFile, onLoadFile, onOpenSampleScript, onClose, themeConfig,
}) => {
  const m = getModalTheme(themeConfig);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
      <button
        id="startup-start-new-btn"
        type="button"
        onClick={onStartNew}
        className="p-4 border font-bold rounded-xl flex flex-col items-center justify-center gap-2 transition group shadow-md cursor-pointer active:scale-95 hover:opacity-90"
        style={m.cardStyle}
      >
        <div className="w-10 h-10 rounded-full border flex items-center justify-center group-hover:scale-105 transition" style={m.headerStyle}>
          <FilePlus className="w-5 h-5" style={m.accentStyle} />
        </div>
        <span className="text-xs" style={m.accentStyle}>Start New Script</span>
        <span className="text-[10px] font-normal text-center" style={m.mutedStyle}>Set title & writer info</span>
      </button>

      {onLoadNativeFile ? (
        <button
          id="startup-load-file-btn"
          type="button"
          onClick={() => { onLoadNativeFile(); onClose(); }}
          className="p-4 border font-bold rounded-xl flex flex-col items-center justify-center gap-2 transition group shadow-md cursor-pointer active:scale-95 hover:opacity-90"
          style={m.cardStyle}
        >
          <div className="w-10 h-10 rounded-full border flex items-center justify-center group-hover:scale-105 transition" style={m.headerStyle}>
            <Upload className="w-5 h-5" style={m.accentStyle} />
          </div>
          <span className="text-xs" style={m.accentStyle}>Load File</span>
          <span className="text-[10px] font-normal text-center" style={m.mutedStyle}>.fountain, .pdf, .docx</span>
        </button>
      ) : (
        <label
          id="startup-load-file-label"
          className="p-4 border font-bold rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition group shadow-md active:scale-95 hover:opacity-90"
          style={m.cardStyle}
        >
          <div className="w-10 h-10 rounded-full border flex items-center justify-center group-hover:scale-105 transition" style={m.headerStyle}>
            <Upload className="w-5 h-5" style={m.accentStyle} />
          </div>
          <span className="text-xs" style={m.accentStyle}>Load File</span>
          <span className="text-[10px] font-normal text-center" style={m.mutedStyle}>.fountain, .pdf, .docx</span>
          <input
            type="file"
            accept=".pdf,.docx,.txt,.fountain,.json,.screenplay"
            onChange={(e) => { onLoadFile(e); onClose(); }}
            className="hidden"
          />
        </label>
      )}

      <button
        id="startup-sample-script-btn"
        type="button"
        onClick={() => { onOpenSampleScript(); onClose(); }}
        className="p-4 border font-bold rounded-xl flex flex-col items-center justify-center gap-2 transition group shadow-md cursor-pointer active:scale-95 hover:opacity-90"
        style={m.cardStyle}
      >
        <div className="w-10 h-10 rounded-full border flex items-center justify-center group-hover:scale-105 transition" style={m.headerStyle}>
          <Sparkles className="w-5 h-5" style={m.accentStyle} />
        </div>
        <span className="text-xs" style={m.accentStyle}>Sample Script</span>
        <span className="text-[10px] font-normal text-center" style={m.mutedStyle}>Interactive Tutorial</span>
      </button>
    </div>
  );
};
