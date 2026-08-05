import React from 'react';
import { X, Type, Sliders } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  editorFont: 'Courier Prime' | 'Courier New';
  onUpdateFont: (font: 'Courier Prime' | 'Courier New') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  editorFont = 'Courier Prime',
  onUpdateFont,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-mono">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-lg w-full text-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-sm uppercase text-amber-300">SETTINGS</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5 text-xs">
          {/* Typography Preference */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <Type className="w-4 h-4 text-amber-400" />
              <span>Editor Typography (12pt Standard)</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Choose your preferred industry-standard screenplay typewriter font.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onUpdateFont('Courier Prime')}
                className={`flex-1 py-2 px-3 rounded font-bold text-xs border transition ${
                  editorFont === 'Courier Prime'
                    ? 'bg-amber-950/80 border-amber-500 text-amber-300 shadow'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Courier Prime
              </button>
              <button
                type="button"
                onClick={() => onUpdateFont('Courier New')}
                className={`flex-1 py-2 px-3 rounded font-bold text-xs border transition ${
                  editorFont === 'Courier New'
                    ? 'bg-amber-950/80 border-amber-500 text-amber-300 shadow'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Courier New
              </button>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
