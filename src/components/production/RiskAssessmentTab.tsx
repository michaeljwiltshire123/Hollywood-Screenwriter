import React, { useState } from 'react';
import { ScreenplayDocument, RiskAssessmentItem, SceneInfo } from '../../types';
import { SafetySignsBank } from './SafetySignsBank';
import { ShieldAlert, Plus, Trash2, Printer, AlertTriangle } from 'lucide-react';

interface RiskAssessmentTabProps {
  script: ScreenplayDocument;
  scenes: SceneInfo[];
  onChangeScript: (updated: ScreenplayDocument) => void;
  watermarkLogoUrl?: string;
}

export const RiskAssessmentTab: React.FC<RiskAssessmentTabProps> = ({
  script,
  scenes,
  onChangeScript,
  watermarkLogoUrl,
}) => {
  // Auto-scan script for potential risk categories
  const autoDetectedRisks: RiskAssessmentItem[] = [];

  const hasNight = scenes.some((s) => s.heading.includes('NIGHT'));
  const hasExt = scenes.some((s) => s.heading.includes('EXT.'));
  const hasVehicle = scenes.some((s) => /CAR|TRUCK|DRIVE|VEHICLE|HIGHWAY|STREET/i.test(s.heading));

  if (hasNight) {
    autoDetectedRisks.push({
      id: 'auto-night',
      category: 'Night Shoot',
      hazard: 'Low visibility, trips/slips, crew fatigue',
      riskLevel: 'MED',
      likelihood: 'MED',
      controlMeasures: 'Deploy high-mast LED work lights, clear walkways, mandate hi-vis vests for crew, provide hot catering.',
      responsiblePerson: '1st AD / Gaffer',
    });
  }

  if (hasVehicle) {
    autoDetectedRisks.push({
      id: 'auto-vehicle',
      category: 'Vehicles / Traffic',
      hazard: 'Moving vehicle collision, pedestrian safety',
      riskLevel: 'HIGH',
      likelihood: 'MED',
      controlMeasures: 'Obtain police rolling road closure permits, utilize precision stunt drivers, deploy safety marshals with radio comms.',
      responsiblePerson: 'Stunt Coordinator / Safety Officer',
    });
  }

  if (hasExt) {
    autoDetectedRisks.push({
      id: 'auto-ext',
      category: 'Outdoor Weather',
      hazard: 'Extreme heat/cold, sudden precipitation, exposure',
      riskLevel: 'LOW',
      likelihood: 'MED',
      controlMeasures: 'Provide weather shelter tents, hydration stations, warming blankets, monitor live meteorological updates.',
      responsiblePerson: 'Location Manager',
    });
  }

  // Base general electrical risk
  autoDetectedRisks.push({
    id: 'auto-elec',
    category: 'Electrical & Power',
    hazard: 'Generator high voltage cables, cable trip hazards',
    riskLevel: 'MED',
    likelihood: 'LOW',
    controlMeasures: 'Rubber cable ramps over all walkways, RCD circuit breakers, waterproof distribution boxes.',
    responsiblePerson: 'Key Rigging Gaffer',
  });

  const [risks, setRisks] = useState<RiskAssessmentItem[]>(
    script.riskAssessments && script.riskAssessments.length > 0 ? script.riskAssessments : autoDetectedRisks
  );

  const handleUpdate = (updated: RiskAssessmentItem[]) => {
    setRisks(updated);
    onChangeScript({ ...script, riskAssessments: updated });
  };

  const handleAddRisk = () => {
    const newItem: RiskAssessmentItem = {
      id: `risk-${Date.now()}`,
      category: 'Custom On-Set Hazard',
      hazard: 'Describe hazard (e.g. Broken glass, props, height)',
      riskLevel: 'MED',
      likelihood: 'LOW',
      controlMeasures: 'Describe safety controls & PPE required',
      responsiblePerson: 'Safety Marshal',
    };
    handleUpdate([...risks, newItem]);
  };

  const handleRemoveRisk = (id: string) => {
    handleUpdate(risks.filter((r) => r.id !== id));
  };

  const handleRiskChange = (id: string, field: keyof RiskAssessmentItem, val: any) => {
    handleUpdate(
      risks.map((r) => (r.id === id ? { ...r, [field]: val } : r))
    );
  };

  const handlePrintAssessment = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${script.title || 'Screenplay'} - Official Production Risk Assessment</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 25px; color: #111; background: #fff; }
            .header-banner { border-bottom: 3px solid #111; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
            h1 { font-size: 24px; margin: 0; text-transform: uppercase; font-weight: 900; }
            .meta { font-size: 11px; color: #555; font-family: monospace; }
            .logo { max-height: 50px; max-width: 150px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 11px; }
            th, td { border: 1px solid #444; padding: 8px; text-align: left; vertical-align: top; }
            th { background: #0f172a; color: #fff; text-transform: uppercase; }
            .high { color: #dc2626; font-weight: bold; }
            .med { color: #d97706; font-weight: bold; }
            .low { color: #16a34a; font-weight: bold; }
          </style>
        </head>
        <body>
          <div className="header-banner">
            <div>
              <h1>ON-SET HAZARD IDENTIFICATION & SAFETY AID</h1>
              <div class="meta">PROJECT: ${script.title || 'UNTITLED'} | DATE: ${new Date().toLocaleDateString()} | GUIDANCE CHECKLIST</div>
            </div>
            ${watermarkLogoUrl ? `<img src="${watermarkLogoUrl}" class="logo" alt="Logo" />` : ''}
          </div>

          <div style="border: 1.5px solid #d97706; background: #fffbe0; padding: 10px; margin-bottom: 15px; border-radius: 4px; font-size: 10.5px; line-height: 1.4;">
            <strong>⚠️ IMPORTANT DISCLAIMER & SAFETY NOTICE:</strong><br/>
            This document is an <strong>On-Set Hazard Identification Aid</strong> to assist cast & crew in spotting potential hazards during production. It is <strong>NOT a full or legally exhaustive Risk Assessment</strong>. The producer, location manager, and production team remain solely responsible for conducting their own comprehensive site risk assessments and complying with all local health, safety, and permit laws.
          </div>

          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Identified Hazard</th>
                <th>Risk Level</th>
                <th>Mandated Control Measures & PPE</th>
                <th>Responsible Officer</th>
              </tr>
            </thead>
            <tbody>
              ${risks.map((r) => `
                <tr>
                  <td><strong>${r.category}</strong></td>
                  <td>${r.hazard}</td>
                  <td class="${r.riskLevel.toLowerCase()}">${r.riskLevel}</td>
                  <td>${r.controlMeasures}</td>
                  <td>${r.responsiblePerson}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="margin-top: 30px; border-top: 1px solid #ccc; pt-10; font-size: 11px; font-family: monospace;">
            <strong>ON-SET SAFETY OFFICER SIGN-OFF:</strong> ___________________________ &nbsp;&nbsp;&nbsp;&nbsp; <strong>DATE:</strong> ______________
          </div>

          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 p-4 border border-slate-800 rounded-xl">
        <div>
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            On-Set Hazard Identification Aid & Safety Guidance
          </h2>
          <p className="text-xs text-slate-400">
            Hazard spotter tool auto-scanned from script scenes (Night shoots, Vehicles, Power/Electrical) with printable warning poster signs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddRisk}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 rounded text-xs font-bold flex items-center gap-1 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Hazard Row</span>
          </button>

          <button
            onClick={handlePrintAssessment}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Hazard Guidance</span>
          </button>
        </div>
      </div>

      {/* Safety Notice Disclaimer */}
      <div className="p-3.5 bg-amber-950/40 border border-amber-600/50 rounded-xl text-xs text-amber-200/90 leading-relaxed space-y-1">
        <div className="font-bold text-amber-400 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Important Producer Safety & Responsibility Disclaimer:</span>
        </div>
        <p className="text-[11px] text-amber-200/80">
          This checklist is an <strong>educational and organizational hazard identification aid</strong> to help cast and crew spot potential film set hazards. It does <strong>NOT replace a legally required, formal site risk assessment</strong>. The producer and location manager remain solely responsible for performing their own official risk assessments and complying with local health, safety, and permit regulations.
        </p>
      </div>

      {/* Risk Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-bold uppercase text-slate-100">
          Identified Set Hazards & Mitigation Measures ({risks.length} Hazards)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                <th className="p-2">Category</th>
                <th className="p-2">Hazard Description</th>
                <th className="p-2">Risk</th>
                <th className="p-2">Mandated Control Measures</th>
                <th className="p-2">Responsible Person</th>
                <th className="p-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {risks.map((r) => (
                <tr key={r.id}>
                  <td className="p-2">
                    <input
                      type="text"
                      value={r.category}
                      onChange={(e) => handleRiskChange(r.id, 'category', e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-amber-300 font-bold w-32"
                    />
                  </td>
                  <td className="p-2">
                    <textarea
                      rows={2}
                      value={r.hazard}
                      onChange={(e) => handleRiskChange(r.id, 'hazard', e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200 w-full resize-none text-xs"
                    />
                  </td>
                  <td className="p-2">
                    <select
                      value={r.riskLevel}
                      onChange={(e) => handleRiskChange(r.id, 'riskLevel', e.target.value)}
                      className={`bg-slate-950 border border-slate-800 rounded px-1.5 py-1 font-bold ${
                        r.riskLevel === 'HIGH' ? 'text-rose-400' : r.riskLevel === 'MED' ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      <option value="HIGH">HIGH</option>
                      <option value="MED">MED</option>
                      <option value="LOW">LOW</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <textarea
                      rows={2}
                      value={r.controlMeasures}
                      onChange={(e) => handleRiskChange(r.id, 'controlMeasures', e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200 w-full resize-none text-xs"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={r.responsiblePerson}
                      onChange={(e) => handleRiskChange(r.id, 'responsiblePerson', e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-slate-300 w-28"
                    />
                  </td>
                  <td className="p-2 text-right">
                    <button
                      onClick={() => handleRemoveRisk(r.id)}
                      className="p-1 hover:bg-rose-500/20 text-rose-400 rounded transition"
                      title="Remove hazard row"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Warning Signs Bank */}
      <SafetySignsBank />
    </div>
  );
};
