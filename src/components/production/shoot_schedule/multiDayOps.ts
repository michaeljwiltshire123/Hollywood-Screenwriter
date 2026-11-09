import { ScheduleRowItem, ShootScheduleDaySheet } from '../../../types';

export function calculateDateRangeDays(
  fromStr: string,
  toStr: string,
  existingDays?: ShootScheduleDaySheet[],
  defaultRows?: ScheduleRowItem[]
): ShootScheduleDaySheet[] {
  const startDate = new Date(fromStr || '2026-11-05');
  const endDate = new Date(toStr || fromStr || '2026-11-05');
  const rawDiff = Math.round((endDate.getTime() - startDate.getTime()) / 86400000) + 1;
  const diffDays = Math.max(1, Math.min(365, isNaN(rawDiff) ? 1 : rawDiff));

  const result: ShootScheduleDaySheet[] = [];
  for (let i = 0; i < diffDays; i++) {
    const curDate = new Date(startDate.getTime() + i * 86400000);
    const dateFormatted = curDate.toISOString().split('T')[0];
    const dayNum = i + 1;

    const existing = existingDays?.find((d) => d.dayNumber === dayNum);
    if (existing) {
      result.push({ ...existing, dateStr: dateFormatted });
    } else {
      result.push({
        dayNumber: dayNum,
        dateStr: dateFormatted,
        title: `Day ${dayNum}`,
        isRestDay: false,
        rows: i === 0 && defaultRows ? defaultRows : [],
      });
    }
  }
  return result;
}

