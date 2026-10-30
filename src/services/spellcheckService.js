import { EN_TYPO_MAP, EN_WORD_SET, EN_TO_TR_LEXICON } from '../data/dictionary_en.js';
import { TR_TYPO_MAP, TR_WORD_SET, TR_TO_EN_LEXICON } from '../data/dictionary_tr.js';
import { isEnable1Word, getEnable1Set } from '../data/wordlists/enable1Loader.js';
import { isFreedictWord, isTurkishFreedictWord } from '../data/freedict/freedictLoader.js';

/**
 * Preserves the casing of the original word onto the replacement
 */
export function matchCase(original, replacement, language = 'auto') {
  if (!original || !replacement) return replacement;
  const isTr = language === 'tr' || /[çğıöşüÇĞIİÖŞÜ]/.test(original);
  if (original === (isTr ? original.toLocaleUpperCase('tr-TR') : original.toUpperCase()) && original.length > 1) {
    return isTr ? replacement.toLocaleUpperCase('tr-TR') : replacement.toUpperCase();
  }
  if (original[0] === (isTr ? original[0].toLocaleUpperCase('tr-TR') : original[0].toUpperCase())) {
    const head = isTr ? replacement.charAt(0).toLocaleUpperCase('tr-TR') : replacement.charAt(0).toUpperCase();
    const tail = isTr ? replacement.slice(1).toLocaleLowerCase('tr-TR') : replacement.slice(1).toLowerCase();
    return head + tail;
  }
  return isTr ? replacement.toLocaleLowerCase('tr-TR') : replacement.toLowerCase();
}

/**
 * Strips punctuation and returns clean word and extracted punctuation
 */
export function extractWordAndPunctuation(rawText) {
  const match = rawText.match(/^([^\p{L}\p{N}]*)([\p{L}\p{N}'-]+)([^\p{L}\p{N}]*)$/u);
  if (!match) {
    return { prefix: '', word: rawText, suffix: '' };
  }
  return {
    prefix: match[1] || '',
    word: match[2] || '',
    suffix: match[3] || ''
  };
}

/**
 * Fast offline candidate generation (Norvig 1-edit distance & Damerau letter transposition)
 * Generates suggestions for misspelled words in < 1ms
 */
function generateEnglishSuggestions(cleanWord, wordSet, maxSuggestions = 5) {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const candidates = new Set();
  const len = cleanWord.length;

  // 1. Transpositions (Adjacent letter swap - e.g. aborad -> abroad)
  for (let i = 0; i < len - 1; i++) {
    const swapped = cleanWord.slice(0, i) + cleanWord[i + 1] + cleanWord[i] + cleanWord.slice(i + 2);
    if (wordSet.has(swapped)) candidates.add(swapped);
  }

  // 2. Deletions (Extra letter typed)
  for (let i = 0; i < len; i++) {
    const deleted = cleanWord.slice(0, i) + cleanWord.slice(i + 1);
    if (wordSet.has(deleted)) candidates.add(deleted);
  }

  // 3. Replacements (Wrong letter typed)
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < letters.length; j++) {
      const c = letters[j];
      if (c === cleanWord[i]) continue;
      const replaced = cleanWord.slice(0, i) + c + cleanWord.slice(i + 1);
      if (wordSet.has(replaced)) candidates.add(replaced);
    }
  }

  // 4. Insertions (Missed letter)
  if (len <= 8) {
    for (let i = 0; i <= len; i++) {
      for (let j = 0; j < letters.length; j++) {
        const c = letters[j];
        const inserted = cleanWord.slice(0, i) + c + cleanWord.slice(i);
        if (wordSet.has(inserted)) candidates.add(inserted);
      }
    }
  }

  // Sort candidates: prioritize words present in FreeDict dictionary
  const sorted = Array.from(candidates).sort((a, b) => {
    const aInCore = (isFreedictWord(a) || EN_TO_TR_LEXICON[a]) ? 1 : 0;
    const bInCore = (isFreedictWord(b) || EN_TO_TR_LEXICON[b]) ? 1 : 0;
    if (aInCore !== bInCore) return bInCore - aInCore;
    return a.length - b.length;
  });

  return sorted.slice(0, maxSuggestions);
}

/**
 * Checks a single word for spelling validity and generates correction suggestions
 * Uses ENABLE1 (172,819 words, Public Domain) for English
 * @param {string} word - The word to check
 * @param {'en' | 'tr'} language - The dictionary language
 * @param {string[]} customWords - User's custom added dictionary words
 */
export function checkWord(word, language = 'en', customWords = []) {
  if (!word || word.length < 2) {
    return { isValid: true, suggestions: [] };
  }

  const trimmed = word.trim();
  const isTr = language === 'tr' || /[çğıöşüÇĞIİÖŞÜ]/.test(trimmed);
  const cleanWord = isTr ? trimmed.toLocaleLowerCase('tr-TR') : trimmed.toLowerCase();

  // 1. Check user custom dictionary
  const customLowered = customWords.map(w =>
    (isTr || /[çğıöşüÇĞIİÖŞÜ]/.test(w)) ? w.trim().toLocaleLowerCase('tr-TR') : w.trim().toLowerCase()
  );
  if (customLowered.includes(cleanWord)) {
    return { isValid: true, suggestions: [] };
  }

  // 2. Select dictionary and typo map
  const typoMap = language === 'tr' ? TR_TYPO_MAP : EN_TYPO_MAP;

  // Direct known typo hit (e.g. aborad -> abroad, yalnış -> yanlış)
  if (typoMap[cleanWord]) {
    const fixed = matchCase(word, typoMap[cleanWord], language);
    return {
      isValid: false,
      isKnownTypo: true,
      bestMatch: fixed,
      suggestions: [fixed]
    };
  }

  // 3. Exact word validation against master wordlists
  if (language === 'en') {
    // ENABLE1 (172,819 words) + FreeDict Lexicon (34,405 words) + Curated Lexicon
    if (isEnable1Word(cleanWord) || isFreedictWord(cleanWord) || EN_WORD_SET.has(cleanWord)) {
      return { isValid: true, suggestions: [] };
    }
  } else {
    // TDK Turkish Word Set (TR_WORD_SET) + FreeDict 48k+ Reverse Index + Curated TDK Lexicon
    if (TR_WORD_SET.has(cleanWord) || Boolean(TR_TO_EN_LEXICON[cleanWord]) || isTurkishFreedictWord(cleanWord)) {
      return { isValid: true, suggestions: [] };
    }
  }

  // Check if it's numbers, emails, URLs, or has digits
  if (/[\d@#$]/.test(cleanWord)) {
    return { isValid: true, suggestions: [] };
  }

  // 4. Generate intelligent offline suggestions
  let suggestions = [];
  if (language === 'en') {
    const enable1 = getEnable1Set();
    const rawSuggestions = generateEnglishSuggestions(cleanWord, enable1, 4);
    suggestions = rawSuggestions.map(s => matchCase(word, s));
  } else {
    // For Turkish, test single letter transpose or prefix against TR_WORD_SET
    const candidates = [];
    const trWords = Array.from(TR_WORD_SET);
    for (const tw of trWords) {
      if (Math.abs(tw.length - cleanWord.length) <= 1) {
        if (tw.startsWith(cleanWord.slice(0, 2))) {
          candidates.push(matchCase(word, tw));
          if (candidates.length >= 3) break;
        }
      }
    }
    suggestions = candidates;
  }

  return {
    isValid: false,
    isKnownTypo: false, // NOT a pre-mapped typo!
    bestMatch: suggestions[0] || null,
    suggestions
  };
}

/**
 * Autocorrect check:
 * Returns the corrected word ONLY IF it is an explicitly verified typo!
 * Real words (like "gurur") will NEVER be auto-replaced.
 */
export function getAutoCorrection(word, language = 'en', customWords = []) {
  const result = checkWord(word, language, customWords);
  if (!result.isValid && result.isKnownTypo && result.bestMatch) {
    return result.bestMatch;
  }
  return null;
}
