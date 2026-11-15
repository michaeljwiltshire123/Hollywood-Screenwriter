import React from 'react';
import { X, BookOpen } from 'lucide-react';
import { TitlePage } from '../types';
import { StartupOptionsGrid } from './title_page/StartupOptionsGrid';
import { TitlePageForm } from './title_page/TitlePageForm';
import { useTitlePageModalState } from './title_page/useTitlePageModalState';
import { AppThemeConfig } from '../lib/themePresets';
import { getModalTheme } from '../lib/modalTheme';

interface TitlePageModalProps {
  isOpen: boolean;
  onClose: () => void;
  titlePage: TitlePage;
  onSave: (updated: TitlePage) => void;
  onStartNewScript: (customTitlePage?: TitlePage) => void;
  onLoadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenSampleScript: () => void;
  onLoadNativeFile?: () => void;
  mode?: 'startup' | 'form';
  themeConfig?: AppThemeConfig;
}

export const TitlePageModal: React.FC<TitlePageModalProps> = ({
  isOpen, onClose, titlePage, onSave, onStartNewScript, onLoadFile, onOpenSampleScript, onLoadNativeFile, mode = 'form', themeConfig,
}) => {
  const {
    showTitleForm, setShowTitleForm, isCreatingNew, form, setForm,
    handleStartNewClick, handleEditCurrentClick, handleSubmit,
  } = useTitlePageModalState({
    isOpen, titlePage, onSave, onStartNewScript, onClose, mode: mode as 'startup' | 'form',
  });

  if (!isOpen) return null;
  const isDirectEdit = mode === 'form';
  const m = getModalTheme(themeConfig);

  return (
    <div className="fixed inset-x-0 top-28 bottom-0 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-mono" style={m.overlayStyle}>
      <div className="border rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transition-all duration-200" style={m.windowStyle}>
        <div className="p-4 border-b flex items-center justify-between" style={m.headerStyle}>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" style={m.accentStyle} />
            <h2 className="font-bold text-xs sm:text-sm uppercase tracking-wider" style={m.accentStyle}>
              {showTitleForm
                ? (isCreatingNew ? 'NEW SCRIPT TITLE PAGE SETUP' : 'EDIT ACTIVE TITLE PAGE METADATA')
                : 'HOLLYWOOD TITLE PAGE & STARTUP'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg opacity-70 hover:opacity-100 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5 text-xs">
          {!showTitleForm ? (
            <StartupOptionsGrid
              onStartNew={handleStartNewClick}
              onLoadNativeFile={onLoadNativeFile}
              onLoadFile={onLoadFile}
              onOpenSampleScript={onOpenSampleScript}
              onEditCurrent={handleEditCurrentClick}
              onClose={onClose}
              themeConfig={themeConfig}
            />
          ) : (
            <TitlePageForm
              form={form}
              setForm={setForm}
              isCreatingNew={isCreatingNew}
              onSubmit={handleSubmit}
              onBack={() => setShowTitleForm(false)}
              onClose={onClose}
              isDirectEdit={isDirectEdit}
              themeConfig={themeConfig}
            />
          )}
        </div>
      </div>
    </div>
  );
};
