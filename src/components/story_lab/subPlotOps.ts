import { StoryArcCard, SubPlotTrack } from '../../types';

export interface SubPlotPalette {
  key: string;
  label: string;
  border: string;
  bgTint: string;
  badgeBg: string;
  badgeText: string;
}

export const SUBPLOT_PALETTES: SubPlotPalette[] = [
  { key: 'teal', label: 'Teal', border: '#0D9488', bgTint: '#F0FDFA', badgeBg: '#CCFBF1', badgeText: '#115E59' },
  { key: 'indigo', label: 'Indigo', border: '#4F46E5', bgTint: '#EEF2FF', badgeBg: '#E0E7FF', badgeText: '#3730A3' },
  { key: 'plum', label: 'Plum', border: '#9333EA', bgTint: '#FAF5FF', badgeBg: '#F3E8FF', badgeText: '#6B21A8' },
  { key: 'sage', label: 'Sage', border: '#16A34A', bgTint: '#F0FDF4', badgeBg: '#DCFCE7', badgeText: '#166534' },
  { key: 'coral', label: 'Coral', border: '#E11D48', bgTint: '#FFF1F2', badgeBg: '#FFE4E6', badgeText: '#9F1239' },
  { key: 'sky', label: 'Sky', border: '#0284C7', bgTint: '#F0F9FF', badgeBg: '#E0F2FE', badgeText: '#075985' },
];

export function getSubPlotPalette(colorKey?: string): SubPlotPalette {
  return SUBPLOT_PALETTES.find((p) => p.key === colorKey) || SUBPLOT_PALETTES[0];
}

export function createSubPlotCards(count: number, prefix: string): StoryArcCard[] {
  return Array.from({ length: count }, (_, i) => ({ id: `${prefix}-act-${i + 1}`, actTitle: '', goal: '' }));
}

export function createNewSubPlot(existing: SubPlotTrack[], isFiveAct: boolean): SubPlotTrack {
  const letters = 'BCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nextChar = letters[existing.length] || `${existing.length + 2}`;
  const usedColors = new Set(existing.map((s) => s.color));
  const nextPalette = SUBPLOT_PALETTES.find((p) => !usedColors.has(p.key)) || SUBPLOT_PALETTES[existing.length % SUBPLOT_PALETTES.length];
  const id = `subplot-${Date.now()}-${existing.length + 1}`;
  return {
    id,
    name: `Sub-Plot ${nextChar}`,
    color: nextPalette.key,
    cards: createSubPlotCards(isFiveAct ? 5 : 3, id),
    audienceEmotion: '',
  };
}

export function syncSubPlotCards(subPlot: SubPlotTrack, isFiveAct: boolean): SubPlotTrack {
  const needed = isFiveAct ? 5 : 3;
  if (subPlot.cards.length >= needed) return subPlot;
  const extra = Array.from({ length: needed - subPlot.cards.length }, (_, i) => ({
    id: `${subPlot.id}-act-${subPlot.cards.length + i + 1}`,
    actTitle: '',
    goal: '',
  }));
  return { ...subPlot, cards: [...subPlot.cards, ...extra] };
}

export function getMainActIndices(isFiveAct: boolean): number[] {
  return isFiveAct ? [0, 1, 2, 3, 4] : [0, 1, 2];
}

export function hasActWriting(subPlot: SubPlotTrack, actIdx: number): boolean {
  const c = subPlot.cards[actIdx];
  return Boolean(c && ((c.goal && c.goal.trim()) || (c.actTitle && c.actTitle.trim())));
}

export function countSubPlotsForAct(subPlots: SubPlotTrack[], actIdx: number): number {
  return subPlots.filter((sp) => hasActWriting(sp, actIdx)).length;
}

