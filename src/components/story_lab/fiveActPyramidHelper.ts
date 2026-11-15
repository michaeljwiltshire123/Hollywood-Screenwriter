import { StoryArcCard } from '../../types';

export interface FiveActPyramidModel {
  apexCard: StoryArcCard;         // New Act III (Apex / furthest point)
  leftShoulderCard: StoryArcCard; // New Act II (External disruption)
  rightShoulderCard: StoryArcCard;// New Act IV (Preparation / obstacle)
  bottomLeftCard: StoryArcCard;   // Original 3-Act Beginning (Act 1)
  bottomMiddleCard: StoryArcCard; // Original 3-Act Middle (Act 2 - faded)
  bottomRightCard: StoryArcCard;  // Original 3-Act Ending (Act 3 / Act 5)
}

export function extractFiveActPyramid(cards: StoryArcCard[]): FiveActPyramidModel {
  const bottomMiddle = cards.find((c) => (c as any).isFadedMiddle || c.id === 'original-act-2-faded')
    || { id: 'original-act-2-faded', actTitle: 'Original Act II Middle', goal: 'Faded 3-Act Middle' };

  const bottomLeft = cards[0] || { id: 'act-1', actTitle: 'Beginning', goal: '' };
  const leftShoulder = cards[1] || { id: 'act-2', actTitle: 'External Disruption', goal: '' };
  const apex = cards[2] || { id: 'act-3', actTitle: 'Furthest Point', goal: '' };
  const rightShoulder = cards[3] || { id: 'act-4', actTitle: 'Preparation & Obstacle', goal: '' };
  const bottomRight = cards[4] || { id: 'act-5', actTitle: 'Ending / Climax', goal: '' };

  return {
    apexCard: apex,
    leftShoulderCard: leftShoulder,
    rightShoulderCard: rightShoulder,
    bottomLeftCard: bottomLeft,
    bottomMiddleCard: bottomMiddle,
    bottomRightCard: bottomRight,
  };
}
