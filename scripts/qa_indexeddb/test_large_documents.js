/**
 * LexiNote QA Phase 4.2 — Large Documents (10k, 50k, 100k words) & Unicode Integrity Test
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

function generateWords(count) {
  const dictionary = [
    'araştırma', 'geliştirme', 'bilgisayar', 'mühendisliği', 'şifreleme',
    'özgürlük', 'öğrenme', 'kütüphane', 'çağdaş', 'yağmur', 'ışık',
    'algorithm', 'knowledge', 'architecture', 'database', 'performance',
    'integrity', 'security', 'encryption', 'asynchronous', 'concurrency',
    'workstation', 'lexicon', 'markdown', 'representation', 'transaction',
    'bilingual', 'Turkish', 'English', 'vocabulary', 'mindset', 'thought'
  ];
  const emojis = ['🚀', '🛡️', '📝', '⚡', '💡', '🧠', '🔬', '🌍', '✨', '🔒'];
  const symbols = ['§', '¶', '©', '®', '™', '±', '≠', '≤', '≥', '→', '←', '∑', '∏', '√', '∞'];

  const words = [];
  for (let i = 0; i < count; i++) {
    const baseWord = dictionary[i % dictionary.length];
    if (i % 25 === 0) {
      words.push(`${baseWord}${emojis[i % emojis.length]}`);
    } else if (i % 50 === 0) {
      words.push(`${baseWord}${symbols[i % symbols.length]}`);
    } else {
      words.push(baseWord);
    }
  }
  return words.join(' ');
}

async function runLargeDocumentsTests() {
  console.log('\n================================================================');
  console.log('📄 QA 4.2 — LARGE DOCUMENTS & UNICODE STRESS TEST');
  console.log('================================================================');

  storage.setIDBFactory(indexedDB);
  await storage.deleteDatabase();
  await storage.initDB();

  console.log('\n--- 4.2.1 10,000-Word Document Persistence ---');
  const text10k = generateWords(10000);
  const actualWords10k = text10k.split(/\s+/).length;
  assert(actualWords10k === 10000, `Generated exactly 10,000 words (actual: ${actualWords10k}, ${text10k.length} characters)`);

  const note10k = {
    id: 'note-large-10k',
    title: '10,000 Words Comprehensive Research Paper 🇹🇷 🇬🇧',
    content: `# Executive Summary 🚀\n\n${text10k}\n\n## Conclusion & Math\n$E = mc^2$ and $\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$`,
    mode: 'cornell',
    tags: ['research', 'large-doc', '10k'],
    isPinned: true,
    isLocked: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const t0_10k = Date.now();
  await storage.saveNote(note10k);
  const saveDuration10k = Date.now() - t0_10k;

  const t1_10k = Date.now();
  const loaded10k = await storage.getNote('note-large-10k');
  const loadDuration10k = Date.now() - t1_10k;

  console.log(`     ⚡ 10k Words: Save ${saveDuration10k}ms | Load ${loadDuration10k}ms`);
  assert(loaded10k !== null, '10k words note retrieved from IndexedDB successfully');
  assert(loaded10k.content === note10k.content, `10k words content byte-for-byte identical (${loaded10k.content.length} bytes)`);
  assert(loaded10k.title === note10k.title, '10k note title with emojis preserved intact');

  console.log('\n--- 4.2.2 50,000-Word Document Persistence ---');
  const text50k = generateWords(50000);
  const actualWords50k = text50k.split(/\s+/).length;
  assert(actualWords50k === 50000, `Generated exactly 50,000 words (actual: ${actualWords50k}, ${text50k.length} characters)`);

  const note50k = {
    id: 'note-large-50k',
    title: '50,000 Words Master Thesis & Technical Monograph 🧠',
    content: `# Full Thesis Body\n\n${text50k}\n\n## Mathematical Models\n$$\\nabla \\times \\mathbf{B} = \\mu_0\\left(\\mathbf{J} + \\varepsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t}\\right)$$`,
    mode: 'work',
    tags: ['monograph', 'large-doc', '50k'],
    isPinned: false,
    isLocked: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const t0_50k = Date.now();
  await storage.saveNote(note50k);
  const saveDuration50k = Date.now() - t0_50k;

  const t1_50k = Date.now();
  const loaded50k = await storage.getNote('note-large-50k');
  const loadDuration50k = Date.now() - t1_50k;

  console.log(`     ⚡ 50k Words: Save ${saveDuration50k}ms | Load ${loadDuration50k}ms`);
  assert(loaded50k !== null, '50k words note retrieved from IndexedDB successfully');
  assert(loaded50k.content === note50k.content, `50k words content byte-for-byte identical (${loaded50k.content.length} bytes)`);

  console.log('\n--- 4.2.3 100,000-Word Document Persistence ---');
  const text100k = generateWords(100000);
  const actualWords100k = text100k.split(/\s+/).length;
  assert(actualWords100k === 100000, `Generated exactly 100,000 words (actual: ${actualWords100k}, ${text100k.length} characters)`);

  const note100k = {
    id: 'note-large-100k',
    title: '100,000 Words Full Encyclopedia Volume 📚',
    content: `# Volume Index\n\n${text100k}\n\n## Epilogue\nTam metin Türkçe karakterler: çığırtkan, şövalye, ılık, özgürlük.`,
    mode: 'journal',
    tags: ['encyclopedia', 'extreme-doc', '100k'],
    isPinned: true,
    isLocked: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const t0_100k = Date.now();
  await storage.saveNote(note100k);
  const saveDuration100k = Date.now() - t0_100k;

  const t1_100k = Date.now();
  const loaded100k = await storage.getNote('note-large-100k');
  const loadDuration100k = Date.now() - t1_100k;

  console.log(`     ⚡ 100k Words: Save ${saveDuration100k}ms | Load ${loadDuration100k}ms`);
  assert(loaded100k !== null, '100k words note retrieved from IndexedDB successfully');
  assert(loaded100k.content === note100k.content, `100k words content byte-for-byte identical (${loaded100k.content.length} bytes)`);
  assert(loaded100k.content.includes('Tam metin Türkçe karakterler: çığırtkan, şövalye, ılık, özgürlük.'), 'Turkish diacritics in epilogue verified');

  // Verify all 3 large notes coexist without interference
  const totalNotesCount = await storage.countNotes();
  assert(totalNotesCount === 3, `All 3 large documents coexist in database (count: ${totalNotesCount})`);

  // Clean teardown
  await storage.deleteDatabase();

  console.log(`\nQA 4.2 SUMMARY: ${totalPassed} Passed, ${totalFailed} Failed`);
  return { passed: totalPassed, failed: totalFailed };
}

if (process.argv[1]?.endsWith('test_large_documents.js')) {
  runLargeDocumentsTests().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}

export { runLargeDocumentsTests };
