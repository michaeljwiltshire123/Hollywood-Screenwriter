import React from 'react';
import { GripVertical, ArrowUp, ArrowDown } from 'lucide-react';

interface SmartChipSortRowProps {
  id: string;
  name: string;
  index: number;
  totalCount: number;
  sceneCount: number;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
}

export const SmartChipSortRow: React.FC<SmartChipSortRowProps> = ({
  name, index, totalCount, sceneCount, onMoveUp, onMoveDown, onDragStart, onDragOver, onDrop,
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
      className="flex items-center justify-between px-2.5 py-1.5 bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 rounded-lg transition-all text-xs group cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-center gap-2 min-w-0">
        <GripVertical className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0" />
        <span className="font-mono text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded shrink-0">
          {index + 1}
        </span>
        <span className="font-semibold text-slate-800 truncate text-xs">{name}</span>
        <span className="text-[10px] text-slate-400 font-medium shrink-0">({sceneCount})</span>
      </div>

      <div className="flex items-center gap-0.5 shrink-0 opacity-60 group-hover:opacity-100 transition">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => onMoveUp(index)}
          className="p-0.5 rounded hover:bg-slate-200 disabled:opacity-20 text-slate-600 transition cursor-pointer"
          title="Move up"
        >
          <ArrowUp className="w-3 h-3" />
        </button>
        <button
          type="button"
          disabled={index === totalCount - 1}
          onClick={() => onMoveDown(index)}
          className="p-0.5 rounded hover:bg-slate-200 disabled:opacity-20 text-slate-600 transition cursor-pointer"
          title="Move down"
        >
          <ArrowDown className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
