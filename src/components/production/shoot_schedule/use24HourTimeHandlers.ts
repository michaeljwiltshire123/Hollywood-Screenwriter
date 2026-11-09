import { ScheduleRowItem } from '../../../types';
import { repositionAndResolveClashes24h } from './chronologicalRowSortHelper';

export function create24HourTimeHandlers(
  rawRows: ScheduleRowItem[],
  updateActiveDayRowsRaw: (newRows: ScheduleRowItem[]) => void
) {
  return {
    handleSet24HourTimeDirect: (rowId: string, newTimeStr: string) => {
      const updated = repositionAndResolveClashes24h(rawRows, rowId, newTimeStr);
      updateActiveDayRowsRaw(updated);
    },
  };
}
