import { AppThemeConfig } from '../../lib/themePresets';
import { ModalThemeStyles } from '../../lib/modalTheme';

export type BreakCategory = 'Arcade' | 'Word and Trivia' | 'Logic and Puzzle';
export type WordOrigin = 'bank' | 'Character' | 'Location';

export interface ScriptWordEntry {
  word: string;
  origin: 'Character' | 'Location';
}

export interface WordChoice {
  word: string;
  origin: WordOrigin;
}

export interface BreakGameInfo {
  id: string;
  title: string;
  description: string;
  category: BreakCategory;
  durationSeconds: number;
}

export interface GameScreenProps {
  onBackToMenu: () => void;
  onGameWin: () => void;
  mt: ModalThemeStyles;
  themeConfig?: AppThemeConfig;
  scriptWords?: ScriptWordEntry[];
}
