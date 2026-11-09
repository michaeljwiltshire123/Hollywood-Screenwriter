import { ScheduleRowItem } from '../../../types';

export function parse24HourMinutes(timeStr: string): number {
  if (!timeStr) return 420; // Default 07:00
  const clean = timeStr.trim();
  const ampmMatch = clean.match(/AM|PM/i);
  const isPM = ampmMatch && ampmMatch[0].toUpperCase() === 'PM';
  const isAM = ampmMatch && ampmMatch[0].toUpperCase() === 'AM';

  const numbersOnly = clean.replace(/[^0-9:]/g, '');
  const parts = numbersOnly.split(':');
  let hr = parseInt(parts[0], 10) || 0;
  const min = parseInt(parts[1], 10) || 0;

  if (isPM && hr < 12) hr += 12;
  if (isAM && hr === 12) hr = 0;

  // Clamp within 24h day (0 to 1439 mins)
  const normalized = ((hr * 60 + min) % 1440 + 1440) % 1440;
  return normalized;
}

export function format24HourTimeStr(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hr = Math.floor(normalized / 60);
  const min = normalized % 60;
  return `${hr < 10 ? `0${hr}` : hr}:${min < 10 ? `0${min}` : min}`;
}

export function ensure24HourTimeStr(timeStr: string): string {
  if (!timeStr) return '07:00';
  return format24HourTimeStr(parse24HourMinutes(timeStr));
}

export function sortRowsBy24HourTime(rows: ScheduleRowItem[]): ScheduleRowItem[] {
  return [...rows].sort((a, b) => parse24HourMinutes(a.time) - parse24HourMinutes(b.time));
}
