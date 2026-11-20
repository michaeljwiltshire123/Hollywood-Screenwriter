import rawWordBank from '../../data/break_words/wordBank.json';
import { ScriptWordEntry, WordChoice } from './breakGameTypes';

export const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const STORAGE_KEY = 'screenwriter_word_cooldown_v1';

const BANK_WORDS: string[] = Array.from(
  new Set(
    (rawWordBank as string[])
      .map((w) => w.trim().toUpperCase())
      .filter((w) => /^[A-Z]{4,9}$/.test(w))
  )
);

export function getBankWordCount(): number {
  return BANK_WORDS.length;
}

function loadCooldowns(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveCooldowns(map: Record<string, number>, now: number): void {
  try {
    const pruned: Record<string, number> = {};
    for (const [word, ts] of Object.entries(map)) {
      if (typeof ts === 'number' && now - ts < SEVEN_DAYS_MS) {
        pruned[word] = ts;
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pruned));
  } catch {
    // Ignore storage quota or private mode failures
  }
}

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function pickWordsWithCooldown(
  scriptWords: ScriptWordEntry[] = [],
  count = 6,
  maxLen = 9
): WordChoice[] {
  const now = Date.now();
  const cooldowns = loadCooldowns();
  const isReady = (w: string) => now - (cooldowns[w] ?? 0) >= SEVEN_DAYS_MS;

  const eligibleScript = shuffleArray(
    scriptWords.filter((s) => s.word.length >= 4 && s.word.length <= maxLen && isReady(s.word))
  );

  const chosen: WordChoice[] = [];
  const usedSet = new Set<string>();
  const maxScriptPicks = Math.min(2, count, eligibleScript.length);

  for (let i = 0; i < maxScriptPicks; i++) {
    if (Math.random() < 0.45 || chosen.length === 0) {
      const pick = eligibleScript[i];
      chosen.push({ word: pick.word, origin: pick.origin });
      usedSet.add(pick.word);
    }
  }

  const validBank = BANK_WORDS.filter((w) => w.length <= maxLen && !usedSet.has(w));
  const freshBank = shuffleArray(validBank.filter(isReady));
  const fallbackBank = shuffleArray(validBank.filter((w) => !isReady(w)))
    .sort((a, b) => (cooldowns[a] ?? 0) - (cooldowns[b] ?? 0));

  for (const word of [...freshBank, ...fallbackBank]) {
    if (chosen.length >= count) break;
    chosen.push({ word, origin: 'bank' });
    usedSet.add(word);
  }

  for (const item of chosen) {
    cooldowns[item.word] = now;
  }
  saveCooldowns(cooldowns, now);

  return shuffleArray(chosen);
}
