import React from 'react';
import { Minimize2, Lightbulb } from 'lucide-react';
import { StoryArcCard } from '../../types';

interface StoryLabPlotpointsDeckProps {
  card: StoryArcCard;
  parentLabel: string;
  miniCards: StoryArcCard[];
  onUpdateMiniCard: (index: number, field: 'actTitle' | 'goal', val: string) => void;
  onCollapse: () => void;
  onOpenGuidedSpark: (card: StoryArcCard) => void;
}

export const StoryLabPlotpointsDeck: React.FC<StoryLabPlotpointsDeckProps> = ({
  card, parentLabel, miniCards, onUpdateMiniCard, onCollapse, onOpenGuidedSpark,
}) => {
  return (
    <div className="relative group my-1 font-sans rounded-xl bg-white border-2 border-blue-500 p-2.5 shadow-md flex flex-col space-y-2">
      <div className="flex items-center justify-between border-b border-blue-100 pb-1.5 gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="px-2 py-0.5 rounded text-[11px] font-black bg-blue-600 text-white shrink-0">{parentLabel}</span>
          <span className="text-[11px] font-black text-blue-900 truncate">3 New Story Plot Points</span>
        </div>
        <button
          type="button"
          onClick={onCollapse}
          className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold flex items-center gap-1 transition cursor-pointer border border-slate-300 shrink-0"
        >
          <Minimize2 className="w-3 h-3 text-slate-500" />
          <span>Collapse</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {[0, 1, 2].map((idx) => {
          const beat = miniCards[idx] || { id: `beat-${idx}`, actTitle: '', goal: '' };
          return (
            <div key={idx} className="bg-white border-2 border-blue-400 rounded-lg p-1.5 flex flex-col space-y-1 shadow-2xs">
              <div className="text-[10px] font-black text-blue-800 bg-blue-50 px-1 py-0.5 rounded text-center truncate">Beat {idx + 1}</div>
              <input
                type="text"
                value={beat.actTitle || ''}
                onChange={(e) => onUpdateMiniCard(idx, 'actTitle', e.target.value)}
                placeholder="Title..."
                className="text-[10px] font-bold bg-slate-50 border border-slate-200 rounded px-1 py-0.5 text-slate-900 focus:outline-none focus:border-blue-500 w-full"
              />
              <textarea
                rows={3}
                value={beat.goal || ''}
                onChange={(e) => onUpdateMiniCard(idx, 'goal', e.target.value)}
                placeholder="Write new story stuff..."
                className="w-full flex-1 min-h-[58px] bg-white border border-slate-200 focus:border-blue-500 rounded p-1 text-[10px] text-slate-900 resize-none leading-tight focus:outline-none"
              />
              <button
                type="button"
                onClick={() => onOpenGuidedSpark(beat)}
                className="w-full py-1 px-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold rounded text-[9px] flex items-center justify-center gap-1 transition cursor-pointer shadow-2xs"
              >
                <Lightbulb className="w-3 h-3 text-amber-600 shrink-0" />
                <span>Idea Gen</span>
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center -my-0.5"><div className="w-0.5 h-2.5 border-l-2 border-dashed border-blue-400" /></div>

      <div className="bg-slate-100/90 border border-slate-300 rounded-lg p-2 opacity-60 text-slate-500 select-none space-y-0.5">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
          <span className="line-through">{parentLabel} (Original Card)</span>
          <span className="text-[9px] uppercase font-mono bg-slate-200 px-1 rounded">Greyed Out</span>
        </div>
        <div className="text-[11px] font-bold text-slate-600 truncate">{card.actTitle || 'Act Summary'}</div>
        <p className="text-[10px] text-slate-500 line-clamp-2 italic">{card.goal || 'No act notes.'}</p>
      </div>
    </div>
  );
};
