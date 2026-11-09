import { useState, useMemo } from 'react';
import { ScreenplayDocument, CharacterInfo, CallSheetData } from '../../../types';
import { PrioritySortMode, sortRowsByCastPriority, sortRowsByLocationPriority } from './prioritySortOps';
import { ScheduleViewMode } from './ShootScheduleTitleBanner';

export function usePrioritySortState(
  script: ScreenplayDocument,
  characters: CharacterInfo[],
  days: NonNullable<CallSheetData['days']>,
  activeDayNumber: number,
  scheduleViewMode: ScheduleViewMode,
  updateCallData: (updated: Partial<CallSheetData>) => void
) {
  const [isPriorityDrawerOpen, setIsPriorityDrawerOpen] = useState(false);
  const [priorityMode, setPriorityMode] = useState<PrioritySortMode>('CAST');

  const castList = useMemo(() => {
    const list: string[] = [];
    days.forEach((d) => {
      (d.rows || []).forEach((r) => {
        r.characterTags?.forEach((c) => {
          const upper = c?.trim().toUpperCase();
          if (upper && !list.includes(upper)) list.push(upper);
        });
      });
    });
    script.elements.forEach((el) => {
      if (el.type === 'CHARACTER' && el.content?.trim()) {
        const name = el.content.trim().toUpperCase();
        if (!list.includes(name)) list.push(name);
      }
    });
    characters.forEach((c) => {
      const name = c.name.trim().toUpperCase();
      if (name && !list.includes(name)) list.push(name);
    });
    return list;
  }, [days, script.elements, characters]);

  const locationList = useMemo(() => {
    const list: string[] = [];
    days.forEach((d) => {
      (d.rows || []).forEach((r) => {
        if (r.location?.trim()) {
          const upper = r.location.trim().toUpperCase();
          if (!list.includes(upper)) list.push(upper);
        }
      });
    });
    script.elements.forEach((el) => {
      if (el.type === 'SCENE HEADING' && el.content?.trim()) {
        const cleanLoc = el.content.replace(/^(INT\.|EXT\.|INT\/EXT\.)\s*/i, '').split('-')[0].trim().toUpperCase();
        if (cleanLoc && !list.includes(cleanLoc)) list.push(cleanLoc);
      }
    });
    return list;
  }, [days, script.elements]);

  const handleOpenPriorityDrawer = (mode: PrioritySortMode) => {
    setPriorityMode(mode);
    setIsPriorityDrawerOpen(true);
  };

  const handleApplyPrioritySort = (mode: PrioritySortMode, orderedItems: string[]) => {
    const sortFn = mode === 'CAST' ? sortRowsByCastPriority : sortRowsByLocationPriority;

    if (scheduleViewMode === 'FULL_LIST') {
      const updatedDays = days.map((d) => ({
        ...d,
        rows: sortFn(d.rows || [], orderedItems),
      }));
      const currentDayRows = updatedDays.find((d) => d.dayNumber === activeDayNumber)?.rows || updatedDays[0]?.rows || [];
      updateCallData({ days: updatedDays, rows: currentDayRows, activeFilter: mode });
    } else {
      const targetDay = days.find((d) => d.dayNumber === activeDayNumber) || days[0];
      const sortedRows = sortFn(targetDay?.rows || [], orderedItems);
      const updatedDays = days.map((d) => (d.dayNumber === activeDayNumber ? { ...d, rows: sortedRows } : d));
      updateCallData({ days: updatedDays, rows: sortedRows, activeFilter: mode });
    }

    setIsPriorityDrawerOpen(false);
  };

  const scopeText = scheduleViewMode === 'FULL_LIST' ? 'Full Schedule' : `Day ${activeDayNumber}`;

  return {
    isPriorityDrawerOpen,
    priorityMode,
    scopeText,
    initialPriorityItems: priorityMode === 'CAST' ? castList : locationList,
    handleOpenPriorityDrawer,
    handleClosePriorityDrawer: () => setIsPriorityDrawerOpen(false),
    handleApplyPrioritySort,
  };
}
