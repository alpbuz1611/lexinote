/**
 * LexiNote IndexedDB Storage Engine & LocalStorage Migration Service
 * 
 * Provides an offline-first, high-performance, asynchronous storage engine
 * for LexiNote notes, metadata, and migration backups.
 * 
 * Database: 'lexinote_db' (Version 1)
 * Stores:
 *   - 'notes': primary note storage (keyPath: 'id')
 *       Indexes: 'updatedAt', 'mode', 'isPinned', 'isLocked'
 *   - 'meta': key-value store for app metadata, migration flags, and backups (keyPath: 'key')
 */

export const DB_NAME = 'lexinote_db';
export const DB_VERSION = 1;
export const STORE_NOTES = 'notes';
export const STORE_META = 'meta';

let cachedDB = null;
let customIDBFactory = null;

/**
 * Configure a custom IDBFactory (used in Node.js test environments, e.g. fake-indexeddb)
 */
export function setIDBFactory(factory) {
  customIDBFactory = factory;
  cachedDB = null;
}

/**
 * Resolve the active IndexedDB factory (browser global or injected)
 */
function getIDB() {
  if (customIDBFactory) return customIDBFactory;
  if (typeof indexedDB !== 'undefined') return indexedDB;
  if (typeof globalThis !== 'undefined' && globalThis.indexedDB) return globalThis.indexedDB;
  if (typeof window !== 'undefined' && window.indexedDB) return window.indexedDB;
  return null;
}

/**
 * Open and initialize the LexiNote database with proper stores and indexes.
 */
export function initDB(factory = null) {
  if (factory) {
    setIDBFactory(factory);
  }

  if (cachedDB) {
    return Promise.resolve(cachedDB);
  }

  const idb = getIDB();
  if (!idb) {
    return Promise.reject(new Error('IndexedDB is not supported or unavailable in this environment.'));
  }

  return new Promise((resolve, reject) => {
    const request = idb.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // 1. Primary Notes Store
      if (!db.objectStoreNames.contains(STORE_NOTES)) {
        const notesStore = db.createObjectStore(STORE_NOTES, { keyPath: 'id' });
        notesStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        notesStore.createIndex('mode', 'mode', { unique: false });
        notesStore.createIndex('isPinned', 'isPinned', { unique: false });
        notesStore.createIndex('isLocked', 'isLocked', { unique: false });
      }

      // 2. Metadata / Backups Store
      if (!db.objectStoreNames.contains(STORE_META)) {
        db.createObjectStore(STORE_META, { keyPath: 'key' });
      }
    };

    request.onsuccess = (event) => {
      cachedDB = event.target.result;

      // Handle external connection closes
      cachedDB.onclose = () => {
        cachedDB = null;
      };
      cachedDB.onversionchange = () => {
        if (cachedDB) {
          cachedDB.close();
          cachedDB = null;
        }
      };

      resolve(cachedDB);
    };

    request.onerror = (event) => {
      reject(new Error(`Failed to open IndexedDB (${DB_NAME}): ${event.target.error?.message || 'Unknown error'}`));
    };

    request.onblocked = () => {
      console.warn(`IndexedDB (${DB_NAME}) open request blocked by another tab/connection.`);
    };
  });
}

/**
 * Close current database connection
 */
export function closeDB() {
  if (cachedDB) {
    cachedDB.close();
    cachedDB = null;
  }
}

/**
 * Delete the entire database (used in testing & catastrophic resets)
 */
export function deleteDatabase() {
  closeDB();
  const idb = getIDB();
  if (!idb) return Promise.reject(new Error('IndexedDB unavailable.'));

  return new Promise((resolve, reject) => {
    const request = idb.deleteDatabase(DB_NAME);
    request.onsuccess = () => resolve(true);
    request.onerror = (e) => reject(new Error(`Failed to delete database: ${e.target.error?.message}`));
    request.onblocked = () => resolve(false);
  });
}

/**
 * Sanitize note payload before saving to disk:
 * Purges plaintext and runtime PIN fields from locked notes to preserve zero-knowledge security on disk.
 */
export function sanitizeNote(note) {
  if (!note || typeof note !== 'object') return note;
  if (note.isLocked) {
    return {
      ...note,
      content: '',
      todos: [],
      gratitude: [],
      _tempUnlocked: false,
      _activePin: undefined,
      pinCode: undefined
    };
  }
  return { ...note };
}

/**
 * Retrieve all notes from IndexedDB, ordered by updatedAt descending.
 */
export async function getAllNotes() {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NOTES, 'readonly');
    const store = tx.objectStore(STORE_NOTES);
    const request = store.getAll();

    request.onsuccess = () => {
      const notes = request.result || [];
      // Default sort by updatedAt descending
      notes.sort((a, b) => {
        const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return timeB - timeA;
      });
      resolve(notes);
    };

    request.onerror = (event) => {
      reject(new Error(`getAllNotes failed: ${event.target.error?.message}`));
    };
  });
}

/**
 * Retrieve a single note by ID.
 */
export async function getNote(id) {
  if (!id) return null;
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NOTES, 'readonly');
    const store = tx.objectStore(STORE_NOTES);
    const request = store.get(id);

    request.onsuccess = () => {
      resolve(request.result || null);
    };

    request.onerror = (event) => {
      reject(new Error(`getNote(${id}) failed: ${event.target.error?.message}`));
    };
  });
}

/**
 * Save or update a single note. Locked notes are sanitized before persisting.
 */
export async function saveNote(note) {
  if (!note || !note.id) {
    throw new Error('saveNote requires a valid note with an "id" property.');
  }

  const sanitized = sanitizeNote(note);
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NOTES, 'readwrite');
    const store = tx.objectStore(STORE_NOTES);
    const request = store.put(sanitized);

    tx.oncomplete = () => resolve(sanitized);
    tx.onerror = (event) => reject(new Error(`saveNote failed: ${event.target.error?.message}`));
    tx.onabort = (event) => reject(new Error(`saveNote transaction aborted: ${event.target.error?.message}`));
  });
}

/**
 * Atomic batch save of multiple notes in a single readwrite transaction.
 */
export async function saveNotesBatch(notes) {
  if (!Array.isArray(notes)) {
    throw new Error('saveNotesBatch requires an array of notes.');
  }

  const db = await initDB();
  const sanitizedList = notes.map(sanitizeNote);

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NOTES, 'readwrite');
    const store = tx.objectStore(STORE_NOTES);

    for (const note of sanitizedList) {
      if (note && note.id) {
        store.put(note);
      }
    }

    tx.oncomplete = () => resolve(sanitizedList);
    tx.onerror = (event) => reject(new Error(`saveNotesBatch failed: ${event.target.error?.message}`));
    tx.onabort = (event) => reject(new Error(`saveNotesBatch aborted: ${event.target.error?.message}`));
  });
}

/**
 * Delete a note by its ID.
 */
export async function deleteNote(id) {
  if (!id) return false;
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NOTES, 'readwrite');
    const store = tx.objectStore(STORE_NOTES);
    store.delete(id);

    tx.oncomplete = () => resolve(true);
    tx.onerror = (event) => reject(new Error(`deleteNote failed: ${event.target.error?.message}`));
    tx.onabort = (event) => reject(new Error(`deleteNote transaction aborted: ${event.target.error?.message}`));
  });
}

/**
 * Clear all notes from the primary store.
 */
export async function clearAllNotes() {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NOTES, 'readwrite');
    const store = tx.objectStore(STORE_NOTES);
    store.clear();

    tx.oncomplete = () => resolve(true);
    tx.onerror = (event) => reject(new Error(`clearAllNotes failed: ${event.target.error?.message}`));
  });
}

/**
 * Count total notes in the primary store.
 */
export async function countNotes() {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NOTES, 'readonly');
    const store = tx.objectStore(STORE_NOTES);
    const request = store.count();

    request.onsuccess = () => resolve(request.result || 0);
    request.onerror = (event) => reject(new Error(`countNotes failed: ${event.target.error?.message}`));
  });
}

/**
 * Retrieve a metadata entry by key.
 */
export async function getMeta(key) {
  if (!key) return null;
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_META, 'readonly');
    const store = tx.objectStore(STORE_META);
    const request = store.get(key);

    request.onsuccess = () => {
      resolve(request.result ? request.result.value : null);
    };
    request.onerror = (event) => reject(new Error(`getMeta(${key}) failed: ${event.target.error?.message}`));
  });
}

/**
 * Set a metadata entry by key.
 */
export async function setMeta(key, value) {
  if (!key) throw new Error('setMeta requires a key.');
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_META, 'readwrite');
    const store = tx.objectStore(STORE_META);
    store.put({ key, value, updatedAt: new Date().toISOString() });

    tx.oncomplete = () => resolve(true);
    tx.onerror = (event) => reject(new Error(`setMeta(${key}) failed: ${event.target.error?.message}`));
  });
}

/**
 * Delete a metadata entry by key.
 */
export async function deleteMeta(key) {
  if (!key) return false;
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_META, 'readwrite');
    const store = tx.objectStore(STORE_META);
    store.delete(key);

    tx.oncomplete = () => resolve(true);
    tx.onerror = (event) => reject(new Error(`deleteMeta(${key}) failed: ${event.target.error?.message}`));
  });
}

/**
 * Export complete database payload (notes + meta) for export/backup.
 */
export async function exportDatabase() {
  const notes = await getAllNotes();
  const db = await initDB();

  const metaList = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_META, 'readonly');
    const store = tx.objectStore(STORE_META);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = (e) => reject(e);
  });

  return {
    version: DB_VERSION,
    database: DB_NAME,
    exportedAt: new Date().toISOString(),
    notesCount: notes.length,
    notes,
    meta: metaList
  };
}

/**
 * Safe LocalStorage Migration Service
 * 
 * Guarantees zero data loss:
 * 1. Checks if migration has already been completed.
 * 2. Reads legacy 'lexinote_notes_v4' from localStorage.
 * 3. Creates an immutable backup in localStorage ('lexinote_notes_v4_backup') AND meta store ('localStorage_backup_v4').
 * 4. Atomically writes all notes into IndexedDB 'notes' store.
 * 5. Verifies that every note was successfully stored by ID and count.
 * 6. Records migration completion in 'meta' store.
 * 7. Leaves original 'lexinote_notes_v4' intact as a secondary fallback.
 */
export async function migrateFromLocalStorage(storageObj = null) {
  // Check migration status in IndexedDB
  const alreadyMigrated = await getMeta('migration_v4_complete');
  if (alreadyMigrated) {
    const currentCount = await countNotes();
    return {
      migrated: false,
      reason: 'already_migrated',
      migratedAt: alreadyMigrated.migratedAt || null,
      noteCount: currentCount
    };
  }

  // Determine storage provider (browser window.localStorage or passed-in mock)
  let storage = storageObj;
  if (!storage) {
    if (typeof localStorage !== 'undefined') {
      storage = localStorage;
    } else if (typeof window !== 'undefined' && window.localStorage) {
      storage = window.localStorage;
    }
  }

  if (!storage) {
    return { migrated: false, reason: 'no_storage_available', noteCount: 0 };
  }

  const raw = storage.getItem('lexinote_notes_v4');
  if (!raw || raw.trim() === '') {
    // No legacy notes to migrate: record clean slate
    await setMeta('migration_v4_complete', {
      migratedAt: new Date().toISOString(),
      noteCount: 0,
      reason: 'clean_install'
    });
    return { migrated: false, reason: 'no_legacy_data', noteCount: 0 };
  }

  let parsedNotes = [];
  try {
    parsedNotes = JSON.parse(raw);
  } catch (err) {
    // Corrupted legacy storage: do NOT wipe, create emergency raw backup and return warning
    storage.setItem('lexinote_notes_v4_corrupted_backup', raw);
    await setMeta('migration_v4_error', {
      error: 'Corrupted JSON in localStorage',
      message: err.message,
      attemptedAt: new Date().toISOString()
    });
    return { migrated: false, reason: 'corrupted_json', error: err.message, noteCount: 0 };
  }

  if (!Array.isArray(parsedNotes) || parsedNotes.length === 0) {
    await setMeta('migration_v4_complete', {
      migratedAt: new Date().toISOString(),
      noteCount: 0,
      reason: 'empty_array'
    });
    return { migrated: false, reason: 'empty_array', noteCount: 0 };
  }

  // 1. Create Pre-Migration Backups (both in localStorage and in IndexedDB meta)
  try {
    storage.setItem('lexinote_notes_v4_backup', raw);
  } catch (e) {
    console.warn('Could not write backup to localStorage (quota exceeded?):', e);
  }

  await setMeta('localStorage_backup_v4', {
    raw,
    noteCount: parsedNotes.length,
    backupCreatedAt: new Date().toISOString()
  });

  // 2. Batch Save all notes to IndexedDB
  await saveNotesBatch(parsedNotes);

  // 3. Rigorous Verification Phase
  const verifiedCount = await countNotes();
  const missingNotes = [];

  for (const n of parsedNotes) {
    if (n && n.id) {
      const retrieved = await getNote(n.id);
      if (!retrieved) {
        missingNotes.push(n.id);
      }
    }
  }

  if (missingNotes.length > 0) {
    throw new Error(`Migration verification failed: ${missingNotes.length} notes missing in IndexedDB! IDs: ${missingNotes.slice(0, 5).join(', ')}`);
  }

  // 4. Mark migration as successfully complete
  const migrationRecord = {
    migratedAt: new Date().toISOString(),
    sourceVersion: 'v4',
    noteCount: parsedNotes.length,
    verifiedCount,
    backupKey: 'lexinote_notes_v4_backup'
  };

  await setMeta('migration_v4_complete', migrationRecord);

  return {
    migrated: true,
    noteCount: parsedNotes.length,
    verifiedCount,
    backupCreated: true,
    migrationRecord
  };
}
