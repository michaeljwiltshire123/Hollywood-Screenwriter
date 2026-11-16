import { TimbrePreset, TimbreDefinition, VoiceGender } from './tableReadTypes';
import { classifyVoiceGender } from './voiceGenderClassifier';
import { VOICE_PERSONAS, resolveVoicePersona } from './voicePersonas';

export { autoDetectCharacterTimbre, classifyVoiceGender, getVoiceRateCalibration } from './voiceGenderClassifier';
export { VOICE_PERSONAS, resolveVoicePersona, getPersonasForTimbre } from './voicePersonas';

export const TIMBRE_PRESETS: Record<TimbrePreset, TimbreDefinition> = {
  MALE: { id: 'MALE', label: 'Male', pitch: 1.0, rateMultiplier: 1.0, description: 'Natural male voice' },
  FEMALE: { id: 'FEMALE', label: 'Female', pitch: 1.0, rateMultiplier: 1.0, description: 'Natural female voice' },
  OLD: { id: 'OLD', label: 'Elder', pitch: 0.56, rateMultiplier: 0.84, isFx: true, description: 'Low, weathered elder cadence' },
  BABY: { id: 'BABY', label: 'Baby', pitch: 1.88, rateMultiplier: 1.12, isFx: true, description: 'High, bright toddler pitch' },
  ALIEN: { id: 'ALIEN', label: 'Alien', pitch: 0.45, rateMultiplier: 0.88, isFx: true, description: 'Warbling cosmic alien cadence' },
  CHIPMUNK: { id: 'CHIPMUNK', label: 'Chipmunk', pitch: 2.00, rateMultiplier: 1.42, isFx: true, description: 'Ultra-high rapid squeak' },
  MONSTER: { id: 'MONSTER', label: 'Monster', pitch: 0.15, rateMultiplier: 0.74, isFx: true, description: 'Deep sub-bass booming beast' },
  SURFER: { id: 'SURFER', label: 'Surfer', pitch: 0.86, rateMultiplier: 0.78, isFx: true, description: 'Chill laid-back beach drawl' },
  ROBOT: { id: 'ROBOT', label: 'Robot', pitch: 0.88, rateMultiplier: 0.94, isFx: true, description: 'Clipped mechanical android' },
  GHOST: { id: 'GHOST', label: 'Ghost', pitch: 0.62, rateMultiplier: 0.70, isFx: true, description: 'Haunting hollow whisper' },
  NARRATOR: { id: 'NARRATOR', label: 'Narrator', pitch: 1.0, rateMultiplier: 1.0, description: 'Clear, neutral storyteller' },
};

export const isFxTimbre = (t?: TimbrePreset): boolean => !!(t && TIMBRE_PRESETS[t]?.isFx);

export function getFilteredVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return { onlineNatural: [], offlineOS: [], male: [], female: [], all: [] };
  }
  const voices = window.speechSynthesis.getVoices();
  const enVoices = voices.filter((v) => v.lang.startsWith('en') || !v.lang);
  const baseList = enVoices.length > 0 ? enVoices : voices;
  const onlineNatural = baseList.filter((v) => /Natural|Online|Google|Neural/.test(v.name));
  const offlineOS = baseList.filter((v) => v.localService || /Enhanced|Siri/.test(v.name));
  return {
    onlineNatural: onlineNatural.length > 0 ? onlineNatural : baseList,
    offlineOS: offlineOS.length > 0 ? offlineOS : baseList,
    male: baseList.filter((v) => classifyVoiceGender(v) === 'MALE'),
    female: baseList.filter((v) => classifyVoiceGender(v) === 'FEMALE'),
    all: baseList,
  };
}

export function resolveBaseVoiceForSelection(
  voices: SpeechSynthesisVoice[], voiceOrPersonaId: string, timbre: TimbrePreset, offset = 0
): SpeechSynthesisVoice | undefined {
  if (voices.length === 0) return undefined;
  const targetGender: VoiceGender =
    timbre === 'FEMALE' || timbre === 'BABY' || timbre === 'CHIPMUNK' || timbre === 'GHOST'
      ? 'FEMALE'
      : 'MALE';

  // FX modes MUST use local pitch-capable OS voices (cloud voices ignore pitch!)
  if (isFxTimbre(timbre)) {
    const localPool = voices.filter((v) => v.localService && classifyVoiceGender(v) === targetGender);
    if (localPool.length > 0) return localPool[offset % localPool.length];
    const anyLocal = voices.filter((v) => v.localService);
    if (anyLocal.length > 0) return anyLocal[offset % anyLocal.length];
  }

  const persona = resolveVoicePersona(voiceOrPersonaId);
  if (!persona && voiceOrPersonaId) {
    const exact = voices.find((v) => v.voiceURI === voiceOrPersonaId || v.name === voiceOrPersonaId);
    if (exact) return exact;
  }

  let genderPool = voices.filter((v) => classifyVoiceGender(v) === (persona ? persona.gender : targetGender));
  if (genderPool.length === 0) genderPool = voices;
  if (persona?.accentHint && persona.accentHint !== 'ANY') {
    const accentPool = genderPool.filter((v) => v.lang.toUpperCase().includes(persona.accentHint!));
    if (accentPool.length > 0) return accentPool[offset % accentPool.length];
  }
  return genderPool[offset % genderPool.length];
}

export function findBestVoiceForTimbre(voices: SpeechSynthesisVoice[], timbre: TimbrePreset, offset = 0): string {
  const pool = VOICE_PERSONAS.filter((p) =>
    timbre === 'FEMALE' || timbre === 'BABY' || timbre === 'CHIPMUNK' ? p.gender === 'FEMALE' : p.gender === 'MALE'
  );
  if (pool.length > 0 && timbre !== 'NARRATOR') return pool[offset % pool.length].id;
  const match = resolveBaseVoiceForSelection(voices, '', timbre, offset);
  return match ? match.voiceURI || match.name : '';
}
