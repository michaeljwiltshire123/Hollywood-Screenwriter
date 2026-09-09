import React from 'react';
import { TitlePage } from '../../types';

interface TitlePageFormFieldsProps {
  form: TitlePage;
  setForm: React.Dispatch<React.SetStateAction<TitlePage>>;
}

export const TitlePageFormFields: React.FC<TitlePageFormFieldsProps> = ({ form, setForm }) => {
  return (
    <>
      <div>
        <label className="block text-slate-400 font-bold uppercase mb-1">Script Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value.toUpperCase() })}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-amber-300 font-bold placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
          placeholder="e.g. THE GREAT ESCAPE or UNTITLED SCREENPLAY"
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
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
            placeholder="e.g. Written by"
          />
        </div>
        <div>
          <label className="block text-slate-400 font-bold uppercase mb-1">Author Name(s)</label>
          <input
            type="text"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
            placeholder="e.g. Jane Doe / Pen Name"
          />
        </div>
      </div>

      <div>
        <label className="block text-slate-400 font-bold uppercase mb-1">Source Material (Optional)</label>
        <input
          type="text"
          value={form.source}
          onChange={(e) => setForm({ ...form, source: e.target.value })}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
          placeholder="e.g. Based on the novel by / Original Screenplay"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-slate-400 font-bold uppercase mb-1">Date</label>
          <input
            type="text"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
            placeholder="e.g. August 2026"
          />
        </div>
        <div>
          <label className="block text-slate-400 font-bold uppercase mb-1">Draft Colour / Revisions</label>
          <input
            type="text"
            value={form.draftColor || ''}
            onChange={(e) => setForm({ ...form, draftColor: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
            placeholder="e.g. White Draft / First Draft"
          />
        </div>
      </div>

      <div>
        <label className="block text-slate-400 font-bold uppercase mb-1">Contact / Representative Info</label>
        <textarea
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
          rows={2}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 resize-none"
          placeholder="e.g. Contact details, agency representation, email or phone..."
        />
      </div>
    </>
  );
};
