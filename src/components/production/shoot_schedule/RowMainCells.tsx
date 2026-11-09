import React, { useState } from 'react';
import { ScheduleRowItem } from '../../../types';
import { SmartChipDropdown } from './SmartChipDropdown';
import { ActorPillList } from './ActorBadgePills';
import { LocationBadge } from './LocationBadgePills';
import { NotesCell } from './NotesCell';

interface RowMainCellsProps {
  row: ScheduleRowItem;
  isScene: boolean;
  isLocationFilterActive: boolean;
  onUpdateField: (id: string, field: keyof ScheduleRowItem, val: any) => void;
  onLocationChangePrompt?: (sceneSetting: string, sceneNumber: string, locationVal: string) => void;
  unitsList?: number[];
  onCreateUnitRow?: (rowId: string) => void;
}

export const RowMainCells: React.FC<RowMainCellsProps> = ({
  row, isScene, isLocationFilterActive, onUpdateField, onLocationChangePrompt,
  unitsList = [1], onCreateUnitRow = (_rowId: string) => {},
}) => {
  const [prevLocationVal, setPrevLocationVal] = useState(row.description || '');

  const handleLocationBlur = (e: React.FocusEvent<HTMLInputElement>) => { const v = e.target.value.trim(); if (v && v !== prevLocationVal && onLocationChangePrompt && row.location) { setPrevLocationVal(v); onLocationChangePrompt(row.location, row.sceneNumber || '1', v); } };

  return (
    <>
      <td id="tour-row-unit-chip" className="p-0.5 border-r border-slate-200 text-center w-10">
        <SmartChipDropdown type="UNIT" unitNumber={row.unitNumber} unitsList={unitsList} onUnitChange={(newUnit) => onUpdateField(row.id, 'unitNumber', newUnit)} onCreateUnit={() => onCreateUnitRow(row.id)} />
      </td>

      <td className="p-1 border-r border-slate-200 text-center w-16">
        {row.intExt ? <SmartChipDropdown type="INT_EXT" value={row.intExt} onChange={(val) => { onUpdateField(row.id, 'intExt', val); onUpdateField(row.id, 'isExterior', val.toLowerCase().startsWith('ext')); }} /> : <span className="text-slate-300 font-mono text-xs">—</span>}
      </td>

      <td className="p-1.5 border-r border-slate-200 w-44">
        <LocationBadge location={row.location} isHighlighted={isLocationFilterActive} />
      </td>

      <td className="p-1.5 border-r border-slate-200 min-w-[180px]">
        <input id="tour-row-location-input" type="text" value={row.description && row.description !== row.location ? row.description : (isScene ? '' : (row.description || ''))} onChange={(e) => onUpdateField(row.id, 'description', e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } }} onBlur={handleLocationBlur} className={`bg-transparent hover:bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 rounded px-1.5 py-0.5 w-full ${isScene ? 'font-medium text-slate-900' : 'text-slate-500 italic'}`} placeholder={isScene ? 'Type filming location / address...' : 'Break description...'} />
      </td>

      <td className="p-1 border-r border-slate-200 text-center w-20">
        {row.dayNight ? (
          <SmartChipDropdown type="DAY_NIGHT" value={row.dayNight} onChange={(val) => onUpdateField(row.id, 'dayNight', val)} />
        ) : (
          <span className="text-slate-300 font-mono text-xs">—</span>
        )}
      </td>

      <td className="p-1.5 border-r border-slate-200 min-w-[150px]">
        <ActorPillList
          characters={row.characterTags}
          onChangeCharacters={(newChars) => onUpdateField(row.id, 'characterTags', newChars)}
        />
      </td>

      <td id="tour-row-notes-cell" className="p-1.5 min-w-[180px] text-slate-700">
        <NotesCell notes={row.notes} onUpdateNotes={(val) => onUpdateField(row.id, 'notes', val)} />
      </td>
    </>
  );
};
