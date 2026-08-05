export type ElementType =
  | 'SCENE HEADING'
  | 'ACTION'
  | 'CHARACTER'
  | 'PARENTICAL'
  | 'DIALOGUE'
  | 'TRANSITION'
  | 'SHOT'
  | 'NOTE';

export interface ScreenplayElement {
  id: string;
  type: ElementType;
  content: string;
  sceneNumber?: string;
  meta?: {
    characterName?: string;
    noteAuthor?: string;
    color?: string;
    alternateVersion?: string;
  };
}

export interface TitlePage {
  title: string;
  credit: string; // e.g. "Written by"
  author: string;
  source: string; // e.g. "Based on the story by..."
  contact: string;
  date: string;
  draftColor?: string;
}

export interface CharacterMetadata {
  age?: string;
  appearance?: string;
  attitude?: string;
  actionInFirstScene?: string;
  internalFlaw?: string;
  coreMotivation?: string;
  visualDescription?: string;
  actorNotes?: string;
}

export interface StoryArcCard {
  id: string;
  actTitle: string;
  goal: string;
  sketchId?: string;       // Pinned reference sketch ID from shots
  linkedSceneId?: string;  // Attached scene ID
}

export interface StoryArcStructure {
  preset: '3-Act' | '5-Act' | 'Hero’s Journey' | 'Custom';
  cards: StoryArcCard[];
}

export interface ShotInfo {
  id: string;
  sceneHeadingId: string; // references scene ID
  shotNumber: string;
  shotType: 'WIDE' | 'MEDIUM' | 'CLOSE-UP' | 'EXTREME CLOSE-UP' | 'ESTABLISHING' | 'POV' | 'OVER-THE-SHOULDER' | 'INSERT' | 'AERIAL' | 'OTHER';
  angle: string;
  lens: string;
  equipment: string; // e.g. "Tripod, Gimbal | Handheld with anamorphic lens"
  estimatedTimeMin: number;
  sketchDataUrl?: string; // Base64 image
}

export interface ScreenplayDocument {
  id: string;
  title: string;
  author: string;
  description: string;
  draftStatus: 'DRAFT' | 'REVISION' | 'POLISH' | 'FINAL';
  version: number;
  createdAt: string;
  updatedAt: string;
  titlePage: TitlePage;
  elements: ScreenplayElement[];
  characterBibles?: Record<string, CharacterMetadata>;
  storyArc?: StoryArcStructure;
  shots?: ShotInfo[];
  productionNotes?: string;
  editorFont?: 'Courier Prime' | 'Courier New';
  targetLength?: number; // Target film length in minutes
}

export interface RevisionHistoryItem {
  id: string;
  scriptId: string;
  timestamp: string;
  label: string;
  elementCount: number;
  elements: ScreenplayElement[];
}

export interface CursorPosition {
  elementId: string;
  offset: number;
}

export interface CharacterInfo {
  name: string;
  dialogueCount: number;
  wordCount: number;
  firstAppearedScene: string;
  percentage: number;
  description?: string;
}

export interface SceneInfo {
  id: string;
  heading: string;
  sceneNumber: string;
  elementIndex: number;
  lengthLines: number;
  characters: string[];
}
