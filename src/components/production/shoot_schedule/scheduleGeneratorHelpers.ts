import { ScheduleRowItem, ScreenplayDocument, CharacterInfo, ScreenplayElement } from '../../../types';

export function extractSceneCharacters(elements: ScreenplayElement[], scId: string): string[] {
  const scIdx = elements.findIndex((e) => e.id === scId);
  const nextScIdx = elements.findIndex((e, i) => i > scIdx && e.type === 'SCENE HEADING');
  const sliceEnd = nextScIdx >= 0 ? nextScIdx : elements.length;
  const block = elements.slice(scIdx, sliceEnd);
  return Array.from(
    new Set(
      block
        .filter((e) => e.type === 'CHARACTER')
        .map((e) => e.content.split('(')[0].trim().toUpperCase())
        .filter(Boolean)
    )
  );
}

export function formatClockTime(hour: number, minute: number): string {
  const hStr = String(hour).padStart(2, '0');
  const mStr = String(minute).padStart(2, '0');
  return `${hStr}:${mStr}`;
}
