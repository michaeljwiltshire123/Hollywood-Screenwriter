export type MatchResult = 'exact' | 'fuzzy' | 'close' | 'miss';

const NUM_TOKENS: Record<string, string> = {
  '1': 'ONE', '2': 'TWO', '3': 'THREE', '4': 'FOUR', '5': 'FIVE',
  '6': 'SIX', '7': 'SEVEN', '8': 'EIGHT', '9': 'NINE', '10': 'TEN',
  '11': 'ELEVEN', '12': 'TWELVE', '13': 'THIRTEEN',
  ONE: '1', TWO: '2', THREE: '3', FOUR: '4', FIVE: '5',
  SIX: '6', SEVEN: '7', EIGHT: '8', NINE: '9', TEN: '10',
  II: '2', III: '3', IV: '4', SE7EN: 'SEVEN',
};
const FILLERS = new Set(['THE', 'A', 'AN', 'OF', 'AND', 'IN', 'ON', 'AT', 'TO', 'FOR']);

export function formatTitlePattern(title: string, revealFirst: boolean): string {
  return title.split(' ').map((w) => {
    let seen = false;
    return [...w].map((ch) => (!/[A-Z0-9]/i.test(ch) ? ch : revealFirst && !seen ? ((seen = true), ch) : '_')).join('');
  }).join('  ');
}

export function normaliseTitle(s: string, dropFillers = false, swapNums = false): string {
  const clean = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/&/g, ' AND ').replace(/[^A-Z0-9 ]/g, ' ');
  const words = clean.trim().split(/\s+/).filter(Boolean).map((w) => (swapNums && NUM_TOKENS[w] ? NUM_TOKENS[w] : w));
  const filtered = dropFillers ? words.filter((w) => !FILLERS.has(w)) : words;
  return (filtered.length > 0 ? filtered : words).join('');
}

function phoneticKey(s: string): string {
  return s
    .replace(/PH/g, 'F').replace(/KN/g, 'N').replace(/WR/g, 'R').replace(/PS/g, 'S')
    .replace(/QU/g, 'KW').replace(/CK/g, 'K').replace(/DG/g, 'J').replace(/GH/g, '')
    .replace(/(TION|SION)/g, 'XN').replace(/(CH|SH)/g, 'X').replace(/C(?=[EIY])/g, 'S')
    .replace(/C/g, 'K').replace(/X/g, 'KS').replace(/Z/g, 'S')
    .replace(/(OUILLE|UILLE|OUIL|OOEY|OEY)/g, 'UY').replace(/(EE|EA|IE|EI)/g, 'E')
    .replace(/(OO|OU)/g, 'U').replace(/(AI|AY)/g, 'A').replace(/(.)\1+/g, '$1');
}

function damerauDist(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  const d: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let val = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) val = Math.min(val, d[i - 2][j - 2] + 1);
      d[i][j] = val;
    }
  }
  return d[m][n];
}

function maxTypos(len: number): number {
  if (len <= 4) return 0;
  if (len <= 6) return 1;
  if (len <= 11) return 2;
  return Math.min(4, Math.floor(len * 0.25));
}

function getTargets(title: string): string[] {
  const parts = [title];
  if (title.includes(': ')) {
    const [head, tail] = title.split(': ');
    if (tail && tail.replace(/[^A-Z0-9]/gi, '').length >= 5) parts.push(tail);
    if (head && head.replace(/[^A-Z0-9]/gi, '').length >= 6) parts.push(head);
  }
  return parts;
}

export function checkEmojiGuess(guess: string, title: string): MatchResult {
  const gExact = normaliseTitle(guess, false, false);
  if (!gExact) return 'miss';
  if (gExact === normaliseTitle(title, false, false)) return 'exact';
  let bestGap = Infinity;
  for (const cand of getTargets(title)) {
    for (const [drop, swap] of [[false, false], [true, false], [true, true]] as const) {
      const g = normaliseTitle(guess, drop, swap), t = normaliseTitle(cand, drop, swap);
      if (!g || !t) continue;
      if (g === t) return 'fuzzy';
      const dist = damerauDist(g, t), budget = maxTypos(t.length);
      if (dist <= budget) return 'fuzzy';
      if (t.length >= 4 && damerauDist(phoneticKey(g), phoneticKey(t)) <= (t.length >= 11 ? 2 : t.length >= 6 ? 1 : 0)) return 'fuzzy';
      bestGap = Math.min(bestGap, dist - budget);
    }
  }
  return bestGap <= 1 ? 'close' : 'miss';
}
