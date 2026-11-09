import React, { useState } from 'react';
import { GripVertical, Plus } from 'lucide-react';

interface RowDragHandleWithGhostPlusProps {
  onAddLineBelow: () => void;
  onDragStart: (e: React.DragEvent) => void;
}

export const RowDragHandleWithGhostPlus: React.FC<RowDragHandleWithGhostPlusProps> = ({
  onAddLineBelow,
  onDragStart,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex flex-col items-center justify-center gap-0.5 py-0.5 w-full group/handle"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = 'move';
          onDragStart(e);
        }}
        className="p-0.5 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 rounded transition"
        title="Click and drag to reorder scene"
      >
        <GripVertical className="w-3.5 h-3.5" />
      </div>

      <button
        id="tour-row-add-plus"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onAddLineBelow();
        }}
        className={`w-4 h-4 border border-dashed border-sky-400 bg-sky-50/90 hover:bg-sky-100 text-sky-700 rounded flex items-center justify-center transition-all cursor-pointer ${
          isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
        }`}
        title="Insert blank line directly below"
      >
        <Plus className="w-2.5 h-2.5 stroke-[2.5]" />
      </button>
    </div>
  );
};
