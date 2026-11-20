import { ScriptWordEntry, WordChoice } from './breakGameTypes';
import { pickWordsWithCooldown } from './wordCooldownTracker';

export function pickUnscrambleWords(
  scriptWords: ScriptWordEntry[] = [],
  count = 6
): WordChoice[] {
  return pickWordsWithCooldown(scriptWords, count, 9);
}

export function scrambleLetters(word: string): string[] {
  const arr = word.split('');
  for (let pass = 0; pass < 6; pass++) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    if (arr.join('') !== word) return arr;
  }
  return arr.reverse();
}
