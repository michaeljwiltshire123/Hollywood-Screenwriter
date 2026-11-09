import React, { useState, useEffect } from 'react';
import { X, ArrowUpDown, RefreshCw, Check } from 'lucide-react';
import { SmartChipSortRow } from './SmartChipSortRow';
import { PrioritySortMode } from './prioritySortOps';
import { ScheduleRowItem } from '../../../types';

interface SmartChipSortPopoverProps {
  isOpen: boolean;
  mode: PrioritySortMode;
  scopeText: string;
  initialItems: string[];
  scheduleRows: ScheduleRowItem[];
  onClose: () => void;
  onApplyPrioritySort: (mode: PrioritySortMode, orderedItems: string[]) => void;
}

export const SmartChipSortPopover: React.FC<SmartChipSortPopoverProps> = ({
  isOpen, mode, scopeText, initialItems, scheduleRows, onClose, onApplyPrioritySort,
}) => {
  const [items, setItems] = useState<string[]>(initialItems);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) setItems(initialItems);
  }, [isOpen]);

  if (!isOpen) return null;

  const countScenesFor = (name: string) => {
    const key = name.toUpperCase().trim();
    if (mode === 'CAST') return scheduleRows.filter((r) => r.type === 'SCENE' && r.characterTags?.some((c) => c.toUpperCase().trim() === key)).length;
    return scheduleRows.filter((r) => r.type === 'SCENE' && r.location?.toUpperCase().trim() === key).length;
  };

  const handleMove = (idx: number, delta: number) => {
    const target = idx + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(idx, 1);
    next.splice(target, 0, moved);
    setItems(next);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    const next = [...items];
    const [moved] = next.splice(draggedIndex, 1);
    next.splice(targetIndex, 0, moved);
    setItems(next);
    setDraggedIndex(null);
  };

  return (
    <div className="absolute right-0 top-full mt-2 z-40 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl p-3 text-slate-800 animate-in fade-in zoom-in-95 duration-150 font-sans">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
        <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
          <ArrowUpDown className="w-3.5 h-3.5 text-amber-500" />
          <span>Sort Priority — {mode === 'CAST' ? 'Cast' : 'Location'}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 rounded">{scopeText}</span>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"><X className="w-3.5 h-3.5" /></button>
        </div>
      </div>
      <div className="text-[11px] text-slate-500 mb-2 leading-tight">Drag items to set priority order. Scenes for higher priority items will be scheduled first.</div>
      <div className="space-y-1.5 max-h-56 overflow-y-auto pr-0.5 mb-3">
        {items.map((item, idx) => (
          <SmartChipSortRow key={item} id={item} name={item} index={idx} totalCount={items.length} sceneCount={countScenesFor(item)} onMoveUp={(i) => handleMove(i, -1)} onMoveDown={(i) => handleMove(i, 1)} onDragStart={(_, i) => setDraggedIndex(i)} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} />
        ))}
      </div>
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        <button type="button" onClick={() => onApplyPrioritySort(mode, items)} className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1 transition shadow-xs cursor-pointer active:scale-95"><Check className="w-3.5 h-3.5" /><span>Apply Sort</span></button>
        <button type="button" onClick={() => setItems(initialItems)} className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium flex items-center gap-1 transition cursor-pointer" title="Reset order"><RefreshCw className="w-3 h-3" /><span>Reset</span></button>
      </div>
    </div>
  );
};
