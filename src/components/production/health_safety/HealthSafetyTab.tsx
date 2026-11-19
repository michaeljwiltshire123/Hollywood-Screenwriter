import React, { useEffect, useState } from 'react';
import { RiskAssessmentItem, SceneInfo, ScreenplayDocument } from '../../../types';
import { getModalTheme } from '../../../lib/modalTheme';
import { AppThemeConfig } from '../../../lib/themePresets';
import { ShieldAlert } from 'lucide-react';
import { HS_DISCLAIMER } from './hsDefaultData';
import { mergeScannedHazards, scanScriptHazards } from './hsKeywordScanner';
import { HsExportActions } from './HsExportActions';
import { HazardChecklistSection } from './HazardChecklistSection';
import { ToolboxTalkSection } from './ToolboxTalkSection';
import { IncidentLogSection } from './IncidentLogSection';
import { EmergencyContactsSection } from './EmergencyContactsSection';
import { SafetySignsBank } from '../safety_signs/SafetySignsBank';
import { getDefaultCallSheetData } from '../shoot_schedule/defaultShootData';

type HsSectionView = 'hazards' | 'briefing' | 'incidents' | 'emergency' | 'signs';

interface HealthSafetyTabProps {
  script: ScreenplayDocument;
  scenes: SceneInfo[];
  onChangeScript: (updated: ScreenplayDocument) => void;
  themeConfig?: AppThemeConfig;
}

export const HealthSafetyTab: React.FC<HealthSafetyTabProps> = ({ script, scenes, onChangeScript, themeConfig }) => {
  const mt = getModalTheme(themeConfig);
  const [section, setSection] = useState<HsSectionView>('hazards');
  const dismissedIds = script.healthSafetyData?.dismissedAutoIds || [];
  const hazards = mergeScannedHazards(script.riskAssessments, scanScriptHazards(script.elements, scenes), dismissedIds);

  useEffect(() => {
    const prev = script.riskAssessments || [];
    const changed = hazards.length !== prev.length || hazards.some((h, i) => h.id !== prev[i]?.id || h.sceneRefs !== prev[i]?.sceneRefs);
    if (changed) onChangeScript({ ...script, riskAssessments: hazards });
  }, [script.id, scenes.length, script.elements.length]);

  const updateHazards = (updated: RiskAssessmentItem[], nextDismissed = dismissedIds) =>
    onChangeScript({ ...script, riskAssessments: updated, healthSafetyData: { ...script.healthSafetyData, dismissedAutoIds: nextDismissed } });

  const handleRemove = (id: string) =>
    updateHazards(hazards.filter((h) => h.id !== id), id.startsWith('auto-') && !dismissedIds.includes(id) ? [...dismissedIds, id] : dismissedIds);

  const handleAdd = () => updateHazards([{
    id: `risk-${Date.now()}`, category: 'Custom Set Hazard', hazard: '',
    riskLevel: 'MED', likelihood: 'LOW', controlMeasures: '', responsiblePerson: '',
  }, ...hazards]);

  const updateCallSheetFields = (patch: { nearestHospital?: string; emergencyContactName?: string; emergencyContactPhone?: string }) =>
    onChangeScript({ ...script, callSheetData: { ...(script.callSheetData || getDefaultCallSheetData(script.title)), ...patch } });

  const subTabs: { id: HsSectionView; label: string; count?: number }[] = [
    { id: 'hazards', label: 'Hazard Checklist', count: hazards.length },
    { id: 'briefing', label: 'Daily Safety Briefing' },
    { id: 'incidents', label: 'Incident Log', count: script.healthSafetyData?.incidents?.length || 0 },
    { id: 'emergency', label: 'Emergency Contacts' },
    { id: 'signs', label: 'Safety Signs', count: 12 },
  ];

  return (
    <div className="space-y-6">
      <div id="tour-risk-summary" className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-5 border-b" style={mt.borderStyle}>
        <div className="flex items-start gap-3 max-w-2xl">
          {script.productionLogoUrl && <img src={script.productionLogoUrl} alt="Production logo" className="h-11 max-w-[110px] object-contain rounded-lg border p-1 bg-white/80 shrink-0" style={mt.borderStyle} />}
          <div className="space-y-1.5">
            <h2 className="text-base font-bold tracking-tight flex items-center gap-2"><ShieldAlert className="w-5 h-5 shrink-0" style={mt.accentStyle} /><span>On-Set Health &amp; Safety (H&amp;S) Suite</span></h2>
            <p className="text-xs leading-relaxed" style={mt.mutedStyle}>{HS_DISCLAIMER}</p>
          </div>
        </div>
        <div className="shrink-0">
          <HsExportActions sheetType="pack" script={script} hazards={hazards} mt={mt} labelPrefix="Full Pack" />
        </div>
      </div>

      <div id="tour-hs-templates" className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl border" style={mt.subCardStyle}>
        {subTabs.map((t) => (
          <button
            key={t.id}
            id={t.id === 'signs' ? 'tour-hs-signs-tab' : undefined}
            type="button"
            onClick={() => setSection(t.id)}
            className="px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5"
            style={section === t.id ? mt.primaryBtnStyle : { color: mt.theme.primaryText, backgroundColor: 'transparent' }}
          >
            <span>{t.label}</span>
            {t.count !== undefined && <span className="opacity-75 tabular-nums">({t.count})</span>}
          </button>
        ))}
      </div>

      <div id="tour-hs-workspace">
        {section === 'hazards' && <HazardChecklistSection script={script} hazards={hazards} mt={mt} onAdd={handleAdd} onRemove={handleRemove} onChangeField={(id, field, val) => updateHazards(hazards.map((r) => (r.id === id ? { ...r, [field]: val } : r)))} />}
        {section === 'briefing' && <ToolboxTalkSection script={script} hazards={hazards} mt={mt} onUpdateBriefing={(briefing) => onChangeScript({ ...script, healthSafetyData: { ...script.healthSafetyData, briefing } })} />}
        {section === 'incidents' && <IncidentLogSection script={script} hazards={hazards} mt={mt} onUpdateIncidents={(incidents) => onChangeScript({ ...script, healthSafetyData: { ...script.healthSafetyData, incidents } })} />}
        {section === 'emergency' && <EmergencyContactsSection script={script} hazards={hazards} mt={mt} onUpdateCallSheetFields={updateCallSheetFields} onUpdateEmergency={(emergency) => onChangeScript({ ...script, healthSafetyData: { ...script.healthSafetyData, emergency } })} />}
        {section === 'signs' && <SafetySignsBank themeConfig={themeConfig} productionLogoUrl={script.productionLogoUrl} />}
      </div>
    </div>
  );
};
