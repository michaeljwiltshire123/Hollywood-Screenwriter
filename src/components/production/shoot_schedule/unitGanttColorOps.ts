import { ScheduleRowItem } from '../../../types';

export const GANTT_UNIT_BAR_STYLES: Record<number, string> = {
  1: 'bg-sky-500 text-white border-sky-600 font-medium',
  2: 'bg-amber-500 text-slate-950 border-amber-600 font-bold',
  3: 'bg-emerald-600 text-white border-emerald-700 font-medium',
  4: 'bg-purple-600 text-white border-purple-700 font-medium',
  5: 'bg-rose-600 text-white border-rose-700 font-medium',
  6: 'bg-indigo-600 text-white border-indigo-700 font-medium',
  7: 'bg-teal-600 text-white border-teal-700 font-medium',
};

export function getGanttBarColor(row: ScheduleRowItem, isMultiUnitView: boolean = true): string {
  const isBreak = row.type === 'BREAK' || !row.sceneNumber;
  if (isBreak) {
    return 'bg-amber-400 text-amber-950 border-amber-500 font-bold';
  }

  if (isMultiUnitView && row.unitNumber) {
    const style = GANTT_UNIT_BAR_STYLES[row.unitNumber];
    if (style) return style;
    return 'bg-violet-600 text-white border-violet-700 font-medium';
  }

  const isExt = row.isExterior || row.intExt?.toLowerCase().startsWith('ext');
  return isExt
    ? 'bg-sky-500 text-white border-sky-600 font-medium'
    : 'bg-purple-600 text-white border-purple-700 font-medium';
}
