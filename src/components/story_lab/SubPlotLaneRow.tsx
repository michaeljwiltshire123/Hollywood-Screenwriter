import React from 'react';
import { Trash2, Heart, Lightbulb } from 'lucide-react';
import { StoryArcCard, SubPlotTrack } from '../../types';
import { SUBPLOT_PALETTES, getSubPlotPalette, getMainActIndices } from './subPlotOps';

interface SubPlotLaneRowProps {
  subPlot: SubPlotTrack;
  isFiveAct: boolean;
  onRename: (id: string, name: string) => void;
  onChangeColor: (id: string, color: string) => void;
  onChangeEmotion: (id: string, emotion: string) => void;
  onUpdateCard: (subPlotId: string, cardIdx: number, field: 'actTitle' | 'goal', val: string) => void;
  onDelete: (id: string) => void;
  onCardIdeaGen: (card: StoryArcCard, subPlotName: string) => void;
}

export const SubPlotLaneRow: React.FC<SubPlotLaneRowProps> = ({
  subPlot, isFiveAct, onRename, onChangeColor, onChangeEmotion, onUpdateCard, onDelete, onCardIdeaGen,
}) => {
  const pal = getSubPlotPalette(subPlot.color);
  const indices = getMainActIndices(isFiveAct);

  return (
    <div className="rounded-xl border-2 p-3 space-y-2.5 shadow-sm font-sans transition-colors" style={{ borderColor: pal.border, backgroundColor: pal.bgTint }}>
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b" style={{ borderColor: `${pal.border}33` }}>
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <span className="px-2 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wide shrink-0" style={{ backgroundColor: pal.badgeBg, color: pal.badgeText }}>
            Sub-Plot
          </span>
          <input
            type="text"
            value={subPlot.name}
            onChange={(e) => onRename(subPlot.id, e.target.value)}
            className="font-extrabold text-sm bg-white/80 border rounded-lg px-2.5 py-1 text-slate-900 focus:outline-none focus:ring-2 w-40 sm:w-48"
            style={{ borderColor: `${pal.border}66` }}
            aria-label="Sub-plot name"
          />
          <div className="flex items-center gap-1 px-1.5 py-1 bg-white/70 rounded-lg border" style={{ borderColor: `${pal.border}33` }}>
            {SUBPLOT_PALETTES.map((c) => (
              <button
                key={c.key} type="button" onClick={() => onChangeColor(subPlot.id, c.key)} title={`Colour: ${c.label}`}
                className={`w-4 h-4 rounded-full transition cursor-pointer ${subPlot.color === c.key ? 'ring-2 ring-offset-1 ring-slate-800 scale-110' : 'opacity-70 hover:opacity-100'}`}
                style={{ backgroundColor: c.border }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 flex-1 justify-end min-w-[240px]">
          <label className="flex items-center gap-1.5 bg-white/90 border rounded-lg px-2.5 py-1 flex-1 max-w-xs" style={{ borderColor: `${pal.border}55` }}>
            <Heart className="w-3.5 h-3.5 shrink-0" style={{ color: pal.border }} />
            <input
              type="text" value={subPlot.audienceEmotion || ''} onChange={(e) => onChangeEmotion(subPlot.id, e.target.value)}
              placeholder="Sub-plot audience feeling..." className="w-full bg-transparent text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </label>
          <button
            type="button" onClick={() => onDelete(subPlot.id)}
            className="p-1.5 rounded-lg bg-white/80 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition cursor-pointer"
            title="Remove this sub-plot"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className={`grid gap-3 grid-cols-1 ${isFiveAct ? 'md:grid-cols-5' : 'md:grid-cols-3'}`}>
        {indices.map((idx) => {
          const card = subPlot.cards[idx] || { id: `${subPlot.id}-act-${idx + 1}`, actTitle: '', goal: '' };
          return (
            <div key={card.id} className="bg-white rounded-xl border p-2.5 flex flex-col space-y-1.5 shadow-2xs" style={{ borderColor: `${pal.border}88` }}>
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black shrink-0" style={{ backgroundColor: pal.badgeBg, color: pal.badgeText }}>
                  Act {idx + 1}
                </span>
                <input
                  type="text" value={card.actTitle || ''} onChange={(e) => onUpdateCard(subPlot.id, idx, 'actTitle', e.target.value)}
                  placeholder="Sub-plot beat title..." className="font-bold text-xs text-slate-900 bg-transparent px-1 py-0.5 w-full truncate focus:outline-none"
                />
              </div>
              <textarea
                value={card.goal || ''} onChange={(e) => onUpdateCard(subPlot.id, idx, 'goal', e.target.value)}
                placeholder={`Write ${subPlot.name} notes for Act ${idx + 1}...`}
                className="w-full flex-1 min-h-[260px] rounded-lg p-2.5 text-xs text-slate-900 leading-relaxed resize-none bg-white border border-slate-200 focus:outline-none focus:ring-1"
              />
              <button
                type="button" onClick={() => onCardIdeaGen(card, subPlot.name)}
                className="w-full py-1 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 border transition cursor-pointer hover:opacity-90"
                style={{ backgroundColor: pal.bgTint, borderColor: `${pal.border}66`, color: pal.badgeText }}
              >
                <Lightbulb className="w-3.5 h-3.5" style={{ color: pal.border }} />
                <span>Idea Generation</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
