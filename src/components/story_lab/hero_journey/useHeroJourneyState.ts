import { useState, useEffect, useMemo } from 'react';
import { HeroJourneyBeat, HeroJourneyData, ScreenplayDocument, StoryArcCard, SubPlotTrack } from '../../../types';
import { buildHeroJourneyFromActs, guardPageCount, syncHeroJourneyTracks } from './heroJourneyMapper';
import { computeStagePercents, deleteCustomHeroRow, getNormalizedStages, insertCustomHeroRow } from './heroJourneyRowOps';

export interface SelectedHeroBeatRef {
  trackId: 'main' | string;
  stageIdx: number;
}

export function useHeroJourneyState(
  script: ScreenplayDocument, mainCards: StoryArcCard[], subPlots: SubPlotTrack[],
  isFiveAct: boolean, audienceEmotion: string, onChangeScript: (updated: ScreenplayDocument) => void
) {
  const targetMinutes = Math.max(1, script.targetLength || 90);
  const [selectedRef, setSelectedRef] = useState<SelectedHeroBeatRef>({ trackId: 'main', stageIdx: 0 });
  const [filterTrackId, setFilterTrackId] = useState<'all' | 'main' | string>('all');

  const syncedData = useMemo(
    () => syncHeroJourneyTracks(script.storyArc?.heroJourney, mainCards, subPlots, targetMinutes),
    [script.storyArc?.heroJourney, mainCards, subPlots, targetMinutes]
  );
  const stages = useMemo(() => getNormalizedStages(syncedData), [syncedData]);

  const commitHeroData = (next: HeroJourneyData) => {
    onChangeScript({
      ...script,
      storyArc: { ...script.storyArc, preset: isFiveAct ? '5-Act' : '3-Act', cards: mainCards, audienceEmotion, subPlots, heroJourney: next },
    });
  };

  useEffect(() => {
    const cur = script.storyArc?.heroJourney;
    const missingSub = subPlots.some((sp) => !cur?.subPlotBeats?.[sp.id] || cur.subPlotBeats[sp.id].length !== syncedData.mainBeats.length);
    if (!cur || cur.mainBeats.length < 12 || missingSub) commitHeroData(syncedData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subPlots.length]);

  const safeIdx = Math.min(selectedRef.stageIdx, Math.max(0, stages.length - 1));
  const activeTrackBeats = selectedRef.trackId === 'main' ? syncedData.mainBeats : (syncedData.subPlotBeats[selectedRef.trackId] || syncedData.mainBeats);
  const activeBeat = activeTrackBeats[safeIdx] || syncedData.mainBeats[0];

  const handleUpdateBeat = (patch: Partial<HeroJourneyBeat>) => {
    const cleanPatch = { ...(patch.pageCount !== undefined ? { ...patch, pageCount: guardPageCount(patch.pageCount) } : patch), isEmptyPlaceholder: false };
    if (selectedRef.trackId === 'main' || !syncedData.subPlotBeats[selectedRef.trackId]) {
      commitHeroData({ ...syncedData, stages, mainBeats: syncedData.mainBeats.map((b, i) => (i === safeIdx ? { ...b, ...cleanPatch } : b)) });
      return;
    }
    const nextList = syncedData.subPlotBeats[selectedRef.trackId].map((b, i) => (i === safeIdx ? { ...b, ...cleanPatch } : b));
    commitHeroData({ ...syncedData, stages, subPlotBeats: { ...syncedData.subPlotBeats, [selectedRef.trackId]: nextList } });
  };

  const handleInsertRow = (insertIdx: number) => {
    const percents = computeStagePercents(syncedData);
    const prevP = insertIdx > 0 ? percents[insertIdx - 1] : 4;
    const nextP = insertIdx < percents.length ? percents[insertIdx] : 96;
    const midPct = Math.max(6, Math.min(94, Math.round((prevP + nextP) / 2)));
    const targetTrack = filterTrackId !== 'all' ? filterTrackId : 'main';
    const { nextData, clampedIdx } = insertCustomHeroRow(syncedData, subPlots, insertIdx, targetTrack, midPct);
    commitHeroData(nextData);
    setSelectedRef({ trackId: targetTrack, stageIdx: clampedIdx });
  };

  const handleDeleteRow = (rowIdx: number) => {
    commitHeroData(deleteCustomHeroRow(syncedData, subPlots, rowIdx));
    setSelectedRef((prev) => ({ ...prev, stageIdx: Math.max(0, Math.min(prev.stageIdx, stages.length - 2)) }));
  };

  const handleRenameStage = (rowIdx: number, title: string) => {
    const nextStages = stages.map((s, i) => (i === rowIdx ? { ...s, title } : s));
    commitHeroData({ ...syncedData, stages: nextStages });
  };

  return {
    heroData: syncedData, stages, selectedRef: { ...selectedRef, stageIdx: safeIdx },
    setSelectedRef, filterTrackId, setFilterTrackId, activeBeat,
    totalMainPages: syncedData.mainBeats.reduce((sum, b) => sum + guardPageCount(b.pageCount), 0),
    handleUpdateBeat, handleInsertRow, handleDeleteRow, handleRenameStage,
    handleReimportFromActs: () => {
      commitHeroData(buildHeroJourneyFromActs(mainCards, subPlots, targetMinutes));
      setSelectedRef({ trackId: 'main', stageIdx: 0 });
    },
  };
}
