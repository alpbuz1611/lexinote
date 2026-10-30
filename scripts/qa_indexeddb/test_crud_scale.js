/**
 * LexiNote QA Phase 4.1 — IndexedDB CRUD & 1,000 Notes Scale Test
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

async function runCrudScaleTests() {
  console.log('\n================================================================');
  console.log('🧪 QA 4.1 — INDEXEDDB CRUD & 1,000 NOTES SCALE TEST');
  console.log('================================================================');

  storage.setIDBFactory(indexedDB);
  await storage.deleteDatabase();
  await storage.initDB();

  console.log('\n--- 4.1.1 Single Note CRUD ---');
  const note1 = {
    id: 'note-crud-1',
    title: 'First Test Note',
    content: 'Initial content for testing CRUD operations.',
    mode: 'work',
    tags: ['test', 'indexeddb'],
    isPinned: false,
    isLocked: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await storage.saveNote(note1);
  const retrieved1 = await storage.getNote('note-crud-1');
  assert(retrieved1 !== null, 'Saved note retrieved successfully from IndexedDB');
  assert(retrieved1.title === 'First Test Note', 'Retrieved note title matches exactly');
  assert(retrieved1.content === note1.content, 'Retrieved note content matches byte-for-byte');

  // Update note
  const updated1 = {
    ...retrieved1,
    title: 'Updated Test Note Title',
    content: 'Updated content with new modifications.',
    updatedAt: new Date().toISOString()
  };
  await storage.saveNote(updated1);
  const retrievedUpdated = await storage.getNote('note-crud-1');
  assert(retrievedUpdated.title === 'Updated Test Note Title', 'Note update persisted correctly in IndexedDB');
  assert(retrievedUpdated.content === 'Updated content with new modifications.', 'Updated content verified');

  // Delete note
  await storage.deleteNote('note-crud-1');
  const retrievedDeleted = await storage.getNote('note-crud-1');
  assert(retrievedDeleted === null, 'Deleted note returns null upon subsequent get');
  const countAfterDelete = await storage.countNotes();
  assert(countAfterDelete === 0, 'Database note count is exactly 0 after deletion');

  console.log('\n--- 4.1.2 Scale: 1,000 Notes Batch Insertion ---');
  const notes1000 = [];
  const modes = ['work', 'journal', 'developer', 'minimal', 'cornell'];
  
  const startTime = Date.now();
  for (let i = 1; i <= 1000; i++) {
    notes1000.push({
      id: `scale-note-${String(i).padStart(4, '0')}`,
      title: `Scale Test Document #${i} — Project Plan`,
      content: `Comprehensive documentation content for document #${i}. Includes Turkish terms like geliştirme, kütüphane, ve şifreleme.`,
      mode: modes[i % modes.length],
      tags: [`tag-${i % 10}`, 'scale-test'],
      isPinned: i % 25 === 0,
      isLocked: false,
      createdAt: new Date(Date.now() - (1000 - i) * 60000).toISOString(),
      updatedAt: new Date(Date.now() - (1000 - i) * 30000).toISOString()
    });
  }

  await storage.saveNotesBatch(notes1000);
  const batchDuration = Date.now() - startTime;
  console.log(`     ⚡ 1,000 notes batch written in ${batchDuration}ms (${(batchDuration / 1000).toFixed(3)}ms/note)`);

  const totalCount = await storage.countNotes();
  assert(totalCount === 1000, `Stored exactly 1,000 notes in IndexedDB (actual: ${totalCount})`);

  // Verify all 1,000 IDs are unique and present
  const allNotes = await storage.getAllNotes();
  assert(allNotes.length === 1000, `getAllNotes retrieved all 1,000 notes (actual: ${allNotes.length})`);

  const uniqueIds = new Set(allNotes.map(n => n.id));
  assert(uniqueIds.size === 1000, `All 1,000 retrieved note IDs are strictly unique (size: ${uniqueIds.size})`);

  console.log('\n--- 4.1.3 Random Access & Selective Updates ---');
  // Randomly access 50 notes
  let randomAccessSuccess = true;
  for (let i = 1; i <= 50; i++) {
    const targetIdx = ((i * 19) % 1000) + 1;
    const targetId = `scale-note-${String(targetIdx).padStart(4, '0')}`;
    const n = await storage.getNote(targetId);
    if (!n || n.id !== targetId) {
      randomAccessSuccess = false;
      break;
    }
  }
  assert(randomAccessSuccess, '50 random indexed note lookups resolved accurately');

  // Update 200 random notes
  const updateStartTime = Date.now();
  for (let i = 1; i <= 200; i++) {
    const targetId = `scale-note-${String(i * 4).padStart(4, '0')}`;
    const note = await storage.getNote(targetId);
    note.title = `MODIFIED TITLE #${targetId}`;
    note.updatedAt = new Date().toISOString();
    await storage.saveNote(note);
  }
  const updateDuration = Date.now() - updateStartTime;
  console.log(`     ⚡ 200 selective note updates completed in ${updateDuration}ms (${(updateDuration / 200).toFixed(2)}ms/update)`);

  // Verify selective updates
  let verifyUpdates = true;
  for (let i = 1; i <= 200; i++) {
    const targetId = `scale-note-${String(i * 4).padStart(4, '0')}`;
    const note = await storage.getNote(targetId);
    if (!note || !note.title.startsWith('MODIFIED TITLE')) {
      verifyUpdates = false;
      break;
    }
  }
  assert(verifyUpdates, 'All 200 modified notes retained their updated values');

  console.log('\n--- 4.1.4 Selective Deletions & Store Cleanup ---');
  // Delete 100 notes
  for (let i = 1; i <= 100; i++) {
    await storage.deleteNote(`scale-note-${String(i).padStart(4, '0')}`);
  }
  const remainingCount = await storage.countNotes();
  assert(remainingCount === 900, `Count after 100 deletions is exactly 900 (actual: ${remainingCount})`);

  // Verify deleted notes are absent
  let deletedAreAbsent = true;
  for (let i = 1; i <= 100; i++) {
    const n = await storage.getNote(`scale-note-${String(i).padStart(4, '0')}`);
    if (n !== null) {
      deletedAreAbsent = false;
      break;
    }
  }
  assert(deletedAreAbsent, 'All 100 deleted notes are verified absent');

  // Verify surviving notes remain untouched
  const survivor = await storage.getNote('scale-note-0500');
  assert(survivor !== null && survivor.id === 'scale-note-0500', 'Surviving notes unaffected by deletion operations');

  // Clean teardown
  await storage.deleteDatabase();

  console.log(`\nQA 4.1 SUMMARY: ${totalPassed} Passed, ${totalFailed} Failed`);
  return { passed: totalPassed, failed: totalFailed };
}

if (process.argv[1]?.endsWith('test_crud_scale.js')) {
  runCrudScaleTests().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}

export { runCrudScaleTests };
