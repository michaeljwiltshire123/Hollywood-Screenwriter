import React from 'react';
import { X, BookOpen } from 'lucide-react';
import { TitlePage } from '../types';
import { StartupOptionsGrid } from './title_page/StartupOptionsGrid';
import { TitlePageForm } from './title_page/TitlePageForm';
import { useTitlePageModalState } from './title_page/useTitlePageModalState';

interface TitlePageModalProps {
  isOpen: boolean;
  onClose: () => void;
  titlePage: TitlePage;
  onSave: (updated: TitlePage) => void;
  onStartNewScript: (customTitlePage?: TitlePage) => void;
  onLoadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenSampleScript: () => void;
  onLoadNativeFile?: () => void;
}

export const TitlePageModal: React.FC<TitlePageModalProps> = ({
  isOpen,
  onClose,
  titlePage,
  onSave,
  onStartNewScript,
  onLoadFile,
  onOpenSampleScript,
  onLoadNativeFile,
}) => {
  const {
    showTitleForm,
    setShowTitleForm,
    isCreatingNew,
    form,
    setForm,
    handleStartNewClick,
    handleEditCurrentClick,
    handleSubmit,
  } = useTitlePageModalState({
    isOpen,
    titlePage,
    onSave,
    onStartNewScript,
    onClose,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 top-28 bottom-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-mono">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full text-slate-100 overflow-hidden transition-all duration-200">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-xs sm:text-sm uppercase text-amber-300 tracking-wider">
              {showTitleForm
                ? (isCreatingNew ? 'NEW SCRIPT TITLE PAGE SETUP' : 'EDIT ACTIVE TITLE PAGE METADATA')
                : 'HOLLYWOOD TITLE PAGE & STARTUP'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition cursor-pointer">
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
            />
          ) : (
            <TitlePageForm
              form={form}
              setForm={setForm}
              isCreatingNew={isCreatingNew}
              onSubmit={handleSubmit}
              onBack={() => setShowTitleForm(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
