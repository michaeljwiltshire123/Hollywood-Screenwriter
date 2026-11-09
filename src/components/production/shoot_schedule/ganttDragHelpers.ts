import React from 'react';
import { formatTimeStrFromMinutes, parseMinutesFromTimeStr } from './scheduleTimingOps';

export function handleLeftHandleDrag(
  e: React.PointerEvent<HTMLDivElement>,
  evtId: string,
  evtTime: string,
  evtDuration: number,
  trackEl: HTMLDivElement | null,
  dayStart: number,
  totalHours: number,
  onUpdateTime?: (rowId: string, newTime: string) => void,
  onUpdateDuration?: (rowId: string, newDur: number) => void
) {
  e.stopPropagation();
  if (!onUpdateTime || !onUpdateDuration || !trackEl) return;
  const origStartMins = parseMinutesFromTimeStr(evtTime);
  const origDur = evtDuration || 1.0;
  const origEndMins = origStartMins + origDur * 60;

  const onPointerMove = (mv: PointerEvent) => {
    const rect = trackEl.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, mv.clientX - rect.left));
    const targetHour = dayStart + (x / rect.width) * totalHours;
    const newStartMins = Math.round((targetHour * 60) / 15) * 15;
    if (newStartMins < origEndMins - 30) {
      const newDur = (origEndMins - newStartMins) / 60;
      onUpdateTime(evtId, formatTimeStrFromMinutes(newStartMins));
      onUpdateDuration(evtId, Math.round(newDur * 2) / 2);
    }
  };

  const onPointerUp = () => {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  };

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
}

export function handleRightHandleDrag(
  e: React.PointerEvent<HTMLDivElement>,
  evtId: string,
  evtTime: string,
  trackEl: HTMLDivElement | null,
  dayStart: number,
  totalHours: number,
  onUpdateDuration?: (rowId: string, newDur: number) => void
) {
  e.stopPropagation();
  if (!onUpdateDuration || !trackEl) return;
  const origStartMins = parseMinutesFromTimeStr(evtTime);

  const onPointerMove = (mv: PointerEvent) => {
    const rect = trackEl.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, mv.clientX - rect.left));
    const targetHour = dayStart + (x / rect.width) * totalHours;
    const newEndMins = Math.round((targetHour * 60) / 15) * 15;
    if (newEndMins > origStartMins + 30) {
      const newDur = (newEndMins - origStartMins) / 60;
      onUpdateDuration(evtId, Math.max(0.5, Math.min(6.0, Math.round(newDur * 2) / 2)));
    }
  };

  const onPointerUp = () => {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  };

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
}
