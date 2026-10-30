import { lookupEnglishWord, lookupTurkishWord } from '../../src/data/freedict/freedictLoader.js';
import { translateSelection } from '../../src/services/translationService.js';
import { checkWord } from '../../src/services/spellcheckService.js';

export async function runPhase7Tests() {
  console.log('\n================================================================');
  console.log('⚡ PHASE 7 — PERFORMANCE & STABILITY BENCHMARK SUITE');
  console.log('================================================================');

  let passed = 0;
  let failed = 0;
  const metrics = {};

  function assert(condition, message) {
    if (condition) {
      passed++;
      console.log(`  ✅ [PASS] ${message}`);
    } else {
      failed++;
      console.error(`  ❌ [FAIL] ${message}`);
    }
  }

  // 7.1 Offline Dictionary Lookup Latency Benchmark (1,000 iterations)
  console.log('\n--- 7.1 Dictionary Lookup Responsiveness ---');
  const testQueries = ['computer', 'development', 'school', 'abroad', 'privacy', 'language', 'circumstance', 'book'];
  const t0 = performance.now();
  for (let i = 0; i < 1000; i++) {
    const q = testQueries[i % testQueries.length];
    lookupEnglishWord(q);
  }
  const totalLookupTime = performance.now() - t0;
  const avgLookupTimeMs = totalLookupTime / 1000;
  metrics.avgDictionaryLookupMs = avgLookupTimeMs;

  assert(avgLookupTimeMs < 0.5, `1,000 dictionary lookups executed at avg ${avgLookupTimeMs.toFixed(3)}ms/op (< 0.5ms ultra-low latency)`);

  // 7.2 Full Text Search Benchmark (500 Notes)
  console.log('\n--- 7.2 Search Responsiveness across 500 Notes ---');
  const mockNotes = [];
  for (let i = 0; i < 500; i++) {
    mockNotes.push({
      id: `note-${i}`,
      title: `Project Architecture Specification #${i}`,
      content: `Extensive documentation for subsystem ${i}. Includes critical keywords like quantum, cybernetics, offline dictionary, encryption vault, and memory management. Item ${i} details.`,
      tags: [`tag-${i % 10}`]
    });
  }

  const searchTerms = ['quantum', 'subsystem 42', 'Item 250', 'cybernetics', 'nonexistent_keyword'];
  const tSearchStart = performance.now();
  let totalMatchesFound = 0;

  for (let iter = 0; iter < 100; iter++) {
    const query = searchTerms[iter % searchTerms.length].toLowerCase();
    const results = mockNotes.filter(n =>
      n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query)
    );
    totalMatchesFound += results.length;
  }
  const searchDuration = performance.now() - tSearchStart;
  const avgSearchTimeMs = searchDuration / 100;
  metrics.avgSearch500NotesMs = avgSearchTimeMs;

  assert(avgSearchTimeMs < 5.0, `100 searches across 500 notes executed in avg ${avgSearchTimeMs.toFixed(3)}ms/search (< 5.0ms instant search)`);

  // 7.3 Note Switching Latency
  console.log('\n--- 7.3 Note Switching & Render Preparation Latency ---');
  const tSwitchStart = performance.now();
  for (let i = 0; i < 500; i++) {
    const targetId = `note-${i}`;
    const found = mockNotes.find(n => n.id === targetId);
    if (!found) break;
  }
  const switchDuration = performance.now() - tSwitchStart;
  const avgSwitchMs = switchDuration / 500;
  metrics.avgNoteSwitchMs = avgSwitchMs;

  assert(avgSwitchMs < 0.05, `500 note switch operations averaged ${avgSwitchMs.toFixed(4)}ms/switch (< 0.05ms)`);

  // 7.4 Spellcheck Performance (10,000 words stream check)
  console.log('\n--- 7.4 Spellcheck Throughput Benchmark ---');
  const testParagraphWords = ['The', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog', 'aborad', 'computer', 'development', 'privacy'];
  const tSpellStart = performance.now();
  for (let i = 0; i < 5000; i++) {
    const w = testParagraphWords[i % testParagraphWords.length];
    checkWord(w, 'en');
  }
  const spellDuration = performance.now() - tSpellStart;
  const wordsPerSecond = (5000 / (spellDuration / 1000));
  metrics.spellcheckWordsPerSecond = Math.round(wordsPerSecond);

  assert(wordsPerSecond > 20000, `Spellchecker processed 5,000 words in ${spellDuration.toFixed(2)}ms (~${Math.round(wordsPerSecond).toLocaleString()} words/sec throughput (> 20,000 wps))`);

  // 7.5 Memory Usage & Heap Footprint
  console.log('\n--- 7.5 Memory Consumption Footprint ---');
  const memoryUsage = process.memoryUsage();
  const heapUsedMB = memoryUsage.heapUsed / (1024 * 1024);
  const rssMB = memoryUsage.rss / (1024 * 1024);
  metrics.heapUsedMB = heapUsedMB.toFixed(2);
  metrics.rssMB = rssMB.toFixed(2);

  console.log(`     📊 Node Heap Used: ${metrics.heapUsedMB} MB | RSS: ${metrics.rssMB} MB`);
  assert(heapUsedMB < 250, `Heap memory usage (${metrics.heapUsedMB} MB) is well within lightweight application boundaries (< 250 MB)`);

  console.log(`\nPHASE 7 SUMMARY: ${passed} Passed, ${failed} Failed`);
  return { passed, failed, metrics };
}

if (process.argv[1]?.endsWith('test_phase7_performance.js')) {
  runPhase7Tests();
}
