import { TimbrePreset, VoicePersona } from './tableReadTypes';

export const VOICE_PERSONAS: VoicePersona[] = [
  // 10 Distinct Male Character Personas
  { id: 'persona:male-lead', label: 'Classic Male Lead', gender: 'MALE', pitch: 1.0, rateMultiplier: 1.0, accentHint: 'ANY', description: 'Warm, natural leading man' },
  { id: 'persona:male-brit', label: 'British Gentleman', gender: 'MALE', pitch: 0.96, rateMultiplier: 0.98, accentHint: 'GB', description: 'Poised UK delivery' },
  { id: 'persona:male-baritone', label: 'Deep Baritone', gender: 'MALE', pitch: 0.78, rateMultiplier: 0.95, accentHint: 'ANY', description: 'Rich, resonant low voice' },
  { id: 'persona:male-detective', label: 'Gravelly Detective', gender: 'MALE', pitch: 0.72, rateMultiplier: 0.93, accentHint: 'US', description: 'Measured noir authority' },
  { id: 'persona:male-young', label: 'Brisk Young Man', gender: 'MALE', pitch: 1.12, rateMultiplier: 1.05, accentHint: 'ANY', description: 'Upbeat youthful cadence' },
  { id: 'persona:male-boss', label: 'Commanding Boss', gender: 'MALE', pitch: 0.85, rateMultiplier: 0.98, accentHint: 'ANY', description: 'Sharp executive presence' },
  { id: 'persona:male-comic', label: 'Fast-Talking Comic', gender: 'MALE', pitch: 1.08, rateMultiplier: 1.08, accentHint: 'US', description: 'Quick-witted banter' },
  { id: 'persona:male-calm', label: 'Gentle Philosopher', gender: 'MALE', pitch: 0.90, rateMultiplier: 0.94, accentHint: 'GB', description: 'Calm, thoughtful tone' },
  { id: 'persona:male-veteran', label: 'Weary Veteran', gender: 'MALE', pitch: 0.68, rateMultiplier: 0.90, accentHint: 'ANY', description: 'World-weary elder resonance' },
  { id: 'persona:male-sidekick', label: 'Nervous Sidekick', gender: 'MALE', pitch: 1.18, rateMultiplier: 1.06, accentHint: 'ANY', description: 'Anxious, animated pitch' },

  // 10 Distinct Female Character Personas
  { id: 'persona:female-lead', label: 'Classic Female Lead', gender: 'FEMALE', pitch: 1.0, rateMultiplier: 1.0, accentHint: 'ANY', description: 'Clear, natural leading lady' },
  { id: 'persona:female-duchess', label: 'British Duchess', gender: 'FEMALE', pitch: 0.98, rateMultiplier: 0.97, accentHint: 'GB', description: 'Crisp, poised UK tone' },
  { id: 'persona:female-alto', label: 'Warm Alto', gender: 'FEMALE', pitch: 0.86, rateMultiplier: 0.96, accentHint: 'ANY', description: 'Grounded, rich lower register' },
  { id: 'persona:female-ingenue', label: 'Bright Ingenue', gender: 'FEMALE', pitch: 1.16, rateMultiplier: 1.03, accentHint: 'ANY', description: 'Light, expressive warmth' },
  { id: 'persona:female-exec', label: 'Sharp Executive', gender: 'FEMALE', pitch: 0.94, rateMultiplier: 1.02, accentHint: 'US', description: 'Crisp, decisive authority' },
  { id: 'persona:female-story', label: 'Gentle Storyteller', gender: 'FEMALE', pitch: 0.95, rateMultiplier: 0.95, accentHint: 'GB', description: 'Soothing, unhurried rhythm' },
  { id: 'persona:female-witty', label: 'Witty Best Friend', gender: 'FEMALE', pitch: 1.08, rateMultiplier: 1.06, accentHint: 'ANY', description: 'Lively, conversational spark' },
  { id: 'persona:female-noir', label: 'Noir Femme Fatale', gender: 'FEMALE', pitch: 0.82, rateMultiplier: 0.92, accentHint: 'ANY', description: 'Smooth, deliberate alto' },
  { id: 'persona:female-rebel', label: 'Spirited Rebel', gender: 'FEMALE', pitch: 1.04, rateMultiplier: 1.05, accentHint: 'AU', description: 'Punchy, energetic edge' },
  { id: 'persona:female-matriarch', label: 'Wise Matriarch', gender: 'FEMALE', pitch: 0.78, rateMultiplier: 0.92, accentHint: 'ANY', description: 'Dignified, measured elder' },
];

export function resolveVoicePersona(personaId?: string): VoicePersona | undefined {
  if (!personaId || !personaId.startsWith('persona:')) return undefined;
  return VOICE_PERSONAS.find((p) => p.id === personaId);
}

export function getPersonasForTimbre(timbre: TimbrePreset): VoicePersona[] {
  if (timbre === 'FEMALE' || timbre === 'BABY') {
    return VOICE_PERSONAS.filter((p) => p.gender === 'FEMALE');
  }
  if (timbre === 'MALE' || timbre === 'OLD' || timbre === 'ALIEN') {
    return VOICE_PERSONAS.filter((p) => p.gender === 'MALE');
  }
  return VOICE_PERSONAS;
}
