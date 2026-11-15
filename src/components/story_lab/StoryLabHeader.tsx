import React from 'react';
import { Layers, Minimize2, Clock } from 'lucide-react';
import { AppThemeConfig } from '../../lib/themePresets';
import { getModalTheme } from '../../lib/modalTheme';

interface StoryLabHeaderProps {
  title: string;
  targetLength: number;
  estimatedMinutes: number;
  onChangeTargetLength: (val: number) => void;
  onClose: () => void;
  themeConfig?: AppThemeConfig;
}

export const StoryLabHeader: React.FC<StoryLabHeaderProps> = ({
  title, targetLength, onChangeTargetLength, onClose, themeConfig,
}) => {
  const safeTarget = Math.max(1, targetLength || 90);
  const mt = getModalTheme(themeConfig);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b font-sans" style={mt.borderStyle}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0" style={{ ...mt.cardStyle, ...mt.accentStyle }}>
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-black uppercase tracking-wide flex items-center gap-2">
            <span>Story Lab</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full border font-mono font-bold" style={{ ...mt.cardStyle, ...mt.accentStyle }}>
              3-Act Workspace
            </span>
          </h2>
          <p className="text-xs font-mono truncate max-w-md" style={mt.mutedStyle}>
            {title || 'UNTITLED SCREENPLAY'} • Narrative structure & beat planning
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2 border px-3 py-1.5 rounded-xl text-xs font-bold" style={mt.cardStyle}>
          <Clock className="w-3.5 h-3.5" style={mt.accentStyle} />
          <span className="text-[11px] uppercase" style={mt.mutedStyle}>Target:</span>
          <input
            type="number"
            min={1}
            value={safeTarget}
            onChange={(e) => onChangeTargetLength(Math.max(1, parseInt(e.target.value) || 90))}
            className="w-14 border rounded px-1.5 py-0.5 text-xs font-bold text-center focus:outline-none"
            style={mt.inputStyle}
          />
          <span className="text-[10px] font-mono" style={mt.mutedStyle}>mins</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 font-bold rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-xs active:scale-95 hover:opacity-90"
          style={mt.primaryBtnStyle}
          title="Return to Screenplay Editor (or press Esc)"
        >
          <Minimize2 className="w-3.5 h-3.5" />
          <span>Return to Script</span>
        </button>
      </div>
    </div>
  );
};
