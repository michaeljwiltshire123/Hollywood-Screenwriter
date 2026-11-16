import { TimbrePreset } from './tableReadTypes';
import { getVoiceRateCalibration, resolveBaseVoiceForSelection, resolveVoicePersona, isFxTimbre } from './speechVoiceManager';
import { ActiveFxPlayback, playMespeakFxLine } from './fxPlaybackHelper';

export interface SpeakOptions {
  pitch?: number;
  rate?: number;
  volume?: number;
  voiceURI?: string;
  timbre?: TimbrePreset;
  charOffset?: number;
  isParenthetical?: boolean;
  onEnd?: () => void;
  onBoundary?: (charIndex: number, charLength?: number) => void;
}

export class SpeechController {
  private synth: SpeechSynthesis | null = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private activeFx: ActiveFxPlayback | null = null;
  private currentText = '';
  private currentOptions: SpeakOptions = {};
  private lastBoundaryIndex = 0;
  private playSeq = 0;
  private pendingTimer: number | null = null;

  speak(text: string, options: SpeakOptions = {}, fromIndex = 0) {
    this.stop();
    const seq = ++this.playSeq;
    this.currentText = text;
    this.currentOptions = options;
    this.lastBoundaryIndex = fromIndex;
    const spokenText = fromIndex > 0 ? text.substring(fromIndex) : text;
    if (!spokenText.trim()) { options.onEnd?.(); return; }

    if (isFxTimbre(options.timbre)) {
      playMespeakFxLine(
        spokenText,
        options.timbre!,
        options.rate ?? 1.0,
        options.charOffset ?? 0,
        !!options.isParenthetical,
        () => seq === this.playSeq,
        options.onBoundary,
        () => { if (seq === this.playSeq) { this.activeFx = null; options.onEnd?.(); } }
      ).then((handle) => {
        if (seq === this.playSeq) this.activeFx = handle;
        else handle?.stop();
      });
      return;
    }

    if (!this.synth) { options.onEnd?.(); return; }
    this.pendingTimer = window.setTimeout(() => {
      if (!this.synth || seq !== this.playSeq) return;
      const u = new SpeechSynthesisUtterance(spokenText);
      const match = resolveBaseVoiceForSelection(this.synth.getVoices(), options.voiceURI || '', options.timbre || 'NARRATOR', options.charOffset || 0);
      if (match) { u.voice = match; u.lang = match.lang || 'en-GB'; }
      const persona = resolveVoicePersona(options.voiceURI);
      const rawRate = (options.rate ?? 1.0) * (persona ? persona.rateMultiplier : 1.0) * getVoiceRateCalibration(match);
      const safeRate = Math.min(match && !match.localService ? 2.0 : 5.0, Math.max(0.5, rawRate));
      const safePitch = Math.min(2.0, Math.max(0.1, options.pitch ?? persona?.pitch ?? 1.0));

      u.volume = options.isParenthetical ? 0.38 : (options.volume ?? 1.0);
      u.rate = options.isParenthetical ? Math.max(0.5, safeRate * 0.88) : safeRate;
      u.pitch = options.isParenthetical ? Math.max(0.1, safePitch * 0.95) : safePitch;
      u.onend = () => { if (seq === this.playSeq) options.onEnd?.(); };
      u.onerror = () => { if (seq === this.playSeq) this.currentUtterance = null; };
      u.onboundary = (e) => {
        this.lastBoundaryIndex = fromIndex + e.charIndex;
        options.onBoundary?.(this.lastBoundaryIndex, e.charLength || 4);
      };
      this.currentUtterance = u;
      this.synth.speak(u);
    }, 25);
  }

  updateLiveRate(newBaseSpeed: number, extraRatio = 1.0) {
    const rate = Math.min(5.0, Math.max(0.5, newBaseSpeed * extraRatio));
    if (this.activeFx) {
      this.currentOptions.rate = rate;
      this.activeFx.setSpeedRatio(rate);
      return;
    }
    if (!this.synth || !this.currentText || (!this.synth.speaking && !this.pendingTimer)) return;
    this.currentOptions.rate = rate;
    this.speak(this.currentText, this.currentOptions, this.lastBoundaryIndex);
  }

  stop() {
    this.playSeq++;
    if (this.activeFx) { this.activeFx.stop(); this.activeFx = null; }
    if (this.pendingTimer) { clearTimeout(this.pendingTimer); this.pendingTimer = null; }
    if (this.currentUtterance) { this.currentUtterance.onend = null; this.currentUtterance.onerror = null; this.currentUtterance = null; }
    this.synth?.cancel();
  }
}

export const speechEngine = new SpeechController();
