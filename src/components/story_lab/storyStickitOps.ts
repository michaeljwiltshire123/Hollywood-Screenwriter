import { HeroJourneyData, HeroJourneyPacing, HeroJourneyStageRow, StoryArcCard, SubPlotTrack } from '../../types';
import { guardPageCount } from './hero_journey/heroJourneyMapper';
import { getNormalizedStages } from './hero_journey/heroJourneyRowOps';
import { getSubPlotPalette } from './subPlotOps';

export interface WallStickitItem {
  id: string; trackId: string; trackName: string; borderColor: string; bgTint: string; textColor: string;
  shortLabel: string; stageLabel: string; title: string; summary: string;
  percentX: number; displayX: number; side: 'top' | 'bottom'; topPct: number; tiltDeg: number;
  pacingLabel: string; pacingSpeed?: HeroJourneyPacing; hasContent: boolean; stageIdx: number;
}

type RawStickit = Omit<WallStickitItem, 'displayX' | 'side' | 'topPct' | 'tiltDeg'>;
const TILTS = [-1.4, 1.1, -0.7, 1.4, -1.1, 0.8];

function mapHeroBeats(
  beats: HeroJourneyData['mainBeats'], stages: HeroJourneyStageRow[],
  trackId: string, trackName: string, borderColor: string, bgTint: string, textColor: string
): RawStickit[] {
  const totalPages = Math.max(1, beats.reduce((s, b) => s + guardPageCount(b.pageCount), 0));
  let cum = 0;
  return beats.reduce<RawStickit[]>((acc, b, idx) => {
    const pages = guardPageCount(b.pageCount);
    const startP = cum + 1;
    const propX = Math.max(6, Math.min(94, Math.round(((cum + pages / 2) / totalPages) * 100)));
    cum += pages;
    const st = stages[idx];
    if (b.isEmptyPlaceholder && !b.title.trim() && !b.summary.trim()) return acc;
    const percentX = st?.timelinePercent !== undefined ? Math.max(6, Math.min(94, st.timelinePercent)) : propX;
    acc.push({
      id: `${trackId}-${b.id}`, trackId, trackName, borderColor, bgTint, textColor,
      shortLabel: st?.isCustom ? `+${idx + 1}` : `${idx + 1}`,
      stageLabel: `Row ${idx + 1}: ${st?.title || `Stage ${idx + 1}`}`,
      title: b.title || st?.title || `Stage ${idx + 1}`, summary: b.summary || st?.promptHint || '',
      percentX, pacingLabel: `pp. ${startP}–${startP + pages - 1} (${pages}p)`, pacingSpeed: b.pacingSpeed,
      hasContent: Boolean(b.summary?.trim() || (b.title && b.title !== st?.title)), stageIdx: idx,
    });
    return acc;
  }, []);
}

function mapActCards(cards: StoryArcCard[], trackId: string, trackName: string, borderColor: string, bgTint: string, textColor: string, targetMinutes: number): RawStickit[] {
  const isFive = cards.length > 3;
  const xs = isFive ? [11, 30, 50, 70, 89] : [16, 50, 84];
  return cards.slice(0, isFive ? 5 : 3).reduce<RawStickit[]>((acc, c, i) => {
    if (!((c.goal && c.goal.trim()) || (c.actTitle && c.actTitle.trim()))) return acc;
    const approxMin = Math.round((xs[i] / 100) * Math.max(1, targetMinutes));
    acc.push({
      id: `${trackId}-${c.id}`, trackId, trackName, borderColor, bgTint, textColor,
      shortLabel: `A${i + 1}`, stageLabel: `Act ${i + 1}`,
      title: c.actTitle || `${trackName} Act ${i + 1}`, summary: c.goal || '',
      percentX: xs[i], pacingLabel: `~${approxMin}m`, hasContent: true, stageIdx: i,
    });
    return acc;
  }, []);
}

function placeSide(items: RawStickit[], side: 'top' | 'bottom'): WallStickitItem[] {
  const sorted = [...items].sort((a, b) => a.percentX - b.percentX);
  const tiers = side === 'top' ? [13, 27] : [62, 76];
  const lastX = [-30, -30];
  return sorted.map((it, idx) => {
    let tier = idx % 2;
    if (it.percentX - lastX[tier] < 11 && it.percentX - lastX[1 - tier] >= 11) tier = 1 - tier;
    const clash = Math.abs(it.percentX - lastX[tier]) < 4;
    const displayX = Math.max(6, Math.min(94, clash ? it.percentX + (idx % 2 === 0 ? 3.5 : -3.5) : it.percentX));
    lastX[tier] = displayX;
    return { ...it, displayX, side, topPct: sorted.length <= 3 && side === 'top' ? 19 : tiers[tier], tiltDeg: TILTS[idx % TILTS.length] };
  });
}

export function buildWallStickits(
  cards: StoryArcCard[], subPlots: SubPlotTrack[], heroJourney: HeroJourneyData | undefined,
  isHeroJourneyOpen: boolean, showAllPlots: boolean, targetMinutes: number
): WallStickitItem[] {
  const stages = getNormalizedStages(heroJourney);
  const mainRaw = isHeroJourneyOpen && heroJourney?.mainBeats?.length
    ? mapHeroBeats(heroJourney.mainBeats, stages, 'main', 'Main Story', '#D97706', '#FEF3C7', '#78350F')
    : mapActCards(cards, 'main', 'Main Story', '#D97706', '#FEF3C7', '#78350F', targetMinutes);
  const subRaw = showAllPlots ? subPlots.flatMap((sp) => {
    const pal = getSubPlotPalette(sp.color);
    const spBeats = heroJourney?.subPlotBeats?.[sp.id];
    return isHeroJourneyOpen && spBeats?.length
      ? mapHeroBeats(spBeats, stages, sp.id, sp.name, pal.border, pal.bgTint, pal.badgeText)
      : mapActCards(sp.cards, sp.id, sp.name, pal.border, pal.bgTint, pal.badgeText, targetMinutes);
  }) : [];

  if (subRaw.length === 0 && isHeroJourneyOpen) {
    return [...placeSide(mainRaw.filter((_, i) => i % 2 === 0), 'top'), ...placeSide(mainRaw.filter((_, i) => i % 2 === 1), 'bottom')];
  }
  return [...placeSide(mainRaw, 'top'), ...placeSide(subRaw, 'bottom')];
}
