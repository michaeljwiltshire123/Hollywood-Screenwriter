import React, { useState } from 'react';
import { ScreenplayDocument, ReleaseFormItem } from '../../types';
import { AppThemeConfig } from '../../lib/themePresets';
import { getModalTheme } from '../../lib/modalTheme';
import { FileCheck, Printer, Plus, Trash2, Edit3, X, FileText } from 'lucide-react';

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
  const defaultForms: ReleaseFormItem[] = script.releaseForms || [
    {
      id: 'form-talent-1',
      formType: 'TALENT',
      grantorName: 'Lead Actor Name',
      grantorContact: 'actor@agency.com | (555) 012-3456',
      projectTitle: script.title || 'UNTITLED FILM',
      producerName: script.author || 'Producer Name',
      compensation: 'Standard SAG-AFTRA / Deferred Indie Rate ($100/day)',
      date: new Date().toLocaleDateString(),
      notes: 'Covers world-wide perpetual rights in all media.',
      agreementText: DEFAULT_AGREEMENT_TEMPLATES.TALENT,
      status: 'READY TO SIGN',
    },
    {
      id: 'form-loc-1',
      formType: 'LOCATION',
      grantorName: 'Property Owner / Business Owner',
      grantorContact: 'owner@location.com',
      projectTitle: script.title || 'UNTITLED FILM',
      producerName: script.author || 'Producer Name',
      compensation: '$500 Location Fee + $250 Cleaning Deposit',
      date: new Date().toLocaleDateString(),
      locationDetails: '124 Main Street Diner & Parking Lot Area',
      notes: 'Filming permitted 07:00 AM to 08:00 PM.',
      agreementText: DEFAULT_AGREEMENT_TEMPLATES.LOCATION,
      status: 'READY TO SIGN',
    },
  ];

  const [forms, setForms] = useState<ReleaseFormItem[]>(defaultForms);
  const [editingForm, setEditingForm] = useState<ReleaseFormItem | null>(null);

  const handleUpdate = (updated: ReleaseFormItem[]) => {
    setForms(updated);
    onChangeScript({ ...script, releaseForms: updated });
  };

  const handleAddForm = (type: ReleaseFormItem['formType']) => {
    const newForm: ReleaseFormItem = {
      id: `form-${type.toLowerCase()}-${Date.now()}`,
      formType: type,
      grantorName:
        type === 'TALENT'
          ? 'Actor Name'
          : type === 'LOCATION'
          ? 'Location Owner'
          : type === 'MATERIALS'
          ? 'Artist / Prop Owner'
          : type === 'MINOR'
          ? 'Minor Name (Child)'
          : type === 'MUSIC'
          ? 'Composer / Band Name'
          : type === 'CROWD_NOTICE'
          ? 'Public Crowd Notice'
          : 'Background Extra Name',
      grantorContact: 'contact@email.com',
      projectTitle: script.title || 'UNTITLED FILM',
      producerName: script.author || 'Producer Name',
      compensation: type === 'CROWD_NOTICE' ? 'N/A (Public Notice)' : 'Negotiated Terms / Credit',
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
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let titleText = 'STANDARD APPEARANCE & TALENT RELEASE AGREEMENT';
    if (form.formType === 'LOCATION') titleText = 'LOCATION FILMING & PRODUCTION ACCESS AGREEMENT';
    if (form.formType === 'EXTRA') titleText = 'BACKGROUND EXTRA RELEASE FORM';
    if (form.formType === 'MATERIALS') titleText = 'MATERIALS / ARTWORK / PROP USE RELEASE';
    if (form.formType === 'MINOR') titleText = 'MINOR TALENT RELEASE & PARENTAL CONSENT FORM';
    if (form.formType === 'MUSIC') titleText = 'MUSIC SYNCHRONIZATION & MASTER USE RELEASE';
    if (form.formType === 'CROWD_NOTICE') titleText = 'PUBLIC FILMING / CROWD NOTICE POSTER';

    const agreement = form.agreementText || DEFAULT_AGREEMENT_TEMPLATES[form.formType] || '';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${titleText} - ${form.grantorName}</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; padding: 40px; color: #111; background: #fff; line-height: 1.6; }
            .header-banner { border-bottom: 2px solid #111; padding-bottom: 12px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; }
            h1 { font-size: 18px; margin: 0; text-transform: uppercase; font-weight: bold; }
            .meta { font-size: 11px; color: #444; }
            .logo { max-height: 50px; max-width: 150px; }
            .legal-text { font-size: 12px; margin: 20px 0; text-align: justify; white-space: pre-wrap; background: #fdfdfd; padding: 15px; border: 1px solid #ddd; }
            .field-row { margin-bottom: 8px; font-size: 12px; }
            .sig-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 50px; }
            .sig-line { border-top: 1px solid #000; pt-8; font-size: 12px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header-banner">
            <div>
              <h1>${titleText}</h1>
              <div class="meta">PROJECT: ${form.projectTitle} | DATE: ${form.date}</div>
            </div>
            ${watermarkLogoUrl ? `<img src="${watermarkLogoUrl}" class="logo" alt="Logo" />` : ''}
          </div>

          <div class="field-row"><strong>GRANTOR / RELEASOR:</strong> ${form.grantorName}</div>
          ${form.parentGuardianName ? `<div class="field-row"><strong>PARENT / GUARDIAN:</strong> ${form.parentGuardianName}</div>` : ''}
          <div class="field-row"><strong>CONTACT DETAILS:</strong> ${form.grantorContact}</div>
          <div class="field-row"><strong>PRODUCER / PRODUCTION CO:</strong> ${form.producerName}</div>
          ${form.compensation ? `<div class="field-row"><strong>COMPENSATION / CONSIDERATION:</strong> ${form.compensation}</div>` : ''}
          ${form.locationDetails ? `<div class="field-row"><strong>LOCATION ADDRESS:</strong> ${form.locationDetails}</div>` : ''}
          ${form.artworkDetails ? `<div class="field-row"><strong>ARTWORK / MATERIAL DETAILS:</strong> ${form.artworkDetails}</div>` : ''}
          ${form.musicDetails ? `<div class="field-row"><strong>MUSIC TRACK DETAILS:</strong> ${form.musicDetails}</div>` : ''}

          <div class="legal-text">${agreement}</div>

          ${form.notes ? `<div class="field-row"><strong>ADDITIONAL TERMS:</strong> ${form.notes}</div>` : ''}

          ${
            form.formType !== 'CROWD_NOTICE'
              ? `
          <div class="sig-grid">
            <div>
              <div class="sig-line">${form.formType === 'MINOR' ? 'PARENT / GUARDIAN SIGNATURE' : 'GRANTOR SIGNATURE'}</div>
              <div style="font-size: 11px; margin-top: 4px;">Print Name: ${form.parentGuardianName || form.grantorName}</div>
              <div style="font-size: 11px;">Date: ________________________</div>
            </div>
            <div>
              <div class="sig-line">PRODUCER SIGNATURE</div>
              <div style="font-size: 11px; margin-top: 4px;">Print Name: ${form.producerName}</div>
              <div style="font-size: 11px;">Date: ________________________</div>
            </div>
          </div>
          `
              : `<div style="margin-top: 30px; font-weight: bold; text-align: center; border: 2px solid #000; padding: 15px;">PUBLIC NOTICE POSTED BY PRODUCTION MANAGEMENT</div>`
          }

          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Top Bar Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border rounded-xl" style={mt.cardStyle}>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
            <FileCheck className="w-4 h-4" style={mt.accentStyle} />
            Legal Release Forms & Clearances Library ({forms.length})
          </h2>
          <p className="text-xs" style={mt.mutedStyle}>
            Fully customisable agreement texts for Actors, Minors, Locations, Extras, Artwork/Props, Music Clearances, and Public Filming Notices.
          </p>
        </div>

        <div id="tour-releases-selector" className="flex flex-wrap items-center gap-1.5">
          {[
            { type: 'TALENT' as const, label: '+ Actor' },
            { type: 'MINOR' as const, label: '+ Minor (Parental)' },
            { type: 'LOCATION' as const, label: '+ Location' },
            { type: 'MATERIALS' as const, label: '+ Artwork / Materials' },
            { type: 'MUSIC' as const, label: '+ Music Clearance' },
            { type: 'CROWD_NOTICE' as const, label: '+ Crowd Notice Poster' },
          ].map((btn) => (
            <button
              key={btn.type}
              onClick={() => handleAddForm(btn.type)}
              className="px-2.5 py-1 border rounded text-xs font-bold transition cursor-pointer hover:opacity-85"
              style={mt.secondaryBtnStyle}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Release Forms Grid */}
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
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                    form.formType === 'TALENT'
                      ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                      : form.formType === 'MINOR'
                      ? 'bg-pink-500/10 text-pink-300 border-pink-500/30'
                      : form.formType === 'LOCATION'
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      : form.formType === 'MATERIALS'
                      ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                      : form.formType === 'MUSIC'
                      ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                      : form.formType === 'CROWD_NOTICE'
                      ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                      : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  }`}
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
                    className="p-1 hover:bg-sky-500/20 text-sky-400 rounded transition flex items-center gap-1 text-[11px] font-bold px-2"
                    title="Edit full written agreement text"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Agreement Text</span>
                  </button>

                  <button
                    onClick={() => handleRemoveForm(form.id)}
                    className="p-1 hover:bg-rose-500/20 text-rose-400 rounded transition"
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
                    value={form.grantorName}
                    onChange={(e) => handleFormChange(form.id, 'grantorName', e.target.value)}
                    className="w-full border rounded p-1.5 font-bold"
                    style={mt.inputStyle}
                  />
                </div>

                {form.formType === 'MINOR' && (
                  <div>
                    <label className="text-[10px] uppercase font-bold block" style={mt.mutedStyle}>Parent / Legal Guardian Name</label>
                    <input
                      type="text"
                      value={form.parentGuardianName || ''}
                      onChange={(e) => handleFormChange(form.id, 'parentGuardianName', e.target.value)}
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
                onClick={() => setEditingForm(form)}
                className="flex-1 py-1.5 border rounded font-bold text-xs flex items-center justify-center gap-1 transition cursor-pointer hover:opacity-85"
                style={mt.secondaryBtnStyle}
              >
                <Edit3 className="w-3.5 h-3.5" style={mt.accentStyle} />
                <span>Edit Terms</span>
              </button>

              <button
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
                  value={editingForm.grantorName}
                  onChange={(e) => handleFormChange(editingForm.id, 'grantorName', e.target.value)}
                  className="w-full border rounded p-2 font-bold"
                  style={mt.inputStyle}
                />
              </div>

              {editingForm.formType === 'MINOR' && (
                <div>
                  <label className="text-[10px] uppercase font-bold block mb-1" style={mt.mutedStyle}>Parent or Legal Guardian Name</label>
                  <input
                    type="text"
                    value={editingForm.parentGuardianName || ''}
                    onChange={(e) => handleFormChange(editingForm.id, 'parentGuardianName', e.target.value)}
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

