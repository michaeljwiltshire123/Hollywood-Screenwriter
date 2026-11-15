import React from 'react';
import { X, Type, Sliders } from 'lucide-react';
import { AppThemeConfig } from '../lib/themePresets';
import { getModalTheme } from '../lib/modalTheme';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  editorFont: 'Courier Prime' | 'Courier New';
  onUpdateFont: (font: 'Courier Prime' | 'Courier New') => void;
  themeConfig?: AppThemeConfig;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen, onClose, editorFont = 'Courier Prime', onUpdateFont, themeConfig,
}) => {
  if (!isOpen) return null;
  const m = getModalTheme(themeConfig);

  return (
    <div className="fixed inset-x-0 top-28 bottom-0 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-mono" style={m.overlayStyle}>
      <div className="border rounded-xl shadow-2xl max-w-lg w-full overflow-hidden" style={m.windowStyle}>
        <div className="p-4 border-b flex items-center justify-between" style={m.headerStyle}>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5" style={m.accentStyle} />
            <h2 className="font-bold text-sm uppercase" style={m.accentStyle}>SETTINGS</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded opacity-70 hover:opacity-100 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5 text-xs">
          <div className="p-4 border rounded-lg space-y-3" style={m.cardStyle}>
            <div className="flex items-center gap-2 font-bold">
              <Type className="w-4 h-4" style={m.accentStyle} />
              <span>Editor Typography (12pt Standard)</span>
            </div>
            <p className="text-[11px] leading-relaxed" style={m.mutedStyle}>
              Choose your preferred industry-standard screenplay typewriter font.
            </p>
            <div className="flex gap-2">
              {(['Courier Prime', 'Courier New'] as const).map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => onUpdateFont(font)}
                  className="flex-1 py-2 px-3 rounded font-bold text-xs border transition cursor-pointer hover:opacity-90"
                  style={editorFont === font ? m.primaryBtnStyle : m.secondaryBtnStyle}
                >
                  {font}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end border-t" style={m.borderStyle}>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 border rounded font-medium cursor-pointer hover:opacity-85 transition"
              style={m.secondaryBtnStyle}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
