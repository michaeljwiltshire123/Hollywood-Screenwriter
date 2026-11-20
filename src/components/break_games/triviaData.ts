export interface TriviaQuestion {
  id?: string;
  cat?: string;
  q: string;
  options: string[];
  answer: number;
}

const SEEN_KEY = 'screenwriter_trivia_seen_v2';
let cachedBank: TriviaQuestion[] | null = null;

export const TRIVIA_POOL: TriviaQuestion[] = [
  { id: 'core-1', cat: 'Screenwriting', q: 'What is the standard industry screenplay font?', options: ['Times New Roman', 'Courier Prime / Courier 12pt', 'Arial 11pt', 'Helvetica'], answer: 1 },
  { id: 'core-2', cat: 'Screenwriting', q: 'Roughly how much screen time does one script page equal?', options: ['1 minute', '2 minutes', '30 seconds', '5 minutes'], answer: 0 },
  { id: 'core-3', cat: 'Screenwriting', q: 'What does EXT. stand for in a scene heading?', options: ['Exterior', 'Extended', 'Extra', 'External Cut'], answer: 0 },
  { id: 'core-4', cat: 'Story Structure', q: 'Which act in a three-act structure contains the Climax?', options: ['Act I', 'Act II', 'Act III', 'Prologue'], answer: 2 },
  { id: 'core-5', cat: 'Screenwriting', q: 'What does V.O. beside a character name indicate?', options: ['Visual Overlay', 'Voice Over', 'Video Out', 'Volume Off'], answer: 1 },
  { id: 'core-6', cat: 'Screenwriting', q: 'What does O.S. beside a character name mean?', options: ['On Screen', 'Off Screen', 'Opening Shot', 'Over Shoulder'], answer: 1 },
  { id: 'core-7', cat: 'Screenwriting', q: 'Where does a parenthetical (wryly) appear?', options: ['Above the slugline', 'Below the character name', 'In the footer', 'After FADE OUT'], answer: 1 },
  { id: 'core-8', cat: 'Screenwriting', q: 'What is a "beat" in dialogue?', options: ['A music cue', 'A short dramatic pause', 'A camera dolly', 'A scene deletion'], answer: 1 },
  { id: 'core-9', cat: 'Cinematography', q: 'Which camera shot frames only a character’s eyes or small detail?', options: ['Wide Shot', 'Extreme Close-Up', 'Two-Shot', 'Establishing Shot'], answer: 1 },
  { id: 'core-10', cat: 'Screenwriting', q: 'What is a one-sentence summary of a screenplay called?', options: ['Treatment', 'Logline', 'Beat Sheet', 'Call Sheet'], answer: 1 },
  { id: 'core-11', cat: 'Screenwriting', q: 'What does INT./EXT. in a slugline signify?', options: ['Intercut only', 'Both interior and exterior', 'Internal monologue', 'Interim scene'], answer: 1 },
  { id: 'core-12', cat: 'Production', q: 'Who oversees lighting and rigging equipment on set?', options: ['Foley Artist', 'Gaffer / Grip', 'Script Supervisor', 'Boom Operator'], answer: 1 },
];

export async function loadFullTriviaPool(): Promise<TriviaQuestion[]> {
  if (cachedBank) return cachedBank;
  try {
    const mod = await import('../../data/break_words/triviaBank.json');
    const items = Array.isArray(mod.default) ? (mod.default as TriviaQuestion[]) : [];
    cachedBank = items.length >= 12 ? items : TRIVIA_POOL;
  } catch {
    cachedBank = TRIVIA_POOL;
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

function shuffleOptions(item: TriviaQuestion): TriviaQuestion {
  const indexed = shuffle(item.options.map((text, idx) => ({ text, isAns: idx === item.answer })));
  return { ...item, options: indexed.map((o) => o.text), answer: indexed.findIndex((o) => o.isAns) };
}

export function pickTriviaQuestions(count = 4, pool = cachedBank ?? TRIVIA_POOL): TriviaQuestion[] {
  const getId = (q: TriviaQuestion) => q.id ?? q.q;
  const seen = getSeenIds();
  let available = pool.filter((q) => !seen.has(getId(q)));
  if (available.length < count) {
    for (const q of pool) seen.delete(getId(q));
    available = [...pool];
  }
  const chosen = shuffle(available).slice(0, count);
  for (const q of chosen) seen.add(getId(q));
  saveSeenIds(seen);
  return chosen.map(shuffleOptions);
}
