import React from 'react';
import { Calendar, X } from 'lucide-react';
import { AppThemeConfig } from '../../lib/themePresets';
import { getModalTheme } from '../../lib/modalTheme';
import { HowDoIUseButton } from './tour/HowDoIUseButton';

interface ProductionSuiteHeaderProps {
  title: string;
  scenesCount: number;
  charactersCount: number;
  onOpenTour: () => void;
  onClose: () => void;
  themeConfig?: AppThemeConfig;
}

export const ProductionSuiteHeader: React.FC<ProductionSuiteHeaderProps> = ({
  title, scenesCount, charactersCount, onOpenTour, onClose, themeConfig,
}) => {
  const mt = getModalTheme(themeConfig);

  return (
    <div className="flex items-center justify-between p-4 border-b font-sans" style={mt.headerStyle}>
      <div className="flex items-center gap-3">
        <div className="p-2 border rounded-xl" style={{ ...mt.cardStyle, ...mt.accentStyle }}>
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-extrabold uppercase tracking-wider flex items-center gap-2">
            Production Schedule & Call Sheet Suite
          </h2>
          <p className="text-xs font-mono" style={mt.mutedStyle}>
            {title || 'UNTITLED SCREENPLAY'} • {scenesCount} Scenes • {charactersCount} Cast Members
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 sm:gap-48">
        <HowDoIUseButton onClick={onOpenTour} themeConfig={themeConfig} />
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg transition cursor-pointer hover:opacity-80"
          style={mt.secondaryBtnStyle}
          title="Close Pre-Production Suite"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
