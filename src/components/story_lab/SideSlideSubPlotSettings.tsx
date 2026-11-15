import React from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { SubPlotTrack } from '../../types';
import { SUBPLOT_PALETTES, SubPlotPalette } from './subPlotOps';

interface SideSlideSubPlotSettingsProps {
  subPlot: SubPlotTrack;
  palette: SubPlotPalette;
  onRename: (id: string, name: string) => void;
  onChangeColor: (id: string, color: string) => void;
  onChangeEmotion: (id: string, emotion: string) => void;
  onDelete: (id: string) => void;
}

export const SideSlideSubPlotSettings: React.FC<SideSlideSubPlotSettingsProps> = ({
  subPlot, palette, onRename, onChangeColor, onChangeEmotion, onDelete,
}) => {
  return (
    <div className="bg-white/95 border rounded-lg p-2 space-y-2 shadow-xs" style={{ borderColor: `${palette.border}55` }}>
      <div className="flex items-center gap-2">
        <input
          type="text" value={subPlot.name} onChange={(e) => onRename(subPlot.id, e.target.value)}
          placeholder="Sub-plot name..." aria-label="Sub-plot name"
          className="flex-1 min-w-0 font-bold text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900 focus:outline-none focus:border-slate-400"
        />
        <button
          type="button" onClick={() => onDelete(subPlot.id)} title="Delete this sub-plot"
          className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-slate-500">Paper tint:</span>
        <div className="flex items-center gap-1.5">
          {SUBPLOT_PALETTES.map((c) => (
            <button
              key={c.key} type="button" onClick={() => onChangeColor(subPlot.id, c.key)} title={c.label}
              className={`w-4 h-4 rounded-full cursor-pointer transition ${subPlot.color === c.key ? 'ring-2 ring-offset-1 ring-slate-800 scale-110' : 'opacity-70 hover:opacity-100'}`}
              style={{ backgroundColor: c.border }}
            />
          ))}
        </div>
      </div>
      <label className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded px-2 py-1">
        <Heart className="w-3.5 h-3.5 shrink-0" style={{ color: palette.border }} />
        <input
          type="text" value={subPlot.audienceEmotion || ''} onChange={(e) => onChangeEmotion(subPlot.id, e.target.value)}
          placeholder="Audience feeling for this sub-plot..." className="w-full text-xs bg-transparent text-slate-900 focus:outline-none"
        />
      </label>
    </div>
  );
};
