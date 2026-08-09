import React, { useState, useEffect } from 'react';
import { X, BookOpen, Save, FilePlus, Upload, Sparkles, ArrowLeft, CheckCircle } from 'lucide-react';
import { TitlePage } from '../types';

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
  const [showTitleForm, setShowTitleForm] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [form, setForm] = useState<TitlePage>({
    title: 'UNTITLED SCREENPLAY',
    credit: 'Written by',
    author: 'J. Onionfist',
    source: '',
    contact: '',
    date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    draftColor: 'White Draft',
  });

  useEffect(() => {
    if (isOpen) {
      setShowTitleForm(false);
      setIsCreatingNew(false);
      setForm({
        title: titlePage.title || 'UNTITLED SCREENPLAY',
        credit: titlePage.credit || 'Written by',
        author: titlePage.author || 'J. Onionfist',
        source: titlePage.source || '',
        contact: titlePage.contact || '',
        date: titlePage.date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        draftColor: titlePage.draftColor || 'White Draft',
      });
    }
  }, [titlePage, isOpen]);

  if (!isOpen) return null;

  const handleStartNewClick = () => {
    setIsCreatingNew(true);
    setShowTitleForm(true);
  };

  const handleEditCurrentClick = () => {
    setIsCreatingNew(false);
    setShowTitleForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreatingNew) {
      onStartNewScript(form);
    } else {
      onSave(form);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-mono">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full text-slate-100 overflow-hidden transition-all duration-200">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-xs sm:text-sm uppercase text-amber-300 tracking-wider">
              {showTitleForm
                ? (isCreatingNew ? 'NEW SCRIPT TITLE PAGE SETUP' : 'EDIT ACTIVE TITLE PAGE METADATA')
                : 'HOLLYWOOD TITLE PAGE & STARTUP'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5 text-xs">
          {!showTitleForm ? (
            /* Phase 1: Only the 3 Quick Startup Options */
            <div className="space-y-4">
              <p className="text-slate-300 text-xs leading-relaxed">
                Choose an option to begin writing, load an existing draft, or explore the interactive sample screenplay:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {/* 1. Start New Script */}
                <button
                  type="button"
                  onClick={handleStartNewClick}
                  className="p-4 bg-slate-950 hover:bg-slate-800/80 border border-amber-500/40 hover:border-amber-400 text-amber-300 font-bold rounded-xl flex flex-col items-center justify-center gap-2 transition group shadow-md"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center group-hover:scale-105 transition">
                    <FilePlus className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className="text-xs">Start New Script</span>
                  <span className="text-[10px] font-normal text-slate-400 text-center">Set title & writer info</span>
                </button>

                {/* 2. Load File */}
                {onLoadNativeFile ? (
                  <button
                    type="button"
                    onClick={() => {
                      onLoadNativeFile();
                      onClose();
                    }}
                    className="p-4 bg-slate-950 hover:bg-slate-800/80 border border-sky-500/40 hover:border-sky-400 text-sky-300 font-bold rounded-xl flex flex-col items-center justify-center gap-2 transition group shadow-md"
                  >
                    <div className="w-10 h-10 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center group-hover:scale-105 transition">
                      <Upload className="w-5 h-5 text-sky-400" />
                    </div>
                    <span className="text-xs">Load File</span>
                    <span className="text-[10px] font-normal text-slate-400 text-center">.fountain, .pdf, .docx</span>
                  </button>
                ) : (
                  <label className="p-4 bg-slate-950 hover:bg-slate-800/80 border border-sky-500/40 hover:border-sky-400 text-sky-300 font-bold rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition group shadow-md">
                    <div className="w-10 h-10 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center group-hover:scale-105 transition">
                      <Upload className="w-5 h-5 text-sky-400" />
                    </div>
                    <span className="text-xs">Load File</span>
                    <span className="text-[10px] font-normal text-slate-400 text-center">.fountain, .pdf, .docx</span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt,.fountain,.json,.screenplay"
                      onChange={(e) => {
                        onLoadFile(e);
                        onClose();
                      }}
                      className="hidden"
                    />
                  </label>
                )}

                {/* 3. Sample Script */}
                <button
                  type="button"
                  onClick={() => {
                    onOpenSampleScript();
                    onClose();
                  }}
                  className="p-4 bg-slate-950 hover:bg-slate-800/80 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 font-bold rounded-xl flex flex-col items-center justify-center gap-2 transition group shadow-md"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center group-hover:scale-105 transition">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-xs">Sample Script</span>
                  <span className="text-[10px] font-normal text-slate-400 text-center">Interactive Tutorial</span>
                </button>
              </div>

              {/* Secondary option to edit current script title page */}
              <div className="pt-3 border-t border-slate-800 flex justify-center">
                <button
                  type="button"
                  onClick={handleEditCurrentClick}
                  className="text-xs text-slate-400 hover:text-amber-300 underline underline-offset-4 transition"
                >
                  Or edit active script's title page metadata
                </button>
              </div>
            </div>
          ) : (
            /* Phase 2: Title Page Form (selected after "Start New Script" or "Edit Active") */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-amber-200 text-xs">
                <span>
                  {isCreatingNew
                    ? 'Fill out your title page details below to launch your new script:'
                    : 'Edit active script title page details below:'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowTitleForm(false)}
                  className="text-xs text-amber-400 hover:text-amber-200 flex items-center gap-1 shrink-0 font-bold ml-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Script Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                  required
                  placeholder="e.g. THE GREAT ESCAPE"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Credit Line</label>
                  <input
                    type="text"
                    value={form.credit}
                    onChange={(e) => setForm({ ...form, credit: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                    placeholder="Written by"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Author Name(s)</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                    required
                    placeholder="J. Onionfist"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Source Material (Optional)</label>
                <input
                  type="text"
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
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
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Draft Color / Revisions</label>
                  <input
                    type="text"
                    value={form.draftColor || 'White Draft'}
                    onChange={(e) => setForm({ ...form, draftColor: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Contact / Representative Info</label>
                <textarea
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400 resize-none"
                  placeholder="Agency / Legal Contact info..."
                />
              </div>

              <div className="pt-3 flex justify-between items-center border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowTitleForm(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg flex items-center gap-2 shadow-lg transition"
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
          )}
        </div>
      </div>
    </div>
  );
};

