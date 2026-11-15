import React from 'react';
import { PenLine } from 'lucide-react';
import { HeroJourneyBeat, HeroJourneyPacing, HeroJourneyStageRow } from '../../../types';
import { ModalThemeStyles } from '../../../lib/modalTheme';
import { HERO_JOURNEY_STAGES } from './heroJourneyConstants';

interface HeroJourneyDraftingPanelProps {
  beat: HeroJourneyBeat;
  stageIndex: number;
  stageRow?: HeroJourneyStageRow;
  trackLabel: string;
  trackColor: string;
  mt: ModalThemeStyles;
  onUpdate: (patch: Partial<HeroJourneyBeat>) => void;
}

export const HeroJourneyDraftingPanel: React.FC<HeroJourneyDraftingPanelProps> = ({
  beat, stageIndex, stageRow, trackLabel, trackColor, mt, onUpdate,
}) => {
  const stage = stageRow || HERO_JOURNEY_STAGES[stageIndex] || HERO_JOURNEY_STAGES[0];

  return (
    <div className="rounded-xl border p-4 space-y-3 shadow-xs font-sans" style={mt.cardStyle}>
      <div className="flex items-center justify-between gap-2 pb-2 border-b" style={mt.borderStyle}>
        <div className="flex items-center gap-2 min-w-0">
          <PenLine className="w-4 h-4 shrink-0" style={{ color: trackColor }} />
          <span className="text-xs font-extrabold truncate">Drafting Workspace Panel</span>
        </div>
        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold border shrink-0 whitespace-nowrap" style={{ borderColor: trackColor, color: trackColor, backgroundColor: `${trackColor}15` }}>
          {trackLabel}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-bold opacity-75">
          <label htmlFor="hj-beat-title">Beat Title</label>
          <span className="truncate max-w-[170px]">Row {stageIndex + 1}: {stage.title}</span>
        </div>
        <input
          id="hj-beat-title" type="text" value={beat.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Enter beat title..."
          className="w-full rounded-lg border-2 px-3 py-2 text-sm font-bold focus:outline-none transition"
          style={{ ...mt.inputStyle, borderColor: trackColor }}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="hj-beat-summary" className="block text-[11px] font-bold opacity-75">Plot Beat Summary</label>
        <textarea
          id="hj-beat-summary" rows={5} value={beat.summary}
          onChange={(e) => onUpdate({ summary: e.target.value })}
          placeholder={stage.promptHint}
          className="w-full min-h-[135px] rounded-lg border p-3 text-[13px] leading-relaxed resize-y focus:outline-none focus:ring-1"
          style={mt.inputStyle}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label htmlFor="hj-pacing" className="block text-[11px] font-bold opacity-75">Pacing Speed</label>
          <select
            id="hj-pacing" value={beat.pacingSpeed}
            onChange={(e) => onUpdate({ pacingSpeed: e.target.value as HeroJourneyPacing })}
            className="w-full rounded-lg border px-2.5 py-2 text-xs font-bold focus:outline-none cursor-pointer"
            style={mt.inputStyle}
          >
            <option value="Slow">Slow</option>
            <option value="Moderate">Moderate</option>
            <option value="Fast">Fast</option>
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="hj-page-count" className="block text-[11px] font-bold opacity-75">Page Count</label>
          <input
            id="hj-page-count" type="number" min={1} max={300} value={beat.pageCount}
            onChange={(e) => onUpdate({ pageCount: Math.max(1, Number(e.target.value) || 1) })}
            className="w-full rounded-lg border px-2.5 py-2 text-xs font-mono font-bold tabular-nums text-right focus:outline-none"
            style={mt.inputStyle}
          />
        </div>
      </div>
    </div>
  );
};
