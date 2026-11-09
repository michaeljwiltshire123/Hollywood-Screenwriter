import React from 'react';
import { ScheduleRowItem, ShotSetupItem } from '../../../types';
import { ScheduleGridRow } from './ScheduleGridRow';
import { ScheduleFilterType } from './ShootScheduleTitleBanner';
import { Clock, ChevronDown } from 'lucide-react';

interface InteractiveScheduleGridProps {
  rows: ScheduleRowItem[];
  selectedRowIds: Set<string>;
  activeFilter: ScheduleFilterType;
  isHighlightModeActive?: boolean;
  workingHoursStr?: string;
  onOpenWorkingHoursPicker?: () => void;
  onLocationChangePrompt?: (sceneSetting: string, sceneNumber: string, locationVal: string) => void;
  onToggleSelectRow: (id: string) => void;
  onToggleSelectAll: () => void;
  onAddLineBelow: (id: string) => void;
  onContextMenu: (e: React.MouseEvent, id: string) => void;
  onUpdateField: (id: string, field: keyof ScheduleRowItem, val: any) => void;
  onOpenTimeWheel: (rowId: string, currentTime: string, description: string) => void;
  onReorderRows: (sourceId: string, targetId: string) => void;
  onToggleExpand: (id: string) => void;
  onAddShot: (rowId: string) => void;
  onDeleteShot: (rowId: string, shotId: string) => void;
  onUpdateShot: (rowId: string, shotId: string, field: keyof ShotSetupItem, val: any) => void;
  unitsList?: number[];
  onCreateUnitRow?: (rowId: string) => void;
}

export const InteractiveScheduleGrid: React.FC<InteractiveScheduleGridProps> = ({
  rows, selectedRowIds, activeFilter, isHighlightModeActive = false,
  workingHoursStr, onOpenWorkingHoursPicker, onLocationChangePrompt,
  onToggleSelectRow, onToggleSelectAll, onAddLineBelow, onContextMenu,
  onUpdateField, onOpenTimeWheel, onReorderRows, onToggleExpand, onAddShot, onDeleteShot, onUpdateShot,
  unitsList = [1], onCreateUnitRow = (_rowId: string) => {},
}) => {
  const [draggedId, setDraggedId] = React.useState<string | null>(null);
  const handleDragStart = (e: React.DragEvent, id: string) => { setDraggedId(id); e.dataTransfer.setData('text/plain', id); };
  const handleDrop = (e: React.DragEvent, targetId: string) => { e.preventDefault(); if (draggedId && draggedId !== targetId) onReorderRows(draggedId, targetId); setDraggedId(null); };
  const allSelected = rows.length > 0 && rows.every((r) => selectedRowIds.has(r.id));

  return (
    <div id="tour-schedule-table" className="overflow-x-auto bg-white border border-slate-300 shadow-sm">
      <table className="w-full text-left border-collapse font-sans text-xs">
        <thead>
          <tr className="bg-slate-900 text-slate-100 border-b border-slate-300 uppercase tracking-wider text-[11px] font-bold">
            <th className="p-1.5 text-center w-8 border-r border-slate-800"><input type="checkbox" checked={allSelected} onChange={onToggleSelectAll} className="rounded border-slate-500 text-blue-500 focus:ring-blue-400 cursor-pointer" /></th>
            <th className="p-1.5 text-center w-8 border-r border-slate-800">:::</th>
            <th className="p-1.5 border-r border-slate-800 w-20 text-center">
              <div className="flex items-center justify-between gap-1">
                <span className="font-extrabold text-slate-100">TIME</span>
                {onOpenWorkingHoursPicker && (
                  <button type="button" onClick={onOpenWorkingHoursPicker} className="whitespace-nowrap inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 hover:text-amber-200 border border-amber-400/40 hover:border-amber-400/70 transition-all cursor-pointer shadow-xs active:scale-95" title="Click to adjust daily filming hours">
                    <Clock className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                    <ChevronDown className="w-2 h-2 opacity-60 shrink-0" />
                  </button>
                )}
              </div>
            </th>
            <th className="p-1.5 text-center border-r border-slate-800 w-14">SCENE</th>
            <th className="p-1 text-center border-r border-slate-800 w-10 text-[10px]">UNIT</th>
            <th className="p-1.5 text-center border-r border-slate-800 w-16">INT/EXT</th>
            <th className="p-1.5 border-r border-slate-800 w-44">SETTING</th>
            <th className="p-1.5 border-r border-slate-800 min-w-[180px]">LOCATION</th>
            <th className="p-1.5 text-center border-r border-slate-800 w-20">DAY/NIGHT</th>
            <th className="p-1.5 border-r border-slate-800 min-w-[150px]">CAST MEMBERS</th>
            <th className="p-1.5 min-w-[180px]">NOTES</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <ScheduleGridRow key={row.id} row={row} isSelected={selectedRowIds.has(row.id)} activeFilter={activeFilter} isHighlightModeActive={isHighlightModeActive} onToggleSelect={onToggleSelectRow} onAddLineBelow={onAddLineBelow} onContextMenu={onContextMenu} onUpdateField={onUpdateField} onOpenTimeWheel={onOpenTimeWheel} onDragStart={handleDragStart} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} onToggleExpand={onToggleExpand} onAddShot={onAddShot} onDeleteShot={onDeleteShot} onUpdateShot={onUpdateShot} onLocationChangePrompt={onLocationChangePrompt} unitsList={unitsList} onCreateUnitRow={onCreateUnitRow} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
