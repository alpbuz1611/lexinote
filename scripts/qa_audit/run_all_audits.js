import fs from 'fs';
import path from 'path';
import { runPhase1Tests } from './test_phase1_persistence.js';
import { runPhase2Tests } from './test_phase2_security.js';
import { runPhase3Tests } from './test_phase3_editor_modes.js';
import { runPhase4Tests } from './test_phase4_dictionary_spellcheck.js';
import { runPhase5Tests } from './test_phase5_wikilinks_mindmap.js';
import { runPhase7Tests } from './test_phase7_performance.js';

async function runPhase6PlatformTests() {
  console.log('\n================================================================');
  console.log('💻 PHASE 6 — PLATFORM COMPATIBILITY AUDIT');
  console.log('================================================================');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      passed++;
      console.log(`  ✅ [PASS] ${message}`);
    } else {
      failed++;
      console.error(`  ❌ [FAIL] ${message}`);
    }
  }

  const root = process.cwd();

  // 6.1 Windows Build Configuration
  console.log('\n--- 6.1 Windows Electron Builder Packaging ---');
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf-8'));
  assert(pkg.build?.win?.target?.includes('nsis') && pkg.build?.win?.target?.includes('portable'), 'Windows packaging configured for both NSIS Installer and Portable EXE');
  assert(pkg.build?.nsis?.oneClick === false && pkg.build?.nsis?.allowToChangeInstallationDirectory === true, 'NSIS configured with custom directory selection and shortcuts');

  // 6.2 Linux Desktop Scripts & Permissions
  console.log('\n--- 6.2 Linux Desktop Execution ---');
  assert(fs.existsSync(path.join(root, 'electron/main.cjs')), 'Electron main process script exists (electron/main.cjs)');
  assert(fs.existsSync(path.join(root, 'baslat.sh')), 'Linux startup script exists (baslat.sh)');
  assert(fs.existsSync(path.join(root, 'launch-desktop.sh')), 'Desktop launcher script exists (launch-desktop.sh)');

  // 6.3 Android Capacitor Configuration
  console.log('\n--- 6.3 Android Capacitor Configuration ---');
  const cap = JSON.parse(fs.readFileSync(path.join(root, 'capacitor.config.json'), 'utf-8'));
  assert(cap.appId === 'com.lexinote.app' && cap.appName === 'LexiNote', 'Capacitor app ID and name verified');
  assert(cap.webDir === 'dist', 'Capacitor web assets mapped to production dist folder');
  assert(fs.existsSync(path.join(root, '.github/workflows/build-apk.yml')), 'GitHub Actions Android APK compilation workflow verified');

  // 6.4 Browser & GitHub Pages
  console.log('\n--- 6.4 Browser & GitHub Pages Compatibility ---');
  const viteConfig = fs.readFileSync(path.join(root, 'vite.config.js'), 'utf-8');
  assert(viteConfig.includes("base: './'") || viteConfig.includes("base: '/lexinote/'"), 'Vite configured with universal relative base path (base: "./") for Electron, Capacitor & GitHub Pages');
  assert(fs.existsSync(path.join(root, '.github/workflows/deploy-pages.yml')), 'GitHub Pages deployment workflow verified');

  console.log(`\nPHASE 6 SUMMARY: ${passed} Passed, ${failed} Failed`);
  return { passed, failed };
}

async function masterRunner() {
  console.log('\n################################################################');
  console.log('🛡️  LEXINOTE v0.1.0 COMPREHENSIVE QA AUDIT & VERIFICATION SUITE');
  console.log('################################################################');

  const p1 = await runPhase1Tests();
  const p2 = await runPhase2Tests();
  const p3 = await runPhase3Tests();
  const p4 = await runPhase4Tests();
  const p5 = await runPhase5Tests();
  const p6 = await runPhase6PlatformTests();
  const p7 = await runPhase7Tests();

  const totalPassed = p1.passed + p2.passed + p3.passed + p4.passed + p5.passed + p6.passed + p7.passed;
  const totalFailed = p1.failed + p2.failed + p3.failed + p4.failed + p5.failed + p6.failed + p7.failed;

  console.log('\n################################################################');
  console.log(`📊 MASTER AUDIT TOTALS: ${totalPassed} PASSED, ${totalFailed} FAILED (${((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1)}%)`);
  console.log('################################################################\n');

  if (totalFailed > 0) {
    process.exit(1);
  }
}

masterRunner();
