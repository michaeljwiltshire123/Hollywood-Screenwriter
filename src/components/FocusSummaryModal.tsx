import React, { useState } from 'react';
import { Trophy, Flame, Target, Share2, Copy, Check, Clock, PenTool, Zap, Sparkles, X } from 'lucide-react';

interface FocusSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetMins: number;
  targetWords: number;
  netWords: number;
  elapsedSeconds: number;
  goalHitTimeSeconds: number | null;
  scriptTitle?: string;
}

export const FocusSummaryModal: React.FC<FocusSummaryModalProps> = ({
  isOpen,
  onClose,
  targetMins,
  targetWords,
  netWords,
  elapsedSeconds,
  goalHitTimeSeconds,
  scriptTitle = 'UNTITLED SCREENPLAY',
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const percentage = targetWords > 0 ? Math.round((netWords / targetWords) * 100) : 0;
  const isGoalAchieved = netWords >= targetWords;

  const actualMinutes = Math.max(0.1, elapsedSeconds / 60);
  const wordsPerMin = Math.round((netWords / actualMinutes) * 10) / 10;

  // Format goal hit time if hit early
  let goalHitFormatted = '';
  if (goalHitTimeSeconds !== null) {
    const ghMins = Math.floor(goalHitTimeSeconds / 60);
    const ghSecs = goalHitTimeSeconds % 60;
    goalHitFormatted = `${ghMins}m ${ghSecs}s`;
  }

  const formatSecs = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  // Share card formatted text
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
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.25)] overflow-hidden flex flex-col text-slate-100 font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-b from-amber-950/80 via-slate-900 to-slate-900 border-b border-slate-800 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex p-3 bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 rounded-2xl shadow-[0_0_25px_rgba(245,158,11,0.5)] mb-3">
            {isGoalAchieved ? <Trophy className="w-8 h-8 animate-bounce" /> : <Flame className="w-8 h-8 text-slate-950" />}
          </div>

          <h2 className="text-xl font-black text-amber-300 tracking-wider uppercase">
            {isGoalAchieved ? 'GOAL SMASHED! 🎉' : 'FOCUS SPRINT COMPLETE!'}
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Here is your writing progress breakdown for this sprint session
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs">
          {/* Big Hero Metric */}
          <div className="p-4 bg-slate-950/80 border border-amber-500/30 rounded-2xl text-center space-y-1">
            <div className="text-[10px] text-amber-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-current" />
              TARGET ACHIEVEMENT RATE
            </div>
            <div className="text-4xl font-black text-amber-300 tracking-tight">
              {percentage}%
            </div>
            {isGoalAchieved && goalHitFormatted && (
              <div className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5 pt-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Target reached in {goalHitFormatted}!</span>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl space-y-1">
              <div className="text-[10px] text-slate-400 flex items-center gap-1 font-bold">
                <PenTool className="w-3 h-3 text-amber-400" />
                NET WORDS WRITTEN
              </div>
              <div className="text-base font-extrabold text-slate-100">
                +{netWords} <span className="text-xs font-normal text-slate-400">/ {targetWords}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl space-y-1">
              <div className="text-[10px] text-slate-400 flex items-center gap-1 font-bold">
                <Clock className="w-3 h-3 text-amber-400" />
                TIME SPENT
              </div>
              <div className="text-base font-extrabold text-slate-100">
                {formatSecs(elapsedSeconds)} <span className="text-xs font-normal text-slate-400">/ {targetMins}m</span>
              </div>
            </div>

            <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl space-y-1">
              <div className="text-[10px] text-slate-400 flex items-center gap-1 font-bold">
                <Zap className="w-3 h-3 text-amber-400" />
                WRITING SPEED
              </div>
              <div className="text-base font-extrabold text-amber-300">
                {wordsPerMin} <span className="text-xs font-normal text-slate-400">words/min</span>
              </div>
            </div>

            <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl space-y-1">
              <div className="text-[10px] text-slate-400 flex items-center gap-1 font-bold">
                <Target className="w-3 h-3 text-amber-400" />
                SPRINT GOAL
              </div>
              <div className="text-base font-extrabold text-slate-100">
                {targetWords} <span className="text-xs font-normal text-slate-400">words in {targetMins}m</span>
              </div>
            </div>
          </div>

          {/* Formatted Share Card Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
                FORMATTED SHARE CARD
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY TO CLIPBOARD</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-amber-200/90 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto select-all">
              {shareCardText}
            </pre>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black rounded-xl transition shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer active:scale-95 text-center"
            >
              CLOSE & RETURN TO SCRIPT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
