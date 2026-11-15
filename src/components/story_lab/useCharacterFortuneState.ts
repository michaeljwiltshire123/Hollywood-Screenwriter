import { useState, useMemo, useEffect } from 'react';
import { CharacterFortuneNode, SceneInfo, ScreenplayDocument } from '../../types';
import { SelectedFortuneNode, TimelineTagPoint } from './characterFortuneTypes';
import { extractScriptCharacters, findEstablishedProtagonist } from './characterExtractor';

const DEFAULT_XS = [10, 30, 50, 70, 90];

function makeInitialNodes(charId: string, offsetFortune: number): CharacterFortuneNode[] {
  return DEFAULT_XS.map((x, idx) => ({ id: `${charId}-n-${idx + 1}`, percentX: x, fortune: Math.round(offsetFortune) }));
}

export function useCharacterFortuneState(
  script?: ScreenplayDocument,
  scenes: SceneInfo[] = [],
  onUpdateCharacterArcs?: (arcs: Record<string, CharacterFortuneNode[]>) => void
) {
  const characters = useMemo(() => extractScriptCharacters(script, scenes), [script, scenes]);
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    const est = findEstablishedProtagonist(script);
    return est && characters.some((c) => c.id === est) ? [est] : [];
  });
  const [draftArcs, setDraftArcs] = useState<Record<string, CharacterFortuneNode[]>>(() => script?.storyArc?.characterArcs || {});
  const [selectedNode, setSelectedNode] = useState<SelectedFortuneNode | null>(null);
  const [activeCharId, setActiveCharId] = useState<string | null>(null);

  useEffect(() => { setDraftArcs(script?.storyArc?.characterArcs || {}); }, [script?.storyArc?.characterArcs]);

  const ensureNodes = (arcs: Record<string, CharacterFortuneNode[]>, charId: string): CharacterFortuneNode[] => {
    if (arcs[charId]) return arcs[charId];
    const idx = Math.max(0, selectedIds.indexOf(charId));
    return makeInitialNodes(charId, selectedIds.length > 1 ? (idx - (selectedIds.length - 1) / 2) * 3 : 0);
  };

  const commitArcs = (next: Record<string, CharacterFortuneNode[]>) => { setDraftArcs(next); onUpdateCharacterArcs?.(next); };

  const handleToggleCharacter = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
    if (selectedNode?.charId === id) setSelectedNode(null);
  };

  const handleSelectAll = () => {
    setSelectedIds((prev) => (prev.length === characters.length ? [] : characters.map((c) => c.id)));
    setSelectedNode(null);
  };

  const handleMoveNode = (charId: string, nodeId: string, percentX: number, fortune: number) => {
    const cx = Math.max(3, Math.min(97, Math.round(percentX * 10) / 10));
    const cy = Math.max(-100, Math.min(100, Math.round(fortune)));
    setDraftArcs((prev) => ({
      ...prev,
      [charId]: ensureNodes(prev, charId).map((n) => (n.id === nodeId ? { ...n, percentX: cx, fortune: cy } : n)).sort((a, b) => a.percentX - b.percentX),
    }));
  };

  const handleAddFortuneNode = (charId: string, percentX: number, fortune: number) => {
    if (!selectedIds.includes(charId)) setSelectedIds((prev) => [...prev, charId]);
    const newNode: CharacterFortuneNode = {
      id: `${charId}-n-${Date.now().toString(36)}`,
      percentX: Math.max(3, Math.min(97, Math.round(percentX))),
      fortune: Math.max(-100, Math.min(100, Math.round(fortune))),
    };
    commitArcs({ ...draftArcs, [charId]: [...ensureNodes(draftArcs, charId), newNode].sort((a, b) => a.percentX - b.percentX) });
    setActiveCharId(charId);
    setSelectedNode({ charId, nodeId: newNode.id });
  };

  const handleDeleteNode = (charId: string, nodeId: string) => {
    commitArcs({ ...draftArcs, [charId]: ensureNodes(draftArcs, charId).filter((n) => n.id !== nodeId) });
    if (selectedNode?.nodeId === nodeId) setSelectedNode(null);
  };

  const characterPointsMap = useMemo(() => {
    const result: Record<string, TimelineTagPoint[]> = {};
    selectedIds.forEach((charId, idx) => {
      const charObj = characters.find((c) => c.id === charId) || { id: charId, name: charId, color: '#be123c' };
      const raw = draftArcs[charId] ?? makeInitialNodes(charId, selectedIds.length > 1 ? (idx - (selectedIds.length - 1) / 2) * 3 : 0);
      result[charId] = [...raw].sort((a, b) => a.percentX - b.percentX).map((n) => ({
        nodeId: n.id, percentX: n.percentX, fortune: n.fortune, characterId: charId, characterName: charObj.name, characterColor: charObj.color,
      }));
    });
    return result;
  }, [selectedIds, characters, draftArcs]);

  return {
    characters, selectedIds, activeCharId, selectedNode, characterPointsMap,
    allTagPoints: useMemo(() => Object.values(characterPointsMap).flat(), [characterPointsMap]),
    setSelectedNode, setActiveCharId, handleToggleCharacter, handleSelectAll,
    handleMoveNode, handleCommitDrag: () => onUpdateCharacterArcs?.(draftArcs), handleAddFortuneNode, handleDeleteNode,
  };
}
