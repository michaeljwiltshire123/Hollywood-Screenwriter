import React from 'react';
import { Save } from 'lucide-react';
import { AppThemeConfig } from '../../lib/themePresets';

interface QuickSaveButtonProps {
  onSave?: () => void;
  isDirty: boolean;
  themeConfig?: AppThemeConfig;
}

export const QuickSaveButton: React.FC<QuickSaveButtonProps> = ({
  onSave,
  isDirty,
  themeConfig,
}) => {
  const accent = themeConfig?.accentButtons || '#8C6239';

  return (
    <button
      id="header-save-btn"
      onClick={onSave}
      className={`px-2.5 sm:px-3 py-1.5 min-h-[38px] rounded-lg border text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer whitespace-nowrap hover:opacity-90 ${
        isDirty ? 'shadow-md' : ''
      }`}
      style={{
        backgroundColor: isDirty ? accent : (themeConfig?.sceneCards || '#F4ECE0'),
        borderColor: isDirty ? accent : (themeConfig?.borders || '#E4D3B9'),
        color: isDirty ? '#FFFFFF' : (themeConfig?.primaryText || '#433422'),
      }}
      title="Save Screenplay (Ctrl+S)"
    >
      <Save
        className="w-4 h-4 shrink-0"
        style={{ color: isDirty ? '#FFFFFF' : (themeConfig?.accentText || '#8C6239') }}
      />
      <span>SAVE</span>
    </button>
  );
};
