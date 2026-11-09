import { ScheduleRowItem } from '../../../types';

export function sortExteriorScenesFirst(rows: ScheduleRowItem[]): ScheduleRowItem[] {
  const breaks = rows.filter((r) => r.type === 'BREAK' || !r.sceneNumber);
  const scenes = rows.filter((r) => r.type !== 'BREAK' && Boolean(r.sceneNumber));
  const extScenes = scenes.filter((s) => s.isExterior || s.intExt?.toLowerCase().startsWith('ext'));
  const intScenes = scenes.filter((s) => !s.isExterior && !s.intExt?.toLowerCase().startsWith('ext'));
  const callBreak = breaks.find((b) => b.description?.toLowerCase().includes('call')) || breaks[0];
  const lunchBreak = breaks.find((b) => b.description?.toLowerCase().includes('lunch'));
  const otherBreaks = breaks.filter((b) => b !== callBreak && b !== lunchBreak);
  const reordered: ScheduleRowItem[] = [];
  if (callBreak) reordered.push(callBreak);
  reordered.push(...extScenes);
  if (lunchBreak) reordered.push(lunchBreak);
  reordered.push(...intScenes);
  reordered.push(...otherBreaks);
  return reordered;
}

export function deriveNextChildSceneNumber(rows: ScheduleRowItem[], targetRowId: string): string {
  const targetIdx = rows.findIndex((r) => r.id === targetRowId);
  if (targetIdx < 0) return '1.1';

  const targetRow = rows[targetIdx];
  let parentNum = targetRow.sceneNumber?.trim();

  if (!parentNum) {
    for (let i = targetIdx - 1; i >= 0; i--) {
      if (rows[i].sceneNumber?.trim()) {
        parentNum = rows[i].sceneNumber.trim();
        break;
      }
    }
  }

  if (!parentNum) return '1.1';

  const prefix = `${parentNum}.`;
  let maxSubNum = 0;

  rows.forEach((r) => {
    const sNum = r.sceneNumber?.trim();
    if (sNum && sNum.startsWith(prefix)) {
      const rest = sNum.slice(prefix.length);
      const firstSegment = parseInt(rest.split('.')[0], 10);
      if (!isNaN(firstSegment) && firstSegment > maxSubNum) {
        maxSubNum = firstSegment;
      }
    }
  });

  return `${parentNum}.${maxSubNum + 1}`;
}

export function createBlankShotLine(sceneNumber: string = ''): ScheduleRowItem {
  return {
    id: `row-custom-${Date.now()}`,
    time: '00:00',
    sceneNumber,
    intExt: 'Int',
    description: '',
    dayNight: 'Day',
    notes: '',
    characterTags: [],
    propTags: [],
    isExterior: false,
    type: 'SCENE',
    durationHours: 1.0,
  };
}
