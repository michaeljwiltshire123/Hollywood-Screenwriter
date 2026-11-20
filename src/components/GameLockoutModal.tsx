import React from 'react';
import { Lock, PenTool, Clock } from 'lucide-react';
import { formatCooldownDisplay, clearGameCooldown } from '../lib/gameCooldownManager';
import { AppThemeConfig } from '../lib/themePresets';
import { getModalTheme } from '../lib/modalTheme';

interface GameLockoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  remainingSeconds: number;
  themeConfig?: AppThemeConfig;
  onResetCooldown?: () => void;
}

export const GameLockoutModal: React.FC<GameLockoutModalProps> = ({
  isOpen,
  onClose,
  remainingSeconds,
  themeConfig,
  onResetCooldown,
}) => {
  if (!isOpen) return null;
  const m = getModalTheme(themeConfig);

  const handlePadlockClick = (e: React.MouseEvent) => {
    if (e.altKey) {
      clearGameCooldown();
      if (onResetCooldown) onResetCooldown();
      onClose();
    }
  };

  return (
    <div className="fixed inset-x-0 top-28 bottom-0 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono select-none" style={m.overlayStyle}>
      <div className="border-2 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden text-center p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150" style={{ ...m.windowStyle, borderColor: m.theme.accentButtons }}>
        <div
          onClick={handlePadlockClick}
          className="w-16 h-16 mx-auto rounded-3xl border-2 flex items-center justify-center shadow-md cursor-pointer group relative"
          style={{ ...m.cardStyle, borderColor: m.theme.accentButtons, ...m.accentStyle }}
          title="Hold Alt + Click to reset cooldown for testing"
        >
          <Lock className="w-8 h-8 group-hover:scale-110 transition-transform" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black uppercase tracking-wide" style={m.accentStyle}>
            Focus Sprint In Progress
          </h2>
          <p className="text-xs leading-relaxed font-sans" style={m.mutedStyle}>
            Splendid effort returning to your draft! To prioritise your writing momentum and maintain productivity, break games are paused during this 10-minute focus session.
          </p>
        </div>

        {/* Live Countdown Display */}
        <div className="border rounded-xl p-3 flex items-center justify-center gap-2" style={m.cardStyle}>
          <Clock className="w-4 h-4" style={m.accentStyle} />
          <span className="text-xs" style={m.mutedStyle}>Next break available in:</span>
          <span className="text-sm font-bold" style={m.accentStyle}>
            {formatCooldownDisplay(remainingSeconds)}
          </span>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full font-mono uppercase font-bold tracking-wider px-6 py-3 rounded-xl border shadow-lg text-xs flex items-center justify-center gap-2 transition hover:opacity-90 cursor-pointer"
            style={m.primaryBtnStyle}
          >
            <PenTool className="w-4 h-4" />
            <span>Return to Writing</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] font-sans" style={m.mutedStyle}>
          <span>Tip: Complete your current scene to earn additional writing streaks.</span>
        </div>
      </div>
    </div>
  );
};
