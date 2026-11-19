import React, { useState } from 'react';
import { ScreenplayDocument, ReleaseFormItem } from '../../types';
import { AppThemeConfig } from '../../lib/themePresets';
import { getModalTheme } from '../../lib/modalTheme';
import { FileCheck, Printer, Trash2, Edit3, X, FileText } from 'lucide-react';
import { printHtmlInPlace } from '../../lib/print/printHtmlInPlace';
import { ReleaseFormPicker } from './release_forms/ReleaseFormPicker';
import { buildAllReleaseFormsHtml, buildReleaseFormHtml } from './release_forms/releaseFormPrintHelper';

interface ReleaseFormsTabProps {
  script: ScreenplayDocument;
  onChangeScript: (updated: ScreenplayDocument) => void;
  watermarkLogoUrl?: string;
  themeConfig?: AppThemeConfig;
}

const DEFAULT_AGREEMENT_TEMPLATES: Record<string, string> = {
  TALENT: `I, the undersigned Grantor, hereby grant to Producer and its successors, assigns, and licensees, the perpetual, worldwide, irrevocable right to photograph, record, and edit my appearance, voice, image, performance, and likeness in connection with the feature film or media production.

Producer shall own all rights, title, and interest (including copyright) in and to the footage, soundtrack, and marketing materials. I waive any right to inspect or approve the finished production or publicity materials.`,

  LOCATION: `I, the undersigned Property Owner / Authorized Agent, grant permission to Producer to enter upon, photograph, film, and record sound at the designated property.

Producer is permitted to bring equipment, crew, cast, and vehicles onto the property. Producer agrees to restore the premises to substantially the same condition as received, reasonable wear and tear excepted.`,

  EXTRA: `I grant permission to Producer to record and broadcast my image, voice, and performance as a background extra in the production. I acknowledge that I am receiving the agreed compensation and/or screen credit as full consideration.`,

  MATERIALS: `I, the undersigned Owner/Artist, hereby grant Producer the non-exclusive, worldwide, perpetual right to include, display, photograph, and broadcast the specified Artwork, Logo, Props, or Intellectual Material in the production and its promotional materials.`,

  MINOR: `I am the parent / legal guardian of the minor specified. I hereby give my consent for the minor to participate in the production under the terms of this Release Agreement. I represent that I have full legal authority to grant this consent and waive any claims on behalf of the minor.`,

  MUSIC: `I, the undersigned Copyright Owner / Composer / Publisher, hereby grant Producer a non-exclusive, world-wide, perpetual Sync & Master Use license to synchronize the specified Musical Composition & Master Recording into the production and all derivative formats.`,

  CROWD_NOTICE: `PUBLIC FILMING / CROWD NOTICE

PLEASE BE ADVISED THAT FILMING IS TAKING PLACE IN THIS AREA TODAY.

By entering this area, you consent to being photographed, filmed, and/or otherwise recorded in connection with the production. If you do not wish to be photographed or recorded, please avoid entering this designated filming area or notify a production assistant immediately.`
};

export const ReleaseFormsTab: React.FC<ReleaseFormsTabProps> = ({
  script,
  onChangeScript,
  watermarkLogoUrl,
  themeConfig,
}) => {
  const mt = getModalTheme(themeConfig);
  const defaultForms: ReleaseFormItem[] = script.releaseForms || [];

  const [forms, setForms] = useState<ReleaseFormItem[]>(defaultForms);
  const [editingForm, setEditingForm] = useState<ReleaseFormItem | null>(null);

  const handleUpdate = (updated: ReleaseFormItem[]) => {
    setForms(updated);
    onChangeScript({ ...script, releaseForms: updated });
  };

  const capitaliseName = (v: string) => v.replace(/(^|\s|-)[a-z]/g, (m) => m.toUpperCase());

  const handleAddForm = (type: ReleaseFormItem['formType']) => {
    const newForm: ReleaseFormItem = {
      id: `form-${type.toLowerCase()}-${Date.now()}`,
      formType: type,
      grantorName: '',
      grantorContact: '',
      projectTitle: script.title || 'UNTITLED FILM',
      producerName: script.author || 'Producer Name',
      compensation: type === 'CROWD_NOTICE' ? 'N/A (Public Notice)' : '',
      date: new Date().toLocaleDateString(),
      agreementText: DEFAULT_AGREEMENT_TEMPLATES[type] || '',
      status: 'READY TO SIGN',
    };
    handleUpdate([...forms, newForm]);
    setEditingForm(newForm);
  };

  const handleRemoveForm = (id: string) => {
    handleUpdate(forms.filter((f) => f.id !== id));
  };

  const handleFormChange = (id: string, field: keyof ReleaseFormItem, val: any) => {
    const updatedList = forms.map((f) => (f.id === id ? { ...f, [field]: val } : f));
    handleUpdate(updatedList);
    if (editingForm && editingForm.id === id) {
      setEditingForm({ ...editingForm, [field]: val });
    }
  };

  const handlePrintForm = (form: ReleaseFormItem) => {
    printHtmlInPlace(buildReleaseFormHtml(form, DEFAULT_AGREEMENT_TEMPLATES, watermarkLogoUrl));
  };

  const handlePrintAllForms = () => {
    if (forms.length === 0) return;
    printHtmlInPlace(buildAllReleaseFormsHtml(forms, DEFAULT_AGREEMENT_TEMPLATES, script.title || 'Production', watermarkLogoUrl));
  };

  return (
    <div className="space-y-6">
      {/* Top Bar Header */}
      <div className="space-y-3 p-4 border rounded-xl" style={mt.cardStyle}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <FileCheck className="w-4 h-4" style={mt.accentStyle} />
              Legal Release Forms & Clearances Library ({forms.length})
            </h2>
            <p className="text-xs mt-0.5" style={mt.mutedStyle}>
              Fully customisable agreement texts for Actors, Minors, Locations, Extras, Artwork/Props, Music Clearances, and Public Filming Notices.
            </p>
          </div>

          {forms.length > 0 && (
            <button
              type="button"
              onClick={handlePrintAllForms}
              className="px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 shrink-0 transition cursor-pointer active:scale-95 shadow-sm hover:opacity-90"
              style={mt.primaryBtnStyle}
              title="Print all release forms together, one form per page"
            >
              <Printer className="w-4 h-4" />
              <span>Print All Forms ({forms.length})</span>
            </button>
          )}
        </div>

        {forms.length > 0 && (
          <div className="pt-3 border-t" style={mt.borderStyle}>
            <ReleaseFormPicker mt={mt} variant="toolbar" onSelect={handleAddForm} />
          </div>
        )}
      </div>

      {/* Empty-State Pill Selector OR Active Release Forms Grid */}
      {forms.length === 0 ? (
        <ReleaseFormPicker mt={mt} variant="empty" onSelect={handleAddForm} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {forms.map((form) => (
          <div
            key={form.id}
            className="p-4 border rounded-xl space-y-3 flex flex-col justify-between"
            style={mt.cardStyle}
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between border-b pb-2" style={mt.borderStyle}>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded border uppercase"
                  style={{
                    backgroundColor: mt.theme.topBottomBars,
                    color: mt.theme.accentText,
                    borderColor: mt.theme.borders,
                  }}
                >
                  {form.formType === 'TALENT'
                    ? 'Actor Release'
                    : form.formType === 'MINOR'
                    ? 'Minor Release (Parental Consent)'
                    : form.formType === 'LOCATION'
                    ? 'Location Agreement'
                    : form.formType === 'MATERIALS'
                    ? 'Materials / Artwork Release'
                    : form.formType === 'MUSIC'
                    ? 'Music Sync & Master Clearance'
                    : form.formType === 'CROWD_NOTICE'
                    ? 'Public Filming Notice'
                    : 'Background Extra Release'}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingForm(form)}
                    className="p-1 rounded transition flex items-center gap-1 text-[11px] font-bold px-2 hover:opacity-80 cursor-pointer"
                    style={mt.accentStyle}
                    title="Edit full written agreement text"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Agreement Text</span>
                  </button>

                  <button
                    onClick={() => handleRemoveForm(form.id)}
                    className={`p-1 rounded transition cursor-pointer ${mt.theme.isDark ? 'hover:bg-rose-500/20 text-rose-400' : 'hover:bg-rose-500/10 text-rose-700'}`}
                    title="Remove release form"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold block" style={mt.mutedStyle}>
                    {form.formType === 'LOCATION'
                      ? 'Property / Location Owner'
                      : form.formType === 'MINOR'
                      ? 'Minor Name (Child)'
                      : form.formType === 'MATERIALS'
                      ? 'Artist / Rights Owner'
                      : form.formType === 'MUSIC'
                      ? 'Composer / Record Label'
                      : form.formType === 'CROWD_NOTICE'
                      ? 'Notice Title / Area'
                      : 'Grantor Name'}
                  </label>
                  <input
                    type="text"
                    autoCapitalize="words"
                    value={form.grantorName}
                    onChange={(e) => handleFormChange(form.id, 'grantorName', capitaliseName(e.target.value))}
                    className="w-full border rounded p-1.5 font-bold"
                    style={mt.inputStyle}
                    placeholder="Enter full name..."
                  />
                </div>

                {form.formType === 'MINOR' && (
                  <div>
                    <label className="text-[10px] uppercase font-bold block" style={mt.mutedStyle}>Parent / Legal Guardian Name</label>
                    <input
                      type="text"
                      autoCapitalize="words"
                      value={form.parentGuardianName || ''}
                      onChange={(e) => handleFormChange(form.id, 'parentGuardianName', capitaliseName(e.target.value))}
                      className="w-full border rounded p-1.5"
                      style={mt.inputStyle}
                      placeholder="e.g. Jane Doe (Parent)"
                    />
                  </div>
                )}

                {form.formType === 'LOCATION' && (
                  <div>
                    <label className="text-[10px] uppercase font-bold block" style={mt.mutedStyle}>Location Address</label>
                    <input
                      type="text"
                      value={form.locationDetails || ''}
                      onChange={(e) => handleFormChange(form.id, 'locationDetails', e.target.value)}
                      className="w-full border rounded p-1.5"
                      style={mt.inputStyle}
                      placeholder="e.g. 124 Main Street Diner"
                    />
                  </div>
                )}

                {form.formType === 'MATERIALS' && (
                  <div>
                    <label className="text-[10px] uppercase font-bold block" style={mt.mutedStyle}>Artwork / Painting / Prop Details</label>
                    <input
                      type="text"
                      value={form.artworkDetails || ''}
                      onChange={(e) => handleFormChange(form.id, 'artworkDetails', e.target.value)}
                      className="w-full border rounded p-1.5"
                      style={mt.inputStyle}
                      placeholder="e.g. Oil Painting 'Abstract Blue #3' placed in living room set"
                    />
                  </div>
                )}

                {form.formType === 'MUSIC' && (
                  <div>
                    <label className="text-[10px] uppercase font-bold block" style={mt.mutedStyle}>Song Title & Track Details</label>
                    <input
                      type="text"
                      value={form.musicDetails || ''}
                      onChange={(e) => handleFormChange(form.id, 'musicDetails', e.target.value)}
                      className="w-full border rounded p-1.5"
                      style={mt.inputStyle}
                      placeholder="e.g. 'Midnight Rain' - Written & Performed by The Soundscapes"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold block" style={mt.mutedStyle}>Compensation</label>
                    <input
                      type="text"
                      value={form.compensation}
                      onChange={(e) => handleFormChange(form.id, 'compensation', e.target.value)}
                      className="w-full border rounded p-1.5"
                      style={mt.inputStyle}
                      placeholder="e.g. Fee or screen credit"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold block" style={mt.mutedStyle}>Contact Details</label>
                    <input
                      type="text"
                      value={form.grantorContact}
                      onChange={(e) => handleFormChange(form.id, 'grantorContact', e.target.value)}
                      className="w-full border rounded p-1.5"
                      style={mt.inputStyle}
                      placeholder="Email or phone number"
                    />
                  </div>
                </div>

                <div className="p-2 border rounded text-[11px] italic line-clamp-2" style={mt.subCardStyle}>
                  "{form.agreementText || DEFAULT_AGREEMENT_TEMPLATES[form.formType] || 'No custom agreement text'}"
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingForm(form)}
                className="flex-1 py-1.5 border rounded font-bold text-xs flex items-center justify-center gap-1 transition cursor-pointer hover:opacity-85"
                style={mt.secondaryBtnStyle}
              >
                <Edit3 className="w-3.5 h-3.5" style={mt.accentStyle} />
                <span>Edit Terms</span>
              </button>

              <button
                type="button"
                onClick={() => handlePrintForm(form)}
                className="flex-1 py-1.5 rounded font-bold text-xs flex items-center justify-center gap-1 transition cursor-pointer active:scale-95 shadow-sm hover:opacity-90"
                style={mt.primaryBtnStyle}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Form</span>
              </button>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Editable Agreement Text Modal */}
      {editingForm && (
        <div
          className="fixed inset-x-0 top-28 bottom-0 z-50 backdrop-blur-xs flex items-center justify-center p-4"
          style={mt.overlayStyle}
        >
          <div className="border rounded-2xl w-full max-w-2xl max-h-[82vh] overflow-y-auto p-6 space-y-4 shadow-2xl" style={mt.windowStyle}>
            <div className="flex items-center justify-between border-b pb-3" style={mt.borderStyle}>
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5" style={mt.accentStyle} />
                  Customise Written Agreement Text & Legal Terms
                </h3>
                <p className="text-xs" style={mt.mutedStyle}>
                  Form: <span className="font-mono font-bold" style={mt.accentStyle}>{editingForm.formType}</span> ({editingForm.grantorName})
                </p>
              </div>

              <button
                onClick={() => setEditingForm(null)}
                className="p-1.5 border rounded-full transition cursor-pointer hover:opacity-80"
                style={mt.secondaryBtnStyle}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold block mb-1" style={mt.mutedStyle}>Grantor / Party Name</label>
                <input
                  type="text"
                  autoCapitalize="words"
                  value={editingForm.grantorName}
                  onChange={(e) => handleFormChange(editingForm.id, 'grantorName', capitaliseName(e.target.value))}
                  className="w-full border rounded p-2 font-bold"
                  style={mt.inputStyle}
                  placeholder="Enter full name..."
                />
              </div>

              {editingForm.formType === 'MINOR' && (
                <div>
                  <label className="text-[10px] uppercase font-bold block mb-1" style={mt.mutedStyle}>Parent or Legal Guardian Name</label>
                  <input
                    type="text"
                    autoCapitalize="words"
                    value={editingForm.parentGuardianName || ''}
                    onChange={(e) => handleFormChange(editingForm.id, 'parentGuardianName', capitaliseName(e.target.value))}
                    className="w-full border rounded p-2 font-bold"
                    style={mt.inputStyle}
                    placeholder="e.g. Mary Smith (Mother)"
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] uppercase font-bold block mb-1" style={mt.mutedStyle}>
                  Full Written Agreement Body Paragraphs (Fully Editable)
                </label>
                <textarea
                  rows={8}
                  value={editingForm.agreementText || ''}
                  onChange={(e) => handleFormChange(editingForm.id, 'agreementText', e.target.value)}
                  className="w-full border rounded p-3 font-mono text-xs leading-relaxed focus:outline-none"
                  style={mt.inputStyle}
                  placeholder="Type or paste custom legal agreement clause..."
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold block mb-1" style={mt.mutedStyle}>Special Rider / Additional Notes</label>
                <input
                  type="text"
                  value={editingForm.notes || ''}
                  onChange={(e) => handleFormChange(editingForm.id, 'notes', e.target.value)}
                  className="w-full border rounded p-2"
                  style={mt.inputStyle}
                  placeholder="e.g. Actor receives single card screen credit in main titles."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t" style={mt.borderStyle}>
              <button
                onClick={() => setEditingForm(null)}
                className="px-4 py-2 border rounded font-bold text-xs transition cursor-pointer hover:opacity-80"
                style={mt.secondaryBtnStyle}
              >
                Close
              </button>
              <button
                onClick={() => {
                  handlePrintForm(editingForm);
                  setEditingForm(null);
                }}
                className="px-4 py-2 rounded font-bold text-xs flex items-center gap-1.5 transition cursor-pointer hover:opacity-90"
                style={mt.primaryBtnStyle}
              >
                <Printer className="w-4 h-4" />
                <span>Save & Print Form</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

