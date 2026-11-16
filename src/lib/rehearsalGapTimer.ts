/**
 * Rehearsal Gap Timer: Calculates natural actor speaking intervals
 * Math Guards: Zero-math protection, guaranteed positive intervals
 */

export function calculateRehearsalGapSeconds(text: string): number {
  if (!text || text.trim() === '') return 2.0;

  const words = text.trim().split(/\s+/).filter(Boolean).length;
  // Natural reading cadence: ~140 words per minute (~0.43s per word + 1.2s buffer)
  const estimatedSeconds = (words * 0.43) + 1.2;

  // Clamped between 2.0s and 25.0s (Math Guard against 0 or endless wait)
  return Math.min(25.0, Math.max(2.0, Math.round(estimatedSeconds * 10) / 10));
}

export function formatSecondsRemaining(seconds: number): string {
  const safeSec = Math.max(0.1, seconds);
  return `${safeSec.toFixed(1)}s`;
}
