import { ScheduleRowItem, ScreenplayDocument, CharacterInfo } from '../../../types';
import { extractSceneCharacters, formatClockTime } from './scheduleGeneratorHelpers';
import { extractSceneNotes, mapScriptShotsToSetupItems } from './sceneNotesAndShotsSyncHelper';

export function deriveScheduleRowsFromScript(
  script: ScreenplayDocument,
  characters: CharacterInfo[]
): ScheduleRowItem[] {
  const sceneElements = script.elements.filter((el) => el.type === 'SCENE HEADING');
  if (sceneElements.length === 0) return [];

  const charNames = characters.map((c) => c.name.toUpperCase());
  let currentHour = 8;
  const rows: ScheduleRowItem[] = [];

  sceneElements.forEach((sc, idx) => {
    if (idx === 0) {
      rows.push({
        id: `row-breakfast-${Date.now()}`,
        time: '07:00 AM',
        sceneNumber: '',
        intExt: '',
        location: 'BASECAMP',
        description: 'Call time & breakfast',
        dayNight: '',
        notes: '',
        characterTags: charNames.slice(0, 3),
        propTags: [],
        isExterior: false,
        type: 'BREAK',
        durationHours: 1.0,
      });
    }

    if (idx === 3) {
      rows.push({
        id: `row-lunch-${Date.now()}`,
        time: '12:30 PM',
        sceneNumber: '',
        intExt: '',
        location: 'CATERING',
        description: 'Lunch break',
        dayNight: '',
        notes: '',
        characterTags: [],
        propTags: [],
        isExterior: false,
        type: 'BREAK',
        durationHours: 1.0,
      });
      currentHour = 13;
    }

    const headingUpper = sc.content.toUpperCase();
    const isExt = headingUpper.includes('EXT.');
    const sceneChars = extractSceneCharacters(script.elements, sc.id);
    const cleanLocation = sc.content.replace(/^(INT\.|EXT\.|INT\/EXT\.)\s*/i, '').split('-')[0].trim();
    const sceneNum = sc.sceneNumber || String(idx + 1);
    const setupShots = mapScriptShotsToSetupItems(script.shots || [], sc.id, sceneNum);
    const notesStr = extractSceneNotes(
      script.elements,
      sc.id,
      sceneChars,
      script.characterBibles,
      script.shots,
      script.productionNotes
    );

    rows.push({
      id: `row-sc-${sc.id}`,
      time: formatClockTime(currentHour, 0),
      sceneNumber: sceneNum,
      unitNumber: 1,
      intExt: isExt ? 'Ext' : 'Int',
      location: cleanLocation || (isExt ? 'LOCATION' : 'STAGE'),
      description: '',
      dayNight: headingUpper.includes('NIGHT') ? 'Night' : 'Day',
      notes: notesStr,
      characterTags: sceneChars.length > 0 ? sceneChars : charNames.slice(0, 2),
      propTags: [],
      isExterior: isExt,
      type: 'SCENE',
      durationHours: 1.0,
      shotIds: setupShots.map((s) => s.id),
      shots: setupShots,
    });
    currentHour += 1;
  });

  return rows;
}
