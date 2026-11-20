export { checkEmojiGuess, formatTitlePattern, normaliseTitle, type MatchResult } from './emojiFuzzyMatch';

export interface EmojiMovie {
  id?: string;
  type?: 'Film' | 'TV';
  emojis: string;
  title: string;
  clue: string;
}

const SEEN_KEY = 'screenwriter_emoji_seen_v1';
let cachedBank: EmojiMovie[] | null = null;

export const EMOJI_MOVIES_POOL: EmojiMovie[] = [
  { id: 'core-1', type: 'Film', emojis: '🦖🌴🚙', title: 'JURASSIC PARK', clue: 'Dinosaur theme park thriller' },
  { id: 'core-2', type: 'Film', emojis: '🚢🧊💎', title: 'TITANIC', clue: 'Maiden voyage disaster romance' },
  { id: 'core-3', type: 'Film', emojis: '🧙‍♂️💍🌋', title: 'THE LORD OF THE RINGS', clue: 'One ring to rule them all' },
  { id: 'core-4', type: 'Film', emojis: '🕷️🧑🕸️', title: 'SPIDER-MAN', clue: 'Bitten by a radioactive arachnid' },
  { id: 'core-5', type: 'Film', emojis: '🦇🃏🌃', title: 'THE DARK KNIGHT', clue: 'Gotham’s caped crusader vs chaos' },
  { id: 'core-6', type: 'Film', emojis: '🦈🏖️🚤', title: 'JAWS', clue: 'You’re gonna need a bigger boat' },
  { id: 'core-7', type: 'Film', emojis: '🎈🏠👴', title: 'UP', clue: 'Floating house to Paradise Falls' },
  { id: 'core-8', type: 'Film', emojis: '🦁👑🌅', title: 'THE LION KING', clue: 'Circle of life on Pride Rock' },
  { id: 'core-9', type: 'Film', emojis: '👻🚫🔫', title: 'GHOSTBUSTERS', clue: 'Who you gonna call?' },
  { id: 'core-10', type: 'Film', emojis: '🚀👨‍🚀🥔', title: 'THE MARTIAN', clue: 'Stranded botanist growing spuds' },
  { id: 'core-11', type: 'Film', emojis: '🤠🚀🧸', title: 'TOY STORY', clue: 'To infinity and beyond!' },
  { id: 'core-12', type: 'TV', emojis: '🧪💎🚐', title: 'BREAKING BAD', clue: 'Chemistry teacher cooks blue crystal in an RV' },
];

export async function loadFullEmojiPool(): Promise<EmojiMovie[]> {
  if (cachedBank) return cachedBank;
  try {
    const mod = await import('../../data/break_words/emojiMediaBank.json');
    const items = Array.isArray(mod.default) ? (mod.default as EmojiMovie[]) : [];
    cachedBank = items.length >= 12 ? items : EMOJI_MOVIES_POOL;
  } catch {
    cachedBank = EMOJI_MOVIES_POOL;
  }
  return cachedBank;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getSeenIds(): Set<string> {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch { return new Set(); }
}

function saveSeenIds(ids: Set<string>): void {
  try { localStorage.setItem(SEEN_KEY, JSON.stringify([...ids])); } catch { /* ignore */ }
}

export function pickEmojiMovies(count = 5, pool = cachedBank ?? EMOJI_MOVIES_POOL): EmojiMovie[] {
  const getId = (m: EmojiMovie) => m.id ?? m.title;
  const seen = getSeenIds();
  let available = pool.filter((m) => !seen.has(getId(m)));
  if (available.length < count) {
    for (const m of pool) seen.delete(getId(m));
    available = [...pool];
  }
  const chosen = shuffle(available).slice(0, count);
  for (const m of chosen) seen.add(getId(m));
  saveSeenIds(seen);
  return chosen;
}
