import { RiskAssessmentItem, ScreenplayDocument } from '../../../types';
import { getResolvedBriefing, getResolvedEmergency, getResolvedIncidents, HS_DISCLAIMER } from './hsDefaultData';
import { escapeHsHtml } from './hsPrintHelper';

export type HsSheetType = 'hazards' | 'briefing' | 'incidents' | 'emergency' | 'pack';

const STYLES = `<style>
body{font-family:Arial,sans-serif;padding:24px;color:#111;font-size:11px;line-height:1.4}
.hdr{border-bottom:3px solid #111;padding-bottom:10px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center}
h1{font-size:18px;margin:0;text-transform:uppercase;letter-spacing:.5px}h2{font-size:13px;text-transform:uppercase;margin:18px 0 6px;border-bottom:1px solid #cbd5e1;padding-bottom:4px}
.disc{border:1.5px solid #d97706;background:#fffbeb;padding:8px 10px;margin-bottom:14px;border-radius:4px;font-size:10px}
table{width:100%;border-collapse:collapse;margin-top:8px;font-size:10.5px}th,td{border:1px solid #475569;padding:6px 8px;text-align:left;vertical-align:top}
th{background:#0f172a;color:#fff;text-transform:uppercase;font-size:9.5px}.blank td{height:28px}.box{border:1px solid #64748b;padding:8px;min-height:46px;margin-top:6px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0}.kv{border:1px solid #cbd5e1;padding:6px 8px;border-radius:4px}
.pb{page-break-before:always}@media print{.pb{page-break-before:always}}</style>`;

function buildHeader(script: ScreenplayDocument, subtitle: string): string {
  const logo = script.productionLogoUrl ? `<img src="${script.productionLogoUrl}" style="max-height:44px;max-width:130px;object-fit:contain" alt="Logo" />` : '';
  return `<div class="hdr"><div><h1>On-Set Health &amp; Safety (H&amp;S) Suite</h1><div><strong>${escapeHsHtml(script.title || 'UNTITLED PRODUCTION')}</strong> — ${subtitle}</div></div>${logo}</div><div class="disc"><strong>Important Notice:</strong> ${HS_DISCLAIMER}</div>`;
}

function buildHazardsBody(hazards: RiskAssessmentItem[]): string {
  const rows = hazards.map((r) => `<tr><td><strong>${escapeHsHtml(r.category)}</strong><br/><small>${escapeHsHtml(r.sceneRefs)}</small></td><td>${escapeHsHtml(r.hazard)}</td><td><strong>${r.riskLevel}</strong></td><td>${escapeHsHtml(r.controlMeasures)}</td><td>${escapeHsHtml(r.responsiblePerson)}</td></tr>`).join('');
  return `<h2>Hazard Identification Checklist</h2><table><thead><tr><th>Category &amp; Scenes</th><th>Identified Hazard</th><th>Priority</th><th>Suggested Controls</th><th>Responsible Person</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function buildBriefingBody(script: ScreenplayDocument, hazards: RiskAssessmentItem[]): string {
  const b = getResolvedBriefing(script);
  const attRows = b.attendees.map((a) => `<tr><td>${escapeHsHtml(a.name)}</td><td>${escapeHsHtml(a.role)}</td><td>${a.signed ? 'Confirmed' : ''}</td></tr>`).join('');
  const blanks = Array.from({ length: 6 }, () => '<tr class="blank"><td></td><td></td><td></td></tr>').join('');
  const topHaz = hazards.slice(0, 6).map((h) => `<li><strong>${escapeHsHtml(h.category)}:</strong> ${escapeHsHtml(h.controlMeasures)}</li>`).join('');
  return `<h2>Daily Safety Briefing (Toolbox Talk)</h2><div class="grid"><div class="kv"><strong>Shoot Date:</strong> ${escapeHsHtml(b.shootDate)}</div><div class="kv"><strong>Location:</strong> ${escapeHsHtml(b.location)}</div><div class="kv"><strong>Safety Officer:</strong> ${escapeHsHtml(b.safetyOfficer)}</div><div class="kv"><strong>Weather:</strong> ${escapeHsHtml(b.weatherSummary)}</div></div><div class="box"><strong>Briefing Notes:</strong> ${escapeHsHtml(b.keyBriefingNotes)}<ul>${topHaz}</ul></div><div class="box"><strong>Additional On-Set Notes (Handwritten):</strong></div><table><thead><tr><th>Crew / Cast Name</th><th>Role / Department</th><th>Signature</th></tr></thead><tbody>${attRows}${blanks}</tbody></table>`;
}

function buildIncidentsBody(script: ScreenplayDocument): string {
  const rows = getResolvedIncidents(script).map((i) => `<tr><td>${escapeHsHtml(i.dateTime)}</td><td>${escapeHsHtml(i.location)}</td><td>${escapeHsHtml(i.personInvolved)}</td><td>${escapeHsHtml(i.summary)}</td><td>${escapeHsHtml(i.actionTaken)}</td><td>${escapeHsHtml(i.reportedBy)}</td></tr>`).join('');
  const blanks = Array.from({ length: 6 }, () => '<tr class="blank"><td></td><td></td><td></td><td></td><td></td><td></td></tr>').join('');
  return `<h2>On-Set Incident &amp; Near-Miss Log</h2><table><thead><tr><th>Date &amp; Time</th><th>Location</th><th>Person Involved</th><th>Incident Summary</th><th>First Aid / Action Taken</th><th>Reported By</th></tr></thead><tbody>${rows}${blanks}</tbody></table>`;
}

function buildEmergencyBody(script: ScreenplayDocument): string {
  const em = getResolvedEmergency(script);
  const extra = (script.callSheetData?.additionalContacts || []).map((c) => `<li>${escapeHsHtml(c.name)} (${escapeHsHtml(c.role)}): ${escapeHsHtml(c.phone)}</li>`).join('');
  return `<h2>Emergency Hospital &amp; On-Set Contacts</h2><div class="grid"><div class="kv"><strong>Emergency Services:</strong> ${escapeHsHtml(em.emergencyNumber)}</div><div class="kv"><strong>Nearest A&amp;E Hospital:</strong> ${escapeHsHtml(em.nearestHospital)} (${escapeHsHtml(em.nearestHospitalPhone)})</div><div class="kv"><strong>Hospital Address / Postcode:</strong> ${escapeHsHtml(em.nearestHospitalAddress)}</div><div class="kv"><strong>Minor Injuries Unit:</strong> ${escapeHsHtml(em.minorInjuriesUnit)}</div><div class="kv"><strong>Primary Emergency Contact:</strong> ${escapeHsHtml(em.primaryContactName)} (${escapeHsHtml(em.primaryContactPhone)})</div><div class="kv"><strong>On-Set First Aider:</strong> ${escapeHsHtml(em.firstAiderName)} (${escapeHsHtml(em.firstAiderPhone)})</div><div class="kv"><strong>Fire Assembly Point:</strong> ${escapeHsHtml(em.fireAssemblyPoint)}</div><div class="kv"><strong>Ambulance / Gate Access Notes:</strong> ${escapeHsHtml(em.accessNotes)}</div></div>${extra ? `<div class="kv"><strong>Additional Production Contacts:</strong><ul>${extra}</ul></div>` : ''}`;
}

export function buildHsPrintHtml(type: HsSheetType, script: ScreenplayDocument, hazards: RiskAssessmentItem[]): string {
  let body = '';
  if (type === 'hazards') body = buildHeader(script, 'Hazard Identification Checklist') + buildHazardsBody(hazards);
  else if (type === 'briefing') body = buildHeader(script, 'Daily Safety Briefing') + buildBriefingBody(script, hazards);
  else if (type === 'incidents') body = buildHeader(script, 'On-Set Incident Log') + buildIncidentsBody(script);
  else if (type === 'emergency') body = buildHeader(script, 'Emergency Hospital Contacts') + buildEmergencyBody(script);
  else body = buildHeader(script, 'Complete Production Pack') + buildEmergencyBody(script) + buildHazardsBody(hazards) + `<div class="pb"></div>` + buildBriefingBody(script, hazards) + `<div class="pb"></div>` + buildIncidentsBody(script);
  return `<!DOCTYPE html><html><head><title>${escapeHsHtml(script.title || 'Screenplay')} - On-Set Health & Safety (H&S) Suite</title>${STYLES}</head><body>${body}</body></html>`;
}
