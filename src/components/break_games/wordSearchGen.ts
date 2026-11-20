import { ScriptWordEntry, WordChoice } from './breakGameTypes';
import { pickWordsWithCooldown } from './wordCooldownTracker';

export interface WordSearchPuzzle {
  grid: string[][];
  words: WordChoice[];
}

const DIRS = [[0, 1], [1, 0], [1, 1], [1, -1], [0, -1], [-1, 0]];
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function generateWordSearch(
  size = 8,
  count = 5,
  scriptWords: ScriptWordEntry[] = []
): WordSearchPuzzle {
  const grid = Array.from({ length: size }, () => Array(size).fill(''));
  const chosen = pickWordsWithCooldown(scriptWords, count, size)
    .sort((a, b) => b.word.length - a.word.length);
  const placed: WordChoice[] = [];

  for (const item of chosen) {
    const word = item.word;
    for (let tries = 0; tries < 120; tries++) {
      const [dr, dc] = DIRS[Math.floor(Math.random() * DIRS.length)];
      const r0 = Math.floor(Math.random() * size);
      const c0 = Math.floor(Math.random() * size);
      const rEnd = r0 + dr * (word.length - 1);
      const cEnd = c0 + dc * (word.length - 1);
      if (rEnd < 0 || rEnd >= size || cEnd < 0 || cEnd >= size) continue;
      let ok = true;
      for (let i = 0; i < word.length; i++) {
        const ch = grid[r0 + dr * i][c0 + dc * i];
        if (ch !== '' && ch !== word[i]) { ok = false; break; }
      }
      if (!ok) continue;
      for (let i = 0; i < word.length; i++) grid[r0 + dr * i][c0 + dc * i] = word[i];
      placed.push(item);
      break;
    }
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === '') grid[r][c] = ALPHA[Math.floor(Math.random() * ALPHA.length)];
    }
  }
  return { grid, words: placed };
}

export function getLineCells(r0: number, c0: number, r1: number, c1: number): [number, number][] {
  const dr = r1 - r0, dc = c1 - c0;
  const steps = Math.max(Math.abs(dr), Math.abs(dc));
  if (steps === 0) return [[r0, c0]];
  if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return [];
  const sr = Math.sign(dr), sc = Math.sign(dc);
  return Array.from({ length: steps + 1 }, (_, i) => [r0 + sr * i, c0 + sc * i]);
}
