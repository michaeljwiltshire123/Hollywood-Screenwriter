import { ScheduleRowItem } from '../../../types';
import { parse24HourMinutes, format24HourTimeStr } from './schedule24HourTimingOps';

export function parseMinutesFromTimeStr(timeStr: string): number {
  return parse24HourMinutes(timeStr);
}

export function formatTimeStrFromMinutes(totalMinutes: number): string {
  return format24HourTimeStr(totalMinutes);
}

export function cascadeShiftSubsequentRows(
  rows: ScheduleRowItem[],
  changedRowId: string,
  newTimeStr: string
): ScheduleRowItem[] {
  const targetIdx = rows.findIndex((r) => r.id === changedRowId);
  if (targetIdx < 0) return rows;

  const oldMins = parseMinutesFromTimeStr(rows[targetIdx].time);
  const newMins = parseMinutesFromTimeStr(newTimeStr);
  const delta = newMins - oldMins;

  return rows.map((r, i) => {
    if (i < targetIdx) return r;
    if (i === targetIdx) return { ...r, time: newTimeStr };
    const curMins = parseMinutesFromTimeStr(r.time);
    return { ...r, time: formatTimeStrFromMinutes(curMins + delta) };
  });
}

export function repositionRowChronologically(
  rows: ScheduleRowItem[],
  changedRowId: string,
  newTimeStr: string
): ScheduleRowItem[] {
  const targetIdx = rows.findIndex((r) => r.id === changedRowId);
  if (targetIdx < 0) return rows;

  const updatedTarget = { ...rows[targetIdx], time: newTimeStr };
  const others = rows.filter((r) => r.id !== changedRowId);
  const newMins = parseMinutesFromTimeStr(newTimeStr);

  const insertIdx = others.findIndex((r) => parseMinutesFromTimeStr(r.time) > newMins);
  const next = [...others];
  if (insertIdx < 0) next.push(updatedTarget);
  else next.splice(insertIdx, 0, updatedTarget);
  return next;
}

export function sortRowsChronologically(rows: ScheduleRowItem[]): ScheduleRowItem[] {
  return [...rows].sort((a, b) => parseMinutesFromTimeStr(a.time) - parseMinutesFromTimeStr(b.time));
}

export function recalculateSequentialTimes(rows: ScheduleRowItem[]): ScheduleRowItem[] {
  if (rows.length === 0) return rows;
  let currentMins = parseMinutesFromTimeStr(rows[0].time || '07:00 AM');
  return rows.map((r, i) => {
    if (i === 0) return r;
    const prev = rows[i - 1];
    const durationMins = Math.max(15, Math.round((prev.durationHours || 1.0) * 60));
    currentMins += durationMins;
    return { ...r, time: formatTimeStrFromMinutes(currentMins) };
  });
}

