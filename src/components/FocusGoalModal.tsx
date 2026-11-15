import React, { useState } from 'react';
import { Target, Clock, PenTool, Sparkles, X, Play } from 'lucide-react';
import { AppThemeConfig } from '../lib/themePresets';
import { getModalTheme } from '../lib/modalTheme';

interface FocusGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartFocus: (targetMins: number, targetWords: number) => void;
  defaultMins?: number;
  defaultWords?: number;
  themeConfig?: AppThemeConfig;
}

const TIME_PRESETS = [15, 25, 45, 60, 90];
const WORD_PRESETS = [250, 500, 750, 1000, 1500, 2000];

export const FocusGoalModal: React.FC<FocusGoalModalProps> = ({
  isOpen, onClose, onStartFocus, defaultMins = 45, defaultWords = 500, themeConfig,
}) => {
  const [selectedMins, setSelectedMins] = useState<number>(defaultMins);
  const [customMinsInput, setCustomMinsInput] = useState<string>(defaultMins.toString());
  const [selectedWords, setSelectedWords] = useState<number>(defaultWords);
  const [customWordsInput, setCustomWordsInput] = useState<string>(defaultWords.toString());

  if (!isOpen) return null;
  const m = getModalTheme(themeConfig);

  const handleMinsSelect = (mins: number) => { setSelectedMins(mins); setCustomMinsInput(mins.toString()); };
  const handleWordsSelect = (words: number) => { setSelectedWords(words); setCustomWordsInput(words.toString()); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalMins = Math.max(1, parseInt(customMinsInput, 10) || selectedMins || 45);
    const finalWords = Math.max(10, parseInt(customWordsInput, 10) || selectedWords || 500);
    onStartFocus(finalMins, finalWords);
  };

  return (
    <div className="fixed inset-x-0 top-28 bottom-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn" style={m.overlayStyle}>
      <div className="w-full max-w-lg border rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={m.windowStyle} onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b flex items-center justify-between" style={m.headerStyle}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 border rounded-xl" style={{ ...m.cardStyle, ...m.accentStyle }}>
              <Target className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-wide flex items-center gap-2" style={m.accentStyle}>
                FOCUS SPRINT GOALS
              </h2>
              <p className="text-xs font-sans" style={m.mutedStyle}>
                Set time & word count targets for a distraction-free writing session
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg opacity-70 hover:opacity-100 transition cursor-pointer" title="Cancel">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 font-mono text-xs">
          <div className="space-y-2">
            <label className="font-bold flex items-center justify-between text-xs" style={m.accentStyle}>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />Working for the next... (minutes)</span>
              <span className="font-normal" style={m.mutedStyle}>{customMinsInput} mins</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {TIME_PRESETS.map((mins) => {
                const active = selectedMins === mins && customMinsInput === mins.toString();
                return (
                  <button
                    type="button" key={mins} onClick={() => handleMinsSelect(mins)}
                    className="py-2 px-1 rounded-xl font-bold transition border text-center cursor-pointer hover:opacity-90"
                    style={active ? m.primaryBtnStyle : m.secondaryBtnStyle}
                  >
                    {mins}m
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px]" style={m.mutedStyle}>Custom Time:</span>
              <input
                type="number" min="1" max="360" value={customMinsInput}
                onChange={(e) => { setCustomMinsInput(e.target.value); setSelectedMins(parseInt(e.target.value, 10) || 0); }}
                className="w-24 border rounded-lg px-3 py-1.5 font-bold text-xs focus:outline-none"
                style={{ ...m.inputStyle, color: m.theme.accentText }}
              />
              <span className="text-[11px]" style={m.mutedStyle}>minutes</span>
            </div>
          </div>

          <div className="h-px border-t" style={m.borderStyle} />

          <div className="space-y-2">
            <label className="font-bold flex items-center justify-between text-xs" style={m.accentStyle}>
              <span className="flex items-center gap-1.5"><PenTool className="w-4 h-4" />Aim to write at least... (words)</span>
              <span className="font-normal" style={m.mutedStyle}>{customWordsInput} words</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {WORD_PRESETS.map((w) => {
                const active = selectedWords === w && customWordsInput === w.toString();
                return (
                  <button
                    type="button" key={w} onClick={() => handleWordsSelect(w)}
                    className="py-2 px-1 rounded-xl font-bold transition border text-center cursor-pointer hover:opacity-90"
                    style={active ? m.primaryBtnStyle : m.secondaryBtnStyle}
                  >
                    {w}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px]" style={m.mutedStyle}>Custom Words:</span>
              <input
                type="number" min="10" max="50000" value={customWordsInput}
                onChange={(e) => { setCustomWordsInput(e.target.value); setSelectedWords(parseInt(e.target.value, 10) || 0); }}
                className="w-28 border rounded-lg px-3 py-1.5 font-bold text-xs focus:outline-none"
                style={{ ...m.inputStyle, color: m.theme.accentText }}
              />
              <span className="text-[11px]" style={m.mutedStyle}>net words</span>
            </div>
          </div>

          <div className="p-3 border rounded-xl text-[11px] leading-relaxed font-sans flex items-start gap-2" style={m.cardStyle}>
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" style={m.accentStyle} />
            <div>
              <strong>How Focus Mode works:</strong> During this session, the top dual progress bars will track elapsed time and net new words written starting from 0. Hitting 100% plays a celebratory chime while you keep writing!
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl font-bold transition border cursor-pointer hover:opacity-85" style={m.secondaryBtnStyle}>
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 font-black rounded-xl transition shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 hover:opacity-90" style={m.primaryBtnStyle}>
              <Play className="w-4 h-4 fill-current" />
              <span>START FOCUSED WORK</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
