import { ScheduleRowItem, ShootScheduleDaySheet } from '../../../types';
import { parseMinutesFromTimeStr, formatTimeStrFromMinutes } from './scheduleTimingOps';

export function applyHoursAndHandleSpillover(
  days: ShootScheduleDaySheet[],
  targetDayNum: number,
  startTimeStr: string,
  wrapTimeStr: string,
  applyToAllDays: boolean
): { updatedDays: ShootScheduleDaySheet[]; spilloverNotice?: string } {
  const startMins = parseMinutesFromTimeStr(startTimeStr);
  const wrapMins = parseMinutesFromTimeStr(wrapTimeStr);
  let movedCount = 0;
  let newDayCreated = false;

  const processDayRows = (
    rows: ScheduleRowItem[],
    dayNum: number,
    nextDayRows: ScheduleRowItem[]
  ): ScheduleRowItem[] => {
    let currentMins = startMins;
    const keptRows: ScheduleRowItem[] = [];

    rows.forEach((row) => {
      const durMins = Math.round((row.durationHours || 1.0) * 60);
      const rowEndMins = currentMins + durMins;

      if (rowEndMins > wrapMins && keptRows.length > 0 && row.type === 'SCENE') {
        // Move overflowing scene to next day
        movedCount += 1;
        nextDayRows.push({ ...row, time: formatTimeStrFromMinutes(currentMins) });
      } else {
        keptRows.push({ ...row, time: formatTimeStrFromMinutes(currentMins) });
        currentMins = rowEndMins;
      }
    });

    return keptRows;
  };

  const nextDays = [...days];
  const targetDayIdx = nextDays.findIndex((d) => d.dayNumber === targetDayNum);
  if (targetDayIdx === -1) return { updatedDays: days };

  const overflowForNextDay: ScheduleRowItem[] = [];

  if (applyToAllDays) {
    for (let i = 0; i < nextDays.length; i++) {
      const overflowArr: ScheduleRowItem[] = [];
      const updatedRows = processDayRows(nextDays[i].rows || [], nextDays[i].dayNumber, overflowArr);
      nextDays[i] = { ...nextDays[i], rows: updatedRows };

      if (overflowArr.length > 0) {
        if (i + 1 < nextDays.length) {
          nextDays[i + 1] = { ...nextDays[i + 1], rows: [...overflowArr, ...(nextDays[i + 1].rows || [])] };
        } else {
          newDayCreated = true;
          nextDays.push({
            dayNumber: nextDays.length + 1,
            dateStr: `Day ${nextDays.length + 1}`,
            title: `Day ${nextDays.length + 1}`,
            isRestDay: false,
            rows: overflowArr,
          });
        }
      }
    }
  } else {
    const updatedRows = processDayRows(nextDays[targetDayIdx].rows || [], targetDayNum, overflowForNextDay);
    nextDays[targetDayIdx] = { ...nextDays[targetDayIdx], rows: updatedRows };

    if (overflowForNextDay.length > 0) {
      if (targetDayIdx + 1 < nextDays.length) {
        nextDays[targetDayIdx + 1] = {
          ...nextDays[targetDayIdx + 1],
          rows: [...overflowForNextDay, ...(nextDays[targetDayIdx + 1].rows || [])],
        };
      } else {
        newDayCreated = true;
        nextDays.push({
          dayNumber: nextDays.length + 1,
          dateStr: `Day ${nextDays.length + 1}`,
          title: `Day ${nextDays.length + 1}`,
          isRestDay: false,
          rows: overflowForNextDay,
        });
      }
    }
  }

  const notice = movedCount > 0
    ? `${movedCount} scene${movedCount > 1 ? 's' : ''} automatically moved to ${newDayCreated ? `newly created Day ${nextDays.length}` : 'the next day'} due to wrap time limit (${wrapTimeStr}).`
    : undefined;

  return { updatedDays: nextDays, spilloverNotice: notice };
}
