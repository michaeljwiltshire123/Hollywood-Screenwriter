import { useState } from 'react';
import { ScreenplayDocument, SceneInfo, StoryArcCard } from '../../types';
import {
  createDefaultEmptyCards, sanitizeCards, hasCardContent, cardHasText, extractLegacyEmotion,
  applySingleCardUpdate, applyGuidedSparkToCards, applyFiveActExpansionToCards, deriveAutoTitleFromText,
} from './storyLabSparkOps';
import { GuidedStorySparkAnswers, FiveActExpansionAnswers } from './storyLabTypes';
import { SprintVaultItem, SprintApplyResult } from './idea_sprint/ideaSprintTypes';

export function useStoryLabState(script: ScreenplayDocument, _scenes: SceneInfo[], onChangeScript: (updated: ScreenplayDocument) => void) {
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isGuidedSparkOpen, setIsGuidedSparkOpen] = useState(false);
  const [guidedTargetCardIndex, setGuidedTargetCardIndex] = useState<number | null>(null);
  const [isFiveActExpansionOpen, setIsFiveActExpansionOpen] = useState(false);
  const [vaultItems, setVaultItems] = useState<SprintVaultItem[]>([]);
  const [cardBackupsMap, setCardBackupsMap] = useState<Record<string, string[]>>({});
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [plotPointsMap, setPlotPointsMap] = useState<Record<string, StoryArcCard[]>>({});
  const [sprintCard, setSprintCard] = useState<StoryArcCard | null>(null);
  const [sprintQuestion, setSprintQuestion] = useState<string | null>(null);

  const cards = sanitizeCards((script.storyArc?.cards && script.storyArc.cards.length > 0) ? script.storyArc.cards : createDefaultEmptyCards());
  const isFiveAct = script.storyArc?.preset === '5-Act' || cards.length > 3;
  const firstThree = cards.slice(0, 3);
  const filledFirstThreeCount = firstThree.filter((c) => cardHasText(c)).length;
  const audienceEmotion = script.storyArc?.audienceEmotion ?? extractLegacyEmotion(cards);
  const subPlots = script.storyArc?.subPlots || [];
  const preset = isFiveAct ? '5-Act' : '3-Act';

  const executeStartNew = () => {
    setIsResetConfirmOpen(false); setExpandedCardId(null); setPlotPointsMap({}); setSprintCard(null); setSprintQuestion(null);
    onChangeScript({ ...script, storyArc: { preset: '3-Act', cards: createDefaultEmptyCards(), audienceEmotion: '', subPlots: [] } });
  };

  const handleOpenGuidedAction = () => {
    if (filledFirstThreeCount >= 3) { setIsFiveActExpansionOpen(true); return; }
    if (filledFirstThreeCount === 2) {
      const emptyIdx = firstThree.findIndex((c) => !cardHasText(c));
      setGuidedTargetCardIndex(emptyIdx >= 0 ? emptyIdx : null);
    } else {
      setGuidedTargetCardIndex(null);
    }
    setIsGuidedSparkOpen(true);
  };

  const handleUpdateCard = (id: string, field: 'actTitle' | 'goal' | 'linkedSceneId', val: string) => {
    const updatedCards = cards.map((c) => {
      if (c.id !== id) return c;
      if (field === 'goal') {
        const oldAuto = deriveAutoTitleFromText(c.goal || '');
        const newTitle = (!c.actTitle || c.actTitle === oldAuto) ? deriveAutoTitleFromText(val) : c.actTitle;
        return { ...c, goal: val, actTitle: newTitle };
      }
      return { ...c, [field]: val };
    });
    onChangeScript({ ...script, storyArc: { ...script.storyArc, preset, cards: updatedCards, audienceEmotion, subPlots } });
  };

  const handleUpdatePlotPoint = (cardId: string, index: number, field: 'actTitle' | 'goal', val: string) => {
    setPlotPointsMap((prev) => {
      const current = prev[cardId] || [1, 2, 3].map((i) => ({ id: `${cardId}-p${i}`, actTitle: '', goal: '' }));
      const next = [...current]; next[index] = { ...next[index], [field]: val };
      return { ...prev, [cardId]: next };
    });
  };

  const handleCardIdeaGeneration = (card: StoryArcCard) => {
    if (filledFirstThreeCount === 0) { setGuidedTargetCardIndex(null); setIsGuidedSparkOpen(true); return; }
    setSprintCard(card);
    setSprintQuestion(card.goal ? `Brainstorm ideas for: ${card.goal.slice(0, 50)}` : `Brainstorm ideas for ${card.actTitle || 'this story beat'}`);
  };

  const handleSubPlotIdeaGen = (card: StoryArcCard, label: string) => {
    setSprintCard(card);
    setSprintQuestion(card.goal ? `[${label}] Brainstorm ideas for: ${card.goal.slice(0, 45)}` : `[${label}] Brainstorm ideas for ${card.actTitle || 'this beat'}`);
  };

  const handleRecordSprintResult = (res: SprintApplyResult) => {
    if (res.saveToVault && res.vaultItem) setVaultItems((prev) => [res.vaultItem!, ...prev]);
    if (res.backupIdeas?.length && sprintCard) setCardBackupsMap((prev) => ({ ...prev, [sprintCard.id]: res.backupIdeas }));
    if (res.primaryIdea && sprintCard) handleUpdateCard(sprintCard.id, 'goal', res.primaryIdea);
  };

  return {
    cards, isFiveAct, filledFirstThreeCount, audienceEmotion, guidedTargetCardIndex, isResetConfirmOpen,
    isGuidedSparkOpen, isFiveActExpansionOpen, vaultItems, cardBackupsMap, expandedCardId, plotPointsMap, sprintQuestion,
    setIsResetConfirmOpen, setIsGuidedSparkOpen, setIsFiveActExpansionOpen, setVaultItems, setExpandedCardId, setSprintQuestion,
    handleOpenGuidedAction, handleCardIdeaGeneration, handleSubPlotIdeaGen, executeStartNew, handleUpdateCard, handleUpdatePlotPoint, handleRecordSprintResult,
    handleStartNewRequest: () => (hasCardContent(cards) || subPlots.length > 0 ? setIsResetConfirmOpen(true) : executeStartNew()),
    handleUpdateAudienceEmotion: (val: string) => onChangeScript({ ...script, storyArc: { ...script.storyArc, preset, cards, audienceEmotion: val, subPlots } }),
    handleApplySingleCard: (idx: number, text: string) => onChangeScript({ ...script, storyArc: { ...script.storyArc, preset, cards: applySingleCardUpdate(cards, idx, text), audienceEmotion, subPlots } }),
    handleApplyGuidedSpark: (ans: GuidedStorySparkAnswers) => onChangeScript({ ...script, storyArc: { ...script.storyArc, preset: '3-Act', cards: applyGuidedSparkToCards(cards, ans), audienceEmotion: ans.endingEmotion.trim(), subPlots } }),
    handleApplyFiveActExpansion: (ans: FiveActExpansionAnswers) => onChangeScript({ ...script, storyArc: { ...script.storyArc, preset: '5-Act', cards: applyFiveActExpansionToCards(cards, ans), audienceEmotion, subPlots } }),
  };
}
