import React, { useState } from 'react';
import { X, Plus, ArrowLeftRight, SlidersHorizontal, Lightbulb } from 'lucide-react';
import { StoryArcCard } from '../../types';
import { getSubPlotPalette } from './subPlotOps';
import { SubPlotPocketBridge } from './storyLabTypes';
import { SideSlideSubPlotSettings } from './SideSlideSubPlotSettings';

interface SideSlideSubPlotCardProps {
  actIndex: number;
  defaultSide: 'left' | 'right';
  pocket: SubPlotPocketBridge;
}

export const SideSlideSubPlotCard: React.FC<SideSlideSubPlotCardProps> = ({ actIndex, defaultSide, pocket }) => {
  const [showSettings, setShowSettings] = useState(false);
  const activeSub = pocket.pocketSubPlot || pocket.subPlots[0];
  if (!activeSub) return null;

  const pal = getSubPlotPalette(activeSub.color);
  const subCard: StoryArcCard = activeSub.cards[actIndex] || { id: `${activeSub.id}-act-${actIndex + 1}`, actTitle: '', goal: '' };
  const side = pocket.slideOverride || defaultSide;
  const sidePos = side === 'right' ? 'md:left-[calc(100%+10px)] slide-in-from-left-2' : 'md:right-[calc(100%+10px)] slide-in-from-right-2';

  return (
    <div
      className={`mt-2 md:mt-0 md:absolute md:top-0 md:bottom-0 md:w-[calc(100%+14px)] md:min-w-[290px] z-40 rounded-xl border-2 p-2.5 flex flex-col space-y-1.5 shadow-2xl font-sans animate-in fade-in duration-150 ${sidePos}`}
      style={{ borderColor: pal.border, backgroundColor: pal.bgTint }}
    >
      <div className="flex items-center justify-between gap-1 border-b pb-1.5" style={{ borderColor: `${pal.border}33` }}>
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar min-w-0">
          {pocket.subPlots.map((sp) => {
            const p = getSubPlotPalette(sp.color);
            const isCur = sp.id === activeSub.id;
            return (
              <button
                key={sp.id} type="button" onClick={() => pocket.onTogglePocket(actIndex, sp.id)}
                className="px-2 py-0.5 rounded text-[11px] font-bold border transition cursor-pointer whitespace-nowrap shrink-0"
                style={{ backgroundColor: isCur ? p.border : '#FFFFFF', borderColor: p.border, color: isCur ? '#FFFFFF' : p.badgeText }}
              >
                {sp.name}
              </button>
            );
          })}
          <button type="button" onClick={() => pocket.onCreateForPocket(actIndex)} title="New Sub-Plot" className="p-1 rounded border border-dashed border-slate-300 bg-white/80 hover:bg-white text-slate-600 cursor-pointer shrink-0">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          <button type="button" onClick={() => pocket.onFlipSide(defaultSide)} title={`Flip card to ${side === 'right' ? 'left' : 'right'} side`} className="hidden md:inline-flex p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-white/70 transition cursor-pointer">
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={() => setShowSettings((v) => !v)} title="Rename, recolour, feeling, or delete" className={`p-1 rounded transition cursor-pointer ${showSettings ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900 hover:bg-white/70'}`}>
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={pocket.onClosePocket} title="Tuck pocket closed" className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-white/70 transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showSettings && (
        <SideSlideSubPlotSettings subPlot={activeSub} palette={pal} onRename={pocket.onRename} onChangeColor={pocket.onChangeColor} onChangeEmotion={pocket.onChangeEmotion} onDelete={pocket.onDelete} />
      )}

      <div className="flex items-center gap-1.5">
        <span className="text-[11px] font-black shrink-0" style={{ color: pal.badgeText }}>Act {actIndex + 1} ·</span>
        <input type="text" value={subCard.actTitle || ''} onChange={(e) => pocket.onUpdateCard(activeSub.id, actIndex, 'actTitle', e.target.value)} placeholder={`${activeSub.name} Act ${actIndex + 1} title...`} className="font-bold text-xs bg-white/90 border rounded px-2 py-1 text-slate-900 w-full focus:outline-none" style={{ borderColor: `${pal.border}44` }} />
      </div>

      <textarea value={subCard.goal || ''} onChange={(e) => pocket.onUpdateCard(activeSub.id, actIndex, 'goal', e.target.value)} placeholder={`Write ${activeSub.name} beats beside Main Act ${actIndex + 1}...`} className="w-full flex-1 min-h-[240px] rounded-lg p-2.5 text-[13px] text-slate-900 leading-relaxed resize-none bg-white border focus:outline-none" style={{ borderColor: `${pal.border}66` }} />

      <button type="button" onClick={() => pocket.onIdeaGen(subCard, activeSub.name)} className="w-full py-1.5 rounded-lg text-[11px] font-bold border bg-white hover:opacity-95 flex items-center justify-center gap-1.5 cursor-pointer" style={{ borderColor: pal.border, color: pal.badgeText }}>
        <Lightbulb className="w-3.5 h-3.5" style={{ color: pal.border }} /><span>Idea Gen</span>
      </button>
    </div>
  );
};
