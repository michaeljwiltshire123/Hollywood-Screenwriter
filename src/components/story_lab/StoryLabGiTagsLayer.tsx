import React, { useEffect } from 'react';
import { SelectedFortuneNode, TimelineTagPoint } from './characterFortuneTypes';

interface StoryLabGiTagsLayerProps {
  points: TimelineTagPoint[];
  canvasHeight?: number;
  targetMinutes?: number;
  activeDragNode: SelectedFortuneNode | null;
  selectedNode: SelectedFortuneNode | null;
  onStartDrag: (node: SelectedFortuneNode) => void;
  onDeleteNode: (charId: string, nodeId: string) => void;
}

export const StoryLabGiTagsLayer: React.FC<StoryLabGiTagsLayerProps> = ({
  points, canvasHeight = 340, targetMinutes = 90, activeDragNode, selectedNode, onStartDrag, onDeleteNode,
}) => {
  useEffect(() => {
    if (!selectedNode) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        onDeleteNode(selectedNode.charId, selectedNode.nodeId);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedNode, onDeleteNode]);

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-visible z-30">
      {points.map((pt) => {
        const centerY = canvasHeight / 2;
        const maxDelta = centerY - 28;
        const topPct = ((centerY - (pt.fortune / 100) * maxDelta) / canvasHeight) * 100;
        const isDragging = activeDragNode?.charId === pt.characterId && activeDragNode?.nodeId === pt.nodeId;
        const isSelected = selectedNode?.charId === pt.characterId && selectedNode?.nodeId === pt.nodeId;
        const approxMin = Math.round((pt.percentX / 100) * Math.max(1, targetMinutes));
        const openBelow = topPct < 24;
        const alignClass = pt.percentX < 18 ? 'left-0' : pt.percentX > 82 ? 'right-0' : 'left-1/2 -translate-x-1/2';

        return (
          <div
            key={`${pt.characterId}-${pt.nodeId}`}
            style={{ left: `${pt.percentX}%`, top: `${topPct}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 group pointer-events-auto cursor-grab active:cursor-grabbing ${isSelected || isDragging ? 'z-50' : 'z-30 hover:z-40'}`}
            onMouseDown={(e) => {
              if (e.button !== 0) return;
              e.stopPropagation();
              e.preventDefault();
              onStartDrag({ charId: pt.characterId, nodeId: pt.nodeId });
            }}
          >
            <div
              className={`w-4 h-4 rounded-full border-2 border-white shadow-md transition-transform select-none ${
                isDragging || isSelected ? 'scale-125 ring-2 ring-slate-900 ring-offset-1' : 'hover:scale-125'
              }`}
              style={{ backgroundColor: pt.characterColor }}
              title={`${pt.characterName} (~${approxMin}m, ${pt.fortune > 0 ? `+${pt.fortune}%` : `${pt.fortune}%`}): Drag to move, Del to delete`}
            />

            <div className={`absolute ${openBelow ? 'top-full mt-2' : 'bottom-full mb-2'} ${alignClass} hidden group-hover:flex flex-col items-center whitespace-nowrap z-50 pointer-events-none`}>
              <div className="bg-slate-950 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xl border border-slate-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: pt.characterColor }} />
                <span className="text-amber-300">{pt.characterName}</span>
                <span className="font-mono text-[10px] text-slate-300 tabular-nums">~{approxMin}m · {pt.fortune > 0 ? `+${pt.fortune}%` : `${pt.fortune}%`}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
