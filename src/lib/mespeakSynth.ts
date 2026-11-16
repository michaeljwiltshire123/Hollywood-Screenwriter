import meSpeak from 'mespeak';
import mespeakConfig from 'mespeak/src/mespeak_config.json';
import enRpVoice from 'mespeak/voices/en/en-rp.json';
import enUsVoice from 'mespeak/voices/en/en-us.json';
import { TimbrePreset } from './tableReadTypes';

interface SynthVoiceParams {
  voice: string;
  variant: string;
  pitch: number;
  speed: number;
  amplitude: number;
}

const MALE_VARIANTS = ['m1', 'm2', 'm3', 'm4', 'm6'];
const FEMALE_VARIANTS = ['f1', 'f2', 'f3', 'f4'];
let initDone = false;

export function ensureMespeakReady(): boolean {
  if (initDone && meSpeak.isConfigLoaded()) return true;
  try {
    if (!meSpeak.isConfigLoaded()) meSpeak.loadConfig(mespeakConfig);
    if (!meSpeak.isVoiceLoaded('en/en-rp')) meSpeak.loadVoice(enRpVoice);
    if (!meSpeak.isVoiceLoaded('en/en-us')) meSpeak.loadVoice(enUsVoice);
    initDone = true;
    return true;
  } catch {
    return false;
  }
}

export function getMespeakParams(
  timbre: TimbrePreset,
  speedRatio = 1.0,
  charOffset = 0,
  accentHint?: 'GB' | 'US' | 'AU' | 'ANY',
  isParenthetical = false
): SynthVoiceParams {
  const safeRatio = Math.max(0.5, Math.min(5.0, speedRatio || 1.0));
  const voice = accentHint === 'US' ? 'en/en-us' : 'en/en-rp';
  const amp = isParenthetical ? 55 : 105;
  const wpm = (base: number) => Math.max(85, Math.min(440, Math.round(base * safeRatio)));

  switch (timbre) {
    case 'CHIPMUNK': return { voice: 'en/en-us', variant: 'f5', pitch: 86, speed: wpm(148), amplitude: amp };
    case 'BABY':     return { voice: 'en/en-rp', variant: 'f3', pitch: 92, speed: wpm(132), amplitude: amp };
    case 'OLD':      return { voice: 'en/en-rp', variant: 'croak', pitch: 24, speed: wpm(138), amplitude: amp };
    case 'MONSTER':  return { voice: 'en/en-rp', variant: 'm4', pitch: 6, speed: wpm(195), amplitude: 120 };
    case 'ROBOT':    return { voice: 'en/en-us', variant: 'klatt2', pitch: 0, speed: wpm(172), amplitude: amp };
    case 'ALIEN':    return { voice: 'en/en-rp', variant: 'm5', pitch: 54, speed: wpm(162), amplitude: amp };
    case 'GHOST':    return { voice: 'en/en-rp', variant: 'whisperf', pitch: 32, speed: wpm(142), amplitude: amp };
    case 'SURFER':   return { voice: 'en/en-us', variant: 'm2', pitch: 38, speed: wpm(152), amplitude: amp };
    case 'FEMALE':   return { voice, variant: FEMALE_VARIANTS[charOffset % FEMALE_VARIANTS.length], pitch: 62, speed: wpm(175), amplitude: amp };
    case 'MALE':     return { voice, variant: MALE_VARIANTS[charOffset % MALE_VARIANTS.length], pitch: 44, speed: wpm(175), amplitude: amp };
    default:         return { voice: 'en/en-rp', variant: 'm3', pitch: 48, speed: wpm(182), amplitude: amp };
  }
}

function shapeSpokenPhrase(text: string, timbre: TimbrePreset): string {
  if (timbre !== 'SURFER') return text;
  let shaped = text
    .replace(/,\s*/g, '... man, ')
    .replace(/\.+/g, '... dude.')
    .replace(/([!?]+)/g, ', dude$1');
  if (!/\bdude\b[.!?]*$/i.test(shaped.trim())) {
    shaped = `${shaped.replace(/[.\s]+$/, '')}... dude.`;
  }
  return shaped;
}

export function synthesiseMespeakWav(
  text: string,
  timbre: TimbrePreset,
  speedRatio = 1.0,
  charOffset = 0,
  accentHint?: 'GB' | 'US' | 'AU' | 'ANY',
  isParenthetical = false
): ArrayBuffer | null {
  const cleanText = text.trim();
  if (!cleanText || !ensureMespeakReady()) return null;
  const spokenText = shapeSpokenPhrase(cleanText, timbre);
  const params = getMespeakParams(timbre, speedRatio, charOffset, accentHint, isParenthetical);
  const out = meSpeak.speak(spokenText, {
    rawdata: 'arraybuffer',
    voice: params.voice,
    variant: params.variant,
    pitch: params.pitch,
    speed: params.speed,
    amplitude: params.amplitude,
  });
  return out instanceof ArrayBuffer ? out : null;
}
