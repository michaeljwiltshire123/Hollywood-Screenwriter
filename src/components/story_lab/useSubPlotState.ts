import { useState, useMemo } from 'react';
import { ScreenplayDocument, StoryArcCard, SubPlotTrack } from '../../types';
import { createNewSubPlot, syncSubPlotCards } from './subPlotOps';
import { deriveAutoTitleFromText } from './storyLabSparkOps';
import { SubPlotPocketBridge } from './storyLabTypes';

export function useSubPlotState(
  script: ScreenplayDocument, isFiveAct: boolean, mainCards: StoryArcCard[],
  audienceEmotion: string, onChangeScript: (updated: ScreenplayDocument) => void,
  onSubPlotIdeaGen: (card: StoryArcCard, label: string) => void
) {
  const [activeSubPlotId, setActiveSubPlotId] = useState<string | null>(null);
  const [openPocketActIndex, setOpenPocketActIndex] = useState<number | null>(null);
  const [pocketSubPlotId, setPocketSubPlotId] = useState<string | null>(null);
  const [slideOverride, setSlideOverride] = useState<'left' | 'right' | null>(null);

  const subPlots = useMemo(
    () => (script.storyArc?.subPlots || []).map((sp) => syncSubPlotCards(sp, isFiveAct)),
    [script.storyArc?.subPlots, isFiveAct]
  );
  const activeSubPlot = useMemo(() => subPlots.find((sp) => sp.id === activeSubPlotId) || null, [subPlots, activeSubPlotId]);
  const pocketSubPlot = useMemo(() => subPlots.find((sp) => sp.id === pocketSubPlotId) || subPlots[0] || null, [subPlots, pocketSubPlotId]);

  const commit = (next: SubPlotTrack[]) => {
    onChangeScript({ ...script, storyArc: { ...script.storyArc, preset: isFiveAct ? '5-Act' : '3-Act', cards: mainCards, audienceEmotion, subPlots: next } });
  };

  const handleCreateSubPlot = (pinLane = true) => {
    const created = createNewSubPlot(subPlots, isFiveAct);
    commit([...subPlots, created]);
    if (pinLane) setActiveSubPlotId(created.id);
    setPocketSubPlotId(created.id);
    return created.id;
  };

  const handleTogglePocket = (actIndex: number, spId?: string) => {
    if (subPlots.length === 0) {
      handleCreateSubPlot(false);
      setOpenPocketActIndex(actIndex);
      setSlideOverride(null);
      return;
    }
    const targetId = spId || pocketSubPlot?.id || subPlots[0].id;
    if (openPocketActIndex === actIndex && (!spId || pocketSubPlot?.id === spId)) {
      setOpenPocketActIndex(null);
      return;
    }
    setPocketSubPlotId(targetId);
    setOpenPocketActIndex(actIndex);
    setSlideOverride(null);
  };

  const handleUpdateSubPlotCard = (subPlotId: string, cardIdx: number, field: 'actTitle' | 'goal', val: string) => {
    commit(subPlots.map((sp) => {
      if (sp.id !== subPlotId) return sp;
      const nextCards = [...sp.cards];
      const cur = nextCards[cardIdx] || { id: `${sp.id}-act-${cardIdx + 1}`, actTitle: '', goal: '' };
      if (field === 'goal') {
        const oldAuto = deriveAutoTitleFromText(cur.goal || '');
        const newTitle = (!cur.actTitle || cur.actTitle === oldAuto) ? deriveAutoTitleFromText(val) : cur.actTitle;
        nextCards[cardIdx] = { ...cur, goal: val, actTitle: newTitle };
      } else {
        nextCards[cardIdx] = { ...cur, actTitle: val };
      }
      return { ...sp, cards: nextCards };
    }));
  };

  const handleDeleteSubPlot = (id: string) => {
    const remaining = subPlots.filter((sp) => sp.id !== id);
    commit(remaining);
    if (activeSubPlotId === id) setActiveSubPlotId(remaining[0]?.id || null);
    if (pocketSubPlotId === id) setPocketSubPlotId(remaining[0]?.id || null);
    if (remaining.length === 0) setOpenPocketActIndex(null);
  };

  const pocketBridge: SubPlotPocketBridge = {
    subPlots, openActIndex: openPocketActIndex, pocketSubPlot, slideOverride,
    onTogglePocket: handleTogglePocket,
    onCreateForPocket: (actIdx) => { handleCreateSubPlot(false); setOpenPocketActIndex(actIdx); setSlideOverride(null); },
    onFlipSide: (defSide) => setSlideOverride((prev) => ((prev || defSide) === 'right' ? 'left' : 'right')),
    onClosePocket: () => setOpenPocketActIndex(null),
    onUpdateCard: handleUpdateSubPlotCard,
    onRename: (id, name) => commit(subPlots.map((sp) => (sp.id === id ? { ...sp, name } : sp))),
    onChangeColor: (id, color) => commit(subPlots.map((sp) => (sp.id === id ? { ...sp, color } : sp))),
    onChangeEmotion: (id, emo) => commit(subPlots.map((sp) => (sp.id === id ? { ...sp, audienceEmotion: emo } : sp))),
    onDelete: handleDeleteSubPlot,
    onIdeaGen: onSubPlotIdeaGen,
  };

  return {
    subPlots, activeSubPlotId, activeSubPlot, setActiveSubPlotId,
    handleCreateSubPlot: () => handleCreateSubPlot(true),
    handleUpdateSubPlotCard, handleDeleteSubPlot, pocketBridge,
    handleRenameSubPlot: pocketBridge.onRename,
    handleChangeSubPlotColor: pocketBridge.onChangeColor,
    handleChangeSubPlotEmotion: pocketBridge.onChangeEmotion,
  };
}
