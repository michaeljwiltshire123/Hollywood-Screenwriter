const RECENT_LIMIT = 15;
const categoryDecks: Record<string, string[]> = {};
const recentTemplates: string[] = [];

function shuffleTemplates(items: string[]): string[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function recordDrawnTemplate(template: string): void {
  const existingIdx = recentTemplates.indexOf(template);
  if (existingIdx !== -1) recentTemplates.splice(existingIdx, 1);
  recentTemplates.push(template);
  if (recentTemplates.length > RECENT_LIMIT) {
    recentTemplates.shift();
  }
}

export function pickFromDeck(deckKey: string, eligible: string[]): string {
  if (eligible.length === 0) return '';
  const eligibleSet = new Set(eligible);
  let deck = (categoryDecks[deckKey] || []).filter((t) => eligibleSet.has(t));
  if (deck.length === 0) {
    deck = shuffleTemplates(eligible);
  }

  const recentSet = new Set(recentTemplates);
  let idx = deck.findIndex((t) => !recentSet.has(t));
  if (idx === -1) {
    deck = shuffleTemplates(eligible);
    idx = deck.findIndex((t) => !recentSet.has(t));
  }

  let picked: string;
  if (idx !== -1) {
    picked = deck.splice(idx, 1)[0];
  } else {
    const oldestRecent = recentTemplates.find((t) => eligibleSet.has(t));
    picked = oldestRecent || deck.shift() || eligible[0];
    deck = deck.filter((t) => t !== picked);
  }

  categoryDecks[deckKey] = deck;
  recordDrawnTemplate(picked);
  return picked;
}
