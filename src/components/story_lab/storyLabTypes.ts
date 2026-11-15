import { StoryArcCard } from '../../types';

export interface StoryLabActDef {
  id: string;
  actNumber: number;
  actLabel: string;
  actTitle: string;
  targetRange: string;
  percentStart: number;
  percentEnd: number;
  defaultGoal: string;
  ideaPrompts: string[];
}

export type StoryLabPreset = '3-Act' | '5-Act';

export interface StoryLabPacingMetrics {
  targetMinutes: number;
  estimatedMinutes: number;
  actOneMins: number;
  actTwoMins: number;
  actThreeMins: number;
}

export interface GuidedStorySparkAnswers {
  endingEmotion: string;
  actThreeClimax: string;
  actOneRhyme: string;
  actTwoMiddle: string;
}

export interface FiveActExpansionAnswers {
  furthestPointAct3: string;
  outsideEventsAct2: string;
  preparationObstacleAct4: string;
}

export interface SubPlotPocketBridge {
  subPlots: import('../../types').SubPlotTrack[];
  openActIndex: number | null;
  pocketSubPlot: import('../../types').SubPlotTrack | null;
  slideOverride: 'left' | 'right' | null;
  onTogglePocket: (actIndex: number, subPlotId?: string) => void;
  onCreateForPocket: (actIndex: number) => void;
  onFlipSide: (defaultSide: 'left' | 'right') => void;
  onClosePocket: () => void;
  onUpdateCard: (subPlotId: string, cardIdx: number, field: 'actTitle' | 'goal', val: string) => void;
  onRename: (id: string, name: string) => void;
  onChangeColor: (id: string, color: string) => void;
  onChangeEmotion: (id: string, emotion: string) => void;
  onDelete: (id: string) => void;
  onIdeaGen: (card: StoryArcCard, subPlotName: string) => void;
}

