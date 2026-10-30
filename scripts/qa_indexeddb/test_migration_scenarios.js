/**
 * LexiNote QA Phase 4.4 — Safe LocalStorage Migration Scenarios, Deep Integrity & Idempotency Test
 */

import { indexedDB } from 'fake-indexeddb';
import * as storage from '../../src/services/storageService.js';

let totalPassed = 0;
let totalFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    totalPassed++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    totalFailed++;
  }
}

// Memory-backed localStorage shim for testing
function createMockLocalStorage(initialStore = {}) {
  const store = { ...initialStore };
  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); },
    _dump: () => ({ ...store })
  };
}

async function runMigrationTests() {
  console.log('\n================================================================');
  console.log('🔄 QA 4.4 — SAFE LOCALSTORAGE MIGRATION & DEEP INTEGRITY TEST');
  console.log('================================================================');

  storage.setIDBFactory(indexedDB);

  console.log('\n--- 4.4.1 Scenario A: Clean Install (No Legacy Data) ---');
  await storage.deleteDatabase();
  const mockStorageEmpty = createMockLocalStorage();
  const resultEmpty = await storage.migrateFromLocalStorage(mockStorageEmpty);

  assert(resultEmpty.migrated === false, 'Clean install flagged as not requiring migration');
  assert(resultEmpty.reason === 'no_legacy_data', 'Clean install correctly identified as no_legacy_data');
  const countEmpty = await storage.countNotes();
  assert(countEmpty === 0, 'Clean install leaves note store empty');
  const metaCompleteEmpty = await storage.getMeta('migration_v4_complete');
  assert(metaCompleteEmpty !== null, 'Clean install marks migration_v4_complete');

  console.log('\n--- 4.4.2 Scenario B: Normal Migration (Standard Notes & Deep Verification) ---');
  await storage.deleteDatabase();
  const legacyNotes = [
    {
      id: 'leg-1',
      title: 'Work Tasks',
      content: 'Legacy task list',
      mode: 'work',
      isPinned: false,
      isLocked: false,
      todos: [{ id: 't1', text: 'Task 1', done: false }],
      gratitude: [],
      tags: ['work', 'legacy'],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 'leg-2',
      title: 'Journal Entry',
      content: 'Legacy journal reflection',
      mode: 'journal',
      isPinned: true,
      isLocked: false,
      todos: [],
      gratitude: ['Peace and quiet'],
      tags: ['journal'],
      createdAt: '2026-01-02T00:00:00.000Z',
      updatedAt: '2026-01-02T00:00:00.000Z'
    },
    {
      id: 'leg-3',
      title: 'Vocabulary List',
      content: 'abroad, hospital, universe',
      mode: 'cornell',
      isPinned: false,
      isLocked: false,
      todos: [],
      gratitude: [],
      tags: ['vocab'],
      createdAt: '2026-01-03T00:00:00.000Z',
      updatedAt: '2026-01-03T00:00:00.000Z'
    }
  ];

  const mockStorageNormal = createMockLocalStorage({
    'lexinote_notes_v4': JSON.stringify(legacyNotes)
  });

  const resultNormal = await storage.migrateFromLocalStorage(mockStorageNormal);
  assert(resultNormal.migrated === true, 'Migration executed successfully for legacy notes');
  assert(resultNormal.noteCount === 3, 'Migration reported 3 notes migrated');
  assert(resultNormal.verifiedCount === 3, 'Migration reported 3 notes verified');

  // Verify backup created in localStorage
  assert(mockStorageNormal.getItem('lexinote_notes_v4_backup') !== null, 'Backup created in localStorage (lexinote_notes_v4_backup)');
  assert(mockStorageNormal.getItem('lexinote_notes_v4') !== null, 'Original localStorage notes preserved (non-destructive)');

  // Verify backup stored in IndexedDB meta
  const metaBackup = await storage.getMeta('localStorage_backup_v4');
  assert(metaBackup !== null && metaBackup.noteCount === 3, 'Backup snapshot recorded in IndexedDB meta store');

  // Deep field-by-field verification of retrieved records
  const note1 = await storage.getNote('leg-1');
  const note2 = await storage.getNote('leg-2');
  const note3 = await storage.getNote('leg-3');
  assert(note1 !== null && note1.title === 'Work Tasks', 'Legacy note 1 title verified in IndexedDB');
  assert(note1.content === 'Legacy task list', 'Legacy note 1 content verified in IndexedDB');
  assert(note1.todos?.[0]?.text === 'Task 1', 'Legacy note 1 todos payload preserved in IndexedDB');
  assert(note2 !== null && note2.isPinned === true, 'Legacy note 2 isPinned status verified');
  assert(note2.gratitude?.[0] === 'Peace and quiet', 'Legacy note 2 gratitude payload preserved');
  assert(note3 !== null && note3.content.includes('abroad'), 'Legacy note 3 content verified in IndexedDB');

  console.log('\n--- 4.4.3 Scenario C: Idempotency (Prevent Duplicate Migrations) ---');
  mockStorageNormal.setItem('lexinote_notes_v4', JSON.stringify([{ id: 'unwanted-dup', title: 'Unwanted' }]));
  const resultRepeat = await storage.migrateFromLocalStorage(mockStorageNormal);

  assert(resultRepeat.migrated === false, 'Second migration attempt correctly skipped (Idempotency guarantee)');
  assert(resultRepeat.reason === 'already_migrated', 'Skipped with reason: already_migrated');
  const dupCheck = await storage.getNote('unwanted-dup');
  assert(dupCheck === null, 'IndexedDB was NOT contaminated by subsequent localStorage edits');
  const countAfterRepeat = await storage.countNotes();
  assert(countAfterRepeat === 3, 'Total note count strictly unchanged at 3');

  console.log('\n--- 4.4.4 Scenario D: Scale Migration (500 Legacy Notes) ---');
  await storage.deleteDatabase();
  const legacy500 = Array.from({ length: 500 }, (_, i) => ({
    id: `legacy-scale-${i}`,
    title: `Legacy Document #${i}`,
    content: `Scale migration content #${i}`,
    mode: 'work',
    isPinned: false,
    isLocked: false,
    updatedAt: new Date().toISOString()
  }));

  const mockStorage500 = createMockLocalStorage({
    'lexinote_notes_v4': JSON.stringify(legacy500)
  });

  const t0_500 = Date.now();
  const result500 = await storage.migrateFromLocalStorage(mockStorage500);
  const dur500 = Date.now() - t0_500;
  console.log(`     ⚡ 500 legacy notes deeply verified and migrated in ${dur500}ms`);

  assert(result500.migrated === true, '500 legacy notes migrated successfully');
  assert(result500.noteCount === 500, 'Reported 500 notes migrated');
  const countInDB500 = await storage.countNotes();
  assert(countInDB500 === 500, 'IndexedDB count strictly matches 500');

  console.log('\n--- 4.4.5 Scenario E: Corrupted / Malformed JSON in LocalStorage ---');
  await storage.deleteDatabase();
  const mockStorageCorrupted = createMockLocalStorage({
    'lexinote_notes_v4': '{ malformed JSON invalid syntax [{{'
  });

  const resultCorrupted = await storage.migrateFromLocalStorage(mockStorageCorrupted);
  assert(resultCorrupted.migrated === false, 'Corrupted JSON did not crash the migration service');
  assert(resultCorrupted.reason === 'corrupted_json', 'Corrupted JSON gracefully identified');
  assert(mockStorageCorrupted.getItem('lexinote_notes_v4_corrupted_backup') !== null, 'Emergency backup of corrupted string preserved in localStorage');

  console.log('\n--- 4.4.6 Scenario F: Locked Encrypted Notes Migration Security & Decryptability ---');
  await storage.deleteDatabase();
  const lockedLegacy = [
    {
      id: 'locked-note-1',
      title: 'Secret Vault Note',
      content: 'CONFIDENTIAL SECRET DATA THAT MUST NOT BE PERSISTED IN PLAINTEXT',
      isLocked: true,
      encryptedData: { ciphertext: 'ENCRYPTED_BLOB_BASE64', iv: 'IV_96_BIT', salt: 'SALT_128_BIT' },
      _tempUnlocked: true,
      _activePin: '9999',
      pinCode: '9999',
      mode: 'journal',
      isPinned: false,
      updatedAt: '2026-01-01T00:00:00.000Z'
    }
  ];

  const mockStorageLocked = createMockLocalStorage({
    'lexinote_notes_v4': JSON.stringify(lockedLegacy)
  });

  await storage.migrateFromLocalStorage(mockStorageLocked);
  const migratedLockedNote = await storage.getNote('locked-note-1');

  assert(migratedLockedNote !== null, 'Locked note migrated into IndexedDB');
  assert(migratedLockedNote.content === '', 'Plaintext content strictly purged to empty string in IndexedDB');
  assert(migratedLockedNote._activePin === undefined, 'Runtime _activePin strictly purged from IndexedDB');
  assert(migratedLockedNote.pinCode === undefined, 'pinCode field strictly purged from IndexedDB');
  assert(migratedLockedNote.encryptedData.ciphertext === 'ENCRYPTED_BLOB_BASE64', 'Ciphertext payload preserved intact');

  console.log('\n--- 4.4.7 Deep Verification: Duplicate Note IDs Detection ---');
  await storage.deleteDatabase();
  const duplicateNotes = [
    { id: 'dup-id-1', title: 'Original Note', content: 'Content A' },
    { id: 'dup-id-1', title: 'Duplicate Note', content: 'Content B' }
  ];
  const mockStorageDup = createMockLocalStorage({
    'lexinote_notes_v4': JSON.stringify(duplicateNotes)
  });

  let dupErrorCaught = false;
  try {
    await storage.migrateFromLocalStorage(mockStorageDup);
  } catch (err) {
    if (err.message.includes('Duplicate note ID "dup-id-1" detected')) {
      dupErrorCaught = true;
    }
  }
  assert(dupErrorCaught, 'Duplicate note ID in legacy storage detected and rejected before saving');
  const countAfterDup = await storage.countNotes();
  assert(countAfterDup === 0, 'Database remains clean when duplicate IDs are encountered');

  console.log('\n--- 4.4.8 Deep Verification: Field Mismatch Detection ---');
  const originalDoc = {
    id: 'test-field-1',
    title: 'Original Title',
    content: 'Original Content',
    mode: 'work',
    isPinned: false,
    isLocked: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  };

  // Test deepVerifyMigratedNote with corrupted content
  let contentMismatchCaught = false;
  try {
    storage.deepVerifyMigratedNote(originalDoc, { ...originalDoc, content: 'Tampered Content' });
  } catch (err) {
    if (err.message.includes('Field "content" mismatch!')) {
      contentMismatchCaught = true;
    }
  }
  assert(contentMismatchCaught, 'deepVerifyMigratedNote detects content mismatch');

  // Test deepVerifyMigratedNote with corrupted title
  let titleMismatchCaught = false;
  try {
    storage.deepVerifyMigratedNote(originalDoc, { ...originalDoc, title: 'Wrong Title' });
  } catch (err) {
    if (err.message.includes('Field "title" mismatch!')) {
      titleMismatchCaught = true;
    }
  }
  assert(titleMismatchCaught, 'deepVerifyMigratedNote detects title mismatch');

  // Test deepVerifyMigratedNote with missing encryptedData on locked note
  let encryptedDataMismatchCaught = false;
  try {
    storage.deepVerifyMigratedNote(
      { ...originalDoc, isLocked: true, encryptedData: { ciphertext: 'a', iv: 'b', salt: 'c' } },
      { ...originalDoc, isLocked: true, content: '', encryptedData: null }
    );
  } catch (err) {
    if (err.message.includes('encryptedData')) {
      encryptedDataMismatchCaught = true;
    }
  }
  assert(encryptedDataMismatchCaught, 'deepVerifyMigratedNote detects missing encryptedData on locked note');

  console.log('\n--- 4.4.9 Interrupted Migration Recovery & Retry ---');
  await storage.deleteDatabase();
  const retryNotes = [
    { id: 'resume-1', title: 'Note Resume 1', content: 'Data 1', mode: 'work', updatedAt: '2026-01-01T00:00:00.000Z' },
    { id: 'resume-2', title: 'Note Resume 2', content: 'Data 2', mode: 'journal', updatedAt: '2026-01-01T00:00:00.000Z' }
  ];
  const mockStorageResume = createMockLocalStorage({
    'lexinote_notes_v4': JSON.stringify(retryNotes)
  });

  // Emulate interruption: database has notes but migration_v4_complete is NOT written
  await storage.saveNotesBatch(retryNotes);
  assert((await storage.getMeta('migration_v4_complete')) === null, 'Pre-condition: migration_v4_complete is absent');

  // Execute migration retry
  const retryResult = await storage.migrateFromLocalStorage(mockStorageResume);
  assert(retryResult.migrated === true, 'Interrupted migration safely resumed and succeeded');
  assert(retryResult.verifiedCount === 2, 'All 2 notes deeply verified on resumed migration');
  assert((await storage.getMeta('migration_v4_complete')) !== null, 'migration_v4_complete successfully committed after retry');

  // Clean teardown
  await storage.deleteDatabase();

  console.log(`\nQA 4.4 SUMMARY: ${totalPassed} Passed, ${totalFailed} Failed`);
  return { passed: totalPassed, failed: totalFailed };
}

if (process.argv[1]?.endsWith('test_migration_scenarios.js')) {
  runMigrationTests().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}

export { runMigrationTests };
