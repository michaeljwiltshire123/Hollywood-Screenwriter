import { Document, ImageRun, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx';
import { RiskAssessmentItem, ScreenplayDocument } from '../../../types';
import { getResolvedBriefing, getResolvedEmergency, getResolvedIncidents, HS_DISCLAIMER } from './hsDefaultData';
import { HsSheetType } from './hsHtmlTemplates';
import { prepareLogoForExport } from './hsLogoHelper';
import { triggerFileDownload } from './hsPrintHelper';

const p = (text: string, bold = false, size = 20) =>
  new Paragraph({ children: [new TextRun({ text, bold, size, font: 'Calibri' })], spacing: { after: 100 } });

const cell = (text: string, bold = false) =>
  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: text || ' ', bold, size: 18, font: 'Calibri' })] })] });

const makeTable = (headers: string[], rows: string[][], blankRows = 0) =>
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: headers.map((h) => cell(h, true)) }),
      ...rows.map((r) => new TableRow({ children: r.map((v) => cell(v)) })),
      ...Array.from({ length: blankRows }, () => new TableRow({ children: headers.map(() => cell(' ')) })),
    ],
  });

export async function exportHsWord(type: HsSheetType, script: ScreenplayDocument, hazards: RiskAssessmentItem[]): Promise<void> {
  const logo = await prepareLogoForExport(script.productionLogoUrl, 110, 38);
  const children: (Paragraph | Table)[] = [];
  if (logo) {
    children.push(new Paragraph({ children: [new ImageRun({ data: logo.pngBytes, transformation: { width: logo.widthPx, height: logo.heightPx }, type: 'png' })], spacing: { after: 120 } }));
  }
  children.push(
    p('ON-SET HEALTH & SAFETY (H&S) SUITE', true, 30),
    p(`Project: ${script.title || 'UNTITLED PRODUCTION'}`, true, 22),
    p(`Notice: ${HS_DISCLAIMER}`, false, 18),
  );

  if (type === 'emergency' || type === 'pack') {
    const em = getResolvedEmergency(script);
    children.push(
      p('EMERGENCY HOSPITAL & ON-SET CONTACTS', true, 24),
      makeTable(['Field', 'Details'], [
        ['Emergency Services', em.emergencyNumber],
        ['Nearest A&E Hospital', `${em.nearestHospital} (${em.nearestHospitalPhone})`],
        ['Hospital Address / Postcode', em.nearestHospitalAddress],
        ['Minor Injuries Unit', em.minorInjuriesUnit],
        ['Primary Set Contact', `${em.primaryContactName} (${em.primaryContactPhone})`],
        ['On-Set First Aider', `${em.firstAiderName} (${em.firstAiderPhone})`],
        ['Fire Assembly Point', em.fireAssemblyPoint],
        ['Gate / Ambulance Access', em.accessNotes],
      ])
    );
  }

  if (type === 'hazards' || type === 'pack') {
    children.push(
      p('HAZARD IDENTIFICATION CHECKLIST', true, 24),
      makeTable(
        ['Category & Scenes', 'Identified Hazard', 'Priority', 'Suggested Controls', 'Owner'],
        hazards.map((h) => [`${h.category} (${h.sceneRefs || 'General'})`, h.hazard, h.riskLevel, h.controlMeasures, h.responsiblePerson])
      )
    );
  }

  if (type === 'briefing' || type === 'pack') {
    const b = getResolvedBriefing(script);
    children.push(
      p('DAILY SAFETY BRIEFING (TOOLBOX TALK)', true, 24),
      p(`Date: ${b.shootDate} | Location: ${b.location} | Safety Officer: ${b.safetyOfficer} | Weather: ${b.weatherSummary}`),
      p(`Briefing Notes: ${b.keyBriefingNotes}`),
      makeTable(
        ['Crew / Cast Name', 'Role / Department', 'Signature'],
        b.attendees.map((a) => [a.name, a.role, a.signed ? 'Confirmed' : '']),
        6
      )
    );
  }

  if (type === 'incidents' || type === 'pack') {
    const inc = getResolvedIncidents(script);
    children.push(
      p('ON-SET INCIDENT & NEAR-MISS LOG', true, 24),
      makeTable(
        ['Date & Time', 'Location', 'Person Involved', 'Summary', 'First Aid / Action Taken', 'Reported By'],
        inc.map((i) => [i.dateTime, i.location, i.personInvolved, i.summary, i.actionTaken, i.reportedBy]),
        6
      )
    );
  }

  const blob = await Packer.toBlob(new Document({ sections: [{ children }] }));
  const slug = (script.title || 'Screenplay').replace(/[^a-z0-9]+/gi, '_');
  triggerFileDownload(blob, `${slug}_HS_${type}.docx`);
}
