export interface CharacterFortuneOption {
  id: string;
  name: string;
  color: string;
}

export interface TimelineTagPoint {
  nodeId: string;
  percentX: number; // 0 to 100% horizontally along the timeline
  fortune: number;  // -100 to +100 vertically along G-I axis
  characterId: string;
  characterName: string;
  characterColor: string;
}

export interface SelectedFortuneNode {
  charId: string;
  nodeId: string;
}
