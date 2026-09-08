// Game Cooldown Manager: Enforces 10-minute focus sprint between break games
// British English localisation and temporary session storage persistence

const STORAGE_KEY = 'screenwriter_game_cooldown_until';
export const DEFAULT_COOLDOWN_SECONDS = 600; // 10 minutes

export const getStoredGameCooldownUntil = (): number => {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const timestamp = parseInt(raw, 10);
    return isNaN(timestamp) ? 0 : timestamp;
  } catch {
    return 0;
  }
};

export const setGameCooldown = (durationSeconds: number = DEFAULT_COOLDOWN_SECONDS): number => {
  if (typeof window === 'undefined') return 0;
  const safeSeconds = Math.max(1, durationSeconds);
  const until = Date.now() + safeSeconds * 1000;
  try {
    sessionStorage.setItem(STORAGE_KEY, until.toString());
  } catch {
    // Graceful fallback for restricted session storage
  }
  return until;
};

export const clearGameCooldown = (): void => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage clear error
  }
};

export const calculateRemainingCooldown = (untilTimestamp: number): number => {
  if (!untilTimestamp || untilTimestamp <= 0) return 0;
  const remainingMs = untilTimestamp - Date.now();
  return remainingMs > 0 ? Math.ceil(remainingMs / 1000) : 0;
};

export const formatCooldownDisplay = (totalSeconds: number): string => {
  const safeSeconds = Math.max(1, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
};
