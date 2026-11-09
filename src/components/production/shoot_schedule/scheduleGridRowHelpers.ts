import { ScheduleRowItem } from '../../../types';
import { ScheduleFilterType } from './ShootScheduleTitleBanner';

export function getRowBg(
  row: ScheduleRowItem,
  isHighlight: boolean,
  filter: ScheduleFilterType,
  isSel: boolean
): string {
  if (isSel) return 'bg-blue-50/80';
  if (!isHighlight) return 'hover:bg-slate-50/80';
  if (filter === 'CAST' && row.characterTags?.length) return 'bg-amber-50/70 border-l-4 border-l-amber-400';
  if (filter === 'LOCATION' && row.location) return 'bg-teal-50/70 border-l-4 border-l-teal-400';
  return 'hover:bg-slate-50/80';
}
