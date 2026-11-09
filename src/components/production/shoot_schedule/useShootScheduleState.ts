import { useState, useMemo, useEffect } from 'react';
import { ScreenplayDocument, CharacterInfo, ScheduleRowItem, CallSheetData } from '../../../types';
import { deriveScheduleRowsFromScript } from './scheduleRowGenerator';
import { sortExteriorScenesFirst, createBlankShotLine, deriveNextChildSceneNumber } from './scheduleRowOps';
import { getDefaultCallSheetData } from './defaultShootData';
import { calculateDateRangeDays } from './multiDayOps';
import { sortRowsChronologically, recalculateSequentialTimes } from './scheduleTimingOps';
import { executeSchedulePrint } from './schedulePrintOps';
import { deleteSelectedRows, insertRowBelow, reorderRowItems } from './scheduleCrudOps';
import { ScheduleFilterType, ScheduleViewMode } from './ShootScheduleTitleBanner';
import { createShootShotsHandlers } from './useShootShotsState';
import { moveRowsToDay, moveRowsToNewDay } from './multiDayMoveOps';
import { recalculateRowDurationsAndProceedingTimes } from './shotDurationShiftHelper';
import { syncScheduleWithScript } from './scheduleScriptSyncOps';
import { createScheduleContactHandlers } from './useScheduleContacts';
import { useWorkingHoursState } from './useWorkingHoursState';
import { useLocationPromptState } from './useLocationPromptState';
import { usePrioritySortState } from './usePrioritySortState';
import { filterRowsByUnit, getExistingUnitsList, MAX_UNITS } from './multiUnitOps';
import { UnitPrintMode } from './PrintExportModal';
import { create24HourTimeHandlers } from './use24HourTimeHandlers';
import { repositionAndResolveClashes24h } from './chronologicalRowSortHelper';

export function useShootScheduleState(
  script: ScreenplayDocument, characters: CharacterInfo[],
  onChangeScript: (updated: ScreenplayDocument) => void, watermarkLogoUrl?: string
) {
  const [callData, setCallData] = useState<CallSheetData>(() => syncScheduleWithScript(script.callSheetData || getDefaultCallSheetData(script), script, characters));
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number; rowId: string } | null>(null);
  const [timeWheelTarget, setTimeWheelTarget] = useState<{ rowId: string; time: string; description: string } | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [ganttViewMode, setGanttViewMode] = useState<'CURRENT' | 'ALL'>('CURRENT');
  const [scheduleViewMode, setScheduleViewMode] = useState<ScheduleViewMode>('DAILY');

  useEffect(() => { setCallData((prev) => syncScheduleWithScript(prev, script, characters)); }, [script.shots, script.elements, script.productionNotes, script.characterBibles]);

  const activeDayNumber = callData.activeDayNumber || 1;
  const days = useMemo(() => callData.days?.length ? callData.days : calculateDateRangeDays(callData.dateFrom || '2026-11-05', callData.dateTo || '2026-11-05', undefined, callData.rows), [callData.days, callData.dateFrom, callData.dateTo, callData.rows]);
  const activeDay = days.find((d) => d.dayNumber === activeDayNumber) || days[0];

  const fullListRows = useMemo(() => days.flatMap((d) => (d.rows || [])), [days]);
  const rawRows = scheduleViewMode === 'FULL_LIST' ? fullListRows : (activeDay?.rows || []);

  const activeUnitFilter = callData.activeUnitFilter || 'ALL';
  const unitsCount = callData.unitsCount || 1;
  const unitsList = useMemo(() => getExistingUnitsList(fullListRows, unitsCount), [fullListRows, unitsCount]);
  const rows = useMemo(() => filterRowsByUnit(rawRows, activeUnitFilter), [rawRows, activeUnitFilter]);

  const update = (updated: Partial<CallSheetData>) => { const next = { ...callData, ...updated }; setCallData(next); onChangeScript({ ...script, callSheetData: next }); };
  const updateActiveDayRows = (newRows: ScheduleRowItem[]) => { const sorted = sortRowsChronologically(newRows); update({ days: days.map((d) => (d.dayNumber === activeDayNumber ? { ...d, rows: sorted } : d)), rows: sorted }); };
  const updateActiveDayRowsRaw = (newRows: ScheduleRowItem[]) => { update({ days: days.map((d) => (d.dayNumber === activeDayNumber ? { ...d, rows: newRows } : d)), rows: newRows }); };

  const workingHours = useWorkingHoursState(days, activeDayNumber, update);
  const locationPrompt = useLocationPromptState(days, update);
  const prioritySort = usePrioritySortState(script, characters, days, activeDayNumber, scheduleViewMode, update);
  const timeHandlers = create24HourTimeHandlers(rawRows, updateActiveDayRowsRaw);

  return {
    rows, rawRows, days, activeDayNumber, activeDay, dateFrom: callData.dateFrom || '2026-11-05', dateTo: callData.dateTo || '2026-11-05',
    directorName: callData.directorName || script.author || 'Director', producerName: callData.producerName || 'Producer',
    activeUnitFilter, unitsCount, unitsList,
    handleSelectUnitFilter: (unit: number | 'ALL') => update({ activeUnitFilter: unit }),
    handleCreateNewUnit: () => update({ unitsCount: Math.min(MAX_UNITS, unitsCount + 1) }),
    handleCreateAndAssignRowToUnit: (rowId: string) => { const u = Math.min(MAX_UNITS, unitsCount + 1); const target = rawRows.find((r) => r.id === rowId); const next = rawRows.map((r) => (r.id === rowId ? { ...r, unitNumber: u } : r)); const timed = repositionAndResolveClashes24h(next, rowId, target?.time || '08:00'); update({ unitsCount: u, days: days.map((d) => (d.dayNumber === activeDayNumber ? { ...d, rows: timed } : d)), rows: timed }); },
    handleAssignSelectedToUnit: (unitNum: number) => { updateActiveDayRowsRaw(rawRows.map((r) => selectedRowIds.has(r.id) ? { ...r, unitNumber: unitNum } : r)); setSelectedRowIds(new Set()); },
    handleCreateAndAssignUnit: () => { const u = Math.min(MAX_UNITS, unitsCount + 1); update({ unitsCount: u, days: days.map((d) => (d.dayNumber === activeDayNumber ? { ...d, rows: rawRows.map((r) => selectedRowIds.has(r.id) ? { ...r, unitNumber: u } : r) } : d)), rows: rawRows.map((r) => selectedRowIds.has(r.id) ? { ...r, unitNumber: u } : r) }); setSelectedRowIds(new Set()); },
    ...createScheduleContactHandlers(callData, update), ...workingHours, ...locationPrompt, ...prioritySort, ...timeHandlers,
    scheduleViewMode, handleToggleViewMode: (mode: ScheduleViewMode) => { setScheduleViewMode(mode); if (mode === 'FULL_LIST') setGanttViewMode('ALL'); },
    activeFilter: (callData.activeFilter || 'ALL') as ScheduleFilterType,
    selectedRowIds, contextMenu, timeWheelTarget, isPrintModalOpen, setContextMenu, setTimeWheelTarget, setIsPrintModalOpen,
    activeActorCount: useMemo(() => { const s = new Set<string>(); rows.forEach((r) => r.characterTags?.forEach((c) => s.add(c.toUpperCase()))); return s.size; }, [rows]),
    handleSelectFilter: (f: ScheduleFilterType) => { update({ activeFilter: f }); if (f === 'CAST' || f === 'LOCATION') prioritySort.handleOpenPriorityDrawer(f); },
    handleAutoSortExtFirst: () => updateActiveDayRows(sortExteriorScenesFirst(rows)),
    handleChangeDateFrom: (f: string) => update({ dateFrom: f, days: calculateDateRangeDays(f, callData.dateTo || f, days, rows) }),
    handleChangeDateTo: (t: string) => update({ dateTo: t, days: calculateDateRangeDays(callData.dateFrom || t, t, days, rows) }),
    handleSelectDay: (num: number) => update({ activeDayNumber: num }),
    handleToggleRestDay: (num: number) => update({ days: days.map((d) => (d.dayNumber === num ? { ...d, isRestDay: !d.isRestDay } : d)) }),
    handleChangeDirector: (name: string) => update({ directorName: name }), handleChangeProducer: (name: string) => update({ producerName: name }),
    handleToggleSelectRow: (id: string) => setSelectedRowIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }),
    handleToggleSelectAll: () => setSelectedRowIds(selectedRowIds.size === rows.length ? new Set() : new Set(rows.map((r) => r.id))),
    handleDeleteSelected: () => { updateActiveDayRows(deleteSelectedRows(rows, selectedRowIds)); setSelectedRowIds(new Set()); },
    handleClearSelection: () => setSelectedRowIds(new Set()),
    handleMoveSelectedToDay: (t: number) => { update({ days: moveRowsToDay(days, activeDayNumber, t, selectedRowIds) }); setSelectedRowIds(new Set()); },
    handleMoveSelectedToNewDay: () => { const { nextDays, newDateTo } = moveRowsToNewDay(days, activeDayNumber, selectedRowIds); update({ days: nextDays, dateTo: newDateTo }); setSelectedRowIds(new Set()); },
    handleAddLineBelow: (rowId: string) => updateActiveDayRowsRaw(recalculateSequentialTimes(insertRowBelow(rows, rowId, createBlankShotLine(deriveNextChildSceneNumber(rows, rowId))))),
    handleDeleteRow: (id: string) => updateActiveDayRows(rows.filter((r) => r.id !== id)),
    handleUpdateField: (id: string, field: keyof ScheduleRowItem, val: any) => {
      const targetRow = rawRows.find((r) => r.id === id);
      const next = rawRows.map((r) => (r.id === id ? { ...r, [field]: val } : r));
      if (field === 'durationHours') updateActiveDayRows(recalculateRowDurationsAndProceedingTimes(next, id));
      else if (field === 'time' || field === 'unitNumber') updateActiveDayRowsRaw(repositionAndResolveClashes24h(next, id, (field === 'time' ? val : targetRow?.time) || '08:00'));
      else updateActiveDayRowsRaw(next);
    },
    handleReorderRows: (sourceId: string, targetId: string) => { const reordered = reorderRowItems(rows, sourceId, targetId); const timed = recalculateSequentialTimes(reordered); updateActiveDayRowsRaw(timed); },
    ...createShootShotsHandlers(rows, updateActiveDayRows), ganttViewMode, handleToggleGanttViewMode: (mode: 'CURRENT' | 'ALL') => setGanttViewMode(mode),
    handleAutoFillFromScript: () => { const gen = deriveScheduleRowsFromScript(script, characters); if (gen.length > 0) updateActiveDayRows(gen); },
    handlePrintCurrentDay: (unitOption?: { mode: UnitPrintMode; unitNumber?: number }) => executeSchedulePrint(script.title, [activeDay], false, callData, script.author, watermarkLogoUrl, unitOption), handlePrintAllDays: (unitOption?: { mode: UnitPrintMode; unitNumber?: number }) => executeSchedulePrint(script.title, days, true, callData, script.author, watermarkLogoUrl, unitOption),
  };
}
