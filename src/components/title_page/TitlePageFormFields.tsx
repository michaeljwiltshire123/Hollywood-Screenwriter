import React from 'react';
import { TitlePage } from '../../types';
import { AppThemeConfig } from '../../lib/themePresets';
import { getModalTheme } from '../../lib/modalTheme';

interface TitlePageFormFieldsProps {
  form: TitlePage;
  setForm: React.Dispatch<React.SetStateAction<TitlePage>>;
  themeConfig?: AppThemeConfig;
}

export const TitlePageFormFields: React.FC<TitlePageFormFieldsProps> = ({ form, setForm, themeConfig }) => {
  const m = getModalTheme(themeConfig);
  const inputCls = 'w-full border rounded-lg px-3 py-2 focus:outline-none';
  const field = (label: string, key: keyof TitlePage, placeholder: string, extraCls = '', isTitle = false) => (
    <div>
      <label className="block font-bold uppercase mb-1" style={m.mutedStyle}>{label}</label>
      <input
        type="text"
        value={(form[key] as string) || ''}
        onChange={(e) => setForm({ ...form, [key]: isTitle ? e.target.value.toUpperCase() : e.target.value })}
        className={`${inputCls} ${extraCls}`}
        style={isTitle ? { ...m.inputStyle, color: m.theme.accentText } : m.inputStyle}
        placeholder={placeholder}
        autoFocus={isTitle}
      />
    </div>
  );

  return (
    <>
      {field('Script Title', 'title', 'e.g. THE GREAT ESCAPE or UNTITLED SCREENPLAY', 'font-bold', true)}
      <div className="grid grid-cols-2 gap-3">
        {field('Credit Line', 'credit', 'e.g. Written by')}
        {field('Author Name(s)', 'author', 'e.g. Jane Doe / Pen Name')}
      </div>
      {field('Source Material (Optional)', 'source', 'e.g. Based on the novel by / Original Screenplay')}
      <div className="grid grid-cols-2 gap-3">
        {field('Date', 'date', 'e.g. August 2026')}
        {field('Draft Colour / Revisions', 'draftColor', 'e.g. White Draft / First Draft')}
      </div>
      <div>
        <label className="block font-bold uppercase mb-1" style={m.mutedStyle}>Contact / Representative Info</label>
        <textarea
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
          rows={2}
          className={`${inputCls} resize-none`}
          style={m.inputStyle}
          placeholder="e.g. Contact details, agency representation, email or phone..."
        />
      </div>
    </>
  );
};
