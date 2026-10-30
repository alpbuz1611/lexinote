import freedictEnTr from './freedict_eng_tur.json' with { type: 'json' };
import freedictTrEn from './freedict_tur_eng.json' with { type: 'json' };
import freedictMetadata from './freedict_metadata.json' with { type: 'json' };

/**
 * FreeDict English-Turkish (eng-tur) Offline Dictionary Service
 * Edition 0.3 - 34,405 unique English headwords, 48,294 Turkish reverse index terms.
 * License: GNU General Public License v2.0 or later (GPL-2.0-or-later)
 */

export function cleanLookupKey(str, lang = 'auto') {
  if (!str) return '';
  const trimmed = str.trim();
  const isTr = lang === 'tr' || /[çğıöşüÇĞIİÖŞÜ]/.test(trimmed);
  const lowered = isTr ? trimmed.toLocaleLowerCase('tr-TR') : trimmed.toLowerCase();
  return lowered.replace(/[.,!?;:'"()[\]{}]/g, '');
}

/**
 * Detect Part of Speech (POS) tag from Turkish definition text
 */
function detectPos(firstQuote = '') {
  if (!firstQuote) return 'İsim / Anlam';
  if (firstQuote.includes('(ünlem)')) return 'Ünlem';
  if (firstQuote.includes('(müz.)')) return 'Müzik Terimi';
  if (firstQuote.includes('(tiyatro)')) return 'Tiyatro';
  if (firstQuote.includes('(argo)')) return 'Argo';
  if (firstQuote.includes('(huk.)')) return 'Hukuk Terimi';
  if (firstQuote.includes('(bot.)')) return 'Botanik';
  if (firstQuote.includes('(zool.)')) return 'Zooloji';
  if (firstQuote.includes('(tıb.)')) return 'Tıp';
  if (firstQuote.startsWith('(çoğ.)')) return 'Çoğul İsim';
  if (firstQuote.startsWith('(sonek)') || firstQuote.startsWith('(önek)')) return 'Ek';
  if (/(\b(etmek|yapmak|olmak|vermek|almak)\b|mek$|mak$)/.test(firstQuote)) return 'Fiil';
  return 'İsim';
}

/**
 * Formats raw FreeDict senses into structured categories preserving source TEI structure
 */
export function formatSenses(raw) {
  if (!raw || raw.length === 0) {
    return {
      primary: '',
      description: '',
      senses: [],
      isPolysemous: false,
      contextNotice: '',
      allSenses: []
    };
  }

  // Normalize: raw can be array of sense arrays or array of strings
  const senseGroups = Array.isArray(raw[0]) ? raw : [raw];
  const parsedSenses = [];
  const allMeanings = [];
  const expressions = [];

  senseGroups.forEach((group) => {
    const cleanItems = [];
    group.forEach(item => {
      const trimmed = item.replace(/\s+/g, ' ').trim();
      if (!trimmed) return;
      cleanItems.push(trimmed);
      if (!allMeanings.includes(trimmed)) {
        allMeanings.push(trimmed);
      }
    });

    if (cleanItems.length > 0) {
      const pos = detectPos(cleanItems[0]);
      parsedSenses.push({
        index: parsedSenses.length + 1,
        pos,
        meanings: cleanItems,
        text: cleanItems.join(', ')
      });
    }
  });

  const isPolysemous = parsedSenses.length > 1;

  // Context notice: do NOT present a single meaning as definitive if multiple exist
  const contextNotice = isPolysemous
    ? '⚠️ Bu kelimenin kaynak sözlükte birden fazla farklı anlamı ve kullanımı bulunmaktadır. Cümlenizdeki bağlama göre uygun karşılığı seçiniz.'
    : '';

  // Primary summary taking first 2-3 distinct senses
  const primaryCandidates = parsedSenses.slice(0, 3).map(s => s.text);
  const primary = primaryCandidates.join(' • ');

  // Readable multi-line or numbered description
  const description = parsedSenses
    .map(s => `${s.index}. [${s.pos}] ${s.text}`)
    .join('\n');

  return {
    primary,
    description,
    senses: parsedSenses,
    isPolysemous,
    contextNotice,
    allSenses: allMeanings,
    expressions
  };
}

/**
 * Look up an English word in FreeDict (English -> Turkish)
 */
export function lookupEnglishWord(query) {
  if (!query) return null;
  const key = cleanLookupKey(query);
  const rawData = freedictEnTr[key];

  if (!rawData || rawData.length === 0) {
    return null;
  }

  const formatted = formatSenses(rawData);

  return {
    query,
    found: true,
    translation: formatted.primary,
    description: formatted.description,
    senses: formatted.senses,
    isPolysemous: formatted.isPolysemous,
    contextNotice: formatted.contextNotice,
    allSenses: formatted.allSenses,
    source: 'FreeDict (eng-tur 0.3, GPLv2+)',
    license: 'GPL-2.0-or-later',
    sourceLang: 'İngilizce',
    targetLang: 'Türkçe'
  };
}

/**
 * Look up a Turkish word in FreeDict Reverse Index (Turkish -> English)
 */
export function lookupTurkishWord(query) {
  if (!query) return null;
  const key = cleanLookupKey(query, 'tr');
  const enWords = freedictTrEn[key];

  if (!enWords || enWords.length === 0) {
    return null;
  }

  const primary = enWords.slice(0, 4).join(', ');
  const description = `İngilizce karşılıkları: ${enWords.slice(0, 8).join(', ')}${enWords.length > 8 ? ` (+${enWords.length - 8} kelime)` : ''}`;

  const senses = enWords.map((w, idx) => ({
    index: idx + 1,
    pos: 'İngilizce Karşılık',
    meanings: [w],
    text: w
  }));

  return {
    query,
    found: true,
    translation: primary,
    description,
    senses: senses.slice(0, 8),
    isPolysemous: enWords.length > 1,
    contextNotice: enWords.length > 1
      ? '⚠️ Bu Türkçe kelimenin birden fazla İngilizce karşılığı bulunmaktadır. İhtiyacınıza uygun olanı seçiniz.'
      : '',
    allSenses: enWords,
    source: 'FreeDict (eng-tur 0.3, GPLv2+)',
    license: 'GPL-2.0-or-later',
    sourceLang: 'Türkçe',
    targetLang: 'İngilizce'
  };
}

/**
 * Checks whether an English word exists in FreeDict
 */
export function isFreedictWord(word) {
  if (!word) return false;
  const key = cleanLookupKey(word, 'en');
  return Boolean(freedictEnTr[key]);
}

/**
 * Checks whether a Turkish word exists in FreeDict reverse index
 */
export function isTurkishFreedictWord(word) {
  if (!word) return false;
  const key = cleanLookupKey(word, 'tr');
  return Boolean(freedictTrEn[key]);
}

/**
 * Search the dictionary for matches
 */
export function searchFreedict(query, lang = 'en', limit = 50) {
  if (!query || query.trim().length === 0) return [];
  const q = query.trim().toLowerCase();
  const results = [];

  if (lang === 'en') {
    for (const [headword, rawData] of Object.entries(freedictEnTr)) {
      if (headword.includes(q)) {
        const formatted = formatSenses(rawData);
        results.push({
          word: headword,
          translation: formatted.primary,
          description: formatted.description,
          senses: formatted.senses,
          isPolysemous: formatted.isPolysemous,
          contextNotice: formatted.contextNotice,
          source: 'FreeDict eng-tur (GPLv2+)'
        });
        if (results.length >= limit) break;
      }
    }
  } else {
    for (const [trWord, enWords] of Object.entries(freedictTrEn)) {
      if (trWord.includes(q)) {
        results.push({
          word: trWord,
          translation: enWords.slice(0, 3).join(', '),
          description: enWords.slice(0, 6).join(', '),
          senses: enWords.slice(0, 5).map((w, i) => ({ index: i + 1, text: w, pos: 'İngilizce' })),
          isPolysemous: enWords.length > 1,
          source: 'FreeDict eng-tur (GPLv2+)'
        });
        if (results.length >= limit) break;
      }
    }
  }

  return results;
}

export function getFreedictMetadata() {
  return freedictMetadata;
}

export function getFreedictEnTrDictionary() {
  return freedictEnTr;
}

export function getFreedictTrEnDictionary() {
  return freedictTrEn;
}
