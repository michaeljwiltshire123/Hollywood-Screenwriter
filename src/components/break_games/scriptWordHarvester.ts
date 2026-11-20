import { ScreenplayElement } from '../../types';
import { ScriptWordEntry } from './breakGameTypes';

const CHAR_STOPWORDS = new Set([
  'DETECTIVE', 'OFFICER', 'DOCTOR', 'NURSE', 'GUARD', 'WOMAN', 'VOICE',
  'NARRATOR', 'STRANGER', 'WAITER', 'WAITRESS', 'CLERK', 'POLICE', 'DRIVER',
  'SOLDIER', 'AGENT', 'PASSENGER', 'REPORTER', 'ANNOUNCER', 'CHARACTER',
  'EVERYONE', 'SOMEONE', 'CROWD', 'PEOPLE', 'MOTHER', 'FATHER', 'FRIEND',
]);

const LOC_STOPWORDS = new Set([
  'CONTINUOUS', 'MORNING', 'EVENING', 'AFTERNOON', 'NIGHT', 'DAWN', 'DUSK',
  'LATER', 'SAME', 'MOMENTS', 'FLASHBACK', 'PRESENT', 'PAST', 'CONT',
  'CONTINUED', 'UNTITLED', 'SCENE', 'OUTSIDE', 'INSIDE', 'FROM', 'WITH',
  'INTO', 'OVER', 'NEAR', 'NEXT', 'BACK', 'FRONT', 'SIDE', 'HERE', 'THERE',
  'SOMEWHERE', 'ANYWHERE', 'UNKNOWN', 'TIME', 'EXTERIOR', 'INTERIOR',
]);

function extractTokens(raw: string, stopwords: Set<string>): string[] {
  return raw
    .toUpperCase()
    .replace(/\([^)]*\)/g, ' ')
    .split(/[^A-Z]+/)
    .filter((tok) => tok.length >= 4 && tok.length <= 9 && !stopwords.has(tok));
}

function stripSluglineBoilerplate(heading: string): string {
  return heading
    .toUpperCase()
    .replace(/^\s*(INT\.?\s*\/\s*EXT\.?|EXT\.?\s*\/\s*INT\.?|I\/E\.?|INT\.?|EXT\.?)\s*/i, '')
    .replace(/\s*[-–—]\s*(DAY|NIGHT|DAWN|DUSK|MORNING|EVENING|AFTERNOON|CONTINUOUS|LATER|SAME.*|CONT.*)$/i, '');
}

export function harvestScriptWords(elements: ScreenplayElement[]): ScriptWordEntry[] {
  const seen = new Map<string, 'Character' | 'Location'>();

  for (const el of elements) {
    if (el.type === 'CHARACTER' && el.content.trim()) {
      for (const word of extractTokens(el.content, CHAR_STOPWORDS)) {
        seen.set(word, 'Character');
      }
    } else if (el.type === 'SCENE HEADING' && el.content.trim()) {
      const cleaned = stripSluglineBoilerplate(el.content);
      for (const word of extractTokens(cleaned, LOC_STOPWORDS)) {
        if (!seen.has(word)) seen.set(word, 'Location');
      }
    }
  }

  return Array.from(seen.entries()).map(([word, origin]) => ({ word, origin }));
}
