import { RiskAssessmentItem, SceneInfo, ScreenplayElement } from '../../../types';
import { HAZARD_RULES } from './hsHazardRules';

export function scanScriptHazards(elements: ScreenplayElement[], scenes: SceneInfo[]): RiskAssessmentItem[] {
  const buckets: { num: string; text: string }[] = [];
  let active = { num: '1', text: '' };

  for (const el of elements) {
    if (el.type === 'SCENE HEADING') {
      if (active.text) buckets.push(active);
      const match = scenes.find((s) => s.id === el.id);
      active = { num: match?.sceneNumber || String(buckets.length + 1), text: el.content || '' };
    } else if (el.type === 'ACTION' || el.type === 'SHOT') {
      active.text += ` ${el.content || ''}`;
    }
  }
  if (active.text) buckets.push(active);

  const detected: RiskAssessmentItem[] = [];
  for (const rule of HAZARD_RULES) {
    const matchedNums = buckets.filter((b) => rule.pattern.test(b.text)).map((b) => `Sc ${b.num}`);
    if (matchedNums.length > 0) {
      const refs = matchedNums.slice(0, 6).join(', ') + (matchedNums.length > 6 ? ` (+${matchedNums.length - 6})` : '');
      detected.push({
        id: rule.id, category: rule.category, hazard: rule.hazard,
        riskLevel: rule.riskLevel, likelihood: rule.likelihood,
        controlMeasures: rule.controlMeasures, responsiblePerson: rule.responsiblePerson,
        sceneRefs: refs,
      });
    }
  }

  detected.push({
    id: 'auto-elec', category: 'Electrical & Power',
    hazard: 'Generator cables, wet leads, walkway trip hazards', riskLevel: 'MED', likelihood: 'LOW',
    controlMeasures: 'Cover cables with rubber ramps, use RCD breakers and waterproof distro boxes.',
    responsiblePerson: 'Gaffer', sceneRefs: 'All Set Locations',
  });
  return detected;
}

export function mergeScannedHazards(
  existing: RiskAssessmentItem[] | undefined,
  scanned: RiskAssessmentItem[],
  dismissedIds: string[] = []
): RiskAssessmentItem[] {
  const dismissed = new Set(dismissedIds);
  if (!existing || existing.length === 0) {
    return scanned.filter((item) => !dismissed.has(item.id));
  }
  const scannedMap = new Map(scanned.map((s) => [s.id, s]));
  const updatedExisting = existing.map((item) => {
    const fresh = scannedMap.get(item.id);
    return fresh ? { ...item, sceneRefs: fresh.sceneRefs } : item;
  });
  const existingIds = new Set(existing.map((e) => e.id));
  const newlyTriggered = scanned.filter((s) => !existingIds.has(s.id) && !dismissed.has(s.id));
  return [...updatedExisting, ...newlyTriggered];
}
