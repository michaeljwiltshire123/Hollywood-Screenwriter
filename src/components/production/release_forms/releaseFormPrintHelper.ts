import { ReleaseFormItem } from '../../../types';

const FORM_TITLES: Record<ReleaseFormItem['formType'], string> = {
  TALENT: 'STANDARD APPEARANCE & TALENT RELEASE AGREEMENT',
  LOCATION: 'LOCATION FILMING & PRODUCTION ACCESS AGREEMENT',
  EXTRA: 'BACKGROUND EXTRA RELEASE FORM',
  MATERIALS: 'MATERIALS / ARTWORK / PROP USE RELEASE',
  MINOR: 'MINOR TALENT RELEASE & PARENTAL CONSENT FORM',
  MUSIC: 'MUSIC SYNCHRONIZATION & MASTER USE RELEASE',
  CROWD_NOTICE: 'PUBLIC FILMING / CROWD NOTICE POSTER',
};

function esc(val?: string): string {
  return (val || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const RELEASE_PRINT_STYLES = `
  @page { size: auto; margin: 15mm; }
  body { font-family: 'Courier New', Courier, monospace; padding: 28px; color: #111; background: #fff; line-height: 1.6; }
  .rf-page { page-break-after: always; break-after: page; }
  .rf-page:last-child { page-break-after: auto; break-after: auto; }
  .header-banner { border-bottom: 2px solid #111; padding-bottom: 12px; margin-bottom: 22px; display: flex; justify-content: space-between; align-items: center; gap: 16px; }
  h1 { font-size: 18px; margin: 0; text-transform: uppercase; font-weight: bold; }
  .meta { font-size: 11px; color: #444; margin-top: 4px; }
  .logo { max-height: 50px; max-width: 150px; object-fit: contain; }
  .legal-text { font-size: 12px; margin: 20px 0; text-align: justify; white-space: pre-wrap; background: #fdfdfd; padding: 15px; border: 1px solid #ddd; }
  .field-row { margin-bottom: 8px; font-size: 12px; }
  .sig-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 50px; }
  .sig-line { border-top: 1px solid #000; padding-top: 8px; font-size: 12px; font-weight: bold; }
`;

function renderReleaseFormBody(
  form: ReleaseFormItem,
  defaultAgreement: string,
  watermarkLogoUrl?: string
): string {
  const titleText = FORM_TITLES[form.formType] || FORM_TITLES.TALENT;
  const agreement = form.agreementText || defaultAgreement || '';
  const signatures =
    form.formType !== 'CROWD_NOTICE'
      ? `<div class="sig-grid">
          <div>
            <div class="sig-line">${form.formType === 'MINOR' ? 'PARENT / GUARDIAN SIGNATURE' : 'GRANTOR SIGNATURE'}</div>
            <div style="font-size:11px;margin-top:4px;">Print Name: ${esc(form.parentGuardianName || form.grantorName)}</div>
            <div style="font-size:11px;">Date: ________________________</div>
          </div>
          <div>
            <div class="sig-line">PRODUCER SIGNATURE</div>
            <div style="font-size:11px;margin-top:4px;">Print Name: ${esc(form.producerName)}</div>
            <div style="font-size:11px;">Date: ________________________</div>
          </div>
        </div>`
      : `<div style="margin-top:30px;font-weight:bold;text-align:center;border:2px solid #000;padding:15px;">PUBLIC NOTICE POSTED BY PRODUCTION MANAGEMENT</div>`;

  return `
    <div class="rf-page">
      <div class="header-banner">
        <div>
          <h1>${titleText}</h1>
          <div class="meta">PROJECT: ${esc(form.projectTitle)} | DATE: ${esc(form.date)}</div>
        </div>
        ${watermarkLogoUrl ? `<img src="${watermarkLogoUrl}" class="logo" alt="Logo" />` : ''}
      </div>
      <div class="field-row"><strong>GRANTOR / RELEASOR:</strong> ${esc(form.grantorName) || '________________________'}</div>
      ${form.parentGuardianName ? `<div class="field-row"><strong>PARENT / GUARDIAN:</strong> ${esc(form.parentGuardianName)}</div>` : ''}
      <div class="field-row"><strong>CONTACT DETAILS:</strong> ${esc(form.grantorContact) || '________________________'}</div>
      <div class="field-row"><strong>PRODUCER / PRODUCTION CO:</strong> ${esc(form.producerName)}</div>
      ${form.compensation ? `<div class="field-row"><strong>COMPENSATION / CONSIDERATION:</strong> ${esc(form.compensation)}</div>` : ''}
      ${form.locationDetails ? `<div class="field-row"><strong>LOCATION ADDRESS:</strong> ${esc(form.locationDetails)}</div>` : ''}
      ${form.artworkDetails ? `<div class="field-row"><strong>ARTWORK / MATERIAL DETAILS:</strong> ${esc(form.artworkDetails)}</div>` : ''}
      ${form.musicDetails ? `<div class="field-row"><strong>MUSIC TRACK DETAILS:</strong> ${esc(form.musicDetails)}</div>` : ''}
      <div class="legal-text">${esc(agreement)}</div>
      ${form.notes ? `<div class="field-row"><strong>ADDITIONAL TERMS:</strong> ${esc(form.notes)}</div>` : ''}
      ${signatures}
    </div>`;
}

export function buildReleaseFormHtml(
  form: ReleaseFormItem,
  templates: Record<string, string>,
  watermarkLogoUrl?: string
): string {
  const title = `${FORM_TITLES[form.formType] || 'RELEASE FORM'}${form.grantorName ? ` - ${esc(form.grantorName)}` : ''}`;
  const body = renderReleaseFormBody(form, templates[form.formType] || '', watermarkLogoUrl);
  return `<!DOCTYPE html><html><head><title>${title}</title><style>${RELEASE_PRINT_STYLES}</style></head><body>${body}</body></html>`;
}

export function buildAllReleaseFormsHtml(
  forms: ReleaseFormItem[],
  templates: Record<string, string>,
  projectTitle: string,
  watermarkLogoUrl?: string
): string {
  const body = forms.map((f) => renderReleaseFormBody(f, templates[f.formType] || '', watermarkLogoUrl)).join('');
  return `<!DOCTYPE html><html><head><title>${esc(projectTitle || 'Production')} - All Release Forms</title><style>${RELEASE_PRINT_STYLES}</style></head><body>${body}</body></html>`;
}
