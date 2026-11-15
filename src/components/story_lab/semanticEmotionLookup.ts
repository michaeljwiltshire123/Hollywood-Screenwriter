// Zero-AI Cinematic Emotion Constellation Mapper by Category
export type EmotionCategory = 'Positive' | 'Negative' | 'Neutral';

const CATEGORY_MAP: Record<EmotionCategory, string[]> = {
  Positive: [
    'Triumphant', 'Cathartic', 'Vindicated', 'Restored', 'Radiant',
    'Euphoric', 'Exhilarated', 'Heartwarming', 'Optimistic', 'Reinspired',
    'Empowered', 'Ecstatic', 'Joyous', 'Thrilling', 'Enchanting',
    'Exuberant', 'Glorious', 'Uplifted', 'Transcendent', 'Invincible',
  ],
  Negative: [
    'Heartbreaking', 'Devastating', 'Chilling', 'Ominous', 'Haunting',
    'Terrifying', 'Suspenseful', 'Furious', 'Unsettling', 'Visceral',
    'Desolate', 'Foreboding', 'Agonising', 'Claustrophobic', 'Gut-wrenching',
    'Sinister', 'Treacherous', 'Explosive', 'Isolated', 'Paralysing',
  ],
  Neutral: [
    'Bittersweet', 'Poignant', 'Nostalgic', 'Melancholic', 'Elegiac',
    'Reflective', 'Contemplative', 'Soulful', 'Intriguing', 'Thought-provoking',
    'Ambiguous', 'Enigmatic', 'Hypnotic', 'Mesmerising', 'Wistful',
    'Sombre', 'Stoic', 'Philosophical', 'Quiet', 'Hauntingly Calm',
  ],
};

const KEYWORD_VALENCE: Record<string, EmotionCategory> = {
  good: 'Positive', happy: 'Positive', nice: 'Positive', cool: 'Positive', love: 'Positive', funny: 'Positive',
  bad: 'Negative', scary: 'Negative', dark: 'Negative', angry: 'Negative',
  sad: 'Neutral',
};

export async function fetchSemanticEmotionSuggestions(
  queryWords: string[],
  category: EmotionCategory = 'Positive'
): Promise<string[]> {
  const cleanInput = queryWords.map((w) => w.trim().toLowerCase()).filter(Boolean);
  const baseList = CATEGORY_MAP[category] || CATEGORY_MAP.Positive;

  if (cleanInput.length === 0) {
    return baseList.slice(0, 15);
  }

  const matched: string[] = [];
  for (const word of cleanInput) {
    for (const [key, val] of Object.entries(KEYWORD_VALENCE)) {
      if (word.includes(key) && val === category) {
        baseList.forEach((item) => {
          if (!matched.includes(item) && !cleanInput.includes(item.toLowerCase())) {
            matched.push(item);
          }
        });
      }
    }
  }

  const combined = Array.from(new Set([...matched, ...baseList]));
  return combined
    .filter((w) => !cleanInput.includes(w.toLowerCase()))
    .slice(0, 15);
}


