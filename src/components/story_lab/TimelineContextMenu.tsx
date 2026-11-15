import React, { useEffect } from 'react';
import { Plus, Activity } from 'lucide-react';
import { SubPlotTrack } from '../../types';
import { CharacterFortuneOption } from './characterFortuneTypes';
import { getSubPlotPalette } from './subPlotOps';

interface TimelineContextMenuProps {
  x: number;
  y: number;
  percentX: number;
  fortuneY: number;
  approxMinutes: number;
  subPlots: SubPlotTrack[];
  selectedCharacters: CharacterFortuneOption[];
  fallbackCharacter?: CharacterFortuneOption;
  activeCharId?: string | null;
  onSelectTrack: (trackId: string) => void;
  onAddFortuneNode: (charId: string) => void;
  onClose: () => void;
}

export const TimelineContextMenu: React.FC<TimelineContextMenuProps> = ({
  x, y, percentX, fortuneY, approxMinutes, subPlots, selectedCharacters,
  fallbackCharacter, activeCharId, onSelectTrack, onAddFortuneNode, onClose,
}) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    const onClick = () => onClose();
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('mousedown', onClick); };
  }, [onClose]);

  const safeX = typeof window !== 'undefined' ? Math.min(x, window.innerWidth - 268) : x;
  const safeY = typeof window !== 'undefined' ? Math.min(y, window.innerHeight - 280) : y;
  const orderedChars = [...selectedCharacters].sort((a, b) => (a.id === activeCharId ? -1 : b.id === activeCharId ? 1 : 0));

  return (
    <div style={{ left: safeX, top: safeY }} onMouseDown={(e) => e.stopPropagation()} className="fixed z-50 w-64 rounded-xl border border-slate-200 bg-white shadow-2xl py-1.5 font-sans text-slate-800 animate-in fade-in duration-100">
      <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center justify-between">
        <span>Pin Story Card</span>
        <span className="font-mono text-amber-700 tabular-nums">~{approxMinutes}m ({percentX}%)</span>
      </div>

      <button type="button" onClick={() => { onSelectTrack('main'); onClose(); }} className="w-full px-3 py-1.5 text-left text-xs font-bold hover:bg-amber-50 flex items-center gap-2 transition cursor-pointer">
        <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 shrink-0" /><Plus className="w-3.5 h-3.5 text-amber-600 shrink-0" /><span className="truncate">Add Card to Main Story</span>
      </button>

      {subPlots.map((sp) => {
        const pal = getSubPlotPalette(sp.color);
        return (
          <button key={sp.id} type="button" onClick={() => { onSelectTrack(sp.id); onClose(); }} className="w-full px-3 py-1.5 text-left text-xs font-bold hover:bg-slate-50 flex items-center gap-2 transition cursor-pointer">
            <span className="w-2.5 h-2.5 rounded-xs shrink-0" style={{ backgroundColor: pal.border }} /><Plus className="w-3.5 h-3.5 shrink-0" style={{ color: pal.border }} /><span className="truncate">Add Card to {sp.name}</span>
          </button>
        );
      })}

      {(orderedChars.length > 0 || fallbackCharacter) && (
        <>
          <div className="my-1 border-t border-slate-100 px-3 pt-1.5 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Add Fortune Node</span>
            <span className="font-mono text-slate-500 tabular-nums">{fortuneY > 0 ? `+${fortuneY}%` : `${fortuneY}%`}</span>
          </div>
          {orderedChars.length > 0 ? orderedChars.map((ch) => (
            <button key={ch.id} type="button" onClick={() => { onAddFortuneNode(ch.id); onClose(); }} className="w-full px-3 py-1.5 text-left text-xs font-bold hover:bg-slate-50 flex items-center gap-2 transition cursor-pointer">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: ch.color }} />
              <Activity className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{ch.name}</span>
              {ch.id === activeCharId && orderedChars.length > 1 && <span className="ml-auto text-[9px] text-amber-700 font-extrabold">Selected</span>}
            </button>
          )) : fallbackCharacter && (
            <button type="button" onClick={() => { onAddFortuneNode(fallbackCharacter.id); onClose(); }} className="w-full px-3 py-1.5 text-left text-xs font-bold hover:bg-slate-50 flex items-center gap-2 transition cursor-pointer">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: fallbackCharacter.color }} />
              <Activity className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">Show &amp; Add for {fallbackCharacter.name}</span>
            </button>
          )}
        </>
      )}
    </div>
  );
};
