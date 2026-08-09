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
  targetCharacter?: string; // Character featured/framed in shot
  movementDetail?: string; // e.g. Whip pan, Dolly push-in, Handheld
  transitionFromPrev?: string; // Transition note from previous shot/scene
  transitionToNext?: string; // Transition note to next shot/scene
  otherNotes?: string; // Additional director/DOP notes
}

export interface ProductionScheduleDay {
  id: string;
  dayNumber: number;
  date: string;
  shootStartTime: string;
  shootEndTime: string;
  locationName: string;
  notes: string;
  sceneIds: string[]; // Ordered list of scene IDs or banner strings (e.g. "BANNER:LUNCH:13:00")
}

export interface CallSheetCharacter {
  id: string;
  characterName: string;
  actorName: string;
  pickupTime: string; // Used as Report Time or Driver Pickup Time
  hmuTime: string;
  setCallTime: string;
  scenes: string;
  travelType?: 'PICKUP' | 'SELF_REPORT';
  notes?: string;
}

export interface DepartmentCall {
  id: string;
  department: string;
  callTime: string;
  notes: string;
}

export interface CallSheetLocation {
  id: string;
  name: string;
  address: string;
  postcode?: string;
  type: 'SET' | 'BASECAMP' | 'PARKING' | 'HOSPITAL' | 'CATERING';
  notes?: string;
}

export interface CallSheetData {
  shootDate: string;
  generalCallTime: string;
  breakfastTime: string;
  estimatedWrapTime: string;
  locationName: string;
  locationAddress: string;
  nearestHospital: string;
  weatherForecast: string;
  sunriseTime: string;
  sunsetTime: string;
  characters: CallSheetCharacter[];
  directorName: string;
  producerName: string;
  dopName: string;
  generalNotes: string;
  departmentCalls?: DepartmentCall[];
  locations?: CallSheetLocation[];
  selectedDayNumber?: number;
}

export interface RiskAssessmentItem {
  id: string;
  hazard: string;
  category: string; // e.g. "Night Shoot", "Stunts/Fights", "Vehicles/Traffic", "Water/Wet", "Electrical", "General"
  riskLevel: 'HIGH' | 'MED' | 'LOW';
  likelihood: 'HIGH' | 'MED' | 'LOW';
  controlMeasures: string;
  responsiblePerson: string;
}

export type ReleaseFormType = 'TALENT' | 'LOCATION' | 'EXTRA' | 'MATERIALS' | 'MINOR' | 'MUSIC' | 'CROWD_NOTICE';

export interface ReleaseFormItem {
  id: string;
  formType: ReleaseFormType;
  grantorName: string;
  grantorContact: string;
  projectTitle: string;
  producerName: string;
  compensation: string;
  date: string;
  locationDetails?: string;
  notes?: string;
  status: 'DRAFT' | 'READY TO SIGN' | 'SIGNED';
  agreementText?: string; // Written body of the contract/release (fully editable)
  artworkDetails?: string; // For Materials / Artwork release
  musicDetails?: string; // For Music release
  parentGuardianName?: string; // For Minor release
  distributionChannels?: string; // For Crowd Notice / Public filming
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
  productionLogoUrl?: string; // Watermark / Production Company Logo Data URL
  callSheetData?: CallSheetData;
  riskAssessments?: RiskAssessmentItem[];
  releaseForms?: ReleaseFormItem[];
  productionScheduleDays?: ProductionScheduleDay[];
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
