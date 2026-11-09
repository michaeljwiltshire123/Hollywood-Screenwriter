import { ScheduleRowItem } from '../../../types';

export function deleteSelectedRows(rows: ScheduleRowItem[], selectedIds: Set<string>): ScheduleRowItem[] {
  return rows.filter((r) => !selectedIds.has(r.id));
}

export function insertRowBelow(rows: ScheduleRowItem[], targetId: string, newRow: ScheduleRowItem): ScheduleRowItem[] {
  const idx = rows.findIndex((r) => r.id === targetId);
  const next = [...rows];
  if (idx >= 0) next.splice(idx + 1, 0, newRow);
  else next.push(newRow);
  return next;
}

export function reorderRowItems(rows: ScheduleRowItem[], sourceId: string, targetId: string): ScheduleRowItem[] {
  const sIdx = rows.findIndex((r) => r.id === sourceId);
  const tIdx = rows.findIndex((r) => r.id === targetId);
  if (sIdx < 0 || tIdx < 0) return rows;
  const next = [...rows];
  const [item] = next.splice(sIdx, 1);
  next.splice(tIdx, 0, item);
  return next;
}
