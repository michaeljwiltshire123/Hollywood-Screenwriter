import React from 'react';
import { AppThemeConfig, resolveThemeConfig } from './themePresets';

export interface ModalThemeStyles {
  theme: AppThemeConfig;
  overlayStyle: React.CSSProperties;
  windowStyle: React.CSSProperties;
  headerStyle: React.CSSProperties;
  cardStyle: React.CSSProperties;
  subCardStyle: React.CSSProperties;
  inputStyle: React.CSSProperties;
  primaryBtnStyle: React.CSSProperties;
  secondaryBtnStyle: React.CSSProperties;
  accentStyle: React.CSSProperties;
  mutedStyle: React.CSSProperties;
  borderStyle: React.CSSProperties;
}

export function getModalTheme(themeConfig?: AppThemeConfig): ModalThemeStyles {
  const theme = themeConfig || resolveThemeConfig();
  const inputBg = theme.isDark ? theme.topBottomBars : '#FFFFFF';
  const overlayBg = theme.isDark ? 'rgba(15, 18, 24, 0.84)' : 'rgba(42, 34, 24, 0.45)';

  return {
    theme,
    overlayStyle: { backgroundColor: overlayBg },
    windowStyle: {
      backgroundColor: theme.workspaceBackdrop,
      borderColor: theme.borders,
      color: theme.primaryText,
    },
    headerStyle: {
      backgroundColor: theme.topBottomBars,
      borderColor: theme.borders,
      color: theme.primaryText,
    },
    cardStyle: {
      backgroundColor: theme.sceneCards,
      borderColor: theme.borders,
      color: theme.primaryText,
    },
    subCardStyle: {
      backgroundColor: theme.sidebarPanel,
      borderColor: theme.borders,
      color: theme.primaryText,
    },
    inputStyle: {
      backgroundColor: inputBg,
      borderColor: theme.borders,
      color: theme.primaryText,
    },
    primaryBtnStyle: {
      backgroundColor: theme.accentButtons,
      borderColor: theme.accentButtons,
      color: '#FFFFFF',
    },
    secondaryBtnStyle: {
      backgroundColor: theme.sceneCards,
      borderColor: theme.borders,
      color: theme.primaryText,
    },
    accentStyle: { color: theme.accentText },
    mutedStyle: { color: theme.primaryText, opacity: 0.72 },
    borderStyle: { borderColor: theme.borders },
  };
}
