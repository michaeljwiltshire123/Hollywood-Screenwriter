import React from 'react';
import { ArrowLeft, CheckCircle, Save } from 'lucide-react';
import { TitlePage } from '../../types';
import { TitlePageFormFields } from './TitlePageFormFields';

interface TitlePageFormProps {
  form: TitlePage;
  setForm: React.Dispatch<React.SetStateAction<TitlePage>>;
  isCreatingNew: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export const TitlePageForm: React.FC<TitlePageFormProps> = ({
  form,
  setForm,
  isCreatingNew,
  onSubmit,
  onBack,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-amber-200 text-xs">
        <span>
          {isCreatingNew
            ? 'Fill out your title page details below to launch your new script:'
            : 'Edit active script title page details below:'}
        </span>
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-amber-400 hover:text-amber-200 flex items-center gap-1 shrink-0 font-bold ml-2 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
      </div>

      <TitlePageFormFields form={form} setForm={setForm} />

      <div className="pt-3 flex justify-between items-center border-t border-slate-800">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg flex items-center gap-2 shadow-lg transition cursor-pointer active:scale-95"
        >
          {isCreatingNew ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Create & Start Script
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Title Page
            </>
          )}
        </button>
      </div>
    </form>
  );
};
