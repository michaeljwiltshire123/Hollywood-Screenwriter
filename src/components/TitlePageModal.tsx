import React, { useState, useEffect } from 'react';
import { X, BookOpen, Save, FilePlus, Upload, Sparkles } from 'lucide-react';
import { TitlePage } from '../types';

interface TitlePageModalProps {
  isOpen: boolean;
  onClose: () => void;
  titlePage: TitlePage;
  onSave: (updated: TitlePage) => void;
  onStartNewScript: () => void;
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
  const [form, setForm] = useState<TitlePage>({ ...titlePage });

  useEffect(() => {
    if (isOpen) {
      setForm({ ...titlePage });
    }
  }, [titlePage, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-mono">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-lg w-full text-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-sm uppercase text-amber-300">HOLLYWOOD TITLE PAGE & STARTUP</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5 text-xs">
          {/* Prominent Startup Options */}
          <div className="p-4 bg-slate-950 border border-amber-500/30 rounded-xl space-y-3">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">Quick Startup Options:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  onStartNewScript();
                  onClose();
                }}
                className="px-3 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-amber-400 text-amber-300 font-bold rounded-lg flex flex-col items-center justify-center gap-1 transition"
              >
                <FilePlus className="w-4 h-4 text-amber-400" />
                <span>Start New Script</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onLoadNativeFile) {
                    onLoadNativeFile();
                    onClose();
                  }
                }}
                className={`px-3 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-sky-400 text-sky-300 font-bold rounded-lg flex flex-col items-center justify-center gap-1 transition ${!onLoadNativeFile ? 'hidden' : ''}`}
              >
                <Upload className="w-4 h-4 text-sky-400" />
                <span>Load File</span>
              </button>

              <label className={`px-3 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-sky-400 text-sky-300 font-bold rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer transition ${onLoadNativeFile ? 'hidden' : ''}`}>
                <Upload className="w-4 h-4 text-sky-400" />
                <span>Load File</span>
                <input type="file" accept=".pdf,.docx,.txt,.fountain,.json,.screenplay" onChange={(e) => { onLoadFile(e); onClose(); }} className="hidden" />
              </label>

              <button
                type="button"
                onClick={() => {
                  onOpenSampleScript();
                  onClose();
                }}
                className="px-3 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-emerald-400 text-emerald-300 font-bold rounded-lg flex flex-col items-center justify-center gap-1 transition"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Sample Script</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-800">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Or Edit Title Page Metadata:</div>
            <div>
              <label className="block text-slate-400 font-bold uppercase mb-1">Script Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value.toUpperCase() })}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Credit Line</label>
                <input
                  type="text"
                  value={form.credit}
                  onChange={(e) => setForm({ ...form, credit: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                  placeholder="Written by"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Author Name(s)</label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-bold uppercase mb-1">Source Material (Optional)</label>
              <input
                type="text"
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                placeholder="Based on the novel by..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Date</label>
                <input
                  type="text"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Draft Color / Revisions</label>
                <input
                  type="text"
                  value={form.draftColor || 'White Draft'}
                  onChange={(e) => setForm({ ...form, draftColor: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-bold uppercase mb-1">Contact / Representative Info</label>
              <textarea
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                placeholder="Agency / Legal Contact info..."
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                Save Title Page
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
