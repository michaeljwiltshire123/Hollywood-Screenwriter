import { ScheduleRowItem } from '../../../types';
import { recalculateRowDurationsAndProceedingTimes } from './shotDurationShiftHelper';

export function createShootShotsHandlers(
  rows: ScheduleRowItem[],
  updateActiveDayRows: (nextRows: ScheduleRowItem[]) => void
) {
  const isAllShotsExpanded = rows.length > 0 && rows.every((r) => r.isExpanded);

  const applyShotsChange = (updatedRows: ScheduleRowItem[]) => {
    const adjusted = recalculateRowDurationsAndProceedingTimes(updatedRows);
    updateActiveDayRows(adjusted);
  };

  return {
    isAllShotsExpanded,
    handleToggleAllShotsExpanded: () => {
      const targetState = !isAllShotsExpanded;
      updateActiveDayRows(rows.map((r) => ({ ...r, isExpanded: targetState })));
    },
    handleToggleExpandShotList: (id: string) => {
      updateActiveDayRows(rows.map((r) => (r.id === id ? { ...r, isExpanded: !r.isExpanded } : r)));
    },
    handleAddShotSetup: (rowId: string) => {
      const next = rows.map((r) => {
        if (r.id !== rowId) return r;
        const existingCount = r.shots?.length || 0;
        const suffix = String.fromCharCode(65 + Math.min(25, existingCount));
        const newShot = {
          id: 'shot_' + Math.random().toString(36).substring(2, 9),
          shotNumber: `${r.sceneNumber || '1'}${suffix}`,
          setup: existingCount === 0 ? 'Wide Shot' : 'Medium Shot',
          lens: '',
          description: '',
          estimatedTimeMinutes: 15,
          status: 'PLANNED' as const,
        };
        return { ...r, shots: [...(r.shots || []), newShot], isExpanded: true };
      });
      applyShotsChange(next);
    },
    handleDeleteShotSetup: (rowId: string, shotId: string) => {
      const next = rows.map((r) => (r.id === rowId ? { ...r, shots: (r.shots || []).filter((s) => s.id !== shotId) } : r));
      applyShotsChange(next);
    },
    handleUpdateShotSetup: (rowId: string, shotId: string, field: string, val: any) => {
      const next = rows.map((r) => {
        if (r.id !== rowId) return r;
        return {
          ...r,
          shots: (r.shots || []).map((s) => (s.id === shotId ? { ...s, [field]: val } : s)),
        };
      });
      applyShotsChange(next);
    },
  };
}
