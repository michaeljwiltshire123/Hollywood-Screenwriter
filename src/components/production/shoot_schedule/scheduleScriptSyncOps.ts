import { CallSheetData, ScreenplayDocument, CharacterInfo, ScheduleRowItem } from '../../../types';
import { extractSceneCharacters, formatClockTime } from './scheduleGeneratorHelpers';
import { extractSceneNotes, mapScriptShotsToSetupItems, sanitizeNotes } from './sceneNotesAndShotsSyncHelper';

function mergeSceneShots(existing: ScheduleRowItem['shots'] = [], incoming: ScheduleRowItem['shots'] = []) {
  if (!incoming || incoming.length === 0) return existing;
  return incoming.map((inc) => {
    const match = existing?.find((ex) => ex.id === inc.id || ex.shotNumber === inc.shotNumber);
    if (match) {
      return {
        ...inc,
        description: match.description || inc.description || '',
        setup: match.setup || inc.setup,
        estimatedTimeMinutes: match.estimatedTimeMinutes ?? inc.estimatedTimeMinutes,
      };
    }
    return inc;
  });
}

function mergeNotes(existing = '', fresh = '') {
  const cleanExisting = sanitizeNotes(existing);
  const cleanFresh = sanitizeNotes(fresh);
  if (!cleanExisting.trim()) return cleanFresh;
  if (!cleanFresh.trim()) return cleanExisting;
  let merged = cleanExisting;
  cleanFresh.split(' | ').forEach((p) => {
    if (!merged.includes(p)) merged = `${merged} | ${p}`;
  });
  return sanitizeNotes(merged);
}

export function syncScheduleWithScript(
  callData: CallSheetData,
  script: ScreenplayDocument,
  characters: CharacterInfo[]
): CallSheetData {
  const sceneElements = script.elements.filter((el) => el.type === 'SCENE HEADING');
  if (sceneElements.length === 0) return callData;

  const charNames = characters.map((c) => c.name.toUpperCase());
  const updateRowsList = (rows: ScheduleRowItem[]): ScheduleRowItem[] => {
    const nextRows = [...rows];
    let lastHour = 9;

    sceneElements.forEach((sc, idx) => {
      const sceneNum = sc.sceneNumber || String(idx + 1);
      const rowIdx = nextRows.findIndex((r) => r.id === `row-sc-${sc.id}` || r.id.includes(sc.id) || r.sceneNumber === sceneNum);
      const sceneChars = extractSceneCharacters(script.elements, sc.id);
      const chars = sceneChars.length > 0 ? sceneChars : charNames.slice(0, 2);
      const scriptSetups = mapScriptShotsToSetupItems(script.shots || [], sc.id, sceneNum);
      const freshNotes = extractSceneNotes(script.elements, sc.id, chars, script.characterBibles, script.shots, script.productionNotes);

      if (rowIdx >= 0) {
        const row = nextRows[rowIdx];
        const mergedShots = mergeSceneShots(row.shots, scriptSetups);
        nextRows[rowIdx] = {
          ...row,
          shots: mergedShots,
          shotIds: mergedShots.map((s) => s.id),
          notes: mergeNotes(row.notes, freshNotes),
        };
      } else {
        const isExt = sc.content.toUpperCase().includes('EXT.');
        const cleanLoc = sc.content.replace(/^(INT\.|EXT\.|INT\/EXT\.)\s*/i, '').split('-')[0].trim();
        nextRows.push({
          id: `row-sc-${sc.id}`,
          time: formatClockTime(lastHour, 0),
          sceneNumber: sceneNum,
          intExt: isExt ? 'Ext' : 'Int',
          location: cleanLoc || (isExt ? 'LOCATION' : 'STAGE'),
          description: '',
          dayNight: sc.content.toUpperCase().includes('NIGHT') ? 'Night' : 'Day',
          notes: freshNotes,
          characterTags: chars,
          isExterior: isExt,
          type: 'SCENE',
          durationHours: 1.0,
          shotIds: scriptSetups.map((s) => s.id),
          shots: scriptSetups,
        });
        lastHour += 1;
      }
    });
    return nextRows.map((r) => ({ ...r, notes: sanitizeNotes(r.notes) }));
  };

  const updatedDays = (callData.days || []).map((d) => ({ ...d, rows: updateRowsList(d.rows || []) }));
  return { ...callData, days: updatedDays.length > 0 ? updatedDays : undefined, rows: updateRowsList(callData.rows || []) };
}
