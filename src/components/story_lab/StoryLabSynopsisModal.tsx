import React, { useState } from 'react';
import { X, Copy, Check, FileText } from 'lucide-react';
import { StoryArcCard, SubPlotTrack } from '../../types';
import { getSubPlotPalette } from './subPlotOps';

interface StoryLabSynopsisModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: StoryArcCard[];
  subPlots?: SubPlotTrack[];
  audienceEmotion?: string;
  title?: string;
}

export const StoryLabSynopsisModal: React.FC<StoryLabSynopsisModalProps> = ({
  isOpen, onClose, cards, subPlots = [], audienceEmotion = '', title = 'Screenplay',
}) => {
  const [copied, setCopied] = useState(false);
  const [filterId, setFilterId] = useState<'ALL' | 'MAIN' | string>('ALL');
  if (!isOpen) return null;

  const formatCards = (list: StoryArcCard[]) =>
    list.map((c, i) => `ACT ${i + 1}${c.actTitle ? `: ${c.actTitle}` : ''}\n${c.goal?.trim() || 'No notes defined yet.'}`).join('\n\n');

  const sections: { id: string; label: string; color: string; emotion?: string; cards: StoryArcCard[] }[] = [
    ...(filterId === 'ALL' || filterId === 'MAIN' ? [{ id: 'MAIN', label: 'Main Story', color: '#B45309', emotion: audienceEmotion, cards }] : []),
    ...subPlots.filter((sp) => filterId === 'ALL' || filterId === sp.id).map((sp) => ({
      id: sp.id, label: sp.name, color: getSubPlotPalette(sp.color).border, emotion: sp.audienceEmotion, cards: sp.cards,
    })),
  ];

  const fullSynopsis = `${title.toUpperCase()} — SYNOPSIS\n\n${sections.map((s) => `${s.label.toUpperCase()}${s.emotion ? ` (Feeling: ${s.emotion})` : ''}\n${formatCards(s.cards)}`).join('\n\n---\n\n')}`;

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(fullSynopsis); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* noop */ }
  };

  return (
    <div className="fixed inset-0 z-70 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 font-sans">
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-3 text-[#0F172A] flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 shrink-0">
          <div className="flex items-center gap-2"><FileText className="w-5 h-5 text-amber-600" /><h3 className="font-extrabold text-base text-slate-900">Story Synopsis</h3></div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        {subPlots.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            {[{ id: 'ALL', label: 'All Plots' }, { id: 'MAIN', label: 'Main Story' }, ...subPlots.map((sp) => ({ id: sp.id, label: sp.name }))].map((tab) => (
              <button key={tab.id} type="button" onClick={() => setFilterId(tab.id)} className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${filterId === tab.id ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}>
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-4 bg-[#FAF7EC] border border-amber-200/80 rounded-xl p-4 text-xs leading-relaxed font-serif select-text text-slate-900">
          <p className="font-bold text-sm text-slate-900 uppercase font-sans border-b border-amber-200/60 pb-2">{title}</p>
          {sections.map((sec) => (
            <div key={sec.id} className="space-y-2.5 pb-2 border-b border-amber-200/40 last:border-b-0">
              <div className="font-sans font-black text-xs uppercase tracking-wide flex items-center gap-2" style={{ color: sec.color }}>
                <span>{sec.label}</span>
                {sec.emotion && <span className="text-[11px] font-semibold text-slate-600 normal-case">· Audience Feeling: {sec.emotion}</span>}
              </div>
              {sec.cards.map((c, i) => (
                <div key={c.id || i} className="space-y-0.5 pl-2">
                  <h4 className="font-sans font-bold text-slate-900 text-xs">Act {i + 1}{c.actTitle ? ` • ${c.actTitle}` : ''}</h4>
                  <p className="whitespace-pre-wrap text-slate-800">{c.goal?.trim() || 'No notes recorded.'}</p>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
          <button type="button" onClick={handleCopy} className="px-3.5 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition cursor-pointer">
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Synopsis'}</span>
          </button>
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-black text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition cursor-pointer shadow-xs">Close</button>
        </div>
      </div>
    </div>
  );
};
