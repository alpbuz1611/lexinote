import { lookupEnglishWord, lookupTurkishWord } from '../data/freedict/freedictLoader.js';
import { translateOfflinePhraseOrSentence } from './sentenceTranslationService.js';
import { EN_TO_TR_LEXICON, DICTIONARY_SOURCE_INFO } from '../data/dictionary_en.js';
import { TR_TO_EN_LEXICON } from '../data/dictionary_tr.js';

function cleanLookupKey(str) {
  if (!str) return '';
  return str.trim().toLowerCase().replace(/[.,!?;:'"()[\]{}]/g, '');
}

/**
 * Enhanced Bilingual Translation & FreeDict Offline Dictionary Lookup
 * Primary EN->TR Source: FreeDict eng-tur 0.3 (GPLv2+) with 34,405 verified headwords.
 * Primary TR->EN Source: FreeDict Reverse Index (48,294 terms) & TDK-aligned vocabulary.
 */
export function translateSelection(text, fromLang = 'en', toLang = 'tr') {
  if (!text || text.trim().length === 0) {
    return null;
  }

  const query = text.trim();
  const cleanKey = cleanLookupKey(query);
  const words = query.split(/\s+/).filter(Boolean);

  // 1. Single Word English to Turkish Lookup
  if (words.length === 1 && (fromLang === 'en' || !fromLang)) {
    const freedictResult = lookupEnglishWord(cleanKey);
    if (freedictResult) {
      const curated = EN_TO_TR_LEXICON[cleanKey];
      return {
        query,
        found: true,
        translation: freedictResult.translation,
        pos: freedictResult.senses?.[0]?.pos || curated?.pos || 'Sözlük Kaydı',
        cefr: curated?.cefr || null,
        ipa: curated?.ipa || null,
        source: freedictResult.source,
        description: freedictResult.description,
        senses: freedictResult.senses || [],
        isPolysemous: freedictResult.isPolysemous || false,
        contextNotice: freedictResult.contextNotice || '',
        examples: curated?.examples || [],
        sourceLang: 'İngilizce',
        targetLang: 'Türkçe'
      };
    }

    if (EN_TO_TR_LEXICON[cleanKey]) {
      const entry = EN_TO_TR_LEXICON[cleanKey];
      return {
        query,
        found: true,
        translation: entry.tr,
        pos: entry.pos || 'Sözlük Kaydı',
        cefr: entry.cefr,
        ipa: entry.ipa,
        source: entry.source || DICTIONARY_SOURCE_INFO.en.name,
        description: entry.desc,
        senses: [{ index: 1, text: entry.tr, pos: entry.pos || 'Sözlük' }],
        isPolysemous: false,
        contextNotice: '',
        examples: entry.examples || [],
        sourceLang: 'İngilizce',
        targetLang: 'Türkçe'
      };
    }
  }

  // 2. Single Word Turkish to English Lookup
  if (words.length === 1 && fromLang === 'tr') {
    if (TR_TO_EN_LEXICON[cleanKey]) {
      const entry = TR_TO_EN_LEXICON[cleanKey];
      return {
        query,
        found: true,
        translation: entry.en,
        pos: entry.pos || 'İsim',
        source: entry.source || DICTIONARY_SOURCE_INFO.tr.name,
        description: entry.tdk,
        senses: [{ index: 1, text: entry.en, pos: entry.pos || 'İsim' }],
        isPolysemous: false,
        contextNotice: '',
        examples: entry.examples || [],
        sourceLang: 'Türkçe',
        targetLang: 'İngilizce'
      };
    }

    const freedictTrResult = lookupTurkishWord(cleanKey);
    if (freedictTrResult) {
      return {
        query,
        found: true,
        translation: freedictTrResult.translation,
        pos: 'Türkçe Karşılık',
        source: freedictTrResult.source,
        description: freedictTrResult.description,
        senses: freedictTrResult.senses || [],
        isPolysemous: freedictTrResult.isPolysemous || false,
        contextNotice: freedictTrResult.contextNotice || '',
        examples: [],
        sourceLang: 'Türkçe',
        targetLang: 'İngilizce'
      };
    }
  }

  // 3. Multi-word phrase or Sentence Translation
  const sentenceResult = translateOfflinePhraseOrSentence(query, fromLang, toLang);
  if (sentenceResult) {
    return {
      query,
      found: true,
      translation: sentenceResult.translation,
      pos: sentenceResult.isSentence ? 'Cümle / İfade' : 'Kalıp İfade',
      source: sentenceResult.source || 'FreeDict Çevrimdışı Çeviri Motoru',
      description: sentenceResult.description || sentenceResult.contextNotice,
      senses: sentenceResult.senses || [],
      isPolysemous: sentenceResult.isPolysemous || false,
      contextNotice: sentenceResult.contextNotice || '',
      isSentence: sentenceResult.isSentence,
      detectedIdioms: sentenceResult.detectedIdioms || [],
      tokenBreakdown: sentenceResult.tokenBreakdown || [],
      sourceLang: fromLang === 'en' ? 'İngilizce' : 'Türkçe',
      targetLang: toLang === 'en' ? 'İngilizce' : 'Türkçe'
    };
  }

  // 4. Fallback if not found
  return {
    query,
    found: false,
    translation: `"${query}" için yerleşik sözlükte birebir karşılık bulunamadı.`,
    pos: 'Özel / Kullanıcı Terimi',
    source: 'Yerel Çevrimdışı Sözlük',
    description: 'Bu kelimeyi "Özel Sözlüğüm" listesine ekleyerek kaydedebilir veya anlamını tanımlayabilirsiniz.',
    senses: [],
    isPolysemous: false,
    contextNotice: '',
    examples: [],
    sourceLang: fromLang === 'en' ? 'İngilizce' : 'Türkçe',
    targetLang: toLang === 'en' ? 'İngilizce' : 'Türkçe'
  };
}
