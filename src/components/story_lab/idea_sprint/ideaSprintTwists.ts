// Zero-AI Static Provocative Story Twist Cards for Idea Sprint
export const ZERO_AI_STORY_TWISTS: string[] = [
  "What if the protagonist's biggest secret was exposed to everyone in the room?",
  "What if the exact opposite of what the hero wanted actually happened?",
  "What if the antagonist was acting out of love or protection?",
  "What if time ran out 10 minutes sooner than expected?",
  "What if the protagonist lost their primary asset or ally right before the climax?",
  "What if the victory had an unexpected, tragic side-effect?",
  "What if the hero had to make a sacrifice they swore they would never make?",
  "What if the ordinary world turned against the protagonist from Scene 1?",
  "What if the safest location in the script became the most dangerous trapped space?",
  "What if the character achieved their external goal but realised it destroyed their internal peace?",
];

export function getRandomStoryTwist(): string {
  const index = Math.floor(Math.random() * ZERO_AI_STORY_TWISTS.length);
  return ZERO_AI_STORY_TWISTS[index];
}
