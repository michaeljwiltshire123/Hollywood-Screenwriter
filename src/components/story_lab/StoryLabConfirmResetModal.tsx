import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface StoryLabConfirmResetModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const StoryLabConfirmResetModal: React.FC<StoryLabConfirmResetModalProps> = ({
  isOpen,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-[#FFFFFF] border border-amber-300 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-[#0F172A] font-sans">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 transition p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-bold text-slate-900">
            Are you sure you want to delete everything that is in here?
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Starting a new story canvas will clear all written act notes, pacing goals, and narrative beats from your Story Lab.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            Keep My Notes
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 rounded-lg flex items-center gap-1.5 transition shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear & Start Fresh</span>
          </button>
        </div>
      </div>
    </div>
  );
};
