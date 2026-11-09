import { ScheduleRowItem } from '../../../types';

export const MAX_UNITS = 15;

export function getUnitLabel(unitNumber?: number): string {
  const u = unitNumber || 1;
  if (u === 1) return '1st Unit';
  if (u === 2) return '2nd Unit';
  if (u === 3) return '3rd Unit';
  return `${u}th Unit`;
}

export function getUnitShortLabel(unitNumber?: number, isBreak: boolean = false): string {
  if (isBreak) return '—';
  return `U${unitNumber || 1}`;
}

export const UNIT_COLOR_PALETTE: Record<number, { bg: string; text: string; border: string }> = {
  1: { bg: 'bg-sky-100/90', text: 'text-sky-900', border: 'border-sky-300' },
  2: { bg: 'bg-amber-100/90', text: 'text-amber-900', border: 'border-amber-300' },
  3: { bg: 'bg-emerald-100/90', text: 'text-emerald-900', border: 'border-emerald-300' },
  4: { bg: 'bg-purple-100/90', text: 'text-purple-900', border: 'border-purple-300' },
  5: { bg: 'bg-rose-100/90', text: 'text-rose-900', border: 'border-rose-300' },
  6: { bg: 'bg-indigo-100/90', text: 'text-indigo-900', border: 'border-indigo-300' },
  7: { bg: 'bg-teal-100/90', text: 'text-teal-900', border: 'border-teal-300' },
};

export function getUnitBadgeStyle(unitNumber?: number) {
  const u = unitNumber || 1;
  const palette = UNIT_COLOR_PALETTE[u];
  if (palette) return palette;
  return { bg: 'bg-violet-100/90', text: 'text-violet-900', border: 'border-violet-300' };
}

export function filterRowsByUnit(
  rows: ScheduleRowItem[],
  activeUnitFilter: number | 'ALL'
): ScheduleRowItem[] {
  if (activeUnitFilter === 'ALL') return rows;
  return rows.filter((r) => {
    if (r.type === 'BREAK' || !r.sceneNumber) return true;
    return (r.unitNumber || 1) === activeUnitFilter;
  });
}

export function getExistingUnitsList(rows: ScheduleRowItem[], unitsCount: number = 1): number[] {
  const units = new Set<number>([1]);
  for (let i = 1; i <= Math.max(1, unitsCount); i++) {
    units.add(i);
  }
  rows.forEach((r) => {
    if (r.unitNumber && r.unitNumber >= 1 && r.unitNumber <= MAX_UNITS) {
      units.add(r.unitNumber);
    }
  });
  return Array.from(units).sort((a, b) => a - b);
}
