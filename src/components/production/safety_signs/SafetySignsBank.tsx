import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { AppThemeConfig } from '../../../lib/themePresets';
import { getModalTheme } from '../../../lib/modalTheme';
import { SAFETY_SIGNS } from './safetySignsData';
import { SafetySignCard } from './SafetySignCard';

export const SafetySignsBank: React.FC<{ themeConfig?: AppThemeConfig; productionLogoUrl?: string }> = ({ themeConfig, productionLogoUrl }) => {
  const mt = getModalTheme(themeConfig);

  return (
    <div className="space-y-4 pt-2">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: mt.theme.primaryText }}>
          <ShieldAlert className="w-4 h-4" style={mt.accentStyle} />
          Printable On-Set Safety Signs Bank ({SAFETY_SIGNS.length} High-Visibility Posters)
        </h3>
        <p className="text-xs" style={mt.mutedStyle}>
          Click any sign below to print a full-page landscape poster for set doors, generators, first aid stations, and filming locations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {SAFETY_SIGNS.map((sign) => (
          <SafetySignCard key={sign.id} sign={sign} productionLogoUrl={productionLogoUrl} />
        ))}
      </div>
    </div>
  );
};
