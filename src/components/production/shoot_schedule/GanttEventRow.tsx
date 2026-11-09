import React, { useRef } from 'react';
import { Coffee, Flag, GripHorizontal } from 'lucide-react';
import { ScheduleRowItem } from '../../../types';
import { handleLeftHandleDrag, handleRightHandleDrag } from './ganttDragHelpers';
import { getGanttBarColor } from './unitGanttColorOps';
import { getUnitShortLabel } from './multiUnitOps';

import { ensure24HourTimeStr } from './schedule24HourTimingOps';

export interface GanttEventItem extends ScheduleRowItem {
  startHour: number;
  endHour: number;
}

interface GanttEventRowProps {
  evt: GanttEventItem;
  dayStart: number;
  totalHours: number;
  isMultiUnitView?: boolean;
  onUpdateTime?: (rowId: string, newTime: string) => void;
  onUpdateDuration?: (rowId: string, newDur: number) => void;
}

export const GanttEventRow: React.FC<GanttEventRowProps> = ({
  evt, dayStart, totalHours, isMultiUnitView = true, onUpdateTime, onUpdateDuration,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const startOffset = Math.max(0, ((evt.startHour - dayStart) / totalHours) * 100);
  const widthPct = Math.min(100 - startOffset, ((evt.durationHours || 1.0) / totalHours) * 100);
  const isBreak = evt.type === 'BREAK' || !evt.sceneNumber;
  const barColor = getGanttBarColor(evt, isMultiUnitView);
  const displayTime = ensure24HourTimeStr(evt.time);

  return (
    <div className="grid grid-cols-12 gap-2 items-center p-1.5 bg-slate-50 border border-slate-200 rounded hover:border-slate-300 transition font-sans">
      <div className="col-span-4 pr-2 border-r border-slate-200 flex items-center justify-between gap-1 min-w-0">
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold text-slate-800 truncate flex items-center gap-1.5">
            {isBreak ? <Coffee className="w-3.5 h-3.5 text-amber-600 shrink-0" /> : <Flag className="w-3.5 h-3.5 text-sky-600 shrink-0" />}
            <span className="truncate">{evt.description || displayTime}</span>
            {evt.unitNumber && (
              <span className="px-1 py-0.2 text-[9px] font-mono rounded bg-slate-200 text-slate-700 font-bold shrink-0">
                {getUnitShortLabel(evt.unitNumber)}
              </span>
            )}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {displayTime} ({evt.durationHours || 1}h)
          </div>
        </div>
      </div>

      <div ref={trackRef} className="col-span-8 relative h-7 bg-slate-200/80 rounded overflow-hidden">
        <div
          id="tour-gantt-event-bar"
          className={`absolute top-0 bottom-0 rounded px-3 py-0.5 border shadow-2xs flex items-center justify-between text-[10px] truncate ${barColor} select-none`}
          style={{ left: `${startOffset}%`, width: `${Math.max(8, widthPct)}%` }}
        >
          <div
            onPointerDown={(e) => handleLeftHandleDrag(e, evt.id, evt.time, evt.durationHours || 1.0, trackRef.current, dayStart, totalHours, onUpdateTime, onUpdateDuration)}
            className="absolute left-0 top-0 bottom-0 w-3 cursor-w-resize bg-black/10 hover:bg-black/30 rounded-l flex items-center justify-center"
            title="Drag left edge to adjust start time"
          >
            <div className="w-0.5 h-3 bg-white/60 rounded" />
          </div>

          <div className="flex items-center gap-1 truncate px-2">
            <GripHorizontal className="w-3 h-3 opacity-60 shrink-0" />
            <span className="truncate font-bold">{evt.description}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 pr-2">
            <span className="text-[9px] font-mono opacity-95">{evt.durationHours || 1}h</span>
          </div>

          <div
            onPointerDown={(e) => handleRightHandleDrag(e, evt.id, evt.time, trackRef.current, dayStart, totalHours, onUpdateDuration)}
            className="absolute right-0 top-0 bottom-0 w-3 cursor-e-resize bg-black/10 hover:bg-black/30 rounded-r flex items-center justify-center"
            title="Drag right edge to lengthen/shorten duration"
          >
            <div className="w-0.5 h-3 bg-white/60 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};
