import { format24HourTimeStr, parse24HourMinutes } from './schedule24HourTimingOps';

export interface TimeSlotOption {
  timeStr: string;
  minutes: number;
  label: string;
}

export function generate24HourTimeSlots(): TimeSlotOption[] {
  const slots: TimeSlotOption[] = [];
  // 06:00 (360 mins) through 23:45 (1425 mins)
  for (let mins = 360; mins < 1440; mins += 15) {
    const timeStr = format24HourTimeStr(mins);
    slots.push({
      timeStr,
      minutes: mins,
      label: timeStr,
    });
  }
  return slots;
}

export function findClosestTimeSlotIndex(targetTimeStr: string, slots: TimeSlotOption[]): number {
  const targetMins = parse24HourMinutes(targetTimeStr);
  let closestIdx = 0;
  let minDiff = Infinity;

  slots.forEach((slot, idx) => {
    const diff = Math.abs(slot.minutes - targetMins);
    if (diff < minDiff) {
      minDiff = diff;
      closestIdx = idx;
    }
  });

  return closestIdx;
}
