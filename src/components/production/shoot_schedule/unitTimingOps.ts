import { ScheduleRowItem } from '../../../types';
import { parseMinutesFromTimeStr, formatTimeStrFromMinutes } from './scheduleTimingOps';

export function recalculateMultiUnitRowTimes(rows: ScheduleRowItem[]): ScheduleRowItem[] {
  if (rows.length === 0) return rows;

  // Track next available time per unit
  const unitCurrentMins: Record<number, number> = {};
  let masterStartMins = parseMinutesFromTimeStr(rows[0].time || '07:00 AM');

  return rows.map((row) => {
    if (row.type === 'BREAK' || !row.sceneNumber) {
      const breakMins = parseMinutesFromTimeStr(row.time);
      masterStartMins = Math.max(masterStartMins, breakMins + Math.round((row.durationHours || 0.5) * 60));
      return row;
    }

    const unitKey = row.unitNumber || 1;
    if (unitCurrentMins[unitKey] === undefined) {
      unitCurrentMins[unitKey] = masterStartMins;
    }

    const assignedTime = formatTimeStrFromMinutes(unitCurrentMins[unitKey]);
    const durationMins = Math.max(15, Math.round((row.durationHours || 1.0) * 60));
    unitCurrentMins[unitKey] += durationMins;

    return { ...row, time: assignedTime };
  });
}

export function shiftUnitRowTimes(
  rows: ScheduleRowItem[],
  changedRowId: string,
  newTimeStr: string
): ScheduleRowItem[] {
  const targetRow = rows.find((r) => r.id === changedRowId);
  if (!targetRow) return rows;

  const targetUnit = targetRow.unitNumber || 1;
  const oldMins = parseMinutesFromTimeStr(targetRow.time);
  const newMins = parseMinutesFromTimeStr(newTimeStr);
  const delta = newMins - oldMins;

  let targetFound = false;

  return rows.map((r) => {
    if (r.id === changedRowId) {
      targetFound = true;
      return { ...r, time: newTimeStr };
    }
    if (!targetFound) return r;

    // Only shift rows within the same unit or shared breaks
    if (r.type === 'BREAK' || (r.unitNumber || 1) === targetUnit) {
      const curMins = parseMinutesFromTimeStr(r.time);
      return { ...r, time: formatTimeStrFromMinutes(curMins + delta) };
    }
    return r;
  });
}
