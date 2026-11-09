import { ScheduleRowItem } from '../../../types';
import { recalculateSequentialTimes } from './scheduleTimingOps';

export type PrioritySortMode = 'CAST' | 'LOCATION';

export function sortRowsByCastPriority(
  rows: ScheduleRowItem[],
  priorityCastList: string[]
): ScheduleRowItem[] {
  const rankMap = new Map<string, number>();
  priorityCastList.forEach((name, idx) => {
    rankMap.set(name.toUpperCase().trim(), idx);
  });

  const getSceneCastRank = (row: ScheduleRowItem): number => {
    if (row.type !== 'SCENE') return -1;
    if (!row.characterTags || row.characterTags.length === 0) return 999999;
    let minRank = 999999;
    row.characterTags.forEach((char) => {
      const cUpper = char.toUpperCase().trim();
      rankMap.forEach((rank, key) => {
        if (cUpper === key || cUpper.includes(key) || key.includes(cUpper)) {
          if (rank < minRank) minRank = rank;
        }
      });
    });
    return minRank;
  };

  const sceneRows = rows.filter((r) => r.type === 'SCENE');
  const nonSceneRows = rows.filter((r) => r.type !== 'SCENE');

  const sortedScenes = [...sceneRows].map((row, originalIndex) => ({
    row,
    rank: getSceneCastRank(row),
    originalIndex,
  })).sort((a, b) => (a.rank !== b.rank ? a.rank - b.rank : a.originalIndex - b.originalIndex))
    .map((item) => item.row);

  return recalculateSequentialTimes(combineScenesAndBreaks(sortedScenes, nonSceneRows));
}

export function sortRowsByLocationPriority(
  rows: ScheduleRowItem[],
  priorityLocationList: string[]
): ScheduleRowItem[] {
  const rankMap = new Map<string, number>();
  priorityLocationList.forEach((loc, idx) => {
    rankMap.set(loc.toUpperCase().trim(), idx);
  });

  const getSceneLocRank = (row: ScheduleRowItem): number => {
    if (row.type !== 'SCENE') return -1;
    if (!row.location) return 999999;
    const locClean = row.location.toUpperCase().trim();
    let minRank = 999999;
    rankMap.forEach((rank, key) => {
      if (locClean === key || locClean.includes(key) || key.includes(locClean)) {
        if (rank < minRank) minRank = rank;
      }
    });
    return minRank;
  };

  const sceneRows = rows.filter((r) => r.type === 'SCENE');
  const nonSceneRows = rows.filter((r) => r.type !== 'SCENE');

  const sortedScenes = [...sceneRows].map((row, originalIndex) => ({
    row,
    rank: getSceneLocRank(row),
    originalIndex,
  })).sort((a, b) => (a.rank !== b.rank ? a.rank - b.rank : a.originalIndex - b.originalIndex))
    .map((item) => item.row);

  return recalculateSequentialTimes(combineScenesAndBreaks(sortedScenes, nonSceneRows));
}

function combineScenesAndBreaks(scenes: ScheduleRowItem[], breaks: ScheduleRowItem[]): ScheduleRowItem[] {
  const callBreak = breaks.find((b) => b.description?.toLowerCase().includes('call')) || breaks[0];
  const lunchBreak = breaks.find((b) => b.description?.toLowerCase().includes('lunch'));
  const otherBreaks = breaks.filter((b) => b !== callBreak && b !== lunchBreak);

  const result: ScheduleRowItem[] = [];
  if (callBreak) result.push(callBreak);

  const half = Math.ceil(scenes.length / 2);
  result.push(...scenes.slice(0, half));
  if (lunchBreak) result.push(lunchBreak);
  result.push(...scenes.slice(half));
  result.push(...otherBreaks);

  return result;
}
