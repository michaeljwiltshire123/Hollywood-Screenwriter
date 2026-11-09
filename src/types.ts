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
  highlightColor?: string; // Soft pastel hex code for actor dialogue highlighting
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
  shotType: string;
  angle: string;
  lens: string;
  equipment: string; // e.g. "Tripod, Gimbal | Handheld with anamorphic lens"
  description?: string; // Framing action, camera description & notes
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

export interface ShotSetupItem {
  id: string;
  shotNumber: string; // e.g. "1A", "1B"
  setup: string; // e.g. "Wide", "Close Up", "Tracking"
  lens: string; // e.g. "35mm anamorphic"
  description: string;
  estimatedTimeMinutes?: number;
  status: 'PLANNED' | 'COMPLETED';
}

export interface ScheduleRowItem {
  id: string;
  time: string;
  sceneNumber: string;
  intExt: string; // 'Int' | 'Ext' or custom
  unitNumber?: number; // 1 to 15, undefined/0 for unassigned
  location?: string; // Parsed scene location (e.g. "COMMAND TENT")
  description: string;
  dayNight: string; // 'Day' | 'Night' or custom
  notes: string;
  characterTags: string[];
  propTags?: string[];
  isExterior: boolean;
  type?: 'SCENE' | 'BREAK';
  durationHours?: number;
  shotIds?: string[];
  shots?: ShotSetupItem[];
  isExpanded?: boolean;
}

export interface ShootScheduleDaySheet {
  dayNumber: number;
  dateStr: string; // e.g. "2026-11-05"
  title: string;
  isRestDay: boolean; // True if day off / non-shooting day
  notes?: string;
  rows: ScheduleRowItem[];
}

export interface CallSheetData {
  shootDate: string;
  dateFrom?: string; // Multi-day start date
  dateTo?: string; // Multi-day end date
  activeDayNumber?: number; // Currently viewed day in accordion (1-indexed)
  days?: ShootScheduleDaySheet[]; // Multi-day sheets
  isHighlightModeActive?: boolean; // Defaults strictly to false
  activeFilter?: 'ALL' | 'CAST' | 'LOCATION' | 'PROPS' | 'CAMERA';
  activeUnitFilter?: number | 'ALL'; // 'ALL' or unit number 1..15
  unitsCount?: number; // Max 15
  selectedRowIds?: string[]; // Serialised array for persistence
  rows?: ScheduleRowItem[];
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
  wardrobeLocation?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  additionalContacts?: { id: string; name: string; role: string; phone: string }[];
  generalNotes?: string;
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
  isActorHighlightingActive?: boolean; // Strictly defaults to false (OFF)
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
