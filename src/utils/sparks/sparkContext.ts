import { ScreenplayDocument } from '../../types';
import { extractCharacters, extractScenes } from '../../lib/screenplayUtils';

const FALLBACK_PROPS = [
  'a set of keys', 'an unopened envelope', 'a cracked coffee mug', 'a folded receipt',
  'a burner phone', 'a silver lighter', 'a spare house key', 'a scratched wristwatch',
  'a half-empty glass', 'a dog-eared notebook', 'a train ticket', 'a warm thermos',
  'a brass compass', 'an old photograph', 'a crumpled napkin', 'a fountain pen',
  'a pair of reading glasses', 'a brass padlock', 'a cassette tape', 'a red biro',
  'a bruised apple', 'a leather wallet', 'an umbrella', 'a chipped teacup',
];

let propDeck: string[] = [];

function pickNextFallbackProp(): string {
  if (propDeck.length === 0) {
    propDeck = [...FALLBACK_PROPS];
    for (let i = propDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [propDeck[i], propDeck[j]] = [propDeck[j], propDeck[i]];
    }
  }
  return propDeck.pop() || 'a set of keys';
}

const toTitle = (s: string) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

export interface SparkContext {
  hasAnyChar: boolean;
  c1: string;
  c2: string;
  loc: string;
  timeOfDay: string;
  sceneNumber: string;
  prop: string;
}

export function extractSparkContext(script: ScreenplayDocument): SparkContext {
  const chars = extractCharacters(script.elements).filter((c) => Boolean(c.name?.trim()));
  const hasAnyChar = chars.length > 0;
  const totalCues = chars.reduce((sum, c) => sum + c.dialogueCount, 0);
  const qualified = totalCues <= 15
    ? chars.slice(0, 4)
    : chars.filter((c) => c.dialogueCount >= 2 && c.percentage >= 5).slice(0, 8);
  const coreCast = qualified.length > 0 ? qualified : chars.slice(0, 4);

  const pick1 = coreCast.length > 0 ? coreCast[Math.floor(Math.random() * coreCast.length)] : null;
  const otherCore = pick1 ? coreCast.filter((c) => c.name !== pick1.name) : [];
  const otherAny = pick1 ? chars.filter((c) => c.name !== pick1.name) : [];
  const pick2Pool = otherCore.length > 0 ? otherCore : otherAny;
  const pick2 = pick2Pool.length > 0 ? pick2Pool[Math.floor(Math.random() * pick2Pool.length)] : null;

  const scenes = extractScenes(script.elements);
  const scene = scenes.length > 0 ? scenes[Math.floor(Math.random() * scenes.length)] : null;
  const heading = scene?.heading || '';
  const todMatch = heading.match(/\s*-\s*(DAY|NIGHT|MORNING|EVENING|LATER|CONTINUOUS|DUSK|DAWN).*$/i);
  const cleaned = heading
    .replace(/^(INT\.\/EXT\.|EXT\.\/INT\.|I\/E\.|INT\.|EXT\.)\s*/i, '')
    .replace(/\s*-\s*(DAY|NIGHT|MORNING|EVENING|LATER|CONTINUOUS|DUSK|DAWN).*$/i, '')
    .trim();
  const props = script.callSheetData?.rows?.flatMap((r) => r.propTags || []).filter(Boolean) || [];

  return {
    hasAnyChar,
    c1: pick1 ? toTitle(pick1.name) : '',
    c2: pick2 ? toTitle(pick2.name) : 'another character',
    loc: cleaned ? toTitle(cleaned) : 'this scene',
    timeOfDay: todMatch ? todMatch[1].toLowerCase() : 'daytime',
    sceneNumber: scene?.sceneNumber || '1',
    prop: props.length > 0 ? props[Math.floor(Math.random() * props.length)] : pickNextFallbackProp(),
  };
}

export function isNudgeRelevant(key: string, script: ScreenplayDocument): boolean {
  const hasDialogue = script.elements.some((e) => e.type === 'DIALOGUE');
  const hasChars = extractCharacters(script.elements).length > 0;
  const hasScenes = extractScenes(script.elements).length > 0;
  if (key === 'characterBible') return hasChars && Object.keys(script.characterBibles || {}).length === 0;
  if (key === 'characterArc') return hasChars && Object.keys(script.storyArc?.characterArcs || {}).length === 0;
  if (key === 'storyLab') return !script.storyArc?.cards?.some((c) => c.goal?.trim());
  if (key === 'subPlots') return !(script.storyArc?.subPlots && script.storyArc.subPlots.length > 0);
  if (key === 'heroJourney') return !script.storyArc?.heroJourney?.mainBeats?.some((b) => !b.isEmptyPlaceholder && b.summary?.trim());
  if (key === 'logline') return !script.storyArc?.logline?.text?.trim();
  if (key === 'synopsis') return !script.storyArc?.synopsis?.text?.trim();
  if (key === 'audienceEmotion') return !script.storyArc?.audienceEmotion?.trim();
  if (key === 'shots') return hasScenes && (!script.shots || script.shots.length === 0);
  if (key === 'tableRead') return hasDialogue;
  if (key === 'actorHighlight') return !script.isActorHighlightingActive && hasDialogue;
  if (key === 'theme') return !script.theme?.preset || script.theme.preset === 'Vintage';
  if (key === 'callSheet') return hasScenes && !(script.callSheetData?.rows && script.callSheetData.rows.length > 0);
  if (key === 'riskAssessment') return hasScenes && !(script.riskAssessments && script.riskAssessments.length > 0);
  if (key === 'titlePage') return !script.titlePage?.author?.trim() || script.titlePage.title === 'UNTITLED SCREENPLAY';
  return true;
}
