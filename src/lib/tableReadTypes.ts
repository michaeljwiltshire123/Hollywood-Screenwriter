/**
 * Table Read Studio Types & Configurations
 */

export type TimbrePreset =
  | 'MALE'
  | 'FEMALE'
  | 'OLD'
  | 'BABY'
  | 'ALIEN'
  | 'CHIPMUNK'
  | 'MONSTER'
  | 'SURFER'
  | 'ROBOT'
  | 'GHOST'
  | 'NARRATOR';

export type VoiceGender = 'MALE' | 'FEMALE' | 'NEUTRAL';

export interface VoicePersona {
  id: string;
  label: string;
  gender: VoiceGender;
  pitch: number;
  rateMultiplier: number;
  accentHint?: 'GB' | 'US' | 'AU' | 'ANY';
  description: string;
}

export interface CharacterVoiceConfig {
  voiceURI: string;
  personaId?: string;
  timbre: TimbrePreset;
  customPitch?: number;
}

export interface WordBoundary {
  charIndex: number;
  charLength: number;
}

export interface TimbreDefinition {
  id: TimbrePreset;
  label: string;
  pitch: number;
  rateMultiplier: number;
  isFx?: boolean;
  description: string;
}
