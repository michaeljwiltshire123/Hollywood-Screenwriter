import React from 'react';
import { ArrowLeft, CheckCircle, Save } from 'lucide-react';
import { TitlePage } from '../../types';
import { TitlePageFormFields } from './TitlePageFormFields';
import { AppThemeConfig } from '../../lib/themePresets';
import { getModalTheme } from '../../lib/modalTheme';

interface TitlePageFormProps {
  form: TitlePage;
  setForm: React.Dispatch<React.SetStateAction<TitlePage>>;
  isCreatingNew: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  onClose?: () => void;
  isDirectEdit?: boolean;
  themeConfig?: AppThemeConfig;
}

export const TitlePageForm: React.FC<TitlePageFormProps> = ({
  form, setForm, isCreatingNew, onSubmit, onBack, onClose, isDirectEdit = false, themeConfig,
}) => {
  const handleCancel = isDirectEdit && onClose ? onClose : onBack;
  const m = getModalTheme(themeConfig);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="p-3 border rounded-xl flex items-center justify-between text-xs" style={m.cardStyle}>
        <span>
          {isCreatingNew
            ? 'Fill out your title page details below to launch your new script:'
            : 'Edit active script title page details below:'}
        </span>
        {!isDirectEdit && (
          <button
            type="button"
            onClick={onBack}
            className="text-xs flex items-center gap-1 shrink-0 font-bold ml-2 cursor-pointer hover:opacity-80"
            style={m.accentStyle}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
        )}
      </div>

      <TitlePageFormFields form={form} setForm={setForm} themeConfig={themeConfig} />

      <div className="pt-3 flex justify-between items-center border-t" style={m.borderStyle}>
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 border rounded-lg transition flex items-center gap-1.5 cursor-pointer font-bold text-xs hover:opacity-85"
          style={m.secondaryBtnStyle}
        >
          {isDirectEdit ? 'Cancel' : (<><ArrowLeft className="w-4 h-4" /> Back</>)}
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 font-bold rounded-lg flex items-center gap-2 shadow-lg transition cursor-pointer active:scale-95 hover:opacity-90"
          style={m.primaryBtnStyle}
        >
          {isCreatingNew ? (
            <><CheckCircle className="w-4 h-4" /> Create & Start Script</>
          ) : (
            <><Save className="w-4 h-4" /> Save Title Page</>
          )}
        </button>
      </div>
    </form>
  );
};
