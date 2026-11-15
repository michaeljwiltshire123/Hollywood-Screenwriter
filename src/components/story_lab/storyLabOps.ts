import { StoryArcCard, SceneInfo } from '../../types';
import { StoryLabActDef, StoryLabPacingMetrics } from './storyLabTypes';

export const STORY_LAB_3_ACT_DEFS: StoryLabActDef[] = [
  {
    id: 'act-1',
    actNumber: 1,
    actLabel: 'Act I',
    actTitle: 'Setup & Inciting Incident',
    targetRange: '0% – 25%',
    percentStart: 0,
    percentEnd: 25,
    defaultGoal: 'Establish the ordinary world, introduce the protagonist flaw, and disrupt the status quo with an inciting incident.',
    ideaPrompts: [
      'What immediate physical action reveals your protagonist flaw before they speak?',
      'How does the inciting incident force them out of their comfort zone?',
      'What ticking clock or urgent problem is established in the first 10 pages?'
    ]
  },
  {
    id: 'act-2',
    actNumber: 2,
    actLabel: 'Act II',
    actTitle: 'Confrontation & Midpoint',
    targetRange: '25% – 75%',
    percentStart: 25,
    percentEnd: 75,
    defaultGoal: 'Escalate obstacles, test alliances, and shift the protagonist from reactive to proactive at the central midpoint crisis.',
    ideaPrompts: [
      'What major revelation or false victory turns the story on its head at the midpoint?',
      'How does the antagonist apply overwhelming pressure to expose character weaknesses?',
      'What unexpected ally or mentor provides guidance when all hope seems lost?'
    ]
  },
  {
    id: 'act-3',
    actNumber: 3,
    actLabel: 'Act III',
    actTitle: 'Climax & Resolution',
    targetRange: '75% – 100%',
    percentStart: 75,
    percentEnd: 100,
    defaultGoal: 'Face the ultimate test, deliver emotional catharsis, and establish a transformed new equilibrium.',
    ideaPrompts: [
      'What ultimate sacrifice or choice must the protagonist make to resolve the climax?',
      'How does the climax mirror or invert the opening image of Act I?',
      'What lingering image proves the world or character has permanently transformed?'
    ]
  }
];

export function calculateSafePacing(targetMins: number, estMins: number): StoryLabPacingMetrics {
  const safeTarget = Math.max(1, Number.isFinite(targetMins) ? targetMins : 90);
  const safeEst = Math.max(1, Number.isFinite(estMins) ? estMins : 1);

  return {
    targetMinutes: safeTarget,
    estimatedMinutes: safeEst,
    actOneMins: Math.round(safeTarget * 0.25),
    actTwoMins: Math.round(safeTarget * 0.50),
    actThreeMins: Math.round(safeTarget * 0.25),
  };
}

export function importScenesIntoActs(scenes: SceneInfo[]): StoryArcCard[] {
  const total = Math.max(1, scenes.length);
  return STORY_LAB_3_ACT_DEFS.map((def) => {
    const startIdx = Math.floor((def.percentStart / 100) * total);
    const endIdx = Math.max(startIdx + 1, Math.floor((def.percentEnd / 100) * total));
    const assigned = scenes.slice(startIdx, endIdx);
    const linkedScene = assigned[0]?.id || '';
    const sceneSummary = assigned.length > 0
      ? `Linked ${assigned.length} scene(s): ${assigned.map(s => `#${s.sceneNumber}`).join(', ')}`
      : def.defaultGoal;

    return {
      id: def.id,
      actTitle: `${def.actLabel}: ${def.actTitle}`,
      goal: `${def.defaultGoal}\n\n[Script Link: ${sceneSummary}]`,
      linkedSceneId: linkedScene,
    };
  });
}
