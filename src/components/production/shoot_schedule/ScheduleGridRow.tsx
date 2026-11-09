import React from 'react';
import { ScheduleRowItem, ShotSetupItem } from '../../../types';
import { RowDragHandleWithGhostPlus } from './RowDragHandleWithGhostPlus';
import { RowMainCells } from './RowMainCells';
import { ScheduleFilterType } from './ShootScheduleTitleBanner';
import { Clock, ChevronDown, ChevronRight } from 'lucide-react';
import { ShotSubRowsList } from './ShotSubRowsList';
import { getRowBg } from './scheduleGridRowHelpers';

import { ensure24HourTimeStr } from './schedule24HourTimingOps';

interface ScheduleGridRowProps {
  row: ScheduleRowItem;
  isSelected: boolean;
  activeFilter: ScheduleFilterType;
  isHighlightModeActive: boolean;
  onLocationChangePrompt?: (sceneSetting: string, sceneNumber: string, locationVal: string) => void;
  onToggleSelect: (id: string) => void;
  onAddLineBelow: (id: string) => void;
  onContextMenu: (e: React.MouseEvent, id: string) => void;
  onUpdateField: (id: string, field: keyof ScheduleRowItem, val: any) => void;
  onOpenTimeWheel: (rowId: string, currentTime: string, description: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetId: string) => void;
  onToggleExpand: (id: string) => void;
  onAddShot: (rowId: string) => void;
  onDeleteShot: (rowId: string, shotId: string) => void;
  onUpdateShot: (rowId: string, shotId: string, field: keyof ShotSetupItem, val: any) => void;
  unitsList?: number[];
  onCreateUnitRow?: (rowId: string) => void;
}

export const ScheduleGridRow: React.FC<ScheduleGridRowProps> = ({
  row, isSelected, activeFilter, isHighlightModeActive, onLocationChangePrompt, onToggleSelect,
  onAddLineBelow, onContextMenu, onUpdateField, onOpenTimeWheel,
  onDragStart, onDragOver, onDrop, onToggleExpand, onAddShot, onDeleteShot, onUpdateShot,
  unitsList, onCreateUnitRow,
}) => {
  const isScene = row.type === 'SCENE' || Boolean(row.sceneNumber);
  const shotCount = row.shots?.length || 0;

  return (
    <React.Fragment>
      <tr
        onContextMenu={(e) => onContextMenu(e, row.id)}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, row.id)}
        className={`border-b border-slate-200 text-xs transition-colors ${getRowBg(row, isHighlightModeActive, activeFilter, isSelected)}`}
      >
        <td className="p-1.5 text-center border-r border-slate-200 w-8">
          <input type="checkbox" checked={isSelected} onChange={() => onToggleSelect(row.id)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
        </td>
        <td id="tour-row-drag-handle" className="p-1 text-center border-r border-slate-200 w-8">
          <RowDragHandleWithGhostPlus onAddLineBelow={() => onAddLineBelow(row.id)} onDragStart={(e) => onDragStart(e, row.id)} />
        </td>
        <td className="p-1 border-r border-slate-200 font-medium text-slate-800 whitespace-nowrap w-20 text-center">
          <button id="tour-row-time-btn" type="button" onClick={() => onOpenTimeWheel(row.id, row.time, row.description)} className="w-full font-mono font-bold text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded px-1 py-0.5 inline-flex items-center justify-center gap-1 transition cursor-pointer" title="Click to select filming time">
            <span>{ensure24HourTimeStr(row.time)}</span>
            <Clock className="w-3 h-3 opacity-40 shrink-0" />
          </button>
        </td>
        <td id={isScene ? "tour-scene-shots-btn" : undefined} className="p-1 text-center border-r border-slate-200 font-bold text-slate-900 w-14">
          <div className="flex items-center justify-center gap-1">
            {isScene && (
              <button type="button" onClick={() => onToggleExpand(row.id)} className="text-sky-600 hover:text-sky-800 p-0.5 rounded hover:bg-sky-50 transition cursor-pointer" title={row.isExpanded ? 'Collapse shot list' : 'Expand camera shot list'}>
                {row.isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            )}
            <input type="text" value={row.sceneNumber} onChange={(e) => onUpdateField(row.id, 'sceneNumber', e.target.value)} className="bg-transparent hover:bg-white focus:bg-white focus:outline-none text-center font-bold w-6" placeholder="—" />
            {shotCount > 0 && <span onClick={() => isScene && onToggleExpand(row.id)} className="text-[10px] font-mono bg-sky-100 text-sky-800 px-1 rounded cursor-pointer" title={`${shotCount} shots configured`}>{shotCount}s</span>}
          </div>
        </td>
        <RowMainCells row={row} isScene={isScene} isLocationFilterActive={isHighlightModeActive && activeFilter === 'LOCATION'} onUpdateField={onUpdateField} onLocationChangePrompt={onLocationChangePrompt} unitsList={unitsList} onCreateUnitRow={onCreateUnitRow} />
      </tr>

      {row.isExpanded && isScene && (
        <ShotSubRowsList shots={row.shots} onAddShot={() => onAddShot(row.id)} onDeleteShot={(shotId) => onDeleteShot(row.id, shotId)} onUpdateShot={(shotId, field, val) => onUpdateShot(row.id, shotId, field, val)} />
      )}
    </React.Fragment>
  );
};
