declare module 'mespeak' {
  export interface MeSpeakOptions {
    amplitude?: number;
    wordgap?: number;
    pitch?: number;
    speed?: number;
    voice?: string;
    variant?: string;
    rawdata?: 'array' | 'arraybuffer' | 'base64' | 'mime' | boolean;
    volume?: number;
    log?: boolean;
  }

  export function loadConfig(config: Record<string, unknown> | string): void;
  export function loadVoice(voice: Record<string, unknown> | string, cb?: (success: boolean, id: string) => void): void;
  export function isConfigLoaded(): boolean;
  export function isVoiceLoaded(voice: string): boolean;
  export function speak(text: string, options?: MeSpeakOptions): ArrayBuffer | Uint8Array | number | null;
  export function stop(): number;
}

declare module 'mespeak/*.json' {
  const data: Record<string, unknown>;
  export default data;
}
