import React from 'react';
import { Flame, Trophy, Zap, AlertTriangle } from 'lucide-react';
import { AppThemeConfig } from '../../../lib/themePresets';
import { getModalTheme } from '../../../lib/modalTheme';
import { calculateSprintRank, calculateIdeasPerMinute } from './ideaSprintRankHelper';

interface MotivationProps {
  ideaCount: number;
  elapsedSeconds: number;
  surgeMultiplier?: string | null;
  isBurnRateActive?: boolean;
  themeConfig?: AppThemeConfig;
}

export const IdeaSprintMotivationBar: React.FC<MotivationProps> = ({
  ideaCount, elapsedSeconds, surgeMultiplier, isBurnRateActive, themeConfig,
}) => {
  const mt = getModalTheme(themeConfig);
  const rank = calculateSprintRank(ideaCount);
  const pace = calculateIdeasPerMinute(ideaCount, elapsedSeconds);
  const velocityPercent = Math.min(100, Math.max(15, (parseFloat(pace) / 8) * 100));

  return (
    <div className="space-y-2 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-xl border shadow-md text-xs" style={mt.cardStyle}>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 animate-pulse" style={mt.accentStyle} />
          <span className="font-extrabold tracking-wide" style={mt.accentStyle}>
            CRITICAL MOMENTUM: {pace} Ideas / Min
          </span>

          {surgeMultiplier && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black shadow-sm animate-bounce" style={mt.primaryBtnStyle}>
              {surgeMultiplier}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4" style={mt.accentStyle} />
          <span className={`px-2 py-0.5 rounded text-[11px] uppercase tracking-wider ${rank.badgeColor}`}>
            {rank.rankTitle}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Flame className={`w-4 h-4 ${surgeMultiplier ? 'animate-bounce' : ''}`} style={mt.accentStyle} />
        <div className="flex-1 rounded-full h-2 overflow-hidden p-0.5 border" style={mt.subCardStyle}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${velocityPercent}%`, backgroundColor: mt.theme.accentButtons }}
          />
        </div>
      </div>

      {isBurnRateActive && (
        <div className="bg-rose-600/15 border border-rose-500 text-rose-600 px-3 py-1.5 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5 animate-pulse shadow-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>INERTIA WARNING: Burn rate active! Keep writing before momentum drops!</span>
        </div>
      )}
    </div>
  );
};
