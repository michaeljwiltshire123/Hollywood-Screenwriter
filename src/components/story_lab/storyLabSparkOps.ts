import { StoryArcCard } from '../../types';
import { GuidedStorySparkAnswers, FiveActExpansionAnswers } from './storyLabTypes';
import { STORY_LAB_3_ACT_DEFS } from './storyLabOps';

export function createDefaultEmptyCards(): StoryArcCard[] {
  return STORY_LAB_3_ACT_DEFS.map((def) => ({ id: def.id, actTitle: '', goal: '' }));
}

export function deriveAutoTitleFromText(text: string): string {
  const line = text.split('\n').map((l) => l.trim()).find((l) => l.length > 0);
  if (!line) return '';
  return line.length > 40 ? `${line.slice(0, 40).trim()}…` : line;
}

const BOILERPLATE = ['arthur introduces', 'lily learns', 'lily writes', 'ordinary world', 'escalate obstacles'];

export function sanitizeCards(cards?: StoryArcCard[]): StoryArcCard[] {
  if (!cards || cards.length === 0) return createDefaultEmptyCards();
  return cards.map((c) => {
    const lower = (c.goal || '').toLowerCase();
    const isB = BOILERPLATE.some((p) => lower.includes(p));
    const isGen = /^(act\s*(i{1,3}|iv|v|\d+))(:.*)?$/i.test((c.actTitle || '').trim());
    return { ...c, actTitle: isGen ? '' : (c.actTitle || ''), goal: isB ? '' : (c.goal || '') };
  });
}

export function cardHasText(card?: StoryArcCard): boolean {
  return Boolean(card && ((card.goal && card.goal.trim().length > 0) || (card.actTitle && card.actTitle.trim().length > 0)));
}

export function hasCardContent(cards: StoryArcCard[]): boolean {
  return cards.some((c) => cardHasText(c));
}

export function extractLegacyEmotion(cards: StoryArcCard[]): string {
  const match = (cards[2]?.goal || '').match(/^\[Audience Feeling:\s*(.+?)\]/i);
  return match ? match[1].trim() : '';
}

export function applySingleCardUpdate(currentCards: StoryArcCard[], cardIndex: number, text: string): StoryArcCard[] {
  const base = currentCards.length >= 3 ? [...currentCards] : createDefaultEmptyCards();
  const clean = text.trim();
  if (!base[cardIndex]) return base;
  base[cardIndex] = { ...base[cardIndex], goal: clean, actTitle: deriveAutoTitleFromText(clean) || base[cardIndex].actTitle };
  return base;
}

export function applyGuidedSparkToCards(currentCards: StoryArcCard[], answers: GuidedStorySparkAnswers): StoryArcCard[] {
  const base = currentCards.length >= 3 ? [...currentCards] : createDefaultEmptyCards();
  const g1 = answers.actOneRhyme.trim() || base[0]?.goal || '';
  const g2 = answers.actTwoMiddle.trim() || base[1]?.goal || '';
  const g3 = answers.actThreeClimax.trim() || base[2]?.goal || '';

  base[0] = { ...base[0], goal: g1, actTitle: deriveAutoTitleFromText(g1) || base[0]?.actTitle || '' };
  base[1] = { ...base[1], goal: g2, actTitle: deriveAutoTitleFromText(g2) || base[1]?.actTitle || '' };
  base[2] = { ...base[2], goal: g3, actTitle: deriveAutoTitleFromText(g3) || base[2]?.actTitle || '' };
  return base;
}

export function applyFiveActExpansionToCards(currentCards: StoryArcCard[], answers: FiveActExpansionAnswers): StoryArcCard[] {
  const oldAct1 = currentCards[0] || { id: 'act-1', actTitle: '', goal: '' };
  const oldAct2 = currentCards[1] || { id: 'act-2', actTitle: '', goal: '' };
  const oldAct3 = currentCards[2] || { id: 'act-3', actTitle: '', goal: '' };

  const act2Goal = answers.outsideEventsAct2.trim();
  const act3Goal = answers.furthestPointAct3.trim();
  const act4Goal = answers.preparationObstacleAct4.trim();

  return [
    { ...oldAct1, id: 'act-1' },
    { id: `act-2-${Date.now()}`, actTitle: deriveAutoTitleFromText(act2Goal), goal: act2Goal },
    { id: `act-3-${Date.now()}`, actTitle: deriveAutoTitleFromText(act3Goal), goal: act3Goal },
    { id: `act-4-${Date.now()}`, actTitle: deriveAutoTitleFromText(act4Goal), goal: act4Goal },
    { ...oldAct3, id: 'act-5' },
    {
      id: 'original-act-2-faded',
      actTitle: oldAct2.actTitle || 'Original Middle',
      goal: oldAct2.goal || '',
      sketchId: 'faded-3-act-middle',
    },
  ];
}
