import { ScheduleRowItem, ShootScheduleDaySheet } from '../../../types';
import { sortRowsChronologically } from './scheduleTimingOps';

export function moveRowsToDay(
  days: ShootScheduleDaySheet[],
  activeDayNum: number,
  targetDayNum: number,
  selectedRowIds: Set<string>
): ShootScheduleDaySheet[] {
  const activeDay = days.find((d) => d.dayNumber === activeDayNum);
  const targetDay = days.find((d) => d.dayNumber === targetDayNum);
  if (!activeDay || !targetDay || selectedRowIds.size === 0) return days;

  const rowsToMove = activeDay.rows.filter((r) => selectedRowIds.has(r.id));
  const remainingRows = activeDay.rows.filter((r) => !selectedRowIds.has(r.id));
  const newTargetRows = sortRowsChronologically([...targetDay.rows, ...rowsToMove]);

  return days.map((d) => {
    if (d.dayNumber === activeDayNum) return { ...d, rows: remainingRows };
    if (d.dayNumber === targetDayNum) return { ...d, rows: newTargetRows };
    return d;
  });
}

export function moveRowsToNewDay(
  days: ShootScheduleDaySheet[],
  activeDayNum: number,
  selectedRowIds: Set<string>
): { nextDays: ShootScheduleDaySheet[]; newDateTo: string } {
  const activeDay = days.find((d) => d.dayNumber === activeDayNum);
  if (!activeDay || selectedRowIds.size === 0) {
    return { nextDays: days, newDateTo: days[days.length - 1]?.dateStr || '2026-11-05' };
  }

  const rowsToMove = activeDay.rows.filter((r) => selectedRowIds.has(r.id));
  const remainingRows = activeDay.rows.filter((r) => !selectedRowIds.has(r.id));

  const lastDay = days[days.length - 1];
  const lastDate = new Date(lastDay?.dateStr || '2026-11-05');
  const nextDateObj = new Date(lastDate.getTime() + 86400000);
  const nextDateStr = nextDateObj.toISOString().split('T')[0];
  const newDayNum = (lastDay?.dayNumber || days.length) + 1;

  const newDaySheet: ShootScheduleDaySheet = {
    dayNumber: newDayNum,
    dateStr: nextDateStr,
    title: `Day ${newDayNum}`,
    isRestDay: false,
    rows: sortRowsChronologically(rowsToMove),
  };

  const nextDays = days.map((d) => (d.dayNumber === activeDayNum ? { ...d, rows: remainingRows } : d)).concat(newDaySheet);
  return { nextDays, newDateTo: nextDateStr };
}
