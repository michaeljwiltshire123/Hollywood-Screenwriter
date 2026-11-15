import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Check, Layers } from 'lucide-react';
import { SubPlotTrack } from '../../types';
import { getSubPlotPalette } from './subPlotOps';

interface PlotSwitcherDropdownProps {
  subPlots: SubPlotTrack[];
  activeSubPlotId: string | null;
  onSelectSubPlot: (id: string | null) => void;
  onCreateSubPlot: () => void;
}

export const PlotSwitcherDropdown: React.FC<PlotSwitcherDropdownProps> = ({
  subPlots, activeSubPlotId, onSelectSubPlot, onCreateSubPlot,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const activeSub = subPlots.find((s) => s.id === activeSubPlotId) || null;
  const activePalette = activeSub ? getSubPlotPalette(activeSub.color) : null;

  return (
    <div className="relative shrink-0 font-sans" ref={ref}>
      <button
        type="button" onClick={() => setIsOpen((p) => !p)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer shadow-2xs hover:opacity-95"
        style={{ backgroundColor: activePalette ? activePalette.bgTint : '#FFFBEB', borderColor: activePalette ? activePalette.border : '#F59E0B', color: activePalette ? activePalette.badgeText : '#78350F' }}
        title="Show Main Story with sub-plot rows below, or focus on a single Sub-Plot"
      >
        {activePalette ? <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: activePalette.border }} /> : <Layers className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
        <span className="whitespace-nowrap">{activeSub ? activeSub.name : 'Main Story'}</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-70 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1.5 space-y-1 animate-in fade-in duration-100">
          <button
            type="button" onClick={() => { onSelectSubPlot(null); setIsOpen(false); }}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${!activeSubPlotId ? 'bg-amber-50 text-amber-950' : 'text-slate-700 hover:bg-slate-50'}`}
          >
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" /><span>Main Story</span></span>
            {!activeSubPlotId && <Check className="w-3.5 h-3.5 text-amber-600" />}
          </button>

          {subPlots.map((sp) => {
            const pal = getSubPlotPalette(sp.color);
            const selected = sp.id === activeSubPlotId;
            return (
              <button
                key={sp.id} type="button" onClick={() => { onSelectSubPlot(sp.id); setIsOpen(false); }}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer hover:bg-slate-50"
                style={{ backgroundColor: selected ? pal.bgTint : undefined, color: selected ? pal.badgeText : '#334155' }}
              >
                <span className="flex items-center gap-2 truncate"><span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: pal.border }} /><span className="truncate">{sp.name}</span></span>
                {selected && <Check className="w-3.5 h-3.5 shrink-0" style={{ color: pal.border }} />}
              </button>
            );
          })}

          <div className="h-px bg-slate-100 my-1" />
          <button
            type="button" onClick={() => { onCreateSubPlot(); setIsOpen(false); }}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-extrabold text-amber-900 bg-amber-50/70 hover:bg-amber-100 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-amber-600 shrink-0" /><span>Create New Sub-Plot</span>
          </button>
        </div>
      )}
    </div>
  );
};
