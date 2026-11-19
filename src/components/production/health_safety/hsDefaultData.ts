import { ScreenplayDocument } from '../../../types';
import { EmergencyDetailsData, IncidentLogEntry, ToolboxBriefingData } from '../../../types/healthSafety';

export const HS_DISCLAIMER =
  'This tool is a Hazard Identification Aid and does not replace a formal site safety inspection. Producers and location managers remain responsible for carrying out full site inspections and complying with local health and safety regulations.';

export function getResolvedEmergency(script: ScreenplayDocument): EmergencyDetailsData & {
  nearestHospital: string;
  primaryContactName: string;
  primaryContactPhone: string;
} {
  const cs = script.callSheetData;
  const em = script.healthSafetyData?.emergency;
  return {
    nearestHospital: cs?.nearestHospital || '',
    primaryContactName: cs?.emergencyContactName || '',
    primaryContactPhone: cs?.emergencyContactPhone || '',
    nearestHospitalAddress: em?.nearestHospitalAddress || cs?.locationAddress || '',
    nearestHospitalPhone: em?.nearestHospitalPhone || '',
    minorInjuriesUnit: em?.minorInjuriesUnit || '',
    emergencyNumber: em?.emergencyNumber || '999 / 112 (Emergency) | 111 (NHS Non-Emergency)',
    firstAiderName: em?.firstAiderName || '',
    firstAiderPhone: em?.firstAiderPhone || '',
    fireAssemblyPoint: em?.fireAssemblyPoint || '',
    accessNotes: em?.accessNotes || '',
  };
}

export function getResolvedBriefing(script: ScreenplayDocument): ToolboxBriefingData {
  const cs = script.callSheetData;
  const saved = script.healthSafetyData?.briefing;
  const defaultAttendees = [
    cs?.directorName ? { id: 'att-dir', name: cs.directorName, role: 'Director', signed: false } : null,
    cs?.producerName ? { id: 'att-prod', name: cs.producerName, role: 'Producer', signed: false } : null,
    cs?.dopName ? { id: 'att-dop', name: cs.dopName, role: 'DOP / Camera', signed: false } : null,
  ].filter(Boolean) as ToolboxBriefingData['attendees'];

  return {
    shootDate: saved?.shootDate ?? cs?.shootDate ?? new Date().toISOString().slice(0, 10),
    location: saved?.location ?? cs?.locationName ?? '',
    safetyOfficer: saved?.safetyOfficer ?? cs?.producerName ?? '',
    weatherSummary: saved?.weatherSummary ?? cs?.weatherForecast ?? '',
    keyBriefingNotes: saved?.keyBriefingNotes ?? 'Review trip hazards, emergency exits, nearest A&E route, and radio channels before rolling.',
    attendees: saved?.attendees ?? defaultAttendees,
  };
}

export function getResolvedIncidents(script: ScreenplayDocument): IncidentLogEntry[] {
  return script.healthSafetyData?.incidents ?? [];
}
