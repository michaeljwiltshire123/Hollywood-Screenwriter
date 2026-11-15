export interface SprintVaultItem {
  id: string;
  timestamp: string;
  question: string;
  durationMins: number;
  ideaCount: number;
  rankTitle: string;
  primaryIdea?: string;
  backupIdeas?: string[];
  rawList: string[];
}

export type SprintPhase = 'LAUNCHER' | 'ACTIVE' | 'SUMMARY';

export interface SprintApplyResult {
  primaryIdea: string;
  backupIdeas: string[];
  saveToVault: boolean;
  vaultItem?: SprintVaultItem;
}
