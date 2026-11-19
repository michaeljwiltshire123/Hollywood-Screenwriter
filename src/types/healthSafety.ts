export interface ToolboxAttendee {
  id: string;
  name: string;
  role: string;
  signed: boolean;
}

export interface ToolboxBriefingData {
  shootDate: string;
  location: string;
  safetyOfficer: string;
  weatherSummary: string;
  keyBriefingNotes: string;
  attendees: ToolboxAttendee[];
}

export interface IncidentLogEntry {
  id: string;
  dateTime: string;
  location: string;
  personInvolved: string;
  summary: string;
  actionTaken: string;
  reportedBy: string;
}

export interface EmergencyDetailsData {
  nearestHospitalAddress: string;
  nearestHospitalPhone: string;
  minorInjuriesUnit: string;
  emergencyNumber: string;
  firstAiderName: string;
  firstAiderPhone: string;
  fireAssemblyPoint: string;
  accessNotes: string;
}

export interface HealthSafetyData {
  dismissedAutoIds?: string[];
  emergency?: EmergencyDetailsData;
  briefing?: ToolboxBriefingData;
  incidents?: IncidentLogEntry[];
}
