import React from 'react';
import { FilePlus, Upload, Sparkles } from 'lucide-react';

interface StartupOptionCardsProps {
  onStartNew: () => void;
  onLoadNativeFile?: () => void;
  onLoadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenSampleScript: () => void;
  onClose: () => void;
}

export const StartupOptionCards: React.FC<StartupOptionCardsProps> = ({
  onStartNew,
  onLoadNativeFile,
  onLoadFile,
  onOpenSampleScript,
  onClose,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
      {/* 1. Start New Script */}
      <button
        id="startup-start-new-btn"
        type="button"
        onClick={onStartNew}
        className="p-4 bg-slate-950 hover:bg-slate-800/80 border border-amber-500/40 hover:border-amber-400 text-amber-300 font-bold rounded-xl flex flex-col items-center justify-center gap-2 transition group shadow-md cursor-pointer active:scale-95"
      >
        <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center group-hover:scale-105 transition">
          <FilePlus className="w-5 h-5 text-amber-400" />
        </div>
        <span className="text-xs">Start New Script</span>
        <span className="text-[10px] font-normal text-slate-400 text-center">Set title & writer info</span>
      </button>

      {/* 2. Load File */}
      {onLoadNativeFile ? (
        <button
          id="startup-load-file-btn"
          type="button"
          onClick={() => {
            onLoadNativeFile();
            onClose();
          }}
          className="p-4 bg-slate-950 hover:bg-slate-800/80 border border-sky-500/40 hover:border-sky-400 text-sky-300 font-bold rounded-xl flex flex-col items-center justify-center gap-2 transition group shadow-md cursor-pointer active:scale-95"
        >
          <div className="w-10 h-10 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center group-hover:scale-105 transition">
            <Upload className="w-5 h-5 text-sky-400" />
          </div>
          <span className="text-xs">Load File</span>
          <span className="text-[10px] font-normal text-slate-400 text-center">.fountain, .pdf, .docx</span>
        </button>
      ) : (
        <label
          id="startup-load-file-label"
          className="p-4 bg-slate-950 hover:bg-slate-800/80 border border-sky-500/40 hover:border-sky-400 text-sky-300 font-bold rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition group shadow-md active:scale-95"
        >
          <div className="w-10 h-10 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center group-hover:scale-105 transition">
            <Upload className="w-5 h-5 text-sky-400" />
          </div>
          <span className="text-xs">Load File</span>
          <span className="text-[10px] font-normal text-slate-400 text-center">.fountain, .pdf, .docx</span>
          <input
            type="file"
            accept=".pdf,.docx,.txt,.fountain,.json,.screenplay"
            onChange={(e) => {
              onLoadFile(e);
              onClose();
            }}
            className="hidden"
          />
        </label>
      )}

      {/* 3. Sample Script */}
      <button
        id="startup-sample-script-btn"
        type="button"
        onClick={() => {
          onOpenSampleScript();
          onClose();
        }}
        className="p-4 bg-slate-950 hover:bg-slate-800/80 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 font-bold rounded-xl flex flex-col items-center justify-center gap-2 transition group shadow-md cursor-pointer active:scale-95"
      >
        <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center group-hover:scale-105 transition">
          <Sparkles className="w-5 h-5 text-emerald-400" />
        </div>
        <span className="text-xs">Sample Script</span>
        <span className="text-[10px] font-normal text-slate-400 text-center">Interactive Tutorial</span>
      </button>
    </div>
  );
};
