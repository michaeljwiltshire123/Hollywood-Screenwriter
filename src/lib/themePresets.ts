export type ThemePresetName = 'Vintage' | 'Charcoal' | 'Eucalyptus';

export interface AppThemeConfig {
  name: ThemePresetName | 'Custom';
  basePreset: ThemePresetName;
  isDark: boolean;
  isPaperDark: boolean;
  sidebarPanel: string;
  sceneCards: string;
  topBottomBars: string;
  workspaceBackdrop: string;
  scriptPaper: string;
  primaryText: string;
  scriptText: string;
  borders: string;
  accentButtons: string;
  accentText: string;
  scriptPaperColor?: string;
  scriptTextColor?: string;
}

export function isColorDark(hex: string): boolean {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return false;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

export const THEME_PRESETS: Record<ThemePresetName, Omit<AppThemeConfig, 'isPaperDark' | 'scriptText' | 'basePreset'>> = {
  Vintage: {
    name: 'Vintage',
    isDark: false,
    sidebarPanel: '#D2BB98',
    sceneCards: '#F4ECE0',
    topBottomBars: '#FBF6EF',
    workspaceBackdrop: '#F4ECE0',
    scriptPaper: '#FFFFFF',
    primaryText: '#433422',
    borders: '#E4D3B9',
    accentButtons: '#8C6239',
    accentText: '#8C6239',
  },
  Charcoal: {
    name: 'Charcoal',
    isDark: true,
    sidebarPanel: '#2B2D31',
    sceneCards: '#3A3F47',
    topBottomBars: '#1E2024',
    workspaceBackdrop: '#232428',
    scriptPaper: '#454545',
    primaryText: '#EDEDED',
    borders: '#1A253D',
    accentButtons: '#1F40C1',
    accentText: '#8FB0FF',
  },
  Eucalyptus: {
    name: 'Eucalyptus',
    isDark: false,
    sidebarPanel: '#DCE6DF',
    sceneCards: '#EBF2EE',
    topBottomBars: '#CAD6CE',
    workspaceBackdrop: '#D1DBD4',
    scriptPaper: '#FFFFFF',
    primaryText: '#2D3A32',
    borders: '#B8C7BE',
    accentButtons: '#4A6B56',
    accentText: '#4A6B56',
  },
};

export function resolveThemeConfig(theme?: {
  preset?: ThemePresetName | 'Custom';
  basePreset?: ThemePresetName;
  scriptPaperColor?: string;
  scriptTextColor?: string;
}): AppThemeConfig {
  const candidate = theme?.basePreset || theme?.preset;
  const presetKey: ThemePresetName =
    candidate && candidate in THEME_PRESETS ? (candidate as ThemePresetName) : 'Vintage';

  const base = THEME_PRESETS[presetKey];
  const resolvedPaper = theme?.scriptPaperColor || base.scriptPaper;
  const resolvedScriptText = theme?.scriptTextColor || base.primaryText;

  return {
    ...base,
    name: presetKey,
    basePreset: presetKey,
    scriptPaper: resolvedPaper,
    isPaperDark: isColorDark(resolvedPaper),
    scriptText: resolvedScriptText,
    scriptPaperColor: theme?.scriptPaperColor,
    scriptTextColor: theme?.scriptTextColor,
  };
}
