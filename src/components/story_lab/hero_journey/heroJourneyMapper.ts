import { HeroJourneyBeat, HeroJourneyData, StoryArcCard, SubPlotTrack } from '../../../types';
import { HERO_JOURNEY_STAGES } from './heroJourneyConstants';

export function guardPageCount(val: number): number {
  const num = Math.round(Number(val));
  return Number.isFinite(num) && num >= 1 ? num : 1;
}

function splitTextIntoChunks(rawText: string, slots: number): string[] {
  const clean = (rawText || '').trim();
  if (!clean) return Array.from({ length: slots }, () => '');
  const lines = clean.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const parts = lines.length >= 2 ? lines : clean.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
  if (parts.length <= 1) return [clean, ...Array.from({ length: slots - 1 }, () => '')];

  const out = Array.from({ length: slots }, () => '');
  parts.forEach((p, idx) => {
    const bucket = Math.min(slots - 1, Math.floor((idx * slots) / parts.length));
    out[bucket] = out[bucket] ? `${out[bucket]}\n${p}` : p;
  });
  return out;
}

function buildTrackBeats(cards: StoryArcCard[], prefix: string, totalPages: number): HeroJourneyBeat[] {
  const isFive = cards.length > 3;
  const act1Text = cards[0]?.goal || '';
  const act2Text = isFive ? [cards[1]?.goal, cards[2]?.goal, cards[3]?.goal].filter(Boolean).join('\n') : (cards[1]?.goal || '');
  const act3Text = isFive ? (cards[4]?.goal || '') : (cards[2]?.goal || '');

  const chunks = [
    ...splitTextIntoChunks(act1Text, 4),
    ...splitTextIntoChunks(act2Text, 4),
    ...splitTextIntoChunks(act3Text, 4),
  ];
  const basePages = Math.max(1, Math.round(Math.max(12, totalPages) / 12));

  return HERO_JOURNEY_STAGES.map((stage, idx) => {
    const summary = chunks[idx] || '';
    const firstLine = summary.split('\n')[0]?.trim() || '';
    const title = firstLine ? firstLine.slice(0, 44) : stage.title;
    return {
      id: `${prefix}-hj-${idx + 1}`,
      title,
      summary,
      pacingSpeed: stage.actGroup === 1 ? 'Fast' : 'Moderate',
      pageCount: basePages,
    };
  });
}

export function buildHeroJourneyFromActs(
  mainCards: StoryArcCard[],
  subPlots: SubPlotTrack[],
  targetMinutes: number
): HeroJourneyData {
  const totalPages = Math.max(12, targetMinutes || 90);
  const stages = HERO_JOURNEY_STAGES.map((s) => ({
    id: `stage-${s.index + 1}`, title: s.title, actGroup: s.actGroup, promptHint: s.promptHint,
  }));
  const mainBeats = buildTrackBeats(mainCards, 'main', totalPages);
  const subPlotBeats: Record<string, HeroJourneyBeat[]> = {};
  subPlots.forEach((sp) => {
    subPlotBeats[sp.id] = buildTrackBeats(sp.cards, sp.id, Math.max(12, Math.round(totalPages * 0.6)));
  });
  return { stages, mainBeats, subPlotBeats };
}

export function syncHeroJourneyTracks(
  data: HeroJourneyData | undefined,
  mainCards: StoryArcCard[],
  subPlots: SubPlotTrack[],
  targetMinutes: number
): HeroJourneyData {
  if (!data || data.mainBeats.length < 12) {
    return buildHeroJourneyFromActs(mainCards, subPlots, targetMinutes);
  }
  const targetLen = data.mainBeats.length;
  const nextSubBeats: Record<string, HeroJourneyBeat[]> = {};
  subPlots.forEach((sp) => {
    const existing = data.subPlotBeats?.[sp.id];
    if (existing && existing.length === targetLen) {
      nextSubBeats[sp.id] = existing;
    } else {
      const base = buildTrackBeats(sp.cards, sp.id, Math.max(12, Math.round((targetMinutes || 90) * 0.6)));
      while (base.length < targetLen) {
        base.push({ id: `${sp.id}-pad-${base.length}`, title: '', summary: '', pacingSpeed: 'Moderate', pageCount: 4, isEmptyPlaceholder: true });
      }
      nextSubBeats[sp.id] = base.slice(0, targetLen);
    }
  });
  return { stages: data.stages, mainBeats: data.mainBeats, subPlotBeats: nextSubBeats };
}
