/**
 * LexiNote QA Phase 4.5 — Failure Recovery, Validation & Export Verification Test
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

async function runFailureRecoveryTests() {
  console.log('\n================================================================');
  console.log('🛡️  QA 4.5 — FAILURE RECOVERY, VALIDATION & EXPORT VERIFICATION');
  console.log('================================================================');

  storage.setIDBFactory(indexedDB);
  await storage.deleteDatabase();
  await storage.initDB();

  console.log('\n--- 4.5.1 Validation & Invalid Note Rejection ---');
  let rejectedNull = false;
  try {
    await storage.saveNote(null);
  } catch (err) {
    rejectedNull = true;
  }
  assert(rejectedNull, 'Attempting to save null rejected with descriptive error');

  let rejectedMissingId = false;
  try {
    await storage.saveNote({ title: 'No ID Note', content: 'Missing ID' });
  } catch (err) {
    rejectedMissingId = true;
  }
  assert(rejectedMissingId, 'Attempting to save note without ID rejected');

  console.log('\n--- 4.5.2 Connection Closure & Seamless Reconnection ---');
  await storage.saveNote({ id: 'reconnect-1', title: 'Before Closure', content: 'Data' });
  assert((await storage.getNote('reconnect-1')) !== null, 'Note saved prior to connection closure');

  // Explicitly close DB connection
  storage.closeDB();

  // Subsequent call should automatically re-open connection transparently
  const retrievedAfterClose = await storage.getNote('reconnect-1');
  assert(retrievedAfterClose !== null && retrievedAfterClose.title === 'Before Closure', 'Connection transparently re-established after close');

  await storage.saveNote({ id: 'reconnect-2', title: 'After Closure', content: 'Data 2' });
  assert((await storage.getNote('reconnect-2')) !== null, 'New write succeeded on reconnected database');

  console.log('\n--- 4.5.3 Complete Database Export & Backup Dump ---');
  await storage.setMeta('system_version', '0.2.0');
  await storage.setMeta('user_backup_schedule', 'daily');

  const exportDump = await storage.exportDatabase();
  assert(exportDump !== null, 'exportDatabase() generated output package');
  assert(exportDump.version === 1, `Export package version is 1 (actual: ${exportDump.version})`);
  assert(exportDump.database === 'lexinote_db', 'Export database name verified');
  assert(exportDump.notesCount === 2, `Export notesCount is 2 (actual: ${exportDump.notesCount})`);
  assert(Array.isArray(exportDump.notes) && exportDump.notes.length === 2, 'Exported notes array contains all notes');
  assert(Array.isArray(exportDump.meta) && exportDump.meta.length >= 2, 'Exported meta store contains all metadata entries');

  console.log('\n--- 4.5.4 Full Store Clear & Re-seeding ---');
  await storage.clearAllNotes();
  const countCleared = await storage.countNotes();
  assert(countCleared === 0, 'clearAllNotes completely emptied primary notes store');

  // Metadata must remain unaffected when clearing notes
  const preservedMeta = await storage.getMeta('system_version');
  assert(preservedMeta === '0.2.0', 'Meta store untouched during primary notes clearance');

  // Re-seed store
  await storage.saveNote({ id: 'reseeded-1', title: 'Reseeded', content: 'Fresh' });
  assert((await storage.countNotes()) === 1, 'Re-seeded note stored successfully');

  // Clean teardown
  await storage.deleteDatabase();

  console.log(`\nQA 4.5 SUMMARY: ${totalPassed} Passed, ${totalFailed} Failed`);
  return { passed: totalPassed, failed: totalFailed };
}

if (process.argv[1]?.endsWith('test_failure_recovery.js')) {
  runFailureRecoveryTests().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}

export { runFailureRecoveryTests };
