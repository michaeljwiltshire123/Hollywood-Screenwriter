import { ScreenplayDocument } from '../types';
import { extractSparkContext, isNudgeRelevant } from './sparks/sparkContext';
import { pickFromDeck } from './sparks/sparkDeck';
import scriptPrompts from '../data/sparks/scriptPrompts.json';
import trivia from '../data/sparks/trivia.json';
import paradoxes from '../data/sparks/paradoxes.json';
import motivation from '../data/sparks/motivation.json';
import antiCliche from '../data/sparks/antiCliche.json';
import psychology from '../data/sparks/psychology.json';
import sensory from '../data/sparks/sensory.json';
import subtext from '../data/sparks/subtext.json';

export type SparkCategoryKey =
  | 'scriptPrompts' | 'trivia' | 'paradoxes' | 'motivation'
  | 'antiCliche' | 'psychology' | 'sensory' | 'subtext';

export interface SparkResult {
  text: string;
  categoryKey: SparkCategoryKey;
  categoryLabel: string;
  isFeatureNudge: boolean;
  nudgeId?: string;
}

interface NudgeEntry { id: string; isFeatureNudge: true; featureKey: string; text: string; }
type PromptEntry = string | NudgeEntry;

const CATEGORIES: { key: SparkCategoryKey; label: string; weight: number; items: PromptEntry[] }[] = [
  { key: 'scriptPrompts', label: 'Script, Character & Feature Prompt', weight: 10, items: scriptPrompts as PromptEntry[] },
  { key: 'trivia', label: 'Bizarre Cinema & Script Trivia', weight: 20, items: trivia },
  { key: 'paradoxes', label: 'Mind Benders & Moral Paradoxes', weight: 10, items: paradoxes },
  { key: 'motivation', label: 'Raw Writer Motivation', weight: 20, items: motivation },
  { key: 'antiCliche', label: 'Anti-Cliché Dare', weight: 10, items: antiCliche },
  { key: 'psychology', label: 'Character Psychology & Phobias', weight: 10, items: psychology },
  { key: 'sensory', label: 'Sensory & Environmental Trigger', weight: 10, items: sensory },
  { key: 'subtext', label: 'Subtext & Unspoken Secrets', weight: 10, items: subtext },
];

const DISMISSED_KEY = 'screenwriter_dismissed_spark_nudges';
let totalDraws = 0;
let nudgeDraws = 0;

export function getDismissedSparkNudges(): string[] {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(DISMISSED_KEY) : null;
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

export function dismissSparkNudge(nudgeId: string): void {
  if (!nudgeId || typeof localStorage === 'undefined') return;
  const current = new Set(getDismissedSparkNudges());
  current.add(nudgeId);
  try { localStorage.setItem(DISMISSED_KEY, JSON.stringify([...current])); } catch { /* ignore */ }
}

const isEligibleText = (text: string, hasAnyChar: boolean) => hasAnyChar || !/\{character[12]\}/.test(text);

export function generateSpark(script: ScreenplayDocument, _lastText?: string): SparkResult {
  const ctx = extractSparkContext(script);
  const dismissed = new Set(getDismissedSparkNudges());
  const available = CATEGORIES.filter((c) => c.items.some((it) => typeof it === 'string' && isEligibleText(it, ctx.hasAnyChar)));
  const poolCats = available.length > 0 ? available : CATEGORIES;
  const totalWeight = poolCats.reduce((sum, c) => sum + c.weight, 0);
  let roll = Math.random() * totalWeight;
  const chosen = poolCats.find((c) => { if (roll < c.weight) return true; roll -= c.weight; return false; }) || poolCats[0];

  const eligibleRegular = chosen.items.filter((x): x is string => typeof x === 'string' && isEligibleText(x, ctx.hasAnyChar));
  const nudges = chosen.items.filter((x): x is NudgeEntry => (
    typeof x !== 'string' && !dismissed.has(x.id) && isNudgeRelevant(x.featureKey, script) && isEligibleText(x.text, ctx.hasAnyChar)
  ));
  const canNudge = nudges.length > 0 && (nudgeDraws + 1) / Math.max(20, totalDraws + 1) <= 0.05 && Math.random() < 0.5;
  totalDraws++;

  let pickedNudge: NudgeEntry | undefined;
  let template: string;
  if (canNudge) {
    template = pickFromDeck(`${chosen.key}_nudges`, nudges.map((n) => n.text));
    pickedNudge = nudges.find((n) => n.text === template) || nudges[0];
    nudgeDraws++;
  } else {
    template = pickFromDeck(chosen.key, eligibleRegular);
  }

  const text = template
    .replace(/\{character1\}/g, ctx.c1).replace(/\{character2\}/g, ctx.c2).replace(/\{location\}/g, ctx.loc)
    .replace(/\{prop\}/g, ctx.prop).replace(/\{time_of_day\}/g, ctx.timeOfDay).replace(/\{scene_number\}/g, ctx.sceneNumber);

  return { text, categoryKey: chosen.key, categoryLabel: chosen.label, isFeatureNudge: Boolean(pickedNudge), nudgeId: pickedNudge?.id };
}
