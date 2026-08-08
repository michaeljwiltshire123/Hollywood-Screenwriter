import React, { useState } from 'react';
import { Target, Clock, PenTool, Sparkles, X, Play } from 'lucide-react';

interface FocusGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartFocus: (targetMins: number, targetWords: number) => void;
  defaultMins?: number;
  defaultWords?: number;
}

const TIME_PRESETS = [15, 25, 45, 60, 90];
const WORD_PRESETS = [250, 500, 750, 1000, 1500, 2000];

export const FocusGoalModal: React.FC<FocusGoalModalProps> = ({
  isOpen,
  onClose,
  onStartFocus,
  defaultMins = 45,
  defaultWords = 500,
}) => {
  const [selectedMins, setSelectedMins] = useState<number>(defaultMins);
  const [customMinsInput, setCustomMinsInput] = useState<string>(defaultMins.toString());

  const [selectedWords, setSelectedWords] = useState<number>(defaultWords);
  const [customWordsInput, setCustomWordsInput] = useState<string>(defaultWords.toString());

  if (!isOpen) return null;

  const handleMinsSelect = (mins: number) => {
    setSelectedMins(mins);
    setCustomMinsInput(mins.toString());
  };

  const handleWordsSelect = (words: number) => {
    setSelectedWords(words);
    setCustomWordsInput(words.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalMins = Math.max(1, parseInt(customMinsInput, 10) || selectedMins || 45);
    const finalWords = Math.max(10, parseInt(customWordsInput, 10) || selectedWords || 500);
    onStartFocus(finalMins, finalWords);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="p-5 bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950/80 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-400">
              <Target className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-amber-300 tracking-wide flex items-center gap-2">
                FOCUS SPRINT GOALS
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Set time & word count targets for a distraction-free writing session
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition cursor-pointer"
            title="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 font-mono text-xs">
          {/* Target Time Selection */}
          <div className="space-y-2">
            <label className="text-amber-400 font-bold flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                Working for the next... (minutes)
              </span>
              <span className="text-slate-400 font-normal">
                {customMinsInput} mins
              </span>
            </label>

            {/* Presets */}
            <div className="grid grid-cols-5 gap-2">
              {TIME_PRESETS.map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => handleMinsSelect(m)}
                  className={`py-2 px-1 rounded-xl font-bold transition border text-center cursor-pointer ${
                    selectedMins === m && customMinsInput === m.toString()
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  {m}m
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-400">Custom Time:</span>
              <input
                type="number"
                min="1"
                max="360"
                value={customMinsInput}
                onChange={(e) => {
                  setCustomMinsInput(e.target.value);
                  setSelectedMins(parseInt(e.target.value, 10) || 0);
                }}
                className="w-24 bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-lg px-3 py-1.5 text-amber-300 font-bold text-xs focus:outline-none"
              />
              <span className="text-[11px] text-slate-400">minutes</span>
            </div>
          </div>

          <div className="h-px bg-slate-800" />

          {/* Target Word Count Selection */}
          <div className="space-y-2">
            <label className="text-amber-400 font-bold flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5">
                <PenTool className="w-4 h-4 text-amber-400" />
                Aim to write at least... (words)
              </span>
              <span className="text-slate-400 font-normal">
                {customWordsInput} words
              </span>
            </label>

            {/* Presets */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {WORD_PRESETS.map((w) => (
                <button
                  type="button"
                  key={w}
                  onClick={() => handleWordsSelect(w)}
                  className={`py-2 px-1 rounded-xl font-bold transition border text-center cursor-pointer ${
                    selectedWords === w && customWordsInput === w.toString()
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-400">Custom Words:</span>
              <input
                type="number"
                min="10"
                max="50000"
                value={customWordsInput}
                onChange={(e) => {
                  setCustomWordsInput(e.target.value);
                  setSelectedWords(parseInt(e.target.value, 10) || 0);
                }}
                className="w-28 bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-lg px-3 py-1.5 text-amber-300 font-bold text-xs focus:outline-none"
              />
              <span className="text-[11px] text-slate-400">net words</span>
            </div>
          </div>

          {/* Explanation Box */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-200/90 leading-relaxed font-sans flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span>
                <strong>How Focus Mode works:</strong> During this session, the top dual progress bars will track elapsed time and net new words written starting from 0. Hitting 100% plays a celebratory chime while you keep writing!
              </span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition border border-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black rounded-xl transition shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>START FOCUSED WORK</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
