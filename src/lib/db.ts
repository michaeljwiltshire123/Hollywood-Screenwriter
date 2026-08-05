import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { ScreenplayDocument, RevisionHistoryItem } from '../types';

interface ScreenwriterDB extends DBSchema {
  scripts: {
    key: string;
    value: ScreenplayDocument;
  };
  revisions: {
    key: string;
    value: RevisionHistoryItem;
    indexes: { 'by-script': string };
  };
  settings: {
    key: string;
    value: { id: string; theme: string; autoSaveDelay: number; activeScriptId: string };
  };
}

const DB_NAME = 'ScreenwriterProDB';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<ScreenwriterDB>> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<ScreenwriterDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('scripts')) {
          db.createObjectStore('scripts', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('revisions')) {
          const revStore = db.createObjectStore('revisions', { keyPath: 'id' });
          revStore.createIndex('by-script', 'scriptId');
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

/**
 * Save screenplay atomically to IndexedDB
 */
export async function saveScriptToIDB(script: ScreenplayDocument): Promise<number> {
  const start = performance.now();
  const db = await getDB();
  const tx = db.transaction('scripts', 'readwrite');
  await tx.store.put({
    ...script,
    updatedAt: new Date().toISOString(),
  });
  await tx.done;
  const elapsed = Math.round(performance.now() - start);
  return elapsed; // Returns write latency in ms
}

export async function getScriptFromIDB(id: string): Promise<ScreenplayDocument | undefined> {
  const db = await getDB();
  return db.get('scripts', id);
}

export async function getAllScriptsFromIDB(): Promise<ScreenplayDocument[]> {
  const db = await getDB();
  return db.getAll('scripts');
}

export async function deleteScriptFromIDB(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('scripts', id);
}

export async function saveRevisionToIDB(revision: RevisionHistoryItem): Promise<void> {
  const db = await getDB();
  await db.put('revisions', revision);
}

export async function getRevisionsForScriptIDB(scriptId: string): Promise<RevisionHistoryItem[]> {
  const db = await getDB();
  const tx = db.transaction('revisions', 'readonly');
  const index = tx.store.index('by-script');
  const items = await index.getAll(scriptId);
  return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export const INITIAL_SAMPLE_SCRIPT: ScreenplayDocument = {
  id: 'script-onboarding-leo-sarah-1',
  title: 'THE SCREENWRITER\'S DUEL: LEO VS. SARAH',
  author: 'Leo & Sarah',
  description: 'A 3-scene meta-screenplay demonstrating Screenwriter Pro keyboard shortcuts, AAA Character Bible, Shot List & Stripboard equipment, and Local-First persistence.',
  draftStatus: 'DRAFT',
  version: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  titlePage: {
    title: 'THE SCREENWRITER\'S DUEL: LEO VS. SARAH',
    credit: 'Written by',
    author: 'Leo & Sarah',
    source: 'Screenwriter Pro Onboarding 3.0',
    contact: 'Screenwriter Pro Studio\nsupport@screenwriterpro.edu',
    date: 'July 2026',
    draftColor: 'Gold Draft',
  },
  elements: [
    // SCENE 1: Leo's Dorm
    {
      id: 'cs-1',
      type: 'SCENE HEADING',
      content: 'INT. LEO\'S DORM ROOM - NIGHT',
      sceneNumber: '1',
    },
    {
      id: 'cs-2',
      type: 'ACTION',
      content: 'Sticky notes plaster the glowing monitor. LEO (24), wearing a crumpled hoodie, flip-opens his AAA Character Bible workbook. He types rapidly, focusing on physical details over exposition (Show, Don\'t Tell).',
    },
    {
      id: 'cs-3',
      type: 'CHARACTER',
      content: 'LEO',
    },
    {
      id: 'cs-4',
      type: 'PARENTICAL',
      content: '(grins at the screen)',
    },
    {
      id: 'cs-5',
      type: 'DIALOGUE',
      content: 'If I reveal Sarah\'s obsession with perfection through her sharp blazer and analytical gaze rather than dialogue, the scene jumps off the page!',
    },
    {
      id: 'cs-6',
      type: 'TRANSITION',
      content: 'CUT TO:',
    },

    // SCENE 2: Campus Coffee Shop
    {
      id: 'cs-7',
      type: 'SCENE HEADING',
      content: 'INT. CAMPUS COFFEE SHOP - DAY',
      sceneNumber: '2',
    },
    {
      id: 'cs-8',
      type: 'ACTION',
      content: 'Steam rises from twin espresso cups. SARAH (24), holding a heavy camera rig bag, marches in and drops her equipment with a heavy THUD onto the booth table.',
    },
    {
      id: 'cs-9',
      type: 'CHARACTER',
      content: 'SARAH',
    },
    {
      id: 'cs-10',
      type: 'PARENTICAL',
      content: '(crossing her arms)',
    },
    {
      id: 'cs-11',
      type: 'DIALOGUE',
      content: 'Did you lock down the Shot List stripboard, Leo? We need exact lens choices and gear assignments before morning.',
    },
    {
      id: 'cs-12',
      type: 'CHARACTER',
      content: 'LEO',
    },
    {
      id: 'cs-13',
      type: 'DIALOGUE',
      content: 'I\'m building the kit checklist right now. Are we mounting the camera on the heavy Tripod or staying mobile on the motorized Gimbal?',
    },
    {
      id: 'cs-14',
      type: 'CHARACTER',
      content: 'SARAH',
    },
    {
      id: 'cs-15',
      type: 'DIALOGUE',
      content: 'We use the Gimbal for the sweeping coffee shop entrance, then anchor the Tripod for tight dialogue close-ups!',
    },
    {
      id: 'cs-16',
      type: 'TRANSITION',
      content: 'CUT TO:',
    },

    // SCENE 3: Film Set
    {
      id: 'cs-17',
      type: 'SCENE HEADING',
      content: 'EXT. FILM SET - NIGHT',
      sceneNumber: '3',
    },
    {
      id: 'cs-18',
      type: 'ACTION',
      content: 'Rain slicks the asphalt under 5K production lights. Leo and Sarah monitor the live recording feed on their tablet as the Red Cloud Pulse indicator pulses steadily in the footer.',
    },
    {
      id: 'cs-19',
      type: 'CHARACTER',
      content: 'LEO',
    },
    {
      id: 'cs-20',
      type: 'DIALOGUE',
      content: 'Look at that 0ms latency! Every single character keystroke is instantly stored in local IndexedDB.',
    },
    {
      id: 'cs-21',
      type: 'CHARACTER',
      content: 'SARAH',
    },
    {
      id: 'cs-22',
      type: 'DIALOGUE',
      content: 'That\'s true Local-First architecture. Even if our network drops mid-shoot, our screenplay and production notes are 100% safe.',
    },
    {
      id: 'cs-23',
      type: 'TRANSITION',
      content: 'FADE OUT.',
    },
  ],
  shots: [
    {
      id: 'shot-1a',
      sceneHeadingId: 'cs-1',
      shotNumber: '1A',
      shotType: 'CLOSE-UP',
      angle: 'Eye Level',
      lens: '50mm',
      equipment: 'Handheld',
      estimatedTimeMin: 10,
    },
    {
      id: 'shot-2a',
      sceneHeadingId: 'cs-7',
      shotNumber: '2A',
      shotType: 'WIDE',
      angle: 'Low Angle',
      lens: '24mm',
      equipment: 'Gimbal',
      estimatedTimeMin: 20,
    },
    {
      id: 'shot-3a',
      sceneHeadingId: 'cs-17',
      shotNumber: '3A',
      shotType: 'MEDIUM',
      angle: 'Eye Level',
      lens: '85mm',
      equipment: 'Tripod',
      estimatedTimeMin: 15,
    },
  ],
  characterBibles: {
    LEO: {
      age: '24',
      appearance: 'Mismatched hoodie, energetic gaze',
      attitude: 'Obsessed with fast keyboard shortcuts and rapid action beats',
      actionInFirstScene: 'Flips open AAA Bible to craft character details show-don\'t-tell style',
      internalFlaw: 'Impulsive writer, prone to rushing without shot breakdowns',
      coreMotivation: 'To write the fastest, highest-octane screenplay in history',
    },
    SARAH: {
      age: '24',
      appearance: 'Pristine sharp blazer, analytical eyes',
      attitude: 'Precision planner focused on story arcs, lens choices, and stripboard logistics',
      actionInFirstScene: 'Marches into coffee shop with full camera rig bag and locks down shot specs',
      internalFlaw: 'Over-analytical perfectionist',
      coreMotivation: 'To craft bulletproof dramatic structures with perfect shot breakdown',
    },
  },
};
