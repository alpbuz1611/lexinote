import { lookupEnglishWord, lookupTurkishWord, isFreedictWord, getFreedictEnTrDictionary, getFreedictTrEnDictionary } from '../data/freedict/freedictLoader.js';

/**
 * Offline Bilingual Sentence & Phrase Translation Engine for LexiNote
 * 100% Offline — No external network or API dependencies.
 * Powered by FreeDict eng-tur (34,405 entries) and structural linguistic alignment.
 */

const PRONOUNS_EN_TO_TR = {
  i: 'ben',
  you: 'sen / siz',
  he: 'o',
  she: 'o',
  it: 'o',
  we: 'biz',
  they: 'onlar',
  my: 'benim',
  your: 'senin / sizin',
  his: 'onun',
  her: 'onun',
  its: 'onun',
  our: 'bizim',
  their: 'onların',
  me: 'beni / bana',
  us: 'bizi / bize',
  him: 'onu / ona',
  them: 'onları / onlara',
  this: 'bu',
  that: 'şu / o',
  these: 'bunlar',
  those: 'şunlar'
};

const COMMON_PARTICLES_EN_TO_TR = {
  the: '',
  a: 'bir',
  an: 'bir',
  and: 've',
  or: 'veya',
  but: 'ama / fakat',
  because: 'çünkü',
  if: 'eğer',
  with: 'ile',
  without: 'olmadan / -siz',
  in: 'içinde / -de',
  on: 'üzerinde',
  at: '-de / -da',
  to: '-e / -a',
  from: '-den / -dan',
  for: 'için',
  about: 'hakkında',
  of: '-(n)ın / ait',
  by: 'tarafından / ile',
  very: 'çok',
  also: 'ayrıca / de',
  too: 'de / çok',
  now: 'şimdi',
  here: 'burada',
  there: 'orada',
  not: 'değil / -me'
};

const AUXILIARY_VERBS_EN_TO_TR = {
  is: 'dır / dir',
  am: 'ım / im',
  are: 'dır / dirler',
  was: 'idi / -di',
  were: 'idiler / -diler',
  will: '-ecek / -acak',
  would: '-erdi / -ardı',
  can: '-ebilir / yapabilir',
  could: '-ebilirdi',
  must: 'zorundadır / -meli',
  should: '-meli / tavsiye edilir',
  may: '-ebilir (ihtimal)',
  might: '-ebilirdi',
  have: 'sahiptir / vardır',
  has: 'sahiptir / vardır',
  had: 'vardı'
};

// Common irregular verb mappings
const IRREGULAR_VERBS = {
  went: 'go', gone: 'go',
  saw: 'see', seen: 'see',
  bought: 'buy',
  wrote: 'write', written: 'write',
  took: 'take', taken: 'take',
  made: 'make',
  came: 'come',
  gave: 'give', given: 'give',
  told: 'tell',
  knew: 'know', known: 'know',
  read: 'read',
  spoke: 'speak', spoken: 'speak',
  found: 'find'
};

// Common idioms and multi-word expressions
const KNOWN_EXPRESSIONS = {
  'by the book': 'kurallara uygun olarak, resmen',
  'bring to book': 'sorumluluğu yükleyerek hesap sormak',
  'at work': 'iş başında, çalışırken',
  'out of work': 'işsiz, boşta',
  'in the works': 'yapılmakta olan, planda',
  'high school': 'lise',
  'elementary school': 'ilkokul',
  'primary school': 'ilkokul',
  'middle school': 'ortaokul',
  'boarding school': 'yatılı okul',
  'day school': 'gündüzlü okul',
  'language arts': 'dil ve edebiyat dersleri',
  'strong language': 'ağır söz, küfürlü dil',
  'under no circumstances': 'hiçbir surette, asla',
  'under the circumstances': 'bu şartlar altında',
  'pomp and circumstance': 'debdebe ve tantana',
  'international law': 'uluslararası hukuk',
  'free school': 'parasız okul',
  'thank you': 'teşekkür ederim',
  'thanks a lot': 'çok teşekkürler',
  'how are you': 'nasılsınız / nasılsın',
  'good morning': 'günaydın',
  'good night': 'iyi geceler',
  'take care': 'kendine iyi bak',
  'look for': 'aramak',
  'look after': 'bakmak, ilgilenmek',
  'as soon as possible': 'mümkün olan en kısa sürede'
};

// Syntactic grammar patterns for natural English to Turkish sentence translation (SOV)
const SYNTACTIC_GRAMMAR_RULES = [
  // 1. Motion/Travel Past: [Subject] went/walked/ran to [Place] [Time]
  // e.g. "I went to school yesterday" -> "Dün okula gittim."
  {
    regex: /^(i|you|he|she|it|we|they)\s+(went|walked|ran|drove|traveled)\s+to\s+([a-zA-Z]+)\s+(yesterday|today|last night|last week|this morning)[.?!]?$/i,
    resolve: (m) => {
      const subj = m[1].toLowerCase();
      const verb = m[2].toLowerCase();
      const place = m[3].toLowerCase();
      const time = m[4].toLowerCase();

      const timeTr = {
        yesterday: 'Dün',
        today: 'Bugün',
        'last night': 'Dün gece',
        'last week': 'Geçen hafta',
        'this morning': 'Bu sabah'
      }[time] || time;

      const placeTr = {
        school: 'okula',
        work: 'işe',
        home: 'eve',
        office: 'ofise',
        hospital: 'hastaneye',
        university: 'üniversiteye',
        hotel: 'otele',
        library: 'kütüphaneye'
      }[place] || `${place}'e`;

      const verbBases = { went: 'git', walked: 'yürü', ran: 'koş', drove: 'araba ile git', traveled: 'seyahat et' };
      const base = verbBases[verb] || 'git';

      const suffixes = {
        i: 'tim', you: 'tin', he: 'ti', she: 'ti', it: 'ti', we: 'tik', they: 'tiler'
      };

      const conjugatedVerb = base + (suffixes[subj] || 'ti');
      const subjPrefix = (subj === 'i' || subj === 'we') ? '' : { you: 'Sen ', he: 'O ', she: 'O ', it: 'O ', they: 'Onlar ' }[subj] || '';
      return `${timeTr} ${subjPrefix}${placeTr} ${conjugatedVerb}.`.replace(/\s+/g, ' ').trim();
    }
  },

  // 2. Continuous action at place: [Subject] [am/is/are] [Verb-ing] at/in [Place]
  // e.g. "I am working at home" -> "Evde çalışıyorum."
  {
    regex: /^(i|you|he|she|it|we|they)\s+(am|is|are)\s+([a-zA-Z]+ing)\s+(at|in)\s+([a-zA-Z]+)[.?!]?$/i,
    resolve: (m) => {
      const subj = m[1].toLowerCase();
      const verb = m[3].toLowerCase();
      const place = m[5].toLowerCase();

      const placeTr = {
        home: 'evde',
        school: 'okulda',
        work: 'işte',
        office: 'ofiste',
        hotel: 'otelde',
        hospital: 'hastanede',
        library: 'kütüphanede',
        room: 'odada'
      }[place] || `${place}'de`;

      const verbBases = {
        working: 'çalışıyor',
        studying: 'ders çalışıyor',
        living: 'yaşıyor',
        staying: 'kalıyor',
        reading: 'okuyor',
        waiting: 'bekliyor',
        resting: 'dinleniyor',
        writing: 'yazıyor'
      };
      const base = verbBases[verb] || 'çalışıyor';

      const personSuff = {
        i: 'um', you: 'sun', he: '', she: '', it: '', we: 'uz', they: 'lar'
      };

      const conjugated = base + (personSuff[subj] || '');
      const subjPrefix = (subj === 'i' || subj === 'we') ? '' : { you: 'Sen ', he: 'O ', she: 'O ', it: 'O ', they: 'Onlar ' }[subj] || '';
      const raw = `${subjPrefix}${placeTr} ${conjugated}.`.replace(/\s+/g, ' ').trim();
      return raw.charAt(0).toUpperCase() + raw.slice(1);
    }
  },

  // 3. Booking / Reservation: [Subject] [booked/reserved] [a/an/the] [room/hotel/ticket...]
  // e.g. "She booked a room" -> "O bir oda ayırttı."
  {
    regex: /^(i|you|he|she|it|we|they)\s+(booked|reserved)\s+(a|an|the)\s+([a-zA-Z]+)[.?!]?$/i,
    resolve: (m) => {
      const subj = m[1].toLowerCase();
      const art = m[3].toLowerCase();
      const obj = m[4].toLowerCase();

      const artTr = art === 'the' ? '' : 'bir ';
      const objTr = {
        room: 'oda',
        hotel: 'otel',
        ticket: 'bilet',
        seat: 'koltuk',
        table: 'masa',
        flight: 'uçuş'
      }[obj] || obj;

      const suff = {
        i: 'm', you: 'n', he: '', she: '', it: '', we: 'k', they: 'lar'
      };

      const verb = 'yer ayırttı' + (suff[subj] || '');
      const subjTr = { i: 'Ben ', you: 'Sen ', he: 'O ', she: 'O ', it: 'O ', we: 'Biz ', they: 'Onlar ' }[subj] || '';
      return `${subjTr}${artTr}${objTr} ${verb}.`.replace(/\s+/g, ' ').trim();
    }
  },

  // 4. Copula / Definition: This/That is a [Adjective] [Noun]
  // e.g. "This is a beautiful book" -> "Bu güzel bir kitaptır."
  {
    regex: /^(this|that)\s+(is|was)\s+(a|an)\s+([a-zA-Z]+)\s+([a-zA-Z]+)[.?!]?$/i,
    resolve: (m) => {
      const dem = m[1].toLowerCase() === 'this' ? 'Bu' : 'Şu';
      const adj = m[4].toLowerCase();
      const noun = m[5].toLowerCase();

      const adjTr = {
        beautiful: 'güzel',
        new: 'yeni',
        old: 'eski',
        good: 'iyi',
        great: 'harika',
        big: 'büyük',
        small: 'küçük'
      }[adj] || adj;

      const nounTr = {
        book: 'kitaptır',
        school: 'okuldur',
        room: 'odadır',
        work: 'iştir',
        language: 'dildir'
      }[noun] || `${noun}dir`;

      return `${dem} ${adjTr} bir ${nounTr}.`;
    }
  }
];

/**
 * Heuristic lemmatization: strips English suffixes to find headword in FreeDict
 */
export function lemmatizeEnglish(word) {
  const low = word.toLowerCase();
  const freedict = getFreedictEnTrDictionary();

  if (freedict[low]) return low;
  if (IRREGULAR_VERBS[low]) return IRREGULAR_VERBS[low];

  // Plural/Verb endings
  if (low.endsWith('ies') && freedict[low.slice(0, -3) + 'y']) {
    return low.slice(0, -3) + 'y';
  }
  if (low.endsWith('es') && freedict[low.slice(0, -2)]) {
    return low.slice(0, -2);
  }
  if (low.endsWith('s') && !low.endsWith('ss') && freedict[low.slice(0, -1)]) {
    return low.slice(0, -1);
  }
  if (low.endsWith('ing') && freedict[low.slice(0, -3)]) {
    return low.slice(0, -3);
  }
  if (low.endsWith('ing') && freedict[low.slice(0, -4)]) {
    return low.slice(0, -4);
  }
  if (low.endsWith('ed') && freedict[low.slice(0, -2)]) {
    return low.slice(0, -2);
  }
  if (low.endsWith('ed') && freedict[low.slice(0, -1)]) {
    return low.slice(0, -1);
  }
  if (low.endsWith('ly') && freedict[low.slice(0, -2)]) {
    return low.slice(0, -2);
  }

  return low;
}

/**
 * Translates a word or multi-word phrase
 */
export function translateOfflinePhraseOrSentence(text, fromLang = 'en', toLang = 'tr') {
  if (!text || text.trim().length === 0) {
    return null;
  }

  const raw = text.trim();

  // 1. Check if the input is a single word
  const words = raw.split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    const singleResult = fromLang === 'en'
      ? lookupEnglishWord(raw)
      : lookupTurkishWord(raw);

    if (singleResult) {
      return {
        original: raw,
        translation: singleResult.translation,
        description: singleResult.description,
        isSentence: false,
        senses: singleResult.senses || [],
        isPolysemous: singleResult.isPolysemous || false,
        contextNotice: singleResult.contextNotice || '',
        source: singleResult.source,
        tokenBreakdown: [{
          word: raw,
          lemma: raw.toLowerCase(),
          translation: singleResult.translation,
          senses: singleResult.senses
        }]
      };
    }
  }

  // 2. Direct exact idiom match (e.g. "by the book", "at work", "under no circumstances")
  const lowTrimmed = raw.toLowerCase().replace(/[.,!?;:]+$/, '');
  if (KNOWN_EXPRESSIONS[lowTrimmed]) {
    const meaning = KNOWN_EXPRESSIONS[lowTrimmed];
    return {
      original: raw,
      translation: meaning,
      description: `Kalıp İfade / Deyim: "${raw}" ➔ ${meaning}`,
      isSentence: true,
      detectedIdioms: [{ phrase: lowTrimmed, meaning }],
      senses: [{ index: 1, text: meaning, pos: 'Kalıp İfade / Deyim' }],
      isPolysemous: false,
      contextNotice: '💡 Yerleşik deyim ve kalıp ifade karşılığı.',
      source: 'FreeDict & Deyim Veritabanı',
      tokenBreakdown: words.map(w => ({
        word: w,
        lemma: w.toLowerCase(),
        translation: '',
        pos: 'İfade Parçası'
      }))
    };
  }

  // 3. Syntactic Rule-Based Translation (Natural Turkish SOV synthesis)
  if (fromLang === 'en') {
    for (const rule of SYNTACTIC_GRAMMAR_RULES) {
      const match = raw.match(rule.regex);
      if (match) {
        const naturalTranslation = rule.resolve(match);
        return {
          original: raw,
          translation: naturalTranslation,
          description: `Doğal Dil Çevirisi (SOV Dilbilgisel Sözdizimi): ${naturalTranslation}`,
          isSentence: true,
          detectedIdioms: [],
          senses: [{ index: 1, text: naturalTranslation, pos: 'Doğal Cümle Çevirisi' }],
          isPolysemous: false,
          contextNotice: '✨ Doğal Türkçe sözdizimi (Özne-Nesne-Yüklem) ve fiil çekim kurallarıyla çevrilmiştir.',
          source: 'LexiNote Dilbilgisel Çeviri Motoru',
          tokenBreakdown: words.map(w => ({
            word: w,
            lemma: lemmatizeEnglish(w),
            translation: '',
            pos: 'Cümle Öğesi'
          }))
        };
      }
    }
  }

  // 4. Multi-word phrase or sentence gloss translation
  if (fromLang === 'en') {
    return translateEnglishSentence(raw);
  } else {
    return translateTurkishSentence(raw);
  }
}

/**
 * Offline English to Turkish sentence glossing & alignment
 */
function translateEnglishSentence(text) {
  const freedict = getFreedictEnTrDictionary();
  const lowerText = text.toLowerCase();
  const detectedIdioms = [];

  // Check known idioms
  for (const [idiom, meaning] of Object.entries(KNOWN_EXPRESSIONS)) {
    if (lowerText.includes(idiom)) {
      detectedIdioms.push({ phrase: idiom, meaning });
    }
  }

  // Tokenize preserving punctuation
  const tokenRegex = /[\w']+|[.,!?;:]/g;
  const rawTokens = text.match(tokenRegex) || [];

  const tokenBreakdown = [];
  const translatedSegments = [];

  for (let i = 0; i < rawTokens.length; i++) {
    const token = rawTokens[i];

    // Punctuation
    if (/^[.,!?;:]$/.test(token)) {
      translatedSegments.push(token);
      continue;
    }

    const lowToken = token.toLowerCase();

    // 1. Pronouns
    if (PRONOUNS_EN_TO_TR[lowToken]) {
      const tr = PRONOUNS_EN_TO_TR[lowToken];
      tokenBreakdown.push({
        word: token,
        lemma: lowToken,
        pos: 'Zamir',
        translation: tr,
        senses: [{ index: 1, text: tr, pos: 'Zamir' }]
      });
      translatedSegments.push(tr);
      continue;
    }

    // 2. Common particles (the, a, and, or...)
    if (COMMON_PARTICLES_EN_TO_TR[lowToken] !== undefined) {
      const tr = COMMON_PARTICLES_EN_TO_TR[lowToken];
      tokenBreakdown.push({
        word: token,
        lemma: lowToken,
        pos: 'Bağlaç / Edat',
        translation: tr || '(belirteç)',
        senses: [{ index: 1, text: tr || '(belirteç)', pos: 'Edat' }]
      });
      if (tr) translatedSegments.push(tr);
      continue;
    }

    // 3. Auxiliaries
    if (AUXILIARY_VERBS_EN_TO_TR[lowToken]) {
      const tr = AUXILIARY_VERBS_EN_TO_TR[lowToken];
      tokenBreakdown.push({
        word: token,
        lemma: lowToken,
        pos: 'Yardımcı Fiil',
        translation: tr,
        senses: [{ index: 1, text: tr, pos: 'Yardımcı Fiil' }]
      });
      translatedSegments.push(tr);
      continue;
    }

    // 4. Lemma & FreeDict lookup
    const lemma = lemmatizeEnglish(lowToken);
    const wordEntry = lookupEnglishWord(lemma);

    if (wordEntry) {
      // Pick first primary sense
      const firstSenseText = wordEntry.senses && wordEntry.senses.length > 0
        ? wordEntry.senses[0].text.split(',')[0].trim()
        : wordEntry.translation.split('•')[0].trim();

      tokenBreakdown.push({
        word: token,
        lemma,
        pos: wordEntry.senses?.[0]?.pos || 'Sözlük',
        translation: firstSenseText,
        senses: wordEntry.senses,
        isPolysemous: wordEntry.isPolysemous,
        contextNotice: wordEntry.contextNotice
      });
      translatedSegments.push(firstSenseText);
    } else {
      // Unknown word
      tokenBreakdown.push({
        word: token,
        lemma: lowToken,
        pos: 'Bilinmeyen / Özel',
        translation: token,
        senses: []
      });
      translatedSegments.push(token);
    }
  }

  // Construct readable sentence
  let constructedTranslation = translatedSegments
    .join(' ')
    .replace(/\s+([.,!?;:])/g, '$1')
    .replace(/^[a-zçğıöşü]/, m => m.toUpperCase());

  return {
    original: text,
    translation: constructedTranslation,
    detectedIdioms,
    isSentence: true,
    tokenBreakdown,
    contextNotice: '⚠️ Cümle çevirisi FreeDict sözlük karşılıkları ve bağlamsal sözcük sıralamasıyla çevrimdışı üretilmiştir. Kelime anlamı ayrıntılarını aşağıdaki dökümden inceleyebilirsiniz.',
    source: 'FreeDict Çevrimdışı Çeviri Motoru'
  };
}

/**
 * Offline Turkish to English sentence translation
 */
function translateTurkishSentence(text) {
  const tokenRegex = /[\wğüşıöçĞÜŞİÖÇ']+|[.,!?;:]/g;
  const rawTokens = text.match(tokenRegex) || [];
  const tokenBreakdown = [];
  const translatedSegments = [];

  for (let i = 0; i < rawTokens.length; i++) {
    const token = rawTokens[i];

    if (/^[.,!?;:]$/.test(token)) {
      translatedSegments.push(token);
      continue;
    }

    const trRes = lookupTurkishWord(token);
    if (trRes) {
      const en = trRes.translation.split(',')[0].trim();
      tokenBreakdown.push({
        word: token,
        lemma: token.toLowerCase(),
        pos: 'Türkçe',
        translation: en,
        senses: trRes.senses
      });
      translatedSegments.push(en);
    } else {
      tokenBreakdown.push({
        word: token,
        lemma: token.toLowerCase(),
        pos: 'Bilinmeyen / Özel',
        translation: token,
        senses: []
      });
      translatedSegments.push(token);
    }
  }

  const constructedTranslation = translatedSegments
    .join(' ')
    .replace(/\s+([.,!?;:])/g, '$1')
    .replace(/^[a-z]/, m => m.toUpperCase());

  return {
    original: text,
    translation: constructedTranslation,
    isSentence: true,
    tokenBreakdown,
    detectedIdioms: [],
    contextNotice: '⚠️ Çevrimdışı Türkçe ➔ İngilizce sözlük karşılıkları ve sözcük analizi.',
    source: 'FreeDict Çevrimdışı Çeviri Motoru'
  };
}
