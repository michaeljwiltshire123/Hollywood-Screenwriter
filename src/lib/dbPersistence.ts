import { ScreenplayDocument } from '../types';

const DB_NAME = 'screenwriter_db';
const STORE_NAME = 'scripts';
const CURRENT_SCRIPT_KEY = 'active_script';

export async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveScriptToDB(script: ScreenplayDocument): Promise<void> {
  try {
    // Backup to localStorage
    try {
      localStorage.setItem('screenwriter_active_script', JSON.stringify(script));
    } catch (e) {
      console.warn('LocalStorage quota limit reached, relying on IndexedDB:', e);
    }

    // Save to IndexedDB
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(script, CURRENT_SCRIPT_KEY);
  } catch (err) {
    console.warn('IndexedDB save exception:', err);
  }
}

export async function loadScriptFromDB(): Promise<ScreenplayDocument | null> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(CURRENT_SCRIPT_KEY);

    const result = await new Promise<ScreenplayDocument | null>((resolve) => {
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });

    if (result && Array.isArray(result.elements) && result.elements.length > 0) {
      return result;
    }

    // Fallback to localStorage
    const local = localStorage.getItem('screenwriter_active_script');
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed && Array.isArray(parsed.elements) && parsed.elements.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('IndexedDB load error, checking localStorage:', err);
    try {
      const local = localStorage.getItem('screenwriter_active_script');
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed && Array.isArray(parsed.elements) && parsed.elements.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
  }
  return null;
}
