import React, { useState } from 'react';
import { Trophy, Flame, Target, Share2, Copy, Check, Clock, PenTool, Zap, Sparkles, X } from 'lucide-react';
import { AppThemeConfig } from '../lib/themePresets';
import { getModalTheme } from '../lib/modalTheme';

interface FocusSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetMins: number;
  targetWords: number;
  netWords: number;
  elapsedSeconds: number;
  goalHitTimeSeconds: number | null;
  scriptTitle?: string;
  themeConfig?: AppThemeConfig;
}

export const FocusSummaryModal: React.FC<FocusSummaryModalProps> = ({
  isOpen, onClose, targetMins, targetWords, netWords, elapsedSeconds, goalHitTimeSeconds, scriptTitle = 'UNTITLED SCREENPLAY', themeConfig,
}) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const m = getModalTheme(themeConfig);
  const percentage = targetWords > 0 ? Math.round((netWords / targetWords) * 100) : 0;
  const isGoalAchieved = netWords >= targetWords;
  const actualMinutes = Math.max(0.1, elapsedSeconds / 60);
  const wordsPerMin = Math.round((netWords / actualMinutes) * 10) / 10;

  let goalHitFormatted = '';
  if (goalHitTimeSeconds !== null) {
    goalHitFormatted = `${Math.floor(goalHitTimeSeconds / 60)}m ${goalHitTimeSeconds % 60}s`;
  }
  const formatSecs = (totalSecs: number) => `${Math.floor(totalSecs / 60)}:${String(totalSecs % 60).padStart(2, '0')}`;

  const shareCardText = `🎬 SCREENWRITER PRO • FOCUS SPRINT
───────────────────────────────
📜 Script: ${scriptTitle}
🎯 Goal: ${targetWords} words in ${targetMins} mins
✍️ Result: +${netWords} net words (${percentage}% of goal)
⚡ Speed: ${wordsPerMin} words/min
⏱️ Duration: ${formatSecs(elapsedSeconds)}
${isGoalAchieved ? `🏆 Target reached in ${goalHitFormatted || formatSecs(elapsedSeconds)}!` : '💪 Great sprint effort! Keep going!'}
───────────────────────────────
#ScreenwriterPro #WritingSprint #Screenwriting`;

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(shareCardText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) { console.error('Copy failed', e); }
  };

  return (
    <div className="fixed inset-x-0 top-28 bottom-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn" style={m.overlayStyle}>
      <div className="w-full max-w-lg border rounded-2xl shadow-2xl overflow-hidden flex flex-col font-mono max-h-[85vh] overflow-y-auto" style={m.windowStyle} onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b text-center relative" style={m.headerStyle}>
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg opacity-70 hover:opacity-100 transition cursor-pointer" title="Close">
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex p-3 rounded-2xl shadow-md mb-3" style={m.primaryBtnStyle}>
            {isGoalAchieved ? <Trophy className="w-8 h-8 animate-bounce" /> : <Flame className="w-8 h-8" />}
          </div>
          <h2 className="text-xl font-black tracking-wider uppercase" style={m.accentStyle}>
            {isGoalAchieved ? 'GOAL SMASHED! 🎉' : 'FOCUS SPRINT COMPLETE!'}
          </h2>
          <p className="text-xs mt-1 font-sans" style={m.mutedStyle}>Here is your writing progress breakdown for this sprint session</p>
        </div>

        <div className="p-6 space-y-5 text-xs">
          <div className="p-4 border rounded-2xl text-center space-y-1" style={m.cardStyle}>
            <div className="text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1" style={m.accentStyle}>
              <Zap className="w-3.5 h-3.5 fill-current" />TARGET ACHIEVEMENT RATE
            </div>
            <div className="text-4xl font-black tracking-tight" style={m.accentStyle}>{percentage}%</div>
            {isGoalAchieved && goalHitFormatted && (
              <div className="text-xs font-bold text-emerald-500 flex items-center justify-center gap-1.5 pt-1">
                <Sparkles className="w-3.5 h-3.5" /><span>Target reached in {goalHitFormatted}!</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 border rounded-xl space-y-1" style={m.cardStyle}>
              <div className="text-[10px] flex items-center gap-1 font-bold" style={m.mutedStyle}><PenTool className="w-3 h-3" style={m.accentStyle} />NET WORDS WRITTEN</div>
              <div className="text-base font-extrabold">+{netWords} <span className="text-xs font-normal" style={m.mutedStyle}>/ {targetWords}</span></div>
            </div>
            <div className="p-3 border rounded-xl space-y-1" style={m.cardStyle}>
              <div className="text-[10px] flex items-center gap-1 font-bold" style={m.mutedStyle}><Clock className="w-3 h-3" style={m.accentStyle} />TIME SPENT</div>
              <div className="text-base font-extrabold">{formatSecs(elapsedSeconds)} <span className="text-xs font-normal" style={m.mutedStyle}>/ {targetMins}m</span></div>
            </div>
            <div className="p-3 border rounded-xl space-y-1" style={m.cardStyle}>
              <div className="text-[10px] flex items-center gap-1 font-bold" style={m.mutedStyle}><Zap className="w-3 h-3" style={m.accentStyle} />WRITING SPEED</div>
              <div className="text-base font-extrabold" style={m.accentStyle}>{wordsPerMin} <span className="text-xs font-normal" style={m.mutedStyle}>words/min</span></div>
            </div>
            <div className="p-3 border rounded-xl space-y-1" style={m.cardStyle}>
              <div className="text-[10px] flex items-center gap-1 font-bold" style={m.mutedStyle}><Target className="w-3 h-3" style={m.accentStyle} />SPRINT GOAL</div>
              <div className="text-base font-extrabold">{targetWords} <span className="text-xs font-normal" style={m.mutedStyle}>words in {targetMins}m</span></div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold flex items-center gap-1.5"><Share2 className="w-3.5 h-3.5" style={m.accentStyle} />FORMATTED SHARE CARD</span>
              <button
                type="button" onClick={handleCopy}
                className="px-2.5 py-1 border rounded-lg font-bold transition flex items-center gap-1 cursor-pointer active:scale-95 hover:opacity-85"
                style={m.secondaryBtnStyle}
              >
                {copied ? <><Check className="w-3.5 h-3.5 text-emerald-500" /><span className="text-emerald-500">COPIED!</span></> : <><Copy className="w-3.5 h-3.5" /><span>COPY TO CLIPBOARD</span></>}
              </button>
            </div>
            <pre className="p-3.5 border rounded-xl text-[11px] whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto select-all" style={m.inputStyle}>
              {shareCardText}
            </pre>
          </div>

          <div className="pt-2 flex items-center justify-end">
            <button onClick={onClose} className="w-full sm:w-auto px-8 py-3 font-black rounded-xl transition shadow-lg cursor-pointer active:scale-95 text-center hover:opacity-90" style={m.primaryBtnStyle}>
              CLOSE & RETURN TO SCRIPT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
