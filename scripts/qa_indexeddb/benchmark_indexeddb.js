/**
 * LexiNote QA Phase 4.6 — IndexedDB Performance & Memory Benchmark Suite
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

async function runBenchmarkTests() {
  console.log('\n================================================================');
  console.log('⚡ QA 4.6 — INDEXEDDB PERFORMANCE & MEMORY BENCHMARKS');
  console.log('================================================================');

  storage.setIDBFactory(indexedDB);
  await storage.deleteDatabase();
  await storage.initDB();

  const memInitial = process.memoryUsage();

  console.log('\n--- 4.6.1 Batch Write Throughput ---');
  // Benchmark 100 notes
  const notes100 = Array.from({ length: 100 }, (_, i) => ({
    id: `bench-100-${i}`,
    title: `Bench Note #${i}`,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    updatedAt: new Date().toISOString()
  }));
  const t0_100 = performance.now();
  await storage.saveNotesBatch(notes100);
  const dur100 = performance.now() - t0_100;
  console.log(`     📊 100 Notes Batch Write:   ${dur100.toFixed(2)}ms (${(dur100 / 100).toFixed(3)}ms/note)`);
  assert(dur100 < 500, `100 notes batch written in < 500ms (${dur100.toFixed(2)}ms)`);

  // Benchmark 500 notes
  const notes500 = Array.from({ length: 500 }, (_, i) => ({
    id: `bench-500-${i}`,
    title: `Bench Note #${i}`,
    content: 'Standard note text for scale performance evaluation with metadata.',
    updatedAt: new Date().toISOString()
  }));
  const t0_500 = performance.now();
  await storage.saveNotesBatch(notes500);
  const dur500 = performance.now() - t0_500;
  console.log(`     📊 500 Notes Batch Write:   ${dur500.toFixed(2)}ms (${(dur500 / 500).toFixed(3)}ms/note)`);
  assert(dur500 < 1500, `500 notes batch written in < 1500ms (${dur500.toFixed(2)}ms)`);

  // Benchmark 1,000 notes
  const notes1000 = Array.from({ length: 1000 }, (_, i) => ({
    id: `bench-1000-${i}`,
    title: `Bench Note #${i}`,
    content: 'Production grade content payload with tags and timestamps.',
    updatedAt: new Date().toISOString()
  }));
  const t0_1000 = performance.now();
  await storage.saveNotesBatch(notes1000);
  const dur1000 = performance.now() - t0_1000;
  console.log(`     📊 1,000 Notes Batch Write: ${dur1000.toFixed(2)}ms (${(dur1000 / 1000).toFixed(3)}ms/note)`);
  assert(dur1000 < 3000, `1,000 notes batch written in < 3000ms (${dur1000.toFixed(2)}ms)`);

  console.log('\n--- 4.6.2 Single-Note Read & Update Latency ---');
  // Measure 100 individual getNote queries
  const t0_get = performance.now();
  for (let i = 0; i < 100; i++) {
    await storage.getNote(`bench-1000-${i * 9}`);
  }
  const durGet = (performance.now() - t0_get) / 100;
  console.log(`     📊 Single Note Read Latency:   ${durGet.toFixed(3)}ms/op`);
  assert(durGet < 2.0, `Single note read latency < 2.0ms (${durGet.toFixed(3)}ms)`);

  // Measure 100 individual saveNote updates
  const t0_update = performance.now();
  for (let i = 0; i < 100; i++) {
    await storage.saveNote({
      id: `bench-1000-${i * 9}`,
      title: `Updated Bench Note #${i}`,
      content: 'Updated content string.',
      updatedAt: new Date().toISOString()
    });
  }
  const durUpdate = (performance.now() - t0_update) / 100;
  console.log(`     📊 Single Note Update Latency: ${durUpdate.toFixed(3)}ms/op`);
  assert(durUpdate < 5.0, `Single note update latency < 5.0ms (${durUpdate.toFixed(3)}ms)`);

  console.log('\n--- 4.6.3 Full Store Scan (getAllNotes across 1,600 notes) ---');
  const t0_all = performance.now();
  const allLoaded = await storage.getAllNotes();
  const durAll = performance.now() - t0_all;
  console.log(`     📊 getAllNotes (${allLoaded.length} notes): ${durAll.toFixed(2)}ms`);
  assert(durAll < 200, `getAllNotes over 1,600 notes took < 200ms (${durAll.toFixed(2)}ms)`);

  console.log('\n--- 4.6.4 Heap Memory Footprint ---');
  const memFinal = process.memoryUsage();
  const heapUsedMb = memFinal.heapUsed / (1024 * 1024);
  const rssMb = memFinal.rss / (1024 * 1024);
  console.log(`     📊 Heap Used: ${heapUsedMb.toFixed(2)} MB | RSS: ${rssMb.toFixed(2)} MB`);
  assert(heapUsedMb < 250, `Heap memory usage (${heapUsedMb.toFixed(2)} MB) remains < 250 MB`);

  // Clean teardown
  await storage.deleteDatabase();

  console.log(`\nQA 4.6 SUMMARY: ${totalPassed} Passed, ${totalFailed} Failed`);
  return { passed: totalPassed, failed: totalFailed };
}

if (process.argv[1]?.endsWith('benchmark_indexeddb.js')) {
  runBenchmarkTests().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}

export { runBenchmarkTests };
