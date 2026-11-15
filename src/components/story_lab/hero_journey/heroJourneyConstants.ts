import { HeroJourneyPacing } from '../../../types';

export interface HeroJourneyStageDef {
  index: number;
  title: string;
  actGroup: 0 | 1 | 2;
  promptHint: string;
  writingTip: string;
}

export const HERO_JOURNEY_STAGES: HeroJourneyStageDef[] = [
  {
    index: 0, title: 'Ordinary World', actGroup: 0,
    promptHint: 'Everyday life and central flaw before change strikes.',
    writingTip: "Establish your protagonist's everyday life, flaw, and status quo. Show what makes them tick and what is missing before disruption strikes.",
  },
  {
    index: 1, title: 'Call to Adventure', actGroup: 0,
    promptHint: 'Inciting spark that disrupts the status quo.',
    writingTip: 'The catalyst that disrupts the status quo. An event, threat, or challenge appears that demands action and sets the journey in motion.',
  },
  {
    index: 2, title: 'Refusal of the Call', actGroup: 0,
    promptHint: 'Hesitation, fear, or stakes holding them back.',
    writingTip: 'Fear, doubt, or duty holds the protagonist back. They hesitate to leave their comfort zone until urgency forces them forward.',
  },
  {
    index: 3, title: 'Meeting the Mentor', actGroup: 0,
    promptHint: 'Guidance, tool, or wisdom that gives courage.',
    writingTip: 'A guide, ally, or revelation provides insight, training, courage, or an essential tool needed to survive the journey ahead.',
  },
  {
    index: 4, title: 'Crossing the Threshold', actGroup: 1,
    promptHint: 'Point of no return entering the unfamiliar world.',
    writingTip: 'The point of no return. The protagonist commits fully and crosses into the unfamiliar special world where new rules apply.',
  },
  {
    index: 5, title: 'Tests, Allies & Enemies', actGroup: 1,
    promptHint: 'First trials, new friendships, and early opposition.',
    writingTip: 'First trials in the new world. The protagonist learns the ropes, gains vital allies, and identifies rivals blocking their way.',
  },
  {
    index: 6, title: 'Approach to the Inmost Cave', actGroup: 1,
    promptHint: 'Preparing to face the central danger or secret.',
    writingTip: 'Preparation and rising tension. Plans are laid, bonds tested, and the protagonist confronts internal fears before entering danger.',
  },
  {
    index: 7, title: 'The Ordeal', actGroup: 1,
    promptHint: 'Major midpoint or dark crisis where everything is tested.',
    writingTip: 'The central life-or-death crucible. The protagonist faces their greatest enemy or worst fear and must transform to survive.',
  },
  {
    index: 8, title: 'Reward (Seizing the Sword)', actGroup: 2,
    promptHint: 'Hard-won prize, truth, or fleeting relief after crisis.',
    writingTip: 'Having survived the ordeal, the protagonist claims the prize, truth, or breakthrough. A fleeting relief before consequences hit.',
  },
  {
    index: 9, title: 'The Road Back', actGroup: 2,
    promptHint: 'Consequences strike back as the return begins.',
    writingTip: 'Urgency spikes as the return journey begins. Antagonists retaliate or a ticking clock forces a rush to the final showdown.',
  },
  {
    index: 10, title: 'The Resurrection', actGroup: 2,
    promptHint: 'Final climax proving transformation under pressure.',
    writingTip: 'The ultimate climax. The protagonist faces a final exam of their growth, risking everything to conquer the conflict definitively.',
  },
  {
    index: 11, title: 'Return with the Elixir', actGroup: 2,
    promptHint: 'Changed hero brings wisdom or balance home.',
    writingTip: 'The protagonist returns home transformed, sharing newfound wisdom or balance that delivers a satisfying, complete resolution.',
  },
];

export const PACING_BADGE_MAP: Record<HeroJourneyPacing, { bg: string; text: string; border: string }> = {
  Slow: { bg: '#DCFCE7', text: '#166534', border: '#86EFAC' },
  Moderate: { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
  Fast: { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
};

export function getStageWritingTip(stageIndex: number, isCustom?: boolean): string {
  if (isCustom) {
    return 'A custom beat pinned to the timeline. Detail the character choices, obstacles, and scene changes occurring at this moment.';
  }
  return HERO_JOURNEY_STAGES[stageIndex]?.writingTip || 'Write the key turning points, character choices, and obstacles for this story milestone.';
}
