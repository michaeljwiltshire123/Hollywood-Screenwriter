import { ScheduleRowItem } from '../../../types';
import { parse24HourMinutes, format24HourTimeStr, ensure24HourTimeStr } from './schedule24HourTimingOps';

export function repositionAndResolveClashes24h(
  rows: ScheduleRowItem[],
  changedRowId: string,
  newTimeStr: string
): ScheduleRowItem[] {
  if (rows.length === 0) return rows;
  const target24h = ensure24HourTimeStr(newTimeStr);

  const updatedRows = rows.map((r) => (r.id === changedRowId ? { ...r, time: target24h } : r));

  const breakRows = updatedRows.filter((r) => r.type === 'BREAK' || !r.sceneNumber);
  const sceneRows = updatedRows.filter((r) => r.type !== 'BREAK' && Boolean(r.sceneNumber));

  const unitGroups: Record<number, ScheduleRowItem[]> = {};
  sceneRows.forEach((r) => {
    const uNum = r.unitNumber || 1;
    if (!unitGroups[uNum]) unitGroups[uNum] = [];
    unitGroups[uNum].push({ ...r, unitNumber: uNum });
  });

  const resolvedSceneRows: ScheduleRowItem[] = [];
  Object.keys(unitGroups).forEach((unitKeyStr) => {
    const unitNum = Number(unitKeyStr);
    const uRows = unitGroups[unitNum].sort((a, b) => parse24HourMinutes(a.time) - parse24HourMinutes(b.time));

    let unitCursorMins = 0;
    uRows.forEach((row, idx) => {
      const rowStartMins = parse24HourMinutes(row.time);
      let assignedStartMins = rowStartMins;

      if (idx > 0 && assignedStartMins < unitCursorMins) {
        assignedStartMins = unitCursorMins;
      }

      const durMins = Math.max(15, Math.round((row.durationHours || 1.0) * 60));
      unitCursorMins = assignedStartMins + durMins;

      resolvedSceneRows.push({
        ...row,
        unitNumber: unitNum,
        time: format24HourTimeStr(assignedStartMins),
      });
    });
  });

  const allCombined = [
    ...breakRows.map((b) => ({ ...b, time: ensure24HourTimeStr(b.time) })),
    ...resolvedSceneRows,
  ];

  return allCombined.sort((a, b) => {
    const diff = parse24HourMinutes(a.time) - parse24HourMinutes(b.time);
    if (diff !== 0) return diff;
    if (a.type === 'BREAK' && b.type !== 'BREAK') return -1;
    if (a.type !== 'BREAK' && b.type === 'BREAK') return 1;
    return (a.unitNumber || 1) - (b.unitNumber || 1);
  });
}
