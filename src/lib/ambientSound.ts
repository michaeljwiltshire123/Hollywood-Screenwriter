// Subtle ambient room tone generator using Web Audio API (100% free, browser native)

class AmbientRoomTone {
  private audioCtx: AudioContext | null = null;
  private isPlaying = false;
  private noiseNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;

  start() {
    if (this.isPlaying || typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      this.audioCtx = new AudioContextClass();

      // Create pink noise buffer for warm, soft room ambience
      const bufferSize = this.audioCtx.sampleRate * 2;
      const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.011; // Extremely subtle volume
        b6 = white * 0.115926;
      }

      const whiteNoise = this.audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.value = 0.03; // Very soft tape/room hiss

      whiteNoise.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);
      whiteNoise.start();

      this.noiseNode = whiteNoise;
      this.isPlaying = true;
    } catch (e) {
      console.warn('Ambient Audio unavailable:', e);
    }
  }

  stop() {
    if (this.noiseNode && 'stop' in this.noiseNode) {
      try {
        (this.noiseNode as any).stop();
      } catch (e) {}
    }
    if (this.audioCtx) {
      try {
        this.audioCtx.close();
      } catch (e) {}
    }
    this.noiseNode = null;
    this.audioCtx = null;
    this.isPlaying = false;
  }
}

export const ambientRoomTone = new AmbientRoomTone();
