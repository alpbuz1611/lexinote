import { lookupEnglishWord, lookupTurkishWord } from '../../src/data/freedict/freedictLoader.js';
import { translateSelection } from '../../src/services/translationService.js';
import { checkWord, getAutoCorrection } from '../../src/services/spellcheckService.js';

export async function runPhase4Tests() {
  console.log('\n================================================================');
  console.log('📖 PHASE 4 — OFFLINE DICTIONARY & SPELLCHECK QUALITY AUDIT');
  console.log('================================================================');

  let passed = 0;
  let failed = 0;
  const issues = [];
  const dictionaryAuditResults = [];

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

  // 4.1 English to Turkish Word Lookup (12 Words)
  console.log('\n--- 4.1 English to Turkish FreeDict Lookup (12 Words) ---');
  const enWords = [
    'abroad',
    'beautiful',
    'book',
    'work',
    'school',
    'language',
    'accommodate',
    'acknowledge',
    'circumstance',
    'computer',
    'privacy',
    'development'
  ];

  for (const word of enWords) {
    const res = translateSelection(word, 'en', 'tr');
    const auditRecord = {
      term: word,
      direction: 'EN -> TR',
      found: res.found,
      translation: res.translation,
      pos: res.pos,
      meaningsCount: res.senses ? res.senses.length : 1,
      isPolysemous: res.isPolysemous
    };
    dictionaryAuditResults.push(auditRecord);

    const isAppropriate = res.found && res.translation && res.translation.length > 0;
    assert(isAppropriate, `EN "${word}" ➔ [${res.pos}] "${res.translation ? res.translation.slice(0, 50) : 'N/A'}" (${auditRecord.meaningsCount} senses)`);
  }

  // 4.2 Turkish to English Lookup (10 Words)
  console.log('\n--- 4.2 Turkish to English Reverse Lookup (10 Words) ---');
  const trWords = [
    'öğretmen',
    'çalışmak',
    'güvenlik',
    'bilgisayar',
    'araştırma',
    'kitap',
    'özgürlük',
    'düşünce',
    'uygulama',
    'geliştirme'
  ];

  for (const word of trWords) {
    const res = translateSelection(word, 'tr', 'en');
    const isAppropriate = res.found && res.translation &&
      res.translation.toLowerCase() !== word.toLowerCase() &&
      !res.translation.includes('bulunamadı');

    const auditRecord = {
      term: word,
      direction: 'TR -> EN',
      found: res.found && isAppropriate,
      translation: res.translation,
      pos: res.pos,
      meaningsCount: res.senses ? res.senses.length : 1,
      isPolysemous: res.isPolysemous
    };
    dictionaryAuditResults.push(auditRecord);

    assert(isAppropriate, `TR "${word}" ➔ [${res.pos}] "${res.translation ? res.translation.slice(0, 50) : 'N/A'}"`);
  }

  // 4.3 Spellcheck: English Correct Words
  console.log('\n--- 4.3 Spellcheck: English Correct Words ---');
  for (const word of enWords) {
    const check = checkWord(word, 'en');
    assert(check.isValid === true, `English word "${word}" marked valid (not misspelled)`);
  }

  // 4.4 Spellcheck: Turkish Correct Words
  console.log('\n--- 4.4 Spellcheck: Turkish Correct Words ---');
  for (const word of trWords) {
    const check = checkWord(word, 'tr');
    assert(check.isValid === true, `Turkish word "${word}" marked valid (not misspelled)`);
  }

  // 4.5 Spellcheck: Turkish Capitalization & Characters (I/ı, İ/i, Ç, Ğ, Ş, Ö, Ü)
  console.log('\n--- 4.5 Spellcheck: Turkish Capitalization & Characters ---');
  const trCased = [
    { word: 'ÖĞRETMEN', expectedValid: true },
    { word: 'Kitap', expectedValid: true },
    { word: 'ÇALIŞMAK', expectedValid: true },
    { word: 'GÜVENLİK', expectedValid: true },
    { word: 'Işık', expectedValid: true },
    { word: 'İSTANBUL', expectedValid: true }
  ];

  for (const item of trCased) {
    const check = checkWord(item.word, 'tr');
    assert(check.isValid === item.expectedValid, `Turkish capitalized word "${item.word}" checked (valid: ${check.isValid})`);
  }

  // 4.6 Spellcheck: Misspelled Words & Suggestions
  console.log('\n--- 4.6 Spellcheck: Misspelled Words & Suggestions ---');
  const enTypo = checkWord('aborad', 'en');
  assert(enTypo.isValid === false, '"aborad" correctly marked invalid');
  assert(enTypo.suggestions.includes('abroad'), '"aborad" produces suggestion "abroad"');

  const trTypo = checkWord('yalnış', 'tr');
  assert(trTypo.isValid === false, '"yalnış" correctly marked invalid');
  assert(trTypo.suggestions.includes('yanlış'), '"yalnış" produces suggestion "yanlış"');

  // 4.7 Custom User Words
  console.log('\n--- 4.7 Custom User Words In Spellchecker ---');
  const customWord = 'LexiNodeSpecialWord';
  const beforeAdd = checkWord(customWord, 'en', []);
  assert(beforeAdd.isValid === false, 'Unknown word is invalid before adding to custom words');

  const afterAdd = checkWord(customWord, 'en', [customWord]);
  assert(afterAdd.isValid === true, 'Custom user word is recognized as valid after adding');

  console.log(`\nPHASE 4 SUMMARY: ${passed} Passed, ${failed} Failed`);
  return { passed, failed, issues, dictionaryAuditResults };
}

if (process.argv[1]?.endsWith('test_phase4_dictionary_spellcheck.js')) {
  runPhase4Tests();
}
