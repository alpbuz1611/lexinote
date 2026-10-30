/**
 * Master Test Runner for LexiNote v0.2.0 IndexedDB Storage Engine & QA Tests
 */

import { runCrudScaleTests } from './test_crud_scale.js';
import { runLargeDocumentsTests } from './test_large_documents.js';
import { runConcurrencyRaceTests } from './test_concurrency_race.js';
import { runMigrationTests } from './test_migration_scenarios.js';
import { runFailureRecoveryTests } from './test_failure_recovery.js';
import { runBenchmarkTests } from './benchmark_indexeddb.js';

async function main() {
  console.log('################################################################');
  console.log('🗄️  LEXINOTE v0.2.0 INDEXEDDB STORAGE & INTEGRITY TEST SUITE');
  console.log('################################################################');

  const results = [];

  results.push(await runCrudScaleTests());
  results.push(await runLargeDocumentsTests());
  results.push(await runConcurrencyRaceTests());
  results.push(await runMigrationTests());
  results.push(await runFailureRecoveryTests());
  results.push(await runBenchmarkTests());

  const totalPassed = results.reduce((acc, r) => acc + r.passed, 0);
  const totalFailed = results.reduce((acc, r) => acc + r.failed, 0);
  const total = totalPassed + totalFailed;
  const passRate = total > 0 ? ((totalPassed / total) * 100).toFixed(1) : '0';

  console.log('\n################################################################');
  console.log(`📊 INDEXEDDB SUITE TOTALS: ${totalPassed} PASSED, ${totalFailed} FAILED (${passRate}%)`);
  console.log('################################################################\n');

  if (totalFailed > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error during IndexedDB test execution:', err);
  process.exit(1);
});
