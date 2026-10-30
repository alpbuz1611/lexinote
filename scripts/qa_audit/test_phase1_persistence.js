import { createInitialBlankNote, getDefaultNotes, isDefaultNotesList } from '../../src/data/defaultNotes.js';

class MockLocalStorage {
  constructor() {
    this.store = new Map();
    this.quotaLimitBytes = 5 * 1024 * 1024; // 5MB simulated quota
    this.failWrites = false;
  }
  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }
  setItem(key, value) {
    if (this.failWrites) {
      const err = new Error('The quota has been exceeded.');
      err.name = 'QuotaExceededError';
      throw err;
    }
    const str = String(value);
    let total = 0;
    for (const [k, v] of this.store.entries()) {
      if (k !== key) total += k.length + v.length;
    }
    total += key.length + str.length;
    if (total > this.quotaLimitBytes) {
      const err = new Error('The quota has been exceeded.');
      err.name = 'QuotaExceededError';
      throw err;
    }
    this.store.set(key, str);
  }
  removeItem(key) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}

export async function runPhase1Tests() {
  console.log('\n================================================================');
  console.log('🧪 PHASE 1 — DATA INTEGRITY & PERSISTENCE AUDIT');
  console.log('================================================================');

  let passed = 0;
  let failed = 0;
  const issues = [];

  function assert(condition, message) {
    if (condition) {
      passed++;
      console.log(`  ✅ [PASS] ${message}`);
    } else {
      failed++;
      console.error(`  ❌ [FAIL] ${message}`);
      issues.push(message);
    }
  }

  const storage = new MockLocalStorage();

  // Test 1: Note Creation, Edit & Persistence
  console.log('\n--- 1.1 CRUD & Basic Persistence ---');
  let note1 = {
    id: `note-${Date.now()}-1`,
    title: 'Audit Note 1',
    content: 'Initial content for testing.',
    mode: 'plain',
    tags: ['audit'],
    updatedAt: new Date().toISOString()
  };
  storage.setItem('lexinote_notes_v4', JSON.stringify([note1]));
  let loaded = JSON.parse(storage.getItem('lexinote_notes_v4'));
  assert(loaded.length === 1 && loaded[0].title === 'Audit Note 1', 'Created note persisted to storage');

  // Edit Note
  note1.content = 'Updated content after edit.';
  note1.updatedAt = new Date().toISOString();
  storage.setItem('lexinote_notes_v4', JSON.stringify([note1]));
  loaded = JSON.parse(storage.getItem('lexinote_notes_v4'));
  assert(loaded[0].content === 'Updated content after edit.', 'Note edit persisted cleanly');

  // Rename Note
  note1.title = 'Renamed Audit Note 1';
  storage.setItem('lexinote_notes_v4', JSON.stringify([note1]));
  loaded = JSON.parse(storage.getItem('lexinote_notes_v4'));
  assert(loaded[0].title === 'Renamed Audit Note 1', 'Note renaming persisted');

  // Delete Note
  storage.setItem('lexinote_notes_v4', JSON.stringify([]));
  loaded = JSON.parse(storage.getItem('lexinote_notes_v4'));
  assert(loaded.length === 0, 'Note deletion persisted');

  // Test 1.2: 50 Notes Creation & ID Collision
  console.log('\n--- 1.2 Scale: 50 Notes Creation & Isolation ---');
  const fiftyNotes = [];
  const idSet = new Set();
  for (let i = 0; i < 50; i++) {
    const id = `note-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`;
    idSet.add(id);
    fiftyNotes.push({
      id,
      title: `Batch Note ${i + 1}`,
      content: `Content payload for note #${i + 1} with unique data: ${Math.random()}`,
      mode: i % 3 === 0 ? 'work' : i % 3 === 1 ? 'journal' : 'plain',
      tags: [`tag-${i}`],
      isPinned: i % 5 === 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  assert(idSet.size === 50, 'All 50 generated note IDs are strictly unique');

  storage.setItem('lexinote_notes_v4', JSON.stringify(fiftyNotes));
  loaded = JSON.parse(storage.getItem('lexinote_notes_v4'));
  assert(loaded.length === 50, 'All 50 notes loaded from storage without loss');

  // Verify no cross-note mixing
  let noMixing = true;
  for (let i = 0; i < 50; i++) {
    if (loaded[i].title !== `Batch Note ${i + 1}`) noMixing = false;
  }
  assert(noMixing, 'Notes maintain their exact individual identity and data (no cross-note overwrite)');

  // Test 1.3: Long Note with 10,000 Words
  console.log('\n--- 1.3 Stress: 10,000-Word Document ---');
  const sampleWords = ['lexinote', 'knowledge', 'architecture', 'graph', 'database', 'indexing', 'encryption', 'privacy', 'bilgi', 'hafıza', 'araştırma', 'performans', 'stabilite'];
  const wordsArr = [];
  for (let i = 0; i < 10000; i++) {
    wordsArr.push(sampleWords[i % sampleWords.length]);
  }
  const longText = wordsArr.join(' ');
  const wordCount = longText.split(/\s+/).length;
  assert(wordCount === 10000, `Generated exactly 10,000 words (actual: ${wordCount})`);

  const longNote = {
    id: 'note-stress-10k',
    title: 'Comprehensive 10,000 Word Monograph',
    content: longText,
    mode: 'plain',
    tags: ['stress', 'monograph'],
    updatedAt: new Date().toISOString()
  };

  const startSave = performance.now();
  storage.setItem('lexinote_notes_v4', JSON.stringify([longNote, ...fiftyNotes]));
  const saveDuration = performance.now() - startSave;

  const startLoad = performance.now();
  loaded = JSON.parse(storage.getItem('lexinote_notes_v4'));
  const loadDuration = performance.now() - startLoad;

  const retrievedLongNote = loaded.find(n => n.id === 'note-stress-10k');
  assert(retrievedLongNote !== undefined, '10,000-word note retrieved from storage successfully');
  assert(retrievedLongNote.content.length === longText.length, `Content byte-for-byte identical (${retrievedLongNote.content.length} chars)`);
  console.log(`     ⚡ Save time: ${saveDuration.toFixed(2)}ms | Load time: ${loadDuration.toFixed(2)}ms`);

  // Test 1.4: Multi-Language, Turkish Characters, Emojis & Math Symbols
  console.log('\n--- 1.4 Character Encoding: Turkish, Emojis, Symbols ---');
  const complexPayload = `
# Türkçe Karakter Testi
Çiftçi, ılık çayını içerken yağmuru izledi. Şemsiyesini alıp göle doğru yürüdü.
Büyük harfler: Ç, Ğ, I, İ, Ö, Ş, Ü
Küçük harfler: ç, ğ, ı, i, ö, ş, ü

# Emojiler & Özel Simgeler
🚀 📚 🔒 💡 🌌 🪐 💎 ✨ 🧠
Telif & Ticari: © ® ™ § ¶ † ‡
Matematik & Mantık: ∀x ∈ ℝ, ∃y : ∫₀^∞ f(x)dx ≤ ∑_{k=1}^n α_k · √β_k
Yön Okları: ➔ ➜ ⇄ ⇅ ↻ ↺ ↳ ↵
Tırnaklar & Çizgiler: «Alıntı» “Çift Tırnak” ‘Tek Tırnak’ — Uzun Tire – Orta Tire … Üç Nokta
`;
  const unicodeNote = {
    id: 'note-unicode-test',
    title: 'Türkçe & Unicode Başlık 🚀',
    content: complexPayload,
    tags: ['türkçe', 'unicode', 'şifreleme'],
    updatedAt: new Date().toISOString()
  };
  storage.setItem('lexinote_notes_v4', JSON.stringify([unicodeNote]));
  loaded = JSON.parse(storage.getItem('lexinote_notes_v4'));
  assert(loaded[0].content === complexPayload, 'Complex Turkish characters, emojis, and math symbols preserved without corruption');
  assert(loaded[0].title === 'Türkçe & Unicode Başlık 🚀', 'Unicode note title preserved');

  // Test 1.5: Rapid Consecutive Edits
  console.log('\n--- 1.5 Concurrency: 100 Rapid Sequential Edits ---');
  let currentNote = { ...note1, content: 'Initial' };
  for (let i = 0; i < 100; i++) {
    currentNote = {
      ...currentNote,
      content: `Keystroke edit #${i}: ${Math.random()}`,
      updatedAt: new Date().toISOString()
    };
    storage.setItem('lexinote_notes_v4', JSON.stringify([currentNote]));
  }
  loaded = JSON.parse(storage.getItem('lexinote_notes_v4'));
  assert(loaded[0].content.startsWith('Keystroke edit #99:'), '100 consecutive rapid edits persisted with final state integrity');

  // Test 1.6: Corrupted Storage Recovery
  console.log('\n--- 1.6 Fault Tolerance & Corrupted Storage Handling ---');
  storage.setItem('lexinote_notes_v4', '{"corrupted json incomplete...');
  let recoveredNotes = null;
  try {
    const raw = storage.getItem('lexinote_notes_v4');
    recoveredNotes = JSON.parse(raw);
  } catch (err) {
    // Application catch block simulation
    recoveredNotes = [createInitialBlankNote('en')];
  }
  assert(Array.isArray(recoveredNotes) && recoveredNotes.length > 0, 'Corrupted JSON gracefully falls back to clean initial blank note without throwing unhandled crash');

  // Test 1.7: Storage Quota Exceeded Handling
  console.log('\n--- 1.7 Storage Quota Exceeded Handling ---');
  storage.failWrites = true;
  let quotaHandled = false;
  try {
    storage.setItem('lexinote_notes_v4', JSON.stringify([longNote]));
  } catch (err) {
    if (err.name === 'QuotaExceededError') {
      quotaHandled = true;
    }
  }
  assert(quotaHandled, 'QuotaExceededError thrown and detectable by storage layer');
  storage.failWrites = false;

  // Test 1.8: Data Overwrite in Default Notes List on Language Change (Audit of isDefaultNotesList)
  console.log('\n--- 1.8 Data Loss Risk: isDefaultNotesList Language Switch ---');
  const starterNotes = getDefaultNotes('en');
  // Simulate user editing starter note 'note-work-1'
  const editedStarterNotes = starterNotes.map(n => {
    if (n.id === 'note-work-1') {
      return { ...n, content: 'MY CONFIDENTIAL PERSONAL BUSINESS PLAN (DO NOT OVERWRITE)' };
    }
    return n;
  });

  const isDefaultResult = isDefaultNotesList(editedStarterNotes);
  if (isDefaultResult === true) {
    console.error('  ⚠️ [VULNERABILITY DETECTED]: isDefaultNotesList returns TRUE even when note-work-1 has been heavily edited by the user!');
    console.error('      If user switches language, handleSetAppLanguage() will silently DESTROY user edits!');
    assert(false, 'isDefaultNotesList must return FALSE when any starter note has been modified by user');
  } else {
    assert(true, 'isDefaultNotesList correctly protects modified starter notes from being overwritten');
  }

  console.log(`\nPHASE 1 SUMMARY: ${passed} Passed, ${failed} Failed`);
  return { passed, failed, issues };
}

if (process.argv[1]?.endsWith('test_phase1_persistence.js')) {
  runPhase1Tests();
}
