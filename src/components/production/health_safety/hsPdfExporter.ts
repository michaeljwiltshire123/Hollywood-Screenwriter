import { jsPDF } from 'jspdf';
import { RiskAssessmentItem, ScreenplayDocument } from '../../../types';
import { getResolvedBriefing, getResolvedEmergency, getResolvedIncidents, HS_DISCLAIMER } from './hsDefaultData';
import { HsSheetType } from './hsHtmlTemplates';
import { prepareLogoForExport } from './hsLogoHelper';

export async function exportHsPdf(type: HsSheetType, script: ScreenplayDocument, hazards: RiskAssessmentItem[]): Promise<void> {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const maxW = 515;
  let y = 44;

  const ensureSpace = (needed: number) => {
    if (y + needed > 790) { doc.addPage(); y = 44; }
  };
  const addHeading = (title: string) => {
    ensureSpace(32);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
    doc.text(title.toUpperCase(), 40, y); y += 16;
  };
  const addLines = (text: string, size = 9.5, bold = false) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal'); doc.setFontSize(size);
    const wrapped = doc.splitTextToSize(text || '—', maxW) as string[];
    ensureSpace(wrapped.length * (size + 3) + 4);
    doc.text(wrapped, 40, y);
    y += wrapped.length * (size + 3) + 4;
  };
  const addBlankLines = (label: string, count: number) => {
    addLines(label, 9.5, true);
    for (let i = 0; i < count; i++) {
      ensureSpace(22);
      doc.setDrawColor(180);
      doc.line(40, y + 12, 555, y + 12);
      y += 22;
    }
  };

  const logo = await prepareLogoForExport(script.productionLogoUrl, 110, 36);
  if (logo) doc.addImage(logo.pngDataUrl, 'PNG', 555 - logo.widthPt, 30, logo.widthPt, logo.heightPt);

  doc.setFont('helvetica', 'bold'); doc.setFontSize(15);
  doc.text('ON-SET HEALTH & SAFETY (H&S) SUITE', 40, y); y += 16;
  addLines(`Project: ${script.title || 'UNTITLED PRODUCTION'}`, 10, true);
  if (logo && y < 34 + logo.heightPt) y = 38 + logo.heightPt;
  addLines(`Notice: ${HS_DISCLAIMER}`, 8.5, false);
  y += 6;

  if (type === 'emergency' || type === 'pack') {
    const em = getResolvedEmergency(script);
    addHeading('Emergency Hospital & Set Contacts');
    addLines(`Emergency: ${em.emergencyNumber} | First Aider: ${em.firstAiderName || 'TBC'} (${em.firstAiderPhone || 'TBC'})`);
    addLines(`Nearest A&E Hospital: ${em.nearestHospital || 'TBC'} (${em.nearestHospitalPhone || 'TBC'}) — ${em.nearestHospitalAddress || ''}`);
    addLines(`Minor Injuries Unit: ${em.minorInjuriesUnit || 'TBC'} | Fire Assembly Point: ${em.fireAssemblyPoint || 'TBC'}`);
    addLines(`Primary Set Contact: ${em.primaryContactName || 'TBC'} (${em.primaryContactPhone || 'TBC'}) | Access: ${em.accessNotes || ''}`);
    y += 8;
  }

  if (type === 'hazards' || type === 'pack') {
    addHeading('Hazard Identification Checklist');
    hazards.forEach((h, idx) => {
      addLines(`${idx + 1}. [${h.riskLevel}] ${h.category} (${h.sceneRefs || 'General'}) — Owner: ${h.responsiblePerson}`, 9.5, true);
      addLines(`   Hazard: ${h.hazard} | Suggested Controls: ${h.controlMeasures}`, 9);
    });
    y += 8;
  }

  if (type === 'briefing' || type === 'pack') {
    const b = getResolvedBriefing(script);
    addHeading('Daily Safety Briefing (Toolbox Talk)');
    addLines(`Date: ${b.shootDate} | Location: ${b.location || 'TBC'} | Safety Officer: ${b.safetyOfficer || 'TBC'} | Weather: ${b.weatherSummary || 'TBC'}`);
    addLines(`Briefing Notes: ${b.keyBriefingNotes}`);
    b.attendees.forEach((a) => addLines(`• ${a.name} (${a.role}) — ${a.signed ? 'Confirmed' : 'Pending signature'}`));
    addBlankLines('Additional Crew Sign-Offs & Handwritten Notes (Print Copy):', 6);
  }

  if (type === 'incidents' || type === 'pack') {
    addHeading('On-Set Incident & Near-Miss Log');
    const inc = getResolvedIncidents(script);
    inc.forEach((i, idx) => addLines(`${idx + 1}. [${i.dateTime}] ${i.location} | ${i.personInvolved}: ${i.summary} -> ${i.actionTaken} (By: ${i.reportedBy})`));
    addBlankLines('Manual Incident Entries (Date/Time | Location | Person | Summary | Action Taken):', 6);
  }

  const slug = (script.title || 'Screenplay').replace(/[^a-z0-9]+/gi, '_');
  doc.save(`${slug}_HS_${type}.pdf`);
}
