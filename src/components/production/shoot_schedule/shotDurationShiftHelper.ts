import { ScheduleRowItem } from '../../../types';
import { parseMinutesFromTimeStr, formatTimeStrFromMinutes } from './scheduleTimingOps';

export function recalculateRowDurationsAndProceedingTimes(
  rows: ScheduleRowItem[],
  changedRowId?: string
): ScheduleRowItem[] {
  let currentTimeMins = 0;

  return rows.map((row, idx) => {
    const rowStartMins = parseMinutesFromTimeStr(row.time);
    if (idx === 0) {
      currentTimeMins = rowStartMins;
    } else if (currentTimeMins > rowStartMins) {
      // Overlap detected: push proceeding item forward so there is no collision
      row = { ...row, time: formatTimeStrFromMinutes(currentTimeMins) };
    } else {
      currentTimeMins = rowStartMins;
    }

    // Check if total estimated shots time exceeds durationHours
    const shotsTotalMins = (row.shots || []).reduce(
      (sum, s) => sum + (s.estimatedTimeMinutes !== undefined ? s.estimatedTimeMinutes : 30),
      0
    );

    let durationHours = row.durationHours || 1.0;
    if (shotsTotalMins > 0) {
      const shotsRequiredHours = Math.ceil((shotsTotalMins / 60) * 2) / 2; // snap to nearest 0.5h
      if (shotsRequiredHours > durationHours) {
        durationHours = shotsRequiredHours;
      }
    }

    currentTimeMins = parseMinutesFromTimeStr(row.time) + Math.round(durationHours * 60);
    return { ...row, durationHours };
  });
}
