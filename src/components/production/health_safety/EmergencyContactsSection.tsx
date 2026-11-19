import React from 'react';
import { RiskAssessmentItem, ScreenplayDocument } from '../../../types';
import { EmergencyDetailsData } from '../../../types/healthSafety';
import { ModalThemeStyles } from '../../../lib/modalTheme';
import { PhoneCall, RefreshCw } from 'lucide-react';
import { getResolvedEmergency } from './hsDefaultData';
import { HsExportActions } from './HsExportActions';

interface EmergencyContactsSectionProps {
  script: ScreenplayDocument;
  hazards: RiskAssessmentItem[];
  mt: ModalThemeStyles;
  onUpdateCallSheetFields: (patch: { nearestHospital?: string; emergencyContactName?: string; emergencyContactPhone?: string }) => void;
  onUpdateEmergency: (updated: EmergencyDetailsData) => void;
}

export const EmergencyContactsSection: React.FC<EmergencyContactsSectionProps> = ({
  script, hazards, mt, onUpdateCallSheetFields, onUpdateEmergency,
}) => {
  const em = getResolvedEmergency(script);
  const setEm = (field: keyof EmergencyDetailsData, value: string) => {
    const { nearestHospital: _a, primaryContactName: _b, primaryContactPhone: _c, ...rest } = em;
    onUpdateEmergency({ ...rest, [field]: value });
  };

  return (
    <div className="border rounded-xl p-4 space-y-4" style={mt.cardStyle}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-xs font-bold uppercase flex items-center gap-1.5">
            <PhoneCall className="w-4 h-4" style={mt.accentStyle} />
            <span>Emergency Hospital &amp; On-Set Contacts</span>
          </h3>
          <p className="text-[11px] flex items-center gap-1 mt-0.5" style={mt.mutedStyle}>
            <RefreshCw className="w-3 h-3" />
            <span>Synced automatically with your Call Sheet—edits here update your Call Sheet and vice versa.</span>
          </p>
        </div>
        <HsExportActions sheetType="emergency" script={script} hazards={hazards} mt={mt} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
        <label className="space-y-1"><span className="font-bold block" style={mt.mutedStyle}>Emergency Services</span>
          <input type="text" value={em.emergencyNumber} onChange={(e) => setEm('emergencyNumber', e.target.value)} className="w-full border rounded p-2 font-bold" style={mt.inputStyle} />
        </label>
        <label className="space-y-1"><span className="font-bold block" style={mt.mutedStyle}>Nearest A&amp;E Hospital (Synced)</span>
          <input type="text" value={em.nearestHospital} onChange={(e) => onUpdateCallSheetFields({ nearestHospital: e.target.value })} placeholder="Hospital Name" className="w-full border rounded p-2" style={mt.inputStyle} />
        </label>
        <label className="space-y-1"><span className="font-bold block" style={mt.mutedStyle}>Hospital Switchboard Phone</span>
          <input type="text" value={em.nearestHospitalPhone} onChange={(e) => setEm('nearestHospitalPhone', e.target.value)} placeholder="e.g. 020 7946 0000" className="w-full border rounded p-2" style={mt.inputStyle} />
        </label>
        <label className="space-y-1 sm:col-span-2"><span className="font-bold block" style={mt.mutedStyle}>Hospital Address &amp; Postcode</span>
          <input type="text" value={em.nearestHospitalAddress} onChange={(e) => setEm('nearestHospitalAddress', e.target.value)} placeholder="Full address & postcode for sat-nav" className="w-full border rounded p-2" style={mt.inputStyle} />
        </label>
        <label className="space-y-1"><span className="font-bold block" style={mt.mutedStyle}>Minor Injuries Unit</span>
          <input type="text" value={em.minorInjuriesUnit} onChange={(e) => setEm('minorInjuriesUnit', e.target.value)} placeholder="Nearest walk-in / urgent care" className="w-full border rounded p-2" style={mt.inputStyle} />
        </label>
        <label className="space-y-1"><span className="font-bold block" style={mt.mutedStyle}>Primary Set Emergency Contact (Synced)</span>
          <input type="text" value={em.primaryContactName} onChange={(e) => onUpdateCallSheetFields({ emergencyContactName: e.target.value })} placeholder="Name & Role" className="w-full border rounded p-2" style={mt.inputStyle} />
        </label>
        <label className="space-y-1"><span className="font-bold block" style={mt.mutedStyle}>Primary Contact Phone (Synced)</span>
          <input type="text" value={em.primaryContactPhone} onChange={(e) => onUpdateCallSheetFields({ emergencyContactPhone: e.target.value })} placeholder="Mobile number" className="w-full border rounded p-2" style={mt.inputStyle} />
        </label>
        <label className="space-y-1"><span className="font-bold block" style={mt.mutedStyle}>On-Set First Aider &amp; Phone</span>
          <div className="grid grid-cols-2 gap-1.5">
            <input type="text" value={em.firstAiderName} onChange={(e) => setEm('firstAiderName', e.target.value)} placeholder="Name" className="border rounded p-2" style={mt.inputStyle} />
            <input type="text" value={em.firstAiderPhone} onChange={(e) => setEm('firstAiderPhone', e.target.value)} placeholder="Phone" className="border rounded p-2" style={mt.inputStyle} />
          </div>
        </label>
        <label className="space-y-1"><span className="font-bold block" style={mt.mutedStyle}>Fire Assembly Point</span>
          <input type="text" value={em.fireAssemblyPoint} onChange={(e) => setEm('fireAssemblyPoint', e.target.value)} placeholder="e.g. Main Gate Car Park" className="w-full border rounded p-2" style={mt.inputStyle} />
        </label>
        <label className="space-y-1 sm:col-span-2"><span className="font-bold block" style={mt.mutedStyle}>Ambulance Gate / What3Words Access Notes</span>
          <input type="text" value={em.accessNotes} onChange={(e) => setEm('accessNotes', e.target.value)} placeholder="Gate code, marshal rendezvous point, What3Words" className="w-full border rounded p-2" style={mt.inputStyle} />
        </label>
      </div>
    </div>
  );
};
