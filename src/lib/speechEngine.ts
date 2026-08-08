// Speech Synthesis Engine using native browser Web Speech API (100% free, zero tokens)

export interface VoiceOption {
  voice: SpeechSynthesisVoice;
  name: string;
  lang: string;
}

export function getAvailableVoices(): VoiceOption[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const voices = window.speechSynthesis.getVoices();
  return voices.map((v) => ({
    voice: v,
    name: `${v.name} (${v.lang})`,
    lang: v.lang,
  }));
}

export function assignCharacterVoices(characterNames: string[]): Record<string, { pitch: number; rate: number; voiceIndex: number }> {
  const map: Record<string, { pitch: number; rate: number; voiceIndex: number }> = {};
  const voices = getAvailableVoices();
  
  characterNames.forEach((char, idx) => {
    // Generate distinct pitch and voice mapping based on index hash
    const pitch = 0.85 + ((idx * 0.15) % 0.5);
    const rate = 1.0;
    const voiceIndex = voices.length > 0 ? idx % voices.length : 0;
    map[char.toUpperCase()] = { pitch, rate, voiceIndex };
  });
  
  return map;
}

export class SpeechController {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  speak(
    text: string,
    options: { pitch?: number; rate?: number; voiceIndex?: number; onEnd?: () => void; onBoundary?: (charIndex: number) => void }
  ) {
    if (!this.synth) return;
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = options.pitch ?? 1.0;
    utterance.rate = options.rate ?? 1.0;

    const voices = this.synth.getVoices();
    if (options.voiceIndex !== undefined && voices[options.voiceIndex]) {
      utterance.voice = voices[options.voiceIndex];
    }

    if (options.onEnd) {
      utterance.onend = options.onEnd;
      utterance.onerror = options.onEnd;
    }

    if (options.onBoundary) {
      utterance.onboundary = (e) => {
        options.onBoundary?.(e.charIndex);
      };
    }

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  pause() {
    if (this.synth?.speaking) {
      this.synth.pause();
    }
  }

  resume() {
    if (this.synth?.paused) {
      this.synth.resume();
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const speechEngine = new SpeechController();
