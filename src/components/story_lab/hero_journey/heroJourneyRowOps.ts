import { HeroJourneyBeat, HeroJourneyData, HeroJourneyStageRow, ScreenplayDocument, StoryArcCard, SubPlotTrack } from '../../../types';
import { HERO_JOURNEY_STAGES } from './heroJourneyConstants';
import { guardPageCount, syncHeroJourneyTracks } from './heroJourneyMapper';

export function getNormalizedStages(data?: HeroJourneyData): HeroJourneyStageRow[] {
  const count = data?.mainBeats?.length || 12;
  if (data?.stages && data.stages.length === count) return data.stages;
  return Array.from({ length: count }, (_, idx) => {
    const base = HERO_JOURNEY_STAGES[idx];
    return base
      ? { id: `stage-${idx + 1}`, title: base.title, actGroup: base.actGroup, promptHint: base.promptHint }
      : { id: `custom-${idx + 1}`, title: 'Custom Story Beat', actGroup: 1, promptHint: 'Custom scene or turning point.', isCustom: true };
  });
}

export function computeStagePercents(data: HeroJourneyData): number[] {
  const beats = data.mainBeats;
  const stages = getNormalizedStages(data);
  const totalPages = Math.max(1, beats.reduce((s, b) => s + guardPageCount(b.pageCount), 0));
  let cum = 0;
  return beats.map((b, i) => {
    const pages = guardPageCount(b.pageCount);
    const propX = Math.max(6, Math.min(94, Math.round(((cum + pages / 2) / totalPages) * 100)));
    cum += pages;
    return stages[i]?.timelinePercent ?? propX;
  });
}

function makeBeat(prefix: string, title: string, isTarget: boolean): HeroJourneyBeat {
  return {
    id: `${prefix}-c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: isTarget ? title : '', summary: '', pacingSpeed: 'Moderate', pageCount: 4, isEmptyPlaceholder: !isTarget,
  };
}

export function insertCustomHeroRow(
  data: HeroJourneyData, subPlots: SubPlotTrack[], insertIdx: number, targetTrackId: string, timelinePercent?: number
): { nextData: HeroJourneyData; clampedIdx: number } {
  const stages = getNormalizedStages(data);
  const clampedIdx = Math.max(0, Math.min(stages.length, insertIdx));
  const pct = timelinePercent ?? Math.round(((clampedIdx + 0.5) / Math.max(1, stages.length + 1)) * 100);
  const newStage: HeroJourneyStageRow = {
    id: `custom-${Date.now()}`, title: 'New Story Beat', actGroup: pct < 25 ? 0 : pct > 75 ? 2 : 1,
    promptHint: 'Custom beat pinned along your story timeline.', timelinePercent: pct, isCustom: true,
  };
  const nextStages = [...stages.slice(0, clampedIdx), newStage, ...stages.slice(clampedIdx)];
  const nextMain = [...data.mainBeats.slice(0, clampedIdx), makeBeat('main', 'New Story Beat', targetTrackId === 'main'), ...data.mainBeats.slice(clampedIdx)];
  const nextSubBeats: Record<string, HeroJourneyBeat[]> = {};
  subPlots.forEach((sp) => {
    const list = data.subPlotBeats[sp.id] || [];
    nextSubBeats[sp.id] = [...list.slice(0, clampedIdx), makeBeat(sp.id, 'New Story Beat', targetTrackId === sp.id), ...list.slice(clampedIdx)];
  });
  return { nextData: { stages: nextStages, mainBeats: nextMain, subPlotBeats: nextSubBeats }, clampedIdx };
}

export function insertBeatAtTimelinePercent(
  script: ScreenplayDocument, mainCards: StoryArcCard[], subPlots: SubPlotTrack[],
  isFiveAct: boolean, audienceEmotion: string, percentX: number, targetTrackId: string
): { updatedScript: ScreenplayDocument; insertedIdx: number } {
  const synced = syncHeroJourneyTracks(script.storyArc?.heroJourney, mainCards, subPlots, Math.max(1, script.targetLength || 90));
  const percents = computeStagePercents(synced);
  const foundIdx = percents.findIndex((p) => p > percentX);
  const { nextData, clampedIdx } = insertCustomHeroRow(synced, subPlots, foundIdx === -1 ? percents.length : foundIdx, targetTrackId, percentX);
  return {
    insertedIdx: clampedIdx,
    updatedScript: { ...script, storyArc: { ...script.storyArc, preset: isFiveAct ? '5-Act' : '3-Act', cards: mainCards, audienceEmotion, subPlots, heroJourney: nextData } },
  };
}

export function deleteCustomHeroRow(data: HeroJourneyData, subPlots: SubPlotTrack[], rowIdx: number): HeroJourneyData {
  const stages = getNormalizedStages(data);
  if (!stages[rowIdx]?.isCustom) return data;
  const nextSubBeats: Record<string, HeroJourneyBeat[]> = {};
  subPlots.forEach((sp) => { nextSubBeats[sp.id] = (data.subPlotBeats[sp.id] || []).filter((_, i) => i !== rowIdx); });
  return { stages: stages.filter((_, i) => i !== rowIdx), mainBeats: data.mainBeats.filter((_, i) => i !== rowIdx), subPlotBeats: nextSubBeats };
}
