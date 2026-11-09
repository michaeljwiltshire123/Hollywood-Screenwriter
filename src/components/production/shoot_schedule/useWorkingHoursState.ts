import { useState } from 'react';
import { ShootScheduleDaySheet, CallSheetData } from '../../../types';
import { applyHoursAndHandleSpillover } from './workingHoursSpilloverOps';

function formatHoursCompact(timeStr: string): string {
  return timeStr
    .trim()
    .replace(/^0/, '')
    .replace(':00', '')
    .replace(/\s+/g, '')
    .toLowerCase();
}

export function useWorkingHoursState(
  days: ShootScheduleDaySheet[],
  activeDayNumber: number,
  update: (updated: Partial<CallSheetData>) => void
) {
  const [workingHoursStart, setWorkingHoursStart] = useState('07:00');
  const [workingHoursWrap, setWorkingHoursWrap] = useState('17:00');
  const [isWorkingHoursPickerOpen, setIsWorkingHoursPickerOpen] = useState(false);
  const [workingHoursChoicePending, setWorkingHoursChoicePending] = useState<{ start: string; wrap: string } | null>(null);

  const applyHours = (start: string, wrap: string, applyToAllDays: boolean) => {
    setWorkingHoursStart(start);
    setWorkingHoursWrap(wrap);
    const { updatedDays } = applyHoursAndHandleSpillover(days, activeDayNumber, start, wrap, applyToAllDays);
    update({ days: updatedDays });
  };

  const startDisplay = formatHoursCompact(workingHoursStart);
  const wrapDisplay = formatHoursCompact(workingHoursWrap);

  return {
    workingHoursStart,
    workingHoursWrap,
    workingHoursStr: `${startDisplay} – ${wrapDisplay}`,
    isWorkingHoursPickerOpen,
    setIsWorkingHoursPickerOpen,
    workingHoursChoicePending,
    setWorkingHoursChoicePending,
    handleSaveWorkingHoursPicker: (start: string, wrap: string) => {
      if (days.length > 1) {
        setWorkingHoursChoicePending({ start, wrap });
      } else {
        applyHours(start, wrap, false);
      }
    },
    handleApplyWorkingHoursCurrentDayOnly: () => {
      if (workingHoursChoicePending) {
        applyHours(workingHoursChoicePending.start, workingHoursChoicePending.wrap, false);
        setWorkingHoursChoicePending(null);
      }
    },
    handleApplyWorkingHoursUniversally: () => {
      if (workingHoursChoicePending) {
        applyHours(workingHoursChoicePending.start, workingHoursChoicePending.wrap, true);
        setWorkingHoursChoicePending(null);
      }
    },
  };
}
